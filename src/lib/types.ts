export type FontSource = "unknown" | "system" | "machine" | "user" | "custom";

export type StyleSummary = {
  faceId: string;
  styleName: string;
  postscriptName: string | null;
  weight: number;
  width: number;
  isItalic: boolean;
  isMonospaced: boolean;
  isVariable: boolean;
  source: FontSource;
  sourceLabel: string;
  formatLabel: string;
  canExport: boolean;
  canUninstall: boolean;
};

export type FamilySummary = {
  name: string;
  searchKey: string;
  supportsJapanese: boolean;
  hasItalic: boolean;
  styles: StyleSummary[];
};

export type ScanSummary = {
  familyCount: number;
  faceCount: number;
  failedCount: number;
  elapsedMs: number;
};

export type NameEntry = { label: string; value: string };

export type VariationAxis = {
  tag: string;
  name: string;
  min: number;
  default: number;
  max: number;
};

export type FontFeature = {
  tag: string;
  label: string;
  group: string | null;
  sample: string;
};

export type FaceDetail = {
  faceId: string;
  familyName: string;
  styleName: string;
  postscriptName: string | null;
  names: NameEntry[];
  axes: VariationAxis[];
  features: FontFeature[];
  glyphCount: number;
  languages: string[];
  formatLabel: string;
  sourceLabel: string;
  path: string;
  fileSize: number;
  index: number;
  isVariable: boolean;
  canExport: boolean;
  canUninstall: boolean;
};

export type CharsetCoverage = {
  id: string;
  name: string;
  covered: number;
  total: number;
};

export type BlockGlyphs = { id: number; name: string; codePoints: number[] };

export type CoverageFilter = { familyNames: string[]; unsupported: string[] };

export type DuplicateCandidate = {
  faceId: string;
  familyName: string;
  path: string;
  sourceLabel: string;
  isActive: boolean;
  canUninstall: boolean;
};

export type DuplicateGroup = {
  postscriptName: string;
  systemOnly: boolean;
  candidates: DuplicateCandidate[];
};

export type ExportPlan = {
  paths: string[];
  excludedSystemCount: number;
  missingFileCount: number;
  collectionCount: number;
};

export type ExportResult = { copied: string[]; failed: string[] };

export type InstallReport = {
  installed: string[];
  skipped: string[];
  failed: string[];
};
