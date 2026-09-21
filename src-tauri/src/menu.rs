use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, Runtime};

pub const PRINT_ID: &str = "menu://print";
pub const CHECK_UPDATE_ID: &str = "menu://check-update";
pub const GITHUB_ID: &str = "menu://github";

pub fn build<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let about_metadata = AboutMetadata {
        name: Some("もじまち".to_string()),
        version: Some(env!("CARGO_PKG_VERSION").to_string()),
        authors: Some(vec!["newt239".to_string()]),
        website: Some("https://github.com/newt239/mojimachi".to_string()),
        website_label: Some("GitHub".to_string()),
        ..Default::default()
    };

    let print_item = MenuItem::with_id(app, PRINT_ID, "プリント…", true, Some("CmdOrCtrl+P"))?;
    let update_item = MenuItem::with_id(
        app,
        CHECK_UPDATE_ID,
        "アップデートを確認…",
        true,
        None::<&str>,
    )?;
    let github_item = MenuItem::with_id(app, GITHUB_ID, "GitHub で開く", true, None::<&str>)?;
    let help_menu = Submenu::with_items(app, "ヘルプ", true, &[&github_item])?;

    let edit_menu = Submenu::with_items(
        app,
        "編集",
        true,
        &[
            &PredefinedMenuItem::undo(app, Some("取り消す"))?,
            &PredefinedMenuItem::redo(app, Some("やり直す"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some("カット"))?,
            &PredefinedMenuItem::copy(app, Some("コピー"))?,
            &PredefinedMenuItem::paste(app, Some("ペースト"))?,
            &PredefinedMenuItem::select_all(app, Some("すべてを選択"))?,
        ],
    )?;

    let window_menu = Submenu::with_items(
        app,
        "ウインドウ",
        true,
        &[
            &PredefinedMenuItem::minimize(app, Some("しまう"))?,
            &PredefinedMenuItem::maximize(app, Some("拡大/縮小"))?,
            &PredefinedMenuItem::fullscreen(app, Some("フルスクリーンにする"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, Some("閉じる"))?,
        ],
    )?;

    #[cfg(target_os = "macos")]
    {
        let app_menu = Submenu::with_items(
            app,
            "もじまち",
            true,
            &[
                &PredefinedMenuItem::about(app, Some("もじまち について"), Some(about_metadata))?,
                &update_item,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::services(app, Some("サービス"))?,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::hide(app, Some("もじまち を隠す"))?,
                &PredefinedMenuItem::hide_others(app, Some("ほかを隠す"))?,
                &PredefinedMenuItem::show_all(app, Some("すべてを表示"))?,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::quit(app, Some("もじまち を終了"))?,
            ],
        )?;

        let file_menu = Submenu::with_items(app, "ファイル", true, &[&print_item])?;
        Menu::with_items(
            app,
            &[&app_menu, &file_menu, &edit_menu, &window_menu, &help_menu],
        )
    }

    #[cfg(not(target_os = "macos"))]
    {
        let file_menu = Submenu::with_items(
            app,
            "ファイル",
            true,
            &[
                &print_item,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::about(app, Some("もじまち について"), Some(about_metadata))?,
                &update_item,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::quit(app, Some("終了"))?,
            ],
        )?;

        Menu::with_items(app, &[&file_menu, &edit_menu, &window_menu, &help_menu])
    }
}
