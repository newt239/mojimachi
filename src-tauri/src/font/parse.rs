use std::path::Path;

use read_fonts::types::{NameId, Tag};
use read_fonts::{FileRef, FontRef, TableProvider};

use super::coverage;
use super::model::{FaceRecord, FontFormat};
use super::names;
use super::source::FontSource;

pub fn face_id(path: &Path, index: u32) -> String {
    let mut hasher = blake3::Hasher::new();
    hasher.update(path.as_os_str().as_encoded_bytes());
    hasher.update(&index.to_le_bytes());
    hasher.finalize().to_hex()[..16].to_string()
}

pub fn face_count(data: &[u8]) -> u32 {
    match FileRef::new(data) {
        Ok(FileRef::Collection(collection)) => collection.len(),
        Ok(FileRef::Font(_)) => 1,
        Err(_) => 0,
    }
}

fn format_of(font: &FontRef<'_>) -> FontFormat {
    if font.table_data(Tag::new(b"CFF ")).is_some() || font.table_data(Tag::new(b"CFF2")).is_some()
    {
        FontFormat::OpenTypeCff
    } else if font.table_data(Tag::new(b"glyf")).is_some() {
        FontFormat::TrueType
    } else {
        FontFormat::Unknown
    }
}

pub fn parse_face(
    data: &[u8],
    path: &Path,
    index: u32,
    source: FontSource,
    file_size: u64,
) -> Option<FaceRecord> {
    let font = FontRef::from_index(data, index).ok()?;
    let table = font.name().ok()?;
    let names = names::collect(&table);

    let family_name = names::get(&names, NameId::TYPOGRAPHIC_FAMILY_NAME)
        .or_else(|| names::get(&names, NameId::FAMILY_NAME))?;
    let style_name = names::get(&names, NameId::TYPOGRAPHIC_SUBFAMILY_NAME)
        .or_else(|| names::get(&names, NameId::SUBFAMILY_NAME))
        .unwrap_or_else(|| "Regular".to_string());

    let (weight, width, italic_by_os2) = font.os2().map_or((400, 5, None), |os2| {
        (
            os2.us_weight_class(),
            os2.us_width_class(),
            Some(os2.fs_selection().bits() & 0x01 != 0),
        )
    });
    let italic_by_head = font
        .head()
        .is_ok_and(|head| head.mac_style().bits() & 0x02 != 0);
    let bitmap = coverage::code_points(&font);

    Some(FaceRecord {
        id: face_id(path, index),
        path: path.to_path_buf(),
        index,
        family_name: family_name.trim().to_string(),
        style_name: style_name.trim().to_string(),
        postscript_name: names::get(&names, NameId::POSTSCRIPT_NAME),
        full_name: names::get(&names, NameId::FULL_NAME),
        weight: weight.clamp(1, 1000),
        width: width.clamp(1, 9),
        is_italic: italic_by_os2.unwrap_or(italic_by_head) || italic_by_head,
        is_monospaced: font.post().is_ok_and(|post| post.is_fixed_pitch() != 0),
        is_variable: font.fvar().is_ok(),
        glyph_count: font.maxp().map_or(0, |maxp| maxp.num_glyphs()),
        format: format_of(&font),
        source,
        file_size,
        supports_japanese: bitmap.contains('あ' as u32) || bitmap.contains('ア' as u32),
        coverage: coverage::encode(&bitmap),
    })
}

pub fn parse_file(path: &Path, source: FontSource) -> Vec<FaceRecord> {
    let Ok(data) = std::fs::read(path) else {
        return Vec::new();
    };
    let file_size = data.len() as u64;
    (0..face_count(&data))
        .filter_map(|index| parse_face(&data, path, index, source, file_size))
        .collect()
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;

    // face id はパスと index の組ごとに変わり、同じ入力では変わらない
    #[test]
    fn face_id_is_stable_and_distinct() {
        let path = PathBuf::from("/a/b.ttc");
        assert_eq!(face_id(&path, 0), face_id(&path, 0));
        assert_ne!(face_id(&path, 0), face_id(&path, 1));
        assert_ne!(face_id(&path, 0), face_id(Path::new("/a/c.ttc"), 0));
        assert_eq!(face_id(&path, 0).len(), 16);
    }

    // 壊れたデータは face 数 0 として扱い、パースはスキップされる
    #[test]
    fn broken_data_yields_no_faces() {
        assert_eq!(face_count(b"not a font"), 0);
        assert!(parse_face(b"not a font", Path::new("/x.ttf"), 0, FontSource::User, 0).is_none());
    }
}
