import { scrapeNyaa } from './scrapers/nyaa.js';
import { scrapeTPB } from './scrapers/tpb.js';
import { scrapeArchiveOrg, scrapeAnnasArchive } from './scrapers/apis.js';
import { scrapeFitGirl, scrapeElAmigos, scrapeGamesTorrents, scrapeSkidrow } from './scrapers/games.js';
import { filterByRelevance } from './scrapers/relevance.js';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

export default {
    async fetch(request) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // Health check
        if (path === '/api/health') {
            return jsonResponse({ status: 'ok', message: 'Seeko Search backend is running' });
        }

        // Search routes: /api/search/:source
        const searchMatch = path.match(/^\/api\/search\/([a-z0-9_-]+)$/i);
        if (searchMatch) {
            const source = searchMatch[1];
            const query = url.searchParams.get('q');

            if (!query) {
                return jsonResponse({ error: 'Missing query parameter "q"' }, 400);
            }

            try {
                let results = [];
                switch (source) {
                    case 'nyaa':
                        results = await scrapeNyaa(query);
                        break;
                    case 'tpb':
                        results = await scrapeTPB(query);
                        break;
                    case 'archiveorg':
                        results = await scrapeArchiveOrg(query);
                        break;
                    case 'annasarchive':
                        results = await scrapeAnnasArchive(query);
                        break;
                    case 'fitgirl':
                        results = await scrapeFitGirl(query);
                        break;
                    case 'elamigos':
                        results = await scrapeElAmigos(query);
                        break;
                    case 'gamestorrents':
                        results = await scrapeGamesTorrents(query);
                        break;
                    case 'skidrowreloaded':
                        results = await scrapeSkidrow(query);
                        break;
                    default:
                        return jsonResponse({ error: 'Unknown source' }, 404);
                }

                const filtered = filterByRelevance(results, query);
                return jsonResponse(filtered);
            } catch (error) {
                console.error(`Route Error [${source}]:`, error.message);
                return jsonResponse({ error: error.message }, 500);
            }
        }

        return jsonResponse({ error: 'Not found' }, 404);
    },
};
