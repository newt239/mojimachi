// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use font_kit::source::{SystemSource};
use serde::Serialize;
use ttf_parser::name::Table;
use ttf_parser::Tag;

#[derive(Serialize)]
struct FontInfo {
    family: String,
    postscript_name: Option<String>,
}

#[tauri::command]
fn get_families(keyword: Option<String>) -> Vec<String> {
    let source = SystemSource::new();
    let families = source.all_families().unwrap();
    let mut filtered_families = Vec::new();
    for family in families {
        if let Some(keyword) = &keyword {
            if family.to_lowercase().contains(&keyword.to_lowercase()) {
                filtered_families.push(family);
            }
        } else {
            filtered_families.push(family);
        }
    }

    filtered_families
}

#[tauri::command]
fn get_fonts_info() -> Vec<FontInfo> {
    let source = SystemSource::new();
    let all_fonts = source.all_fonts().unwrap();
    let mut fonts = Vec::new();

    for font in all_fonts {
        let font_object = font.load().unwrap();
        let font_info = FontInfo {
            family: font_object.family_name().to_string(),
            postscript_name: font_object.postscript_name(),
        };
        fonts.push(font_info);
    }

    fonts
}

#[tauri::command]
fn get_fonts_head() -> Vec<Vec<Option<String>>> {
    let name_table_tag = Tag::from_bytes(b"name").as_u32();
    let source = SystemSource::new();
    let all_fonts = source.all_fonts().unwrap();
    let mut fonts = Vec::new();

    for font in all_fonts {
        let font_object = font.load().unwrap();
        let name_table_bytes = font_object.load_font_table(name_table_tag).unwrap();
        let name_table_data = name_table_bytes.as_ref();
        let name_table = Table::parse(name_table_data).unwrap();

        let mut font_info = Vec::new();
        let mut i = 0;
        loop {
            if i >= 25 {
                break;
            } else {
                let value = name_table
                    .names
                    .get(i)
                    .map(|n| n.to_string())
                    .unwrap_or(None);
                font_info.push(value);
                i += 1;
            }
        }
        fonts.push(font_info);
    }

    fonts
}


#[tauri::command]
fn get_font_head(name: String) -> Vec<Option<String>> {
    let name_table_tag = Tag::from_bytes(b"name").as_u32();
    let source = SystemSource::new();
    let font_handle = source.select_by_postscript_name(&name).unwrap();
    let font_object = font_handle.load().unwrap();
    let name_table_bytes = font_object.load_font_table(name_table_tag).unwrap();
    let name_table_data = name_table_bytes.as_ref();
    let name_table = Table::parse(name_table_data).unwrap();
    let mut font_info = Vec::new();

    let mut i = 0;
        loop {
            if i >= 25 {
                break;
            } else {
                let value = name_table
                    .names
                    .get(i)
                    .map(|n| n.to_string())
                    .unwrap_or(None);
                font_info.push(value);
                i += 1;
            }
        }
    font_info

}

#[tauri::command]
fn get_fonts_by_family(family: String) -> Vec<Option<String>> {
    let source = SystemSource::new();
    let family_handle = source.select_family_by_name(&family).unwrap();
    let fonts = family_handle.fonts();
    let mut family_fonts = Vec::new();

    for font in fonts {
        let font_object = font.load().unwrap();
        family_fonts.push(font_object.postscript_name());
    }

    family_fonts
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_families,
            get_fonts_info,
            get_fonts_head,
            get_font_head,
            get_fonts_by_family,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
