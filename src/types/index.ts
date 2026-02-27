export interface TorrentResult {
    id: string;
    name: string;
    size: string;
    date: string;
    seeders: number;
    leechers: number;
    link: string; // Magnet link or direct download
    source: string;
}

export interface SearchState {
    query: string;
    sources: {
        'The Pirate Bay': boolean;
        'Nyaa': boolean;
        'Archive.org': boolean;
        "Anna's Archive": boolean;
        'FitGirl': boolean;
        'ElAmigos': boolean;
        'GamesTorrents': boolean;
        'SkidrowReloaded': boolean;
    };
    isLoading: boolean;
    results: TorrentResult[];
    error: string | null;
}
