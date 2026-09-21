use std::collections::HashMap;
use std::io::Read;
use std::path::{Path, PathBuf};

use rayon::prelude::*;
use roaring::RoaringBitmap;
use walkdir::WalkDir;

use super::cache;
use super::coverage;
use super::model::{FaceId, FaceRecord, FamilySummary, ScanSummary, StyleSummary};
use super::parse;
use super::source::{self, FontSource};

const EXTENSIONS: [&str; 4] = ["ttf", "otf", "ttc", "otc"];
const MAGICS: [[u8; 4]; 4] = [[0x00, 0x01, 0x00, 0x00], *b"OTTO", *b"ttcf", *b"true"];

#[derive(Debug, Default)]
pub struct Catalog {
    pub faces: HashMap<FaceId, FaceRecord>,
    pub coverage: HashMap<FaceId, RoaringBitmap>,
    pub families: Vec<FamilySummary>,
    pub summary: ScanSummary,
}

impl Catalog {
    pub fn face(&self, id: &str) -> Option<&FaceRecord> {
        self.faces.get(id)
    }

    pub fn coverage_of(&self, id: &str) -> Option<&RoaringBitmap> {
        self.coverage.get(id)
    }
}

fn has_sfnt_magic(path: &Path) -> bool {
    let Ok(mut file) = std::fs::File::open(path) else {
        return false;
    };
    let mut head = [0_u8; 4];
    file.read_exact(&mut head).is_ok() && MAGICS.contains(&head)
}

fn is_font_file(path: &Path) -> bool {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some(ext) => EXTENSIONS.contains(&ext.to_ascii_lowercase().as_str()),
        None => has_sfnt_magic(path),
    }
}

fn collect_files(roots: &[(PathBuf, FontSource)]) -> Vec<(PathBuf, FontSource, u64, u64)> {
    let mut files = Vec::new();
    for (root, _) in roots {
        for entry in WalkDir::new(root)
            .follow_links(false)
            .into_iter()
            .filter_map(Result::ok)
        {
            if !entry.file_type().is_file() {
                continue;
            }
            let path = entry.path();
            if path
                .file_name()
                .is_some_and(|name| name.as_encoded_bytes().starts_with(b"."))
            {
                continue;
            }
            if !is_font_file(path) {
                continue;
            }
            let Ok(metadata) = entry.metadata() else {
                continue;
            };
            files.push((
                path.to_path_buf(),
                source::classify(path, roots),
                cache::modified_secs(&metadata),
                metadata.len(),
            ));
        }
    }
    files.sort_by(|a, b| a.0.cmp(&b.0));
    files.dedup_by(|a, b| a.0 == b.0);
    files
}

pub fn build_families(faces: &[FaceRecord]) -> Vec<FamilySummary> {
    let mut grouped: HashMap<&str, Vec<&FaceRecord>> = HashMap::new();
    for face in faces {
        grouped
            .entry(face.family_name.as_str())
            .or_default()
            .push(face);
    }

    let mut families: Vec<FamilySummary> = grouped
        .into_iter()
        .map(|(name, mut members)| {
            members.sort_by(|a, b| {
                a.weight
                    .cmp(&b.weight)
                    .then(a.is_italic.cmp(&b.is_italic))
                    .then(a.style_name.cmp(&b.style_name))
                    .then(a.id.cmp(&b.id))
            });
            FamilySummary {
                name: name.to_string(),
                search_key: name.to_lowercase(),
                supports_japanese: members.iter().any(|face| face.supports_japanese),
                has_italic: members.iter().any(|face| face.is_italic),
                styles: members
                    .iter()
                    .map(|face| StyleSummary {
                        face_id: face.id.clone(),
                        style_name: face.style_name.clone(),
                        postscript_name: face.postscript_name.clone(),
                        weight: face.weight,
                        width: face.width,
                        is_italic: face.is_italic,
                        is_monospaced: face.is_monospaced,
                        is_variable: face.is_variable,
                        source: face.source,
                        source_label: face.source.label(),
                        format_label: face.format.label(),
                        can_export: face.source.can_export(),
                        can_uninstall: face.source.can_uninstall(),
                    })
                    .collect(),
            }
        })
        .collect();

    families.sort_by(|a, b| a.name.cmp(&b.name));
    families
}

