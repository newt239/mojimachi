use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FontSource {
    Unknown,
    System,
    Machine,
    User,
    Custom,
}

impl FontSource {
    pub fn label(self) -> &'static str {
        match self {
            Self::System => "システム",
            Self::Machine => "コンピュータ",
            Self::User => "ユーザー",
            Self::Custom => "追加した場所",
            Self::Unknown => "不明",
        }
    }

    pub fn can_export(self) -> bool {
        matches!(self, Self::User | Self::Custom | Self::Machine)
    }

    pub fn can_uninstall(self) -> bool {
        matches!(self, Self::User)
    }
}

#[cfg(target_os = "macos")]
fn platform_roots() -> Vec<(PathBuf, FontSource)> {
    let mut roots = vec![
        (PathBuf::from("/System/Library/Fonts"), FontSource::System),
        (PathBuf::from("/Library/Fonts"), FontSource::Machine),
        (PathBuf::from("/Network/Library/Fonts"), FontSource::Machine),
    ];
    if let Some(home) = dirs::home_dir() {
        roots.push((home.join("Library/Fonts"), FontSource::User));
    }
    roots
}

#[cfg(target_os = "windows")]
fn platform_roots() -> Vec<(PathBuf, FontSource)> {
    let mut roots = Vec::new();
    if let Ok(windir) = std::env::var("WINDIR") {
        roots.push((PathBuf::from(windir).join("Fonts"), FontSource::System));
    }
    if let Some(local) = dirs::data_local_dir() {
        roots.push((local.join("Microsoft/Windows/Fonts"), FontSource::User));
    }
    roots
}

#[cfg(target_os = "linux")]
fn platform_roots() -> Vec<(PathBuf, FontSource)> {
    let mut roots = vec![
        (PathBuf::from("/usr/share/fonts"), FontSource::System),
        (PathBuf::from("/usr/local/share/fonts"), FontSource::Machine),
    ];
    if let Some(data) = dirs::data_dir() {
        roots.push((data.join("fonts"), FontSource::User));
    }
    if let Some(home) = dirs::home_dir() {
        roots.push((home.join(".fonts"), FontSource::User));
    }
    roots
}

pub fn default_roots() -> Vec<(PathBuf, FontSource)> {
    platform_roots()
        .into_iter()
        .filter(|(path, _)| path.is_dir())
        .collect()
}

pub fn classify(path: &Path, roots: &[(PathBuf, FontSource)]) -> FontSource {
    roots
        .iter()
        .filter(|(root, _)| path.starts_with(root))
        .max_by_key(|(root, _)| root.as_os_str().len())
        .map_or(FontSource::Unknown, |(_, source)| *source)
}

#[cfg(test)]
mod tests {
    use super::*;

    // より深いルートが優先される
    #[test]
    fn classify_prefers_deepest_root() {
        let roots = vec![
            (PathBuf::from("/a"), FontSource::System),
            (PathBuf::from("/a/b"), FontSource::User),
        ];
        assert_eq!(classify(Path::new("/a/b/c.ttf"), &roots), FontSource::User);
        assert_eq!(classify(Path::new("/a/x.ttf"), &roots), FontSource::System);
    }

    // どのルートにも属さないものは不明になる
    #[test]
    fn classify_unknown_outside_roots() {
        let roots = vec![(PathBuf::from("/a"), FontSource::System)];
        assert_eq!(classify(Path::new("/z/x.ttf"), &roots), FontSource::Unknown);
    }

    // システム領域は書き出しもアンインストールもできない
    #[test]
    fn system_is_protected() {
        assert!(!FontSource::System.can_export());
        assert!(!FontSource::System.can_uninstall());
        assert!(FontSource::User.can_export());
        assert!(FontSource::User.can_uninstall());
        assert!(!FontSource::Machine.can_uninstall());
    }

    // 解決順は Custom > User > Machine > System > Unknown
    #[test]
    fn source_ordering() {
        let mut sources = vec![
            FontSource::System,
            FontSource::Custom,
            FontSource::Unknown,
            FontSource::User,
            FontSource::Machine,
        ];
        sources.sort();
        assert_eq!(
            sources,
            vec![
                FontSource::Unknown,
                FontSource::System,
                FontSource::Machine,
                FontSource::User,
                FontSource::Custom,
            ]
        );
    }
}
