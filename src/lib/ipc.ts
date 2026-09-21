import { invoke } from "@tauri-apps/api/core";

import type {
  BlockGlyphs,
  CharsetCoverage,
  CoverageFilter,
  DuplicateGroup,
  ExportPlan,
  ExportResult,
  FaceDetail,
  FamilySummary,
  InstallReport,
  ScanSummary,
} from "./types";

export const scanFonts = (force: boolean) => invoke<ScanSummary>("scan_fonts", { force });

export const listFamilies = () => invoke<FamilySummary[]>("list_families");

export const getFaceDetail = (faceId: string) => invoke<FaceDetail>("get_face_detail", { faceId });

export const getFaceCoverage = (faceId: string) =>
  invoke<CharsetCoverage[]>("get_face_coverage", { faceId });

export const getFaceBlocks = (faceId: string) =>
  invoke<BlockGlyphs[]>("get_face_blocks", { faceId });

export const filterFamiliesByChars = (text: string) =>
  invoke<CoverageFilter>("filter_families_by_chars", { text });

export const listDuplicates = (includeSystemOnly: boolean) =>
  invoke<DuplicateGroup[]>("list_duplicates", { includeSystemOnly });

export const planExport = (faceIds: string[]) => invoke<ExportPlan>("plan_export", { faceIds });

export const runExport = (faceIds: string[], destination: string) =>
  invoke<ExportResult>("run_export", { faceIds, destination });

export const installFonts = (paths: string[]) => invoke<InstallReport>("install_fonts", { paths });

export const uninstallFaces = (faceIds: string[]) =>
  invoke<InstallReport>("uninstall_faces", { faceIds });

export const revealPath = (path: string) => invoke<null>("reveal_path", { path });

export const listSearchPaths = () => invoke<string[]>("list_search_paths");

export const addSearchPath = (path: string) => invoke<string[]>("add_search_path", { path });

export const removeSearchPath = (path: string) => invoke<string[]>("remove_search_path", { path });
