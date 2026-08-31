// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mojimachi;

use font_kit::font::Font;
use font_kit::handle::Handle;
use serde::Serialize;
use std::time::Instant;
use ttf_parser::{name::Table, Tag};

const NAME_TABLE_LIMIT: u16 = 25;

#[derive(Serialize)]
struct FontInfo {
    family_name: String,
    postscript_name: Option<String>,
    font_path: String,
}

fn check_ja_family(ja: bool, font: &Font) -> bool {
    if !ja {
        return true;
    }
    ['あ', 'ア'].iter().any(|character| {
        font.glyph_for_char(*character)
            .is_some_and(|glyph| glyph != 0)
    })
}

fn font_path_of(handle: &Handle) -> String {
    match handle {
        Handle::Path { path, .. } => path.to_string_lossy().into_owned(),
        Handle::Memory { .. } => String::new(),
    }
}

fn name_table_entries(font: &Font) -> Vec<Option<String>> {
    let name_table_tag = Tag::from_bytes(b"name").as_u32();
    let Some(name_table_bytes) = font.load_font_table(name_table_tag) else {
        return Vec::new();
    };
    let Some(name_table) = Table::parse(name_table_bytes.as_ref()) else {
        return Vec::new();
    };

    (0..NAME_TABLE_LIMIT)
        .map(|index| {
            name_table
                .names
                .get(index)
                .and_then(|name| name.to_string())
        })
        .collect()
}

#[tauri::command]
fn get_families(keyword: String, ja: bool) -> Vec<FontInfo> {
    let start = Instant::now();
    let source = mojimachi::get_source();
    let families = source.all_families().unwrap_or_default();
    let keyword_lowercase = keyword.to_lowercase();

    let mut filtered_families: Vec<String> = families
        .into_iter()
        .filter(|family_name| {
            keyword_lowercase.is_empty() || family_name.to_lowercase().contains(&keyword_lowercase)
        })
        .collect();

    filtered_families.sort();
    filtered_families.dedup();

    let mut parsed_families = Vec::new();
    for family_name in filtered_families {
        let Ok(family_handle) = source.select_family_by_name(&family_name) else {
            continue;
        };
        let fonts = family_handle.fonts();
        let Some(font_handle) = fonts.first() else {
            continue;
        };
        let Ok(font) = font_handle.load() else {
            continue;
        };
        if !check_ja_family(ja, &font) {
            continue;
        }
        parsed_families.push(FontInfo {
            family_name: font.family_name().to_string(),
            postscript_name: font.postscript_name(),
            font_path: font_path_of(font_handle),
        });
    }

    let elapsed = start.elapsed();
    println!(
        "[get_families] {}.{:03}s",
        elapsed.as_secs(),
        elapsed.subsec_millis()
    );

    parsed_families
}

#[tauri::command]
fn get_fonts_by_family(family: String) -> Vec<FontInfo> {
    let source = mojimachi::get_source();
    let Ok(family_handle) = source.select_family_by_name(&family) else {
        return Vec::new();
    };
    let mut family_fonts: Vec<FontInfo> = Vec::new();

    for font_handle in family_handle.fonts() {
        let Ok(font) = font_handle.load() else {
            continue;
        };
        let postscript_name = font.postscript_name();
        if family_fonts
            .iter()
            .any(|existing| existing.postscript_name == postscript_name)
        {
            continue;
        }
        family_fonts.push(FontInfo {
            family_name: font.family_name().to_string(),
            postscript_name,
            font_path: font_path_of(font_handle),
        });
    }

    family_fonts
}

#[tauri::command]
fn get_font_head(name: String) -> Vec<Option<String>> {
    let source = mojimachi::get_source();
    let Ok(font_handle) = source.select_by_postscript_name(&name) else {
        return Vec::new();
    };
    let Ok(font) = font_handle.load() else {
        return Vec::new();
    };

    name_table_entries(&font)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            get_families,
            get_font_head,
            get_fonts_by_family
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
