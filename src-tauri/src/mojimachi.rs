use directories::UserDirs;
use font_kit::{source::SystemSource, sources::{fs::FsSource, multi::MultiSource}};

#[cfg(target_os = "windows")]
fn get_additional_path() -> Option<FsSource> {

    if let Some(user_dirs) = UserDirs::new() {
        let home_dir = user_dirs.home_dir().to_str().unwrap();
        return Some(FsSource::in_path(home_dir.to_string() +"\\AppData\\Local\\Microsoft\\Windows\\Fonts\\"));
    }

    None
}

#[cfg(not(target_os = "windows"))]
fn get_additional_path() -> Option<FsSource> {
    None
}

pub fn get_source() -> MultiSource {
    let other_source = get_additional_path().unwrap();
    let source = SystemSource::new();
    MultiSource::from_sources(
        vec![
            Box::new(source),
            Box::new(other_source),
        ]
    )
}