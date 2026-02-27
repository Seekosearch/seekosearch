import type { TorrentResult } from '../types';

export const searchTPB = async (query: string): Promise<TorrentResult[]> => {
  const url = `https://seeko-backend.seeko-search.workers.dev/api/search/tpb?q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('TPB backend request failed');
  }

  const results: TorrentResult[] = await response.json();
  return results;
};
