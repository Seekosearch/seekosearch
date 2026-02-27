import type { TorrentResult } from '../types';

export const searchAnnasArchive = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/annas-archive?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Annas Archive backend request failed');
    }

    const results: TorrentResult[] = await response.json();
    if (results.length === 0) {
        throw new Error("Cloudflare blocked the request or no results found.");
    }

    return results;
};
