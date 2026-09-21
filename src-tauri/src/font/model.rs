use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use super::source::FontSource;

pub type FaceId = String;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FontFormat {
    TrueType,
    OpenTypeCff,
    Unknown,
}

impl FontFormat {
    pub fn label(self) -> &'static str {
        match self {
            Self::TrueType => "TrueType",
            Self::OpenTypeCff => "OpenType (CFF)",
            Self::Unknown => "不明",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FaceRecord {
    pub id: FaceId,
    pub path: PathBuf,
    pub index: u32,
    pub family_name: String,
    pub style_name: String,
    pub postscript_name: Option<String>,
    pub full_name: Option<String>,
    pub weight: u16,
    pub width: u16,
    pub is_italic: bool,
    pub is_monospaced: bool,
    pub is_variable: bool,
    pub glyph_count: u16,
    pub format: FontFormat,
    pub source: FontSource,
    pub file_size: u64,
    pub supports_japanese: bool,
    pub coverage: Vec<u8>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StyleSummary {
    pub face_id: FaceId,
    pub style_name: String,
    pub postscript_name: Option<String>,
    pub weight: u16,
    pub width: u16,
    pub is_italic: bool,
    pub is_monospaced: bool,
    pub is_variable: bool,
    pub source: FontSource,
    pub source_label: &'static str,
    pub format_label: &'static str,
    pub can_export: bool,
    pub can_uninstall: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilySummary {
    pub name: String,
    pub search_key: String,
    pub supports_japanese: bool,
    pub has_italic: bool,
    pub styles: Vec<StyleSummary>,
}

#[derive(Debug, Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanSummary {
    pub family_count: usize,
    pub face_count: usize,
    pub failed_count: usize,
    pub elapsed_ms: u64,
}
