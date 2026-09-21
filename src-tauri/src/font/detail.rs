use std::collections::HashMap;

use read_fonts::{FontRef, TableProvider};
use serde::Serialize;

use super::features::{self, FontFeature};
use super::model::FaceRecord;
use super::names;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NameEntry {
    pub label: &'static str,
    pub value: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VariationAxis {
    pub tag: String,
    pub name: String,
    pub min: f32,
    pub default: f32,
    pub max: f32,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FaceDetail {
    pub face_id: String,
    pub family_name: String,
    pub style_name: String,
    pub postscript_name: Option<String>,
    pub names: Vec<NameEntry>,
    pub axes: Vec<VariationAxis>,
    pub features: Vec<FontFeature>,
    pub glyph_count: u16,
    pub languages: Vec<&'static str>,
    pub format_label: &'static str,
    pub source_label: &'static str,
    pub path: String,
    pub file_size: u64,
    pub index: u32,
    pub is_variable: bool,
    pub can_export: bool,
    pub can_uninstall: bool,
}

const LANGUAGE_PROBES: [(&str, char); 12] = [
    ("日本語", 'あ'),
    ("中国語（簡体）", '的'),
    ("中国語（繁体）", '繁'),
    ("韓国語", '가'),
    ("ラテン", 'A'),
    ("キリル", 'А'),
    ("ギリシャ", 'Α'),
    ("アラビア", 'ا'),
    ("ヘブライ", 'א'),
    ("タイ", 'ก'),
    ("デーヴァナーガリー", 'अ'),
    ("絵文字", '😀'),
];

fn languages(font: &FontRef<'_>) -> Vec<&'static str> {
    let Ok(cmap) = font.cmap() else {
        return Vec::new();
    };
    LANGUAGE_PROBES
        .iter()
        .filter(|(_, ch)| {
            cmap.map_codepoint(*ch)
                .is_some_and(|glyph| glyph.to_u32() != 0)
        })
        .map(|(name, _)| *name)
        .collect()
}

fn axes(font: &FontRef<'_>, names: &HashMap<u16, String>) -> Vec<VariationAxis> {
    let Ok(fvar) = font.fvar() else {
        return Vec::new();
    };
    let Ok(list) = fvar.axes() else {
        return Vec::new();
    };
    list.iter()
        .map(|axis| {
            let tag = axis.axis_tag().to_string();
            let name = names
                .get(&axis.axis_name_id().to_u16())
                .cloned()
                .unwrap_or_else(|| tag.clone());
            VariationAxis {
                tag,
                name,
                min: axis.min_value().to_f32(),
                default: axis.default_value().to_f32(),
                max: axis.max_value().to_f32(),
            }
        })
        .collect()
}

fn feature_tags(font: &FontRef<'_>) -> Vec<String> {
    let mut tags: Vec<String> = Vec::new();

    if let Ok(gsub) = font.gsub() {
        if let Ok(list) = gsub.feature_list() {
            tags.extend(
                list.feature_records()
                    .iter()
                    .map(|rec| rec.feature_tag().to_string()),
            );
        }
    }
    if let Ok(gpos) = font.gpos() {
        if let Ok(list) = gpos.feature_list() {
            tags.extend(
                list.feature_records()
                    .iter()
                    .map(|rec| rec.feature_tag().to_string()),
            );
        }
    }

    tags.sort();
    tags.dedup();
    tags
}

pub fn build(record: &FaceRecord, data: &[u8]) -> Option<FaceDetail> {
    let font = FontRef::from_index(data, record.index).ok()?;
    let table = font.name().ok()?;
    let collected = names::collect(&table);

    Some(FaceDetail {
        face_id: record.id.clone(),
        family_name: record.family_name.clone(),
        style_name: record.style_name.clone(),
        postscript_name: record.postscript_name.clone(),
        names: names::DISPLAY_IDS
            .iter()
            .filter_map(|(id, label)| {
                names::get(&collected, *id).map(|value| NameEntry { label, value })
            })
            .collect(),
        axes: axes(&font, &collected),
        features: feature_tags(&font)
            .iter()
            .map(|tag| features::describe(tag))
            .collect(),
        glyph_count: record.glyph_count,
        languages: languages(&font),
        format_label: record.format.label(),
        source_label: record.source.label(),
        path: record.path.to_string_lossy().into_owned(),
        file_size: record.file_size,
        index: record.index,
        is_variable: record.is_variable,
        can_export: record.source.can_export(),
        can_uninstall: record.source.can_uninstall(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    // 言語プローブは重複がなく、代表的な文字を 12 件持つ
    #[test]
    fn language_probes_are_unique() {
        let mut names: Vec<&str> = LANGUAGE_PROBES.iter().map(|(name, _)| *name).collect();
        let mut chars: Vec<char> = LANGUAGE_PROBES.iter().map(|(_, ch)| *ch).collect();
        let count = names.len();
        names.sort_unstable();
        names.dedup();
        chars.sort_unstable();
        chars.dedup();
        assert_eq!(count, 12);
        assert_eq!(names.len(), 12);
        assert_eq!(chars.len(), 12);
    }
}
