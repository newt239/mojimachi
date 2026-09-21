use std::path::PathBuf;
use std::time::Duration;

use notify::{RecursiveMode, Watcher};
use tauri::{AppHandle, Emitter, Runtime};

pub const CHANGED_EVENT: &str = "fonts://changed";

const DEBOUNCE: Duration = Duration::from_millis(300);

// 他のアプリでのインストールや削除に追随する
pub fn start<R: Runtime>(app: AppHandle<R>, directories: Vec<PathBuf>) {
    std::thread::spawn(move || {
        let (sender, receiver) = std::sync::mpsc::channel();
        let Ok(mut watcher) = notify::recommended_watcher(sender) else {
            return;
        };
        for directory in &directories {
            let _ = watcher.watch(directory, RecursiveMode::Recursive);
        }

        while receiver.recv().is_ok() {
            while receiver.recv_timeout(DEBOUNCE).is_ok() {}
            let _ = app.emit(CHANGED_EVENT, ());
        }
    });
}