pub fn scan(roots: &[(PathBuf, FontSource)], cache_path: &Path) -> Catalog {
    let started = std::time::Instant::now();
    let files = collect_files(roots);
    let previous = cache::load(cache_path);

    let parsed: Vec<(PathBuf, cache::Entry)> = files
        .par_iter()
        .map(|(path, source, mtime, size)| {
            let faces = previous
                .hit(path, *mtime, *size)
                .cloned()
                .unwrap_or_else(|| parse::parse_file(path, *source));
            (
                path.clone(),
                cache::Entry {
                    mtime: *mtime,
                    size: *size,
                    faces,
                },
            )
        })
        .collect();

    let failed_count = parsed
        .iter()
        .filter(|(_, entry)| entry.faces.is_empty())
        .count();
    let faces: Vec<FaceRecord> = parsed
        .iter()
        .flat_map(|(_, entry)| entry.faces.iter().cloned())
        .collect();

    let next = cache::Cache {
        version: previous.version,
        entries: parsed.into_iter().collect(),
    };
    cache::save(cache_path, &next);

    let families = build_families(&faces);
    let summary = ScanSummary {
        family_count: families.len(),
        face_count: faces.len(),
        failed_count,
        elapsed_ms: started.elapsed().as_millis() as u64,
    };
    let coverage = faces
        .par_iter()
        .map(|face| (face.id.clone(), coverage::decode(&face.coverage)))
        .collect();

    Catalog {
        summary,
        coverage,
        faces: faces
            .into_iter()
            .map(|face| (face.id.clone(), face))
            .collect(),
        families,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::font::model::FontFormat;

    fn face(id: &str, family: &str, style: &str, weight: u16, italic: bool) -> FaceRecord {
        FaceRecord {
            id: id.into(),
            path: PathBuf::from(format!("/{id}.ttf")),
            index: 0,
            family_name: family.into(),
            style_name: style.into(),
            postscript_name: Some(format!("{family}-{style}")),
            full_name: None,
            weight,
            width: 5,
            is_italic: italic,
            is_monospaced: false,
            is_variable: false,
            glyph_count: 1,
            format: FontFormat::TrueType,
            source: FontSource::User,
            file_size: 1,
            supports_japanese: family.starts_with('あ'),
            coverage: Vec::new(),
        }
    }

    // ファミリーは名前の昇順、スタイルはウエイト昇順に並ぶ
    #[test]
    fn families_and_styles_are_sorted() {
        let families = build_families(&[
            face("c", "Beta", "Bold", 700, false),
            face("a", "Alpha", "Regular", 400, false),
            face("b", "Beta", "Light", 300, false),
        ]);
        assert_eq!(
            families.iter().map(|f| f.name.as_str()).collect::<Vec<_>>(),
            ["Alpha", "Beta"]
        );
        assert_eq!(
            families[1]
                .styles
                .iter()
                .map(|s| s.style_name.as_str())
                .collect::<Vec<_>>(),
            ["Light", "Bold"]
        );
    }

    // 同じウエイトならローマン体が斜体より先に並ぶ
    #[test]
    fn roman_precedes_italic_at_same_weight() {
        let families = build_families(&[
            face("i", "Alpha", "Italic", 400, true),
            face("r", "Alpha", "Regular", 400, false),
        ]);
        assert_eq!(families[0].styles[0].style_name, "Regular");
        assert!(families[0].has_italic);
    }

    // 検索キーは小文字化したファミリー名になる
    #[test]
    fn search_key_is_lowercased() {
        let families = build_families(&[face("a", "Noto Sans JP", "Regular", 400, false)]);
        assert_eq!(families[0].search_key, "noto sans jp");
    }

    // 日本語対応はファミリー内のいずれかの face が対応していれば真になる
    #[test]
    fn japanese_support_is_any_of_styles() {
        let families = build_families(&[
            face("a", "あかり", "Regular", 400, false),
            face("b", "Latin", "Regular", 400, false),
        ]);
        let japanese = families
            .iter()
            .find(|f| f.name == "あかり")
            .expect("あること");
        let latin = families
            .iter()
            .find(|f| f.name == "Latin")
            .expect("あること");
        assert!(japanese.supports_japanese);
        assert!(!latin.supports_japanese);
    }

    // 実機のフォントディレクトリを走査する（環境依存なので通常は走らせない）
    #[test]
    #[ignore = "実機のフォント構成に依存する"]
    fn scans_installed_fonts() {
        let roots = source::default_roots();
        let cache = std::env::temp_dir().join("mojimachi-scan-test/catalog.bin");
        let _ = std::fs::remove_file(&cache);

        let cold = scan(&roots, &cache);
        println!(
            "初回: {} ファミリー / {} face / 失敗 {} / {}ms",
            cold.summary.family_count,
            cold.summary.face_count,
            cold.summary.failed_count,
            cold.summary.elapsed_ms
        );
        let warm = scan(&roots, &cache);
        println!("キャッシュ利用: {}ms", warm.summary.elapsed_ms);

        assert!(cold.summary.face_count > 0);
        assert_eq!(cold.summary.face_count, warm.summary.face_count);
        assert!(warm.summary.elapsed_ms <= cold.summary.elapsed_ms);
    }

    // 拡張子で判定し、未知の拡張子は読まない
    #[test]
    fn recognises_font_extensions() {
        assert!(is_font_file(Path::new("/a/b.TTF")));
        assert!(is_font_file(Path::new("/a/b.ttc")));
        assert!(is_font_file(Path::new("/a/b.otf")));
        assert!(!is_font_file(Path::new("/a/b.txt")));
    }
}
