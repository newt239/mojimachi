use std::collections::HashMap;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::model::FaceRecord;

const VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Entry {
    pub mtime: u64,
    pub size: u64,
    pub faces: Vec<FaceRecord>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Cache {
    pub version: u32,
    pub entries: HashMap<PathBuf, Entry>,
}

impl Cache {
    pub fn empty() -> Self {
        Self {
            version: VERSION,
            entries: HashMap::new(),
        }
    }

    pub fn hit(&self, path: &Path, mtime: u64, size: u64) -> Option<&Vec<FaceRecord>> {
        self.entries
            .get(path)
            .filter(|entry| entry.mtime == mtime && entry.size == size)
            .map(|entry| &entry.faces)
    }
}

pub fn load(path: &Path) -> Cache {
    let Ok(bytes) = std::fs::read(path) else {
        return Cache::empty();
    };
    match postcard::from_bytes::<Cache>(&bytes) {
        Ok(cache) if cache.version == VERSION => cache,
        _ => Cache::empty(),
    }
}

pub fn save(path: &Path, cache: &Cache) {
    let Ok(bytes) = postcard::to_stdvec(cache) else {
        return;
    };
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    let _ = std::fs::write(path, bytes);
}

pub fn modified_secs(metadata: &std::fs::Metadata) -> u64 {
    metadata
        .modified()
        .ok()
        .and_then(|time| time.duration_since(std::time::UNIX_EPOCH).ok())
        .map_or(0, |duration| duration.as_secs())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::font::model::FontFormat;
    use crate::font::source::FontSource;

    fn sample() -> FaceRecord {
        FaceRecord {
            id: "abc".into(),
            path: PathBuf::from("/a.ttf"),
            index: 0,
            family_name: "サンプル".into(),
            style_name: "Regular".into(),
            postscript_name: None,
            full_name: None,
            weight: 400,
            width: 5,
            is_italic: false,
            is_monospaced: false,
            is_variable: false,
            glyph_count: 10,
            format: FontFormat::TrueType,
            source: FontSource::User,
            file_size: 100,
            supports_japanese: true,
            coverage: Vec::new(),
        }
    }

    // mtime と size が一致したときだけキャッシュを使う
    #[test]
    fn hit_requires_matching_stamp() {
        let mut cache = Cache::empty();
        cache.entries.insert(
            PathBuf::from("/a.ttf"),
            Entry {
                mtime: 10,
                size: 100,
                faces: vec![sample()],
            },
        );
        let path = Path::new("/a.ttf");
        assert!(cache.hit(path, 10, 100).is_some());
        assert!(cache.hit(path, 11, 100).is_none());
        assert!(cache.hit(path, 10, 101).is_none());
        assert!(cache.hit(Path::new("/b.ttf"), 10, 100).is_none());
    }

    // 往復してもフォント情報が保たれる
    #[test]
    fn round_trips_through_postcard() {
        let mut cache = Cache::empty();
        cache.entries.insert(
            PathBuf::from("/a.ttf"),
            Entry {
                mtime: 1,
                size: 2,
                faces: vec![sample()],
            },
        );
        let bytes = postcard::to_stdvec(&cache).expect("直列化できること");
        let restored: Cache = postcard::from_bytes(&bytes).expect("復元できること");
        assert_eq!(restored.version, VERSION);
        let faces = restored
            .hit(Path::new("/a.ttf"), 1, 2)
            .expect("ヒットすること");
        assert_eq!(faces[0].family_name, "サンプル");
    }

    // スキーマ版が違うキャッシュは捨てる
    #[test]
    fn discards_other_schema_version() {
        let dir = std::env::temp_dir().join("mojimachi-cache-test");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("catalog.bin");
        let stale = Cache {
            version: VERSION + 1,
            entries: HashMap::new(),
        };
        save(&path, &stale);
        assert!(load(&path).entries.is_empty());
        let _ = std::fs::remove_dir_all(&dir);
    }
}
