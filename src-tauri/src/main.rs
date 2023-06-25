// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use font_kit::source::SystemSource;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_font_name_list() -> Vec<String> {
    let source = SystemSource::new();
    let all_fonts = source.all_fonts().unwrap();
    let mut fonts = Vec::new();

    for font in all_fonts {
        let font_object = font.load().unwrap();
        fonts.push(font_object.postscript_name().unwrap());
    }

    fonts
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_font_name_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
