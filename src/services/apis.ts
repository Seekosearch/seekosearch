import type { TorrentResult } from '../types';


export const searchArchiveOrg = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/archiveorg?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Archive.org backend request failed');
    return await response.json();
};

export const searchAnnasArchive = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/annasarchive?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Anna's Archive backend request failed");
    return await response.json();
};
