import path from 'path';
import fs from 'fs';

export type AccountCache = {
  id: string;
  actions: Record<string, boolean>;
};

const accountCacheFile = path.join(__dirname, 'accountCacheData.json');
const EMPTY_CACHE: AccountCache = {
  id: '',
  actions: {}
};

let cache = loadCache();

export function resetCache() {
  saveCache(EMPTY_CACHE);
}

export function resetCacheOnAccountChange(id: string) {
  if (!cache.id) {
    loadCache();
  }

  if (cache.id !== id) {
    saveCache({ ...EMPTY_CACHE, id });
  }
}

function saveCache(data: AccountCache) {
  fs.writeFileSync(accountCacheFile, JSON.stringify(data, null, 4));
}

function loadCache() {
  try {
    const content = fs.readFileSync(accountCacheFile, 'utf8');
    const cache = content ? (JSON.parse(content) as AccountCache) : EMPTY_CACHE;
    if (!content) {
      resetCache();
    }

    return cache;
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    resetCache();

    return EMPTY_CACHE;
  }
}

export function getCachedActions(id: string): Record<string, boolean> {
  console.log('💾 action cache:', cache.id, cache.actions);
  if (!cache.id) {
    loadCache();
  }

  if (cache.id !== id) {
    return {};
  }

  return cache.actions || {};
}

export function setCachedActions(
  id: string,
  actions: Record<string, boolean>
): Record<string, boolean> {
  if (!id) {
    return {};
  }

  if (!cache.id) {
    loadCache();
  }

  if (cache.id !== id) {
    cache = { id, actions };
  } else {
    cache = { id, actions: { ...cache.actions, ...actions } };
  }

  saveCache(cache);

  return cache.actions || {};
}
