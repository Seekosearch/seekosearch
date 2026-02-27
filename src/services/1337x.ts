import type { TorrentResult } from '../types';

export const search1337x = async (query: string): Promise<TorrentResult[]> => {
  const url = `https://seeko-backend.seeko-search.workers.dev/api/search/1337x?q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('1337x backend request failed');
  }

  const results: TorrentResult[] = await response.json();
  if (results.length === 0) {
    throw new Error('No results found or blocked by Cloudflare.');
  }

  return results;
};
