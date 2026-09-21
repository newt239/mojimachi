use std::path::{Path, PathBuf};

use read_fonts::types::{NameId, Tag};
use read_fonts::{FontRef, TableProvider};
use windows::core::HSTRING;
use windows::Win32::Foundation::{LPARAM, WPARAM};
use windows::Win32::Graphics::Gdi::{AddFontResourceW, RemoveFontResourceW};
use windows::Win32::UI::WindowsAndMessaging::{
    SendMessageTimeoutW, HWND_BROADCAST, SMTO_ABORTIFHUNG, WM_FONTCHANGE,
};

use crate::error::{AppError, AppResult};

fn is_open_type_cff(data: &[u8]) -> bool {
    FontRef::from_index(data, 0).is_ok_and(|font| font.table_data(Tag::new(b"CFF ")).is_some())
}

// .ttc は全 face のフルネームを & でつないだ名前で登録される
pub fn registry_value_name(data: &[u8]) -> Option<String> {
    let names: Vec<String> = (0..crate::font::parse::face_count(data))
        .filter_map(|index| {
            let font = FontRef::from_index(data, index).ok()?;
            let table = font.name().ok()?;
            crate::font::names::get(&crate::font::names::collect(&table), NameId::FULL_NAME)
        })
        .collect();
    if names.is_empty() {
        return None;
    }
    let suffix = if is_open_type_cff(data) {
        " (OpenType)"
    } else {
        " (TrueType)"
    };
    Some(format!("{}{suffix}", names.join(" & ")))
}

const FONTS_KEY: &str = r"Software\Microsoft\Windows NT\CurrentVersion\Fonts";

pub fn user_font_dir() -> AppResult<PathBuf> {
    dirs::data_local_dir()
        .map(|local| local.join("Microsoft").join("Windows").join("Fonts"))
        .ok_or_else(|| AppError::Storage("ローカルアプリデータを特定できません".into()))
}

// ユーザー単位のインストールでは絶対パスを値に入れる
pub fn register(path: &Path, data: &[u8]) -> AppResult<()> {
    let name = registry_value_name(data)
        .ok_or_else(|| AppError::Font("フォント名を読み取れません".into()))?;
    let text = HSTRING::from(path.as_os_str());

    if unsafe { AddFontResourceW(&text) } == 0 {
        return Err(AppError::Io("フォントを登録できません".into()));
    }

    let key = windows_registry::CURRENT_USER
        .create(FONTS_KEY)
        .map_err(|err| AppError::Io(err.to_string()))?;
    key.set_string(&name, path.to_string_lossy())
        .map_err(|err| AppError::Io(err.to_string()))
}

pub fn unregister(path: &Path, data: &[u8]) -> AppResult<()> {
    let text = HSTRING::from(path.as_os_str());
    unsafe {
        let _ = RemoveFontResourceW(&text);
    }

    if let Some(name) = registry_value_name(data) {
        if let Ok(key) = windows_registry::CURRENT_USER.create(FONTS_KEY) {
            let _ = key.remove_value(&name);
        }
    }
    Ok(())
}

pub fn notify_changed() {
    unsafe {
        let _ = SendMessageTimeoutW(
            HWND_BROADCAST,
            WM_FONTCHANGE,
            WPARAM(0),
            LPARAM(0),
            SMTO_ABORTIFHUNG,
            1000,
            None,
        );
    }
}

#[cfg(test)]
mod tests {
    use write_fonts::FontBuilder;

    use super::*;

    // 読めないデータからはレジストリの値名を作らない
    #[test]
    fn registry_value_name_needs_a_readable_font() {
        assert!(registry_value_name(b"not a font").is_none());
        assert!(registry_value_name(&[]).is_none());
    }

    // CFF を持つフォントは OpenType として扱う
    #[test]
    fn detects_open_type_cff() {
        let mut builder = FontBuilder::new();
        builder.add_raw(Tag::new(b"CFF "), vec![0_u8; 4]);
        assert!(is_open_type_cff(&builder.build()));

        let mut builder = FontBuilder::new();
        builder.add_raw(Tag::new(b"glyf"), vec![0_u8; 4]);
        assert!(!is_open_type_cff(&builder.build()));
    }

    // ユーザー領域のフォントフォルダは %LOCALAPPDATA% の下にある
    #[test]
    fn user_font_dir_is_under_local_app_data() {
        let dir = user_font_dir().expect("取得できること");
        assert!(dir.ends_with("Microsoft\\Windows\\Fonts"));
    }
}
