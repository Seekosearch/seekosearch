const express = require('express');
const cors = require('cors');

const { scrapeNyaa } = require('./scrapers/nyaa');
const { scrapeTPB } = require('./scrapers/tpb');
const { scrapeOpenLibrary, scrapeArchiveOrg, scrapeAnnasArchive } = require('./scrapers/apis');
const { scrapeFitGirl, scrapeElAmigos, scrapeGamesTorrents, scrapeSkidrow } = require('./scrapers/games');
const { filterByRelevance } = require('./scrapers/relevance');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nexus Search backend is running' });
});

app.get('/api/search/:source', async (req, res) => {
    const { source } = req.params;
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Missing query parameter "q"' });
    }

    try {
        let results = [];
        switch (source) {
            case 'nyaa':
                results = await scrapeNyaa(q);
                break;
            case 'tpb':
                results = await scrapeTPB(q);
                break;
            case 'openlibrary':
                results = await scrapeOpenLibrary(q);
                break;
            case 'archiveorg':
                results = await scrapeArchiveOrg(q);
                break;
            case 'annasarchive':
                results = await scrapeAnnasArchive(q);
                break;
            case 'fitgirl':
                results = await scrapeFitGirl(q);
                break;
            case 'elamigos':
                results = await scrapeElAmigos(q);
                break;
            case 'gamestorrents':
                results = await scrapeGamesTorrents(q);
                break;
            case 'skidrowreloaded':
                results = await scrapeSkidrow(q);
                break;
            default:
                return res.status(404).json({ error: 'Unknown source' });
        }

        // Apply relevance filtering to all results
        const filtered = filterByRelevance(results, q);
        res.json(filtered);
    } catch (error) {
        console.error(`Route Error [${source}]:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Nexus Search Backend listening on port ${PORT}`);
});
