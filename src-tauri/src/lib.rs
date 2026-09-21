mod commands;
mod error;
mod font;
mod manage;
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
            let config_dir = app.path().app_config_dir()?;
            app.manage(AppState::new(
                cache_dir.join("catalog.bin"),
                config_dir.join("search-paths.json"),
            ));

            let state = app.state::<AppState>();
            let directories = state.roots().into_iter().map(|(path, _)| path).collect();
            font::watch::start(app.handle().clone(), directories);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::scan_fonts,
            commands::list_families,
            commands::get_face_detail,
            commands::get_face_coverage,
            commands::get_face_blocks,
            commands::filter_families_by_chars,
            commands::list_duplicates,
            commands::plan_export,
            commands::run_export,
            commands::reveal_path,
            commands::install_fonts,
            commands::uninstall_faces,
            commands::list_search_paths,
            commands::add_search_path,
            commands::remove_search_path
        ])
        .menu(menu::build)
        .run(tauri::generate_context!())
        .expect("アプリの起動に失敗しました");
}
