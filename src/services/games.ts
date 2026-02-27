import type { TorrentResult } from '../types';

export const searchFitGirl = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/fitgirl?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('FitGirl request failed');
    return await res.json();
};

export const searchElAmigos = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/elamigos?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('ElAmigos request failed');
    return await res.json();
};

export const searchGamesTorrents = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/gamestorrents?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('GamesTorrents request failed');
    return await res.json();
};

export const searchSkidrow = async (query: string): Promise<TorrentResult[]> => {
    const url = `https://seeko-backend.seeko-search.workers.dev/api/search/skidrowreloaded?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('SkidrowReloaded request failed');
    return await res.json();
};
