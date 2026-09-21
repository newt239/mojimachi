mod commands;
mod error;
mod font;
mod menu;
mod protocol;
mod state;

use tauri::Manager;

use crate::state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build());

    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    {
        builder = builder
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .register_asynchronous_uri_scheme_protocol(protocol::SCHEME, protocol::handle)
        .setup(|app| {
            let cache_dir = app.path().app_cache_dir()?;
            app.manage(AppState::new(cache_dir.join("catalog.bin")));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::scan_fonts,
            commands::list_families,
            commands::get_face_detail,
            commands::get_face_coverage,
            commands::get_face_blocks,
            commands::filter_families_by_chars
        ])
        .menu(menu::build)
        .run(tauri::generate_context!())
        .expect("アプリの起動に失敗しました");
}
