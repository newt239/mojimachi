use std::path::{Path, PathBuf};

use crate::error::{AppError, AppResult};

pub fn user_font_dir() -> AppResult<PathBuf> {
    dirs::home_dir()
        .map(|home| home.join("Library/Fonts"))
        .ok_or_else(|| AppError::Storage("ホームフォルダを特定できません".into()))
}

// ~/Library/Fonts に置けば CoreText が自動で拾う
pub fn register(_path: &Path, _data: &[u8]) -> AppResult<()> {
    Ok(())
}

pub fn unregister(_path: &Path, _data: &[u8]) -> AppResult<()> {
    Ok(())
}

pub fn notify_changed() {}
