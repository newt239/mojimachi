// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mojimachi;

use std::fs::{File, self};
use std::io::Read;
use std::time::Instant;
use font_kit::font::Font;
use serde::Serialize;
use font_kit::handle::Handle;
use tauri::Menu;
use ttf_parser::{Tag, name::Table};

#[derive(Serialize)]
struct FontInfo {
    family_name: String,
    postscript_name: Option<String>,
    font_path: String,
}

fn check_ja_family(ja: bool, font: Font) -> bool {
    let glyph1 = font.glyph_for_char('あ');
    let glyph2 = font.glyph_for_char('ア');
    (ja && (
        (glyph1.is_some() && glyph1.unwrap() != 0) || (glyph2.is_some() && glyph2.unwrap() != 0)
    )) || !ja
}

#[tauri::command]
fn get_file_as_byte_vec(filename: String) -> Vec<u8> {
    let filename_ref = &filename;
    let mut f = File::open(&filename_ref).expect("no file found");
    let metadata = fs::metadata(&filename_ref).expect("unable to read metadata");
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).expect("buffer overflow");

    buffer
}

#[tauri::command]
fn get_families(keyword: String, ja: bool) -> Vec<FontInfo> {
    let start = Instant::now();
    let source = mojimachi::get_source();
    let families = source.all_families().unwrap();
    let mut filtered_families = Vec::new();
    for family_name in families {
        if keyword != String::from("") {
            if family_name.to_lowercase().contains(&keyword.to_lowercase()) {
                filtered_families.push(family_name);
            }
        } else {
            filtered_families.push(family_name);
        }
    }

    filtered_families.sort();
    filtered_families.dedup();

    let mut parsed_families = Vec::new();
    for family_name in filtered_families {
        let family_handle = source.select_family_by_name(&family_name).unwrap();
        if !family_handle.is_empty() {
            let fonts = family_handle.fonts();
            let font_handle = fonts.first().unwrap();
            let mut font_path = String::from("");
            if let Handle::Path{path, font_index: _} = font_handle {
                font_path = path.clone().into_os_string().into_string().unwrap();
            }
            let font = font_handle.load().unwrap();
            let font_info = FontInfo {
                family_name: font.family_name().to_string(),
                postscript_name: font.postscript_name(),
                font_path: font_path,
            };
            if check_ja_family(ja, font) {
            parsed_families.push(font_info);
            }
        }
    }
    let end = start.elapsed();
    println!("[get_families] {}.{:03}s", end.as_secs(), end.subsec_nanos() / 1_000_000);
    
    parsed_families
}

#[tauri::command]
fn get_fonts_by_family(family: String) -> Vec<FontInfo> {
    let source = mojimachi::get_source();
    let family_handle = source.select_family_by_name(&family).unwrap();
    let fonts_handle = family_handle.fonts();
    let mut family_fonts = Vec::new();

    for font_handle in fonts_handle {
        let font = font_handle.load().unwrap();
        let postscript_name = font.postscript_name();
        if !family_fonts.iter().any(|f: &FontInfo| f.postscript_name == postscript_name) {
            let mut font_path = String::from("");
            if let Handle::Path{path, font_index: _} = font_handle {
                font_path = path.clone().into_os_string().into_string().unwrap();
            }
            let font_info = FontInfo {
                family_name: font.family_name().to_string(),
                postscript_name,
                font_path: font_path,
            };
            family_fonts.push(font_info);
        }
    }
    family_fonts
}

#[tauri::command]
fn get_fonts_info() -> Vec<FontInfo> {
    let source = mojimachi::get_source();
    let all_fonts = source.all_fonts().unwrap();
    let mut fonts = Vec::new();

    for font_handle in all_fonts {
        let font = font_handle.load().unwrap();
        let mut font_path = String::from("");
        if let Handle::Path{path, font_index: _} = font_handle {
            font_path = path.clone().into_os_string().into_string().unwrap();
        }
        let font_info = FontInfo {
            family_name: font.family_name().to_string(),
            postscript_name: font.postscript_name(),
            font_path: font_path,
        };
        fonts.push(font_info);
    }

    fonts
}

#[tauri::command]
fn get_fonts_head() -> Vec<Vec<Option<String>>> {
    let name_table_tag = Tag::from_bytes(b"name").as_u32();
    let source = mojimachi::get_source();
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
    let source = mojimachi::get_source();
    let font_handle = source.select_by_postscript_name(&name).unwrap();
    let font = font_handle.load().unwrap();
    let name_table_bytes = font.load_font_table(name_table_tag).unwrap();
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

fn main() {
    let menu = Menu::new();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_families,
            get_fonts_info,
            get_fonts_head,
            get_font_head,
            get_fonts_by_family,
            get_file_as_byte_vec
        ])
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
