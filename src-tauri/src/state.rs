use std::collections::{HashMap, VecDeque};
use std::path::PathBuf;
use std::sync::{Mutex, RwLock};

use crate::error::{AppError, AppResult};
use crate::font::scan::Catalog;
use crate::font::sfnt;
use crate::font::source::{self, FontSource};

const SFNT_CACHE_CAPACITY: usize = 192;

#[derive(Default)]
struct SfntCache {
    entries: HashMap<String, Vec<u8>>,
    order: VecDeque<String>,
}

impl SfntCache {
    fn get(&mut self, id: &str) -> Option<Vec<u8>> {
        let bytes = self.entries.get(id)?.clone();
        self.order.retain(|key| key != id);
        self.order.push_back(id.to_string());
        Some(bytes)
    }

    fn put(&mut self, id: String, bytes: Vec<u8>) {
        while self.order.len() >= SFNT_CACHE_CAPACITY {
            if let Some(oldest) = self.order.pop_front() {
                self.entries.remove(&oldest);
            }
        }
        self.order.push_back(id.clone());
        self.entries.insert(id, bytes);
    }
}

pub struct AppState {
    pub catalog: RwLock<Catalog>,
    pub cache_path: PathBuf,
    pub search_paths_file: PathBuf,
    pub extra_roots: RwLock<Vec<PathBuf>>,
    sfnt_cache: Mutex<SfntCache>,
}

impl AppState {
    pub fn new(cache_path: PathBuf, search_paths_file: PathBuf) -> Self {
        let saved = std::fs::read_to_string(&search_paths_file)
            .ok()
            .and_then(|text| serde_json::from_str::<Vec<PathBuf>>(&text).ok())
            .unwrap_or_default();

        Self {
            catalog: RwLock::new(Catalog::default()),
            cache_path,
            search_paths_file,
            extra_roots: RwLock::new(saved),
            sfnt_cache: Mutex::new(SfntCache::default()),
        }
    }

    pub fn search_paths(&self) -> Vec<PathBuf> {
        self.extra_roots
            .read()
            .map(|paths| paths.clone())
            .unwrap_or_default()
    }

    pub fn set_search_paths(&self, paths: Vec<PathBuf>) -> AppResult<Vec<PathBuf>> {
        if let Some(parent) = self.search_paths_file.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let text =
            serde_json::to_string(&paths).map_err(|err| AppError::Storage(err.to_string()))?;
        std::fs::write(&self.search_paths_file, text)?;
        *self
            .extra_roots
            .write()
            .map_err(|_| AppError::FaceNotFound)? = paths.clone();
        Ok(paths)
    }

    pub fn roots(&self) -> Vec<(PathBuf, FontSource)> {
        let mut roots = source::default_roots();
        if let Ok(extra) = self.extra_roots.read() {
            roots.extend(
                extra
                    .iter()
                    .filter(|path| path.is_dir())
                    .map(|path| (path.clone(), FontSource::Custom)),
            );
        }
        roots
    }

    pub fn invalidate_sfnt(&self) {
        if let Ok(mut cache) = self.sfnt_cache.lock() {
            cache.entries.clear();
            cache.order.clear();
        }
    }

    pub fn sfnt_bytes(&self, face_id: &str) -> AppResult<Vec<u8>> {
        if let Ok(mut cache) = self.sfnt_cache.lock() {
            if let Some(bytes) = cache.get(face_id) {
                return Ok(bytes);
            }
        }

        let (path, index) = {
            let catalog = self.catalog.read().map_err(|_| AppError::FaceNotFound)?;
            let face = catalog.face(face_id).ok_or(AppError::FaceNotFound)?;
            (face.path.clone(), face.index)
        };

        let data = std::fs::read(&path)?;
        let bytes = sfnt::single_face_sfnt(&data, index)?;
        if let Ok(mut cache) = self.sfnt_cache.lock() {
            cache.put(face_id.to_string(), bytes.clone());
        }
        Ok(bytes)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // 容量を超えると古いものから捨てられる
    #[test]
    fn evicts_oldest_entries() {
        let mut cache = SfntCache::default();
        for i in 0..SFNT_CACHE_CAPACITY + 5 {
            cache.put(i.to_string(), vec![0]);
        }
        assert_eq!(cache.entries.len(), SFNT_CACHE_CAPACITY);
        assert!(cache.get("0").is_none());
        assert!(cache.get(&SFNT_CACHE_CAPACITY.to_string()).is_some());
    }

    // 取り出したものは最近使ったものとして残る
    #[test]
    fn get_refreshes_recency() {
        let mut cache = SfntCache::default();
        cache.put("a".into(), vec![1]);
        for i in 0..SFNT_CACHE_CAPACITY - 1 {
            cache.put(format!("x{i}"), vec![0]);
        }
        assert!(cache.get("a").is_some());
        cache.put("new".into(), vec![2]);
        assert!(cache.get("a").is_some());
    }
}
