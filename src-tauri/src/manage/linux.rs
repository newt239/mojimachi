use std::path::{Path, PathBuf};
use std::process::Command;

use crate::error::{AppError, AppResult};

pub fn user_font_dir() -> AppResult<PathBuf> {
    dirs::data_dir()
        .map(|data| data.join("fonts"))
        .ok_or_else(|| AppError::Storage("データフォルダを特定できません".into()))
}

pub fn register(_path: &Path, _data: &[u8]) -> AppResult<()> {
    Ok(())
}

pub fn unregister(_path: &Path, _data: &[u8]) -> AppResult<()> {
    Ok(())
}

// fc-cache が無い環境でも失敗させない
pub fn notify_changed() {
    if let Ok(dir) = user_font_dir() {
        let _ = Command::new("fc-cache").arg("-f").arg(dir).status();
    }
}
