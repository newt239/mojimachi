use serde::Serialize;
use tauri::State;

use crate::error::{AppError, AppResult};
use crate::font::charset::CharsetCoverage;
use crate::font::coverage::{self, BlockGlyphs};
use crate::font::detail::{self, FaceDetail};
use crate::font::duplicate::{self, DuplicateGroup};
use crate::font::export::{self, ExportPlan, ExportResult};
use crate::font::model::{FamilySummary, ScanSummary};
use crate::font::scan;
use crate::manage::{self, InstallReport};
use crate::state::AppState;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoverageFilter {
    pub family_names: Vec<String>,
    pub unsupported: Vec<String>,
}

#[tauri::command]
pub async fn scan_fonts(force: bool, state: State<'_, AppState>) -> AppResult<ScanSummary> {
    if !force {
        if let Ok(catalog) = state.catalog.read() {
            if !catalog.families.is_empty() {
                return Ok(catalog.summary.clone());
            }
        }
    }

    let roots = state.roots();
    let cache_path = state.cache_path.clone();
    let catalog = tauri::async_runtime::spawn_blocking(move || scan::scan(&roots, &cache_path))
        .await
        .map_err(|err| AppError::Font(err.to_string()))?;

    let summary = catalog.summary.clone();
    state.invalidate_sfnt();
    *state.catalog.write().map_err(|_| AppError::FaceNotFound)? = catalog;
    Ok(summary)
}

#[tauri::command]
pub fn list_families(state: State<'_, AppState>) -> AppResult<Vec<FamilySummary>> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    Ok(catalog.families.clone())
}

#[tauri::command]
pub fn get_face_detail(face_id: String, state: State<'_, AppState>) -> AppResult<FaceDetail> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    let record = catalog.face(&face_id).ok_or(AppError::FaceNotFound)?;
    let data = std::fs::read(&record.path)?;
    detail::build(record, &data).ok_or(AppError::FaceNotFound)
}

#[tauri::command]
pub fn get_face_coverage(
    face_id: String,
    state: State<'_, AppState>,
) -> AppResult<Vec<CharsetCoverage>> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    let bitmap = catalog
        .coverage_of(&face_id)
        .ok_or(AppError::FaceNotFound)?;
    Ok(coverage::charset_coverage(bitmap))
}

#[tauri::command]
pub fn get_face_blocks(face_id: String, state: State<'_, AppState>) -> AppResult<Vec<BlockGlyphs>> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    let bitmap = catalog
        .coverage_of(&face_id)
        .ok_or(AppError::FaceNotFound)?;
    Ok(coverage::blocks(bitmap))
}

#[tauri::command]
pub fn filter_families_by_chars(
    text: String,
    state: State<'_, AppState>,
) -> AppResult<CoverageFilter> {
    let mut wanted: Vec<char> = text.chars().filter(|ch| !ch.is_whitespace()).collect();
    wanted.sort_unstable();
    wanted.dedup();

    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    if wanted.is_empty() {
        return Ok(CoverageFilter {
            family_names: catalog
                .families
                .iter()
                .map(|family| family.name.clone())
                .collect(),
            unsupported: Vec::new(),
        });
    }

    let mut covered_anywhere = vec![false; wanted.len()];
    for bitmap in catalog.coverage.values() {
        for (index, ch) in wanted.iter().enumerate() {
            if !covered_anywhere[index] && bitmap.contains(*ch as u32) {
                covered_anywhere[index] = true;
            }
        }
    }

    let family_names = catalog
        .families
        .iter()
        .filter(|family| {
            family.styles.iter().any(|style| {
                catalog
                    .coverage_of(&style.face_id)
                    .is_some_and(|bitmap| wanted.iter().all(|ch| bitmap.contains(*ch as u32)))
            })
        })
        .map(|family| family.name.clone())
        .collect();

    Ok(CoverageFilter {
        family_names,
        unsupported: wanted
            .iter()
            .zip(&covered_anywhere)
            .filter(|(_, covered)| !**covered)
            .map(|(ch, _)| ch.to_string())
            .collect(),
    })
}

#[tauri::command]
pub fn list_duplicates(
    include_system_only: bool,
    state: State<'_, AppState>,
) -> AppResult<Vec<DuplicateGroup>> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    Ok(duplicate::detect(&catalog.faces, include_system_only))
}

#[tauri::command]
pub fn plan_export(face_ids: Vec<String>, state: State<'_, AppState>) -> AppResult<ExportPlan> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    let faces: Vec<_> = face_ids.iter().filter_map(|id| catalog.face(id)).collect();
    Ok(export::plan(&faces))
}

#[tauri::command]
pub async fn run_export(plan: ExportPlan, destination: String) -> AppResult<ExportResult> {
    tauri::async_runtime::spawn_blocking(move || {
        export::run(&plan, std::path::Path::new(&destination))
    })
    .await
    .map_err(|err| AppError::Font(err.to_string()))
}

#[tauri::command]
pub fn reveal_path(path: String) -> AppResult<()> {
    tauri_plugin_opener::reveal_item_in_dir(&path).map_err(|err| AppError::Io(err.to_string()))
}

#[tauri::command]
pub async fn install_fonts(paths: Vec<String>) -> AppResult<InstallReport> {
    tauri::async_runtime::spawn_blocking(move || {
        manage::install(
            &paths
                .into_iter()
                .map(std::path::PathBuf::from)
                .collect::<Vec<_>>(),
        )
    })
    .await
    .map_err(|err| AppError::Font(err.to_string()))
}

#[tauri::command]
pub fn uninstall_faces(
    face_ids: Vec<String>,
    state: State<'_, AppState>,
) -> AppResult<InstallReport> {
    let catalog = state.catalog.read().map_err(|_| AppError::FaceNotFound)?;
    let faces: Vec<_> = face_ids.iter().filter_map(|id| catalog.face(id)).collect();
    manage::uninstall(&faces)
}

#[tauri::command]
pub fn list_search_paths(state: State<'_, AppState>) -> AppResult<Vec<String>> {
    Ok(state
        .search_paths()
        .iter()
        .map(|path| path.to_string_lossy().into_owned())
        .collect())
}

#[tauri::command]
pub fn add_search_path(path: String, state: State<'_, AppState>) -> AppResult<Vec<String>> {
    let mut paths = state.search_paths();
    let added = std::path::PathBuf::from(path);
    if !added.is_dir() {
        return Err(AppError::Storage("フォルダが見つかりません".into()));
    }
    if !paths.contains(&added) {
        paths.push(added);
    }
    paths.sort();
    Ok(state
        .set_search_paths(paths)?
        .iter()
        .map(|path| path.to_string_lossy().into_owned())
        .collect())
}

#[tauri::command]
pub fn remove_search_path(path: String, state: State<'_, AppState>) -> AppResult<Vec<String>> {
    let removed = std::path::PathBuf::from(path);
    let paths = state
        .search_paths()
        .into_iter()
        .filter(|item| *item != removed)
        .collect();
    Ok(state
        .set_search_paths(paths)?
        .iter()
        .map(|path| path.to_string_lossy().into_owned())
        .collect())
}
