use std::collections::HashMap;

use serde::Serialize;

use super::model::{FaceId, FaceRecord};
use super::source::FontSource;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DuplicateCandidate {
    pub face_id: FaceId,
    pub family_name: String,
    pub path: String,
    pub source_label: &'static str,
    pub is_active: bool,
    pub can_uninstall: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DuplicateGroup {
    pub postscript_name: String,
    pub system_only: bool,
    pub candidates: Vec<DuplicateCandidate>,
}

// 解決順は Custom > User > Machine > System、同順位はパスの昇順で決定的にする
fn resolution_order(face: &FaceRecord) -> (std::cmp::Reverse<FontSource>, String) {
    (
        std::cmp::Reverse(face.source),
        face.path.to_string_lossy().into_owned(),
    )
}

pub fn detect(
    faces: &HashMap<FaceId, FaceRecord>,
    include_system_only: bool,
) -> Vec<DuplicateGroup> {
    let mut grouped: HashMap<&str, Vec<&FaceRecord>> = HashMap::new();
    for face in faces.values() {
        if let Some(name) = face.postscript_name.as_deref() {
            grouped.entry(name).or_default().push(face);
        }
    }

    let mut groups: Vec<DuplicateGroup> = grouped
        .into_iter()
        .filter_map(|(name, mut members)| {
            members.sort_by_key(|face| resolution_order(face));
            members.dedup_by(|a, b| a.path == b.path);
            if members.len() < 2 {
                return None;
            }

            let system_only = members
                .iter()
                .all(|face| matches!(face.source, FontSource::System | FontSource::Machine));
            if system_only && !include_system_only {
                return None;
            }

            Some(DuplicateGroup {
                postscript_name: name.to_string(),
                system_only,
                candidates: members
                    .iter()
                    .enumerate()
                    .map(|(index, face)| DuplicateCandidate {
                        face_id: face.id.clone(),
                        family_name: face.family_name.clone(),
                        path: face.path.to_string_lossy().into_owned(),
                        source_label: face.source.label(),
                        is_active: index == 0,
                        can_uninstall: face.source.can_uninstall(),
                    })
                    .collect(),
            })
        })
        .collect();

    groups.sort_by(|a, b| a.postscript_name.cmp(&b.postscript_name));
    groups
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;
    use crate::font::model::FontFormat;

    fn face(id: &str, postscript: &str, path: &str, source: FontSource) -> FaceRecord {
        FaceRecord {
            id: id.into(),
            path: PathBuf::from(path),
            index: 0,
            family_name: "Sample".into(),
            style_name: "Regular".into(),
            postscript_name: Some(postscript.into()),
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

    fn catalog(faces: Vec<FaceRecord>) -> HashMap<FaceId, FaceRecord> {
        faces
            .into_iter()
            .map(|face| (face.id.clone(), face))
            .collect()
    }

    // 同じ PostScript 名が別ファイルにあれば重複として検出する
    #[test]
    fn detects_same_postscript_name_in_other_files() {
        let groups = detect(
            &catalog(vec![
                face("a", "Sample-Regular", "/u/a.ttf", FontSource::User),
                face("b", "Sample-Regular", "/s/b.ttf", FontSource::System),
            ]),
            false,
        );
        assert_eq!(groups.len(), 1);
        assert_eq!(groups[0].candidates.len(), 2);
    }

    // 同一ファイルの face は重複にしない
    #[test]
    fn same_file_is_not_a_duplicate() {
        let groups = detect(
            &catalog(vec![
                face("a", "Sample-Regular", "/u/a.ttc", FontSource::User),
                face("b", "Sample-Regular", "/u/a.ttc", FontSource::User),
            ]),
            false,
        );
        assert!(groups.is_empty());
    }

    // 使用中は解決順の先頭、すなわち優先度が最も高いもの
    #[test]
    fn active_candidate_is_highest_priority() {
        let groups = detect(
            &catalog(vec![
                face("s", "Sample-Regular", "/s/b.ttf", FontSource::System),
                face("u", "Sample-Regular", "/u/a.ttf", FontSource::User),
            ]),
            false,
        );
        let active = groups[0]
            .candidates
            .iter()
            .find(|c| c.is_active)
            .expect("あること");
        assert_eq!(active.face_id, "u");
        assert!(active.can_uninstall);
    }

    // システム標準どうしの重複は既定で隠す
    #[test]
    fn hides_system_only_duplicates_by_default() {
        let faces = catalog(vec![
            face("a", "Sample-Regular", "/s/a.ttf", FontSource::System),
            face("b", "Sample-Regular", "/m/b.ttf", FontSource::Machine),
        ]);
        assert!(detect(&faces, false).is_empty());
        let shown = detect(&faces, true);
        assert_eq!(shown.len(), 1);
        assert!(shown[0].system_only);
    }

    // 入力順が変わっても結果は変わらない
    #[test]
    fn result_is_independent_of_input_order() {
        let forward = detect(
            &catalog(vec![
                face("a", "Sample-Regular", "/u/a.ttf", FontSource::User),
                face("b", "Sample-Regular", "/u/b.ttf", FontSource::User),
            ]),
            false,
        );
        let backward = detect(
            &catalog(vec![
                face("b", "Sample-Regular", "/u/b.ttf", FontSource::User),
                face("a", "Sample-Regular", "/u/a.ttf", FontSource::User),
            ]),
            false,
        );
        let ids = |groups: &[DuplicateGroup]| {
            groups[0]
                .candidates
                .iter()
                .map(|c| c.face_id.clone())
                .collect::<Vec<_>>()
        };
        assert_eq!(ids(&forward), ids(&backward));
        assert_eq!(ids(&forward), vec!["a".to_string(), "b".to_string()]);
    }

    // PostScript 名がないフォントは重複判定に含めない
    #[test]
    fn faces_without_postscript_name_are_ignored() {
        let mut nameless = face("a", "x", "/u/a.ttf", FontSource::User);
        nameless.postscript_name = None;
        let mut other = face("b", "x", "/u/b.ttf", FontSource::User);
        other.postscript_name = None;
        assert!(detect(&catalog(vec![nameless, other]), true).is_empty());
    }
}
