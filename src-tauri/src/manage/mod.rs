#[cfg(target_os = "linux")]
mod linux;
#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "windows")]
mod windows;

use std::collections::HashSet;
use std::path::{Path, PathBuf};

use serde::Serialize;

use crate::error::{AppError, AppResult};
use crate::font::export;
use crate::font::model::FaceRecord;
use crate::font::source::FontSource;

#[cfg(target_os = "linux")]
use linux as platform;
#[cfg(target_os = "macos")]
use macos as platform;
#[cfg(target_os = "windows")]
use windows as platform;

const EXTENSIONS: [&str; 4] = ["ttf", "otf", "ttc", "otc"];

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InstallReport {
    pub installed: Vec<String>,
    pub skipped: Vec<String>,
    pub failed: Vec<String>,
}

pub fn user_font_dir() -> AppResult<PathBuf> {
    platform::user_font_dir()
}

fn is_supported(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .is_some_and(|ext| EXTENSIONS.contains(&ext.to_ascii_lowercase().as_str()))
}

// フォントとして読めないファイルはインストールしない
fn validate(path: &Path) -> AppResult<Vec<u8>> {
    if !is_supported(path) {
        return Err(AppError::Font(format!(
            "{} は対応していない形式です",
            path.display()
        )));
    }
    let data = std::fs::read(path)?;
    if crate::font::parse::face_count(&data) == 0 {
        return Err(AppError::Font(format!(
            "{} をフォントとして読めません",
            path.display()
        )));
    }
    Ok(data)
}

pub fn install(paths: &[PathBuf]) -> InstallReport {
    let mut report = InstallReport::default();
    let Ok(dir) = user_font_dir() else {
        report.failed = paths
            .iter()
            .map(|path| path.display().to_string())
            .collect();
        return report;
    };
    if std::fs::create_dir_all(&dir).is_err() {
        report.failed = paths
            .iter()
            .map(|path| path.display().to_string())
            .collect();
        return report;
    }

    let mut used: HashSet<String> = std::fs::read_dir(&dir)
        .map(|entries| {
            entries
                .filter_map(Result::ok)
                .map(|entry| entry.file_name().to_string_lossy().into_owned())
                .collect()
        })
        .unwrap_or_default();

    for path in paths {
        let Ok(data) = validate(path) else {
            report.failed.push(path.display().to_string());
            continue;
        };
        let name = path.file_name().map_or_else(
            || "font".to_string(),
            |name| name.to_string_lossy().into_owned(),
        );
        if used.contains(&name) {
            report.skipped.push(path.display().to_string());
            continue;
        }

        let target = dir.join(export::unique_name(&name, &mut used));
        match std::fs::write(&target, &data)
            .map_err(AppError::from)
            .and_then(|()| platform::register(&target, &data))
        {
            Ok(()) => report.installed.push(target.display().to_string()),
            Err(_) => report.failed.push(path.display().to_string()),
        }
    }

    platform::notify_changed();
    report
}

pub fn uninstall(faces: &[&FaceRecord]) -> AppResult<InstallReport> {
    let mut report = InstallReport::default();
    let mut removed: HashSet<PathBuf> = HashSet::new();

    for face in faces {
        // UI の無効化とは別に、ここでも必ず弾く
        if face.source != FontSource::User {
            return Err(AppError::ProtectedLocation);
        }
        if !removed.insert(face.path.clone()) {
            continue;
        }

        let data = std::fs::read(&face.path).unwrap_or_default();
        match platform::unregister(&face.path, &data).and_then(|()| trash(&face.path)) {
            Ok(()) => report.installed.push(face.path.display().to_string()),
            Err(_) => report.failed.push(face.path.display().to_string()),
        }
    }

    platform::notify_changed();
    Ok(report)
}

// 取り返しがつかないので、削除ではなくゴミ箱フォルダに退避する
fn trash(path: &Path) -> AppResult<()> {
    let dir = dirs::data_dir()
        .ok_or_else(|| AppError::Storage("データフォルダを特定できません".into()))?
        .join("dev.newt239.mojimachi/trash");
    std::fs::create_dir_all(&dir)?;

    let mut used: HashSet<String> = std::fs::read_dir(&dir)
        .map(|entries| {
            entries
                .filter_map(Result::ok)
                .map(|entry| entry.file_name().to_string_lossy().into_owned())
                .collect()
        })
        .unwrap_or_default();
    let name = path.file_name().map_or_else(
        || "font".to_string(),
        |name| name.to_string_lossy().into_owned(),
    );

    std::fs::rename(path, dir.join(export::unique_name(&name, &mut used)))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;
    use crate::font::model::FontFormat;

    fn face(path: &str, source: FontSource) -> FaceRecord {
        FaceRecord {
            id: path.into(),
            path: PathBuf::from(path),
            index: 0,
            family_name: "Sample".into(),
            style_name: "Regular".into(),
            postscript_name: None,
            full_name: None,
            weight: 400,
            width: 5,
            is_italic: false,
            is_monospaced: false,
            is_variable: false,
            glyph_count: 1,
            format: FontFormat::TrueType,
            source,
            file_size: 1,
            supports_japanese: false,
            coverage: Vec::new(),
        }
    }

    // システム領域とコンピュータ領域は必ず拒否する
    #[test]
    fn refuses_protected_sources() {
        for source in [FontSource::System, FontSource::Machine, FontSource::Custom] {
            let record = face("/s/a.ttf", source);
            assert!(matches!(
                uninstall(&[&record]),
                Err(AppError::ProtectedLocation)
            ));
        }
    }

    // 対応していない拡張子は弾く
    #[test]
    fn rejects_unsupported_extensions() {
        assert!(is_supported(Path::new("/a/b.ttf")));
        assert!(is_supported(Path::new("/a/b.OTC")));
        assert!(!is_supported(Path::new("/a/b.woff2")));
        assert!(!is_supported(Path::new("/a/b")));
    }

    // フォントとして読めないファイルはインストールしない
    #[test]
    fn rejects_unreadable_font_files() {
        let dir = std::env::temp_dir().join("mojimachi-install-test");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("broken.ttf");
        let _ = std::fs::write(&path, b"not a font");
        assert!(validate(&path).is_err());
        let _ = std::fs::remove_dir_all(&dir);
    }
}
