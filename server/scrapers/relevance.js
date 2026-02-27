/**
 * Checks if a result name is relevant to the search query.
 * Returns true if the name contains at least one significant keyword from the query.
 *
 * Strategy:
 * - Split query into words, ignore short filler words (of, the, a, an, in, on, for, to, and, or)
 * - A result is relevant if it contains ALL significant keywords from the query
 * - Falls back to "at least one keyword" if no result matches all
 */

const STOP_WORDS = new Set(['of', 'the', 'a', 'an', 'in', 'on', 'for', 'to', 'and', 'or', 'by', 'at', 'is', 'it', 'el', 'la', 'de', 'del', 'los', 'las', 'un', 'una', 'en', 'con', 'por', 'para', 'y']);

export function getKeywords(query) {
    return query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Score a result name against the search query.
 * Returns a number 0-1 representing the fraction of keywords matched.
 */
export function relevanceScore(name, keywords) {
    const nameLower = name.toLowerCase();
    let matched = 0;
    for (const kw of keywords) {
        if (nameLower.includes(kw)) matched++;
    }
    return keywords.length > 0 ? matched / keywords.length : 0;
}

/**
 * Filter and sort results by relevance to the query.
 * Only keeps results that match at least half the keywords.
 * Then sorts by relevance score descending (most relevant first).
 */
export function filterByRelevance(results, query) {
    const keywords = getKeywords(query);
    if (keywords.length === 0) return results;

    const scored = results.map(r => ({
        result: r,
        score: relevanceScore(r.name, keywords)
    }));

    const minScore = keywords.length > 1 ? 0.5 : 1;
    const filtered = scored.filter(s => s.score >= minScore);

    const finalResults = filtered.length > 0
        ? filtered
        : scored.filter(s => s.score > 0);

    finalResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.result.seeders - a.result.seeders;
    });

    return finalResults.map(s => s.result);
}
