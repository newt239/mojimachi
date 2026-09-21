import { convertFileSrc } from "@tauri-apps/api/core";

const SCHEME = "fontface";
const CAPACITY = 220;

const loaded = new Map<string, FontFace>();
const pending = new Map<string, Promise<void>>();
const pinned = new Set<string>();
const recency: string[] = [];

export const faceFamily = (faceId: string) => `mj-${faceId}`;

export const faceUrl = (faceId: string) => convertFileSrc(faceId, SCHEME);

const touch = (faceId: string) => {
  const at = recency.indexOf(faceId);
  if (at !== -1) {
    recency.splice(at, 1);
  }
  recency.push(faceId);
};

const evict = () => {
  while (recency.length > CAPACITY) {
    const oldest = recency.find((id) => !pinned.has(id));
    if (oldest === undefined) {
      return;
    }
    recency.splice(recency.indexOf(oldest), 1);
    const face = loaded.get(oldest);
    if (face) {
      document.fonts.delete(face);
    }
    loaded.delete(oldest);
  }
};

// 一覧に数千の face を並べるため、実際に見えているものだけを登録して古いものから外す
export const ensureFace = (faceId: string): Promise<void> => {
  touch(faceId);
  if (loaded.has(faceId)) {
    return Promise.resolve();
  }

  const existing = pending.get(faceId);
  if (existing) {
    return existing;
  }

  const face = new FontFace(faceFamily(faceId), `url("${faceUrl(faceId)}")`);
  const task = face
    .load()
    .then((ready) => {
      document.fonts.add(ready);
      loaded.set(faceId, ready);
      evict();
    })
    .catch(() => {
      // 壊れたフォントは Tofu で表示されるため、登録失敗は無視する
    })
    .finally(() => {
      pending.delete(faceId);
    });

  pending.set(faceId, task);
  return task;
};

export const pinFaces = async (faceIds: string[]) => {
  for (const id of faceIds) {
    pinned.add(id);
  }
  await Promise.all(faceIds.map((id) => ensureFace(id)));
  await document.fonts.ready;
};

export const unpinFaces = (faceIds: string[]) => {
  for (const id of faceIds) {
    pinned.delete(id);
  }
  evict();
};

export const resetFaces = () => {
  for (const face of loaded.values()) {
    document.fonts.delete(face);
  }
  loaded.clear();
  pending.clear();
  pinned.clear();
  recency.length = 0;
};
