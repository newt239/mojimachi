use std::collections::HashSet;
use std::path::Path;

use serde::{Deserialize, Serialize};

use super::model::FaceRecord;
use super::sfnt;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportPlan {
    pub paths: Vec<String>,
    pub excluded_system_count: usize,
    pub missing_file_count: usize,
    pub collection_count: usize,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportResult {
    pub copied: Vec<String>,
    pub failed: Vec<String>,
}

// 同名のときは「名前 2.ttf」の形で連番を振る
fn numbered(name: &str, index: u32) -> String {
    match name.rfind('.') {
        Some(at) if at > 0 => format!("{} {index}{}", &name[..at], &name[at..]),
        _ => format!("{name} {index}"),
    }
}

pub fn unique_name(name: &str, used: &mut HashSet<String>) -> String {
    if used.insert(name.to_string()) {
        return name.to_string();
    }
    let mut index = 2_u32;
    loop {
        let candidate = numbered(name, index);
        if used.insert(candidate.clone()) {
            return candidate;
        }
        index += 1;
    }
}

pub fn plan(faces: &[&FaceRecord]) -> ExportPlan {
    let mut paths: Vec<String> = Vec::new();
    let mut excluded_system_count = 0;
    let mut missing_file_count = 0;
    let mut collection_count = 0;

    for face in faces {
        if !face.source.can_export() {
            excluded_system_count += 1;
            continue;
        }
        if !face.path.is_file() {
            missing_file_count += 1;
            continue;
        }
        paths.push(face.path.to_string_lossy().into_owned());
    }

    paths.sort();
    paths.dedup();

    for path in &paths {
        if std::fs::read(path).is_ok_and(|data| sfnt::is_collection(&data)) {
            collection_count += 1;
        }
    }

    ExportPlan {
        paths,
        excluded_system_count,
        missing_file_count,
        collection_count,
    }
}

pub fn run(plan: &ExportPlan, destination: &Path) -> ExportResult {
    let mut used: HashSet<String> = HashSet::new();
    let mut copied = Vec::new();
    let mut failed = Vec::new();

    for path in &plan.paths {
        let source = Path::new(path);
        let name = source.file_name().map_or_else(
            || "font".to_string(),
            |name| name.to_string_lossy().into_owned(),
        );
        let target = destination.join(unique_name(&name, &mut used));

        // 1 件の失敗で全体を止めない
        match std::fs::copy(source, &target) {
            Ok(_) => copied.push(target.to_string_lossy().into_owned()),
            Err(_) => failed.push(path.clone()),
        }
    }

    ExportResult { copied, failed }
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;
    use crate::font::model::FontFormat;
    use crate::font::source::FontSource;

    fn face(path: &str, source: FontSource) -> FaceRecord {
        FaceRecord {
            id: path.into(),
            path: PathBuf::from(path),
            index: 0,
            family_name: "Sample".into(),
            style_name: "Regular".into(),
            postscript_name: None,
            full_name: None,
            weight: 400,
            width: 5,
            is_italic: false,
            is_monospaced: false,
            is_variable: false,
            glyph_count: 1,
            format: FontFormat::TrueType,
            source,
            file_size: 1,
            supports_japanese: false,
            coverage: Vec::new(),
        }
    }

    // 同名が続くと 2, 3 と連番になる
    #[test]
    fn numbers_colliding_names() {
        let mut used = HashSet::new();
        assert_eq!(unique_name("Sample.ttf", &mut used), "Sample.ttf");
        assert_eq!(unique_name("Sample.ttf", &mut used), "Sample 2.ttf");
        assert_eq!(unique_name("Sample.ttf", &mut used), "Sample 3.ttf");
    }

    // 拡張子がない名前は末尾に番号を足す
    #[test]
    fn numbers_names_without_extension() {
        let mut used = HashSet::new();
        assert_eq!(unique_name("Sample", &mut used), "Sample");
        assert_eq!(unique_name("Sample", &mut used), "Sample 2");
    }

    // ドットが複数ある名前は最後の拡張子だけ残す
    #[test]
    fn numbers_names_with_multiple_dots() {
        let mut used = HashSet::new();
        used.insert("A.B.ttf".to_string());
        assert_eq!(unique_name("A.B.ttf", &mut used), "A.B 2.ttf");
    }

    // 先頭がドットの名前は拡張子とみなさない
    #[test]
    fn treats_leading_dot_as_part_of_name() {
        let mut used = HashSet::new();
        used.insert(".hidden".to_string());
        assert_eq!(unique_name(".hidden", &mut used), ".hidden 2");
    }

    // 既に使われている番号は飛ばす
    #[test]
    fn skips_taken_numbers() {
        let mut used = HashSet::new();
        used.insert("Sample.ttf".to_string());
        used.insert("Sample 2.ttf".to_string());
        assert_eq!(unique_name("Sample.ttf", &mut used), "Sample 3.ttf");
    }

    // システム領域のフォントは除外して件数だけ数える
    #[test]
    fn excludes_protected_sources() {
        let system = face("/s/a.ttf", FontSource::System);
        let plan = plan(&[&system]);
        assert!(plan.paths.is_empty());
        assert_eq!(plan.excluded_system_count, 1);
    }

    // 実体のないファイルは未特定として数える
    #[test]
    fn counts_missing_files() {
        let missing = face("/nowhere/a.ttf", FontSource::User);
        let plan = plan(&[&missing]);
        assert!(plan.paths.is_empty());
        assert_eq!(plan.missing_file_count, 1);
    }

    // 同じファイルを指す face は 1 件に畳む
    #[test]
    fn folds_faces_sharing_a_file() {
        let dir = std::env::temp_dir().join("mojimachi-export-test");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("a.ttf");
        let _ = std::fs::write(&path, b"x");

        let text = path.to_string_lossy().into_owned();
        let first = face(&text, FontSource::User);
        let second = face(&text, FontSource::User);
        assert_eq!(plan(&[&first, &second]).paths.len(), 1);
        let _ = std::fs::remove_dir_all(&dir);
    }

    // 実際にコピーし、失敗したものは報告する
    #[test]
    fn copies_files_and_reports_failures() {
        let dir = std::env::temp_dir().join("mojimachi-export-run");
        let source = dir.join("src");
        let dest = dir.join("dest");
        let _ = std::fs::create_dir_all(&source);
        let _ = std::fs::create_dir_all(&dest);
        let file = source.join("a.ttf");
        let _ = std::fs::write(&file, b"font");

        let plan = ExportPlan {
            paths: vec![
                file.to_string_lossy().into_owned(),
                "/nowhere/b.ttf".to_string(),
            ],
            excluded_system_count: 0,
            missing_file_count: 0,
            collection_count: 0,
        };
        let result = run(&plan, &dest);
        assert_eq!(result.copied.len(), 1);
        assert_eq!(result.failed.len(), 1);
        assert!(dest.join("a.ttf").is_file());
        let _ = std::fs::remove_dir_all(&dir);
    }
}
