import React, { useState } from 'react';
import { Search, Loader2, Download, AlertCircle, HardDrive, Users, Clock, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { SearchState, TorrentResult } from './types';

import { searchTPB } from './services/tpb';
import { searchNyaa } from './services/nyaa';
import { searchArchiveOrg, searchAnnasArchive } from './services/apis';
import { searchFitGirl, searchElAmigos, searchGamesTorrents, searchSkidrow } from './services/games';

const RESULTS_PER_PAGE = 20;

function App() {
  const [state, setState] = useState<SearchState>({
    query: '',
    sources: {
      'The Pirate Bay': true,
      'Nyaa': true,
      'Archive.org': true,
      "Anna's Archive": true,
      'FitGirl': true,
      'ElAmigos': true,
      'GamesTorrents': true,
      'SkidrowReloaded': true,
    },
    isLoading: false,
    results: [],
    error: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, results: [] }));
    setCurrentPage(1);

    try {
      const activeSources = Object.keys(state.sources).filter(
        (key) => state.sources[key as keyof SearchState['sources']]
      );

      if (activeSources.length === 0) {
        throw new Error('Please select at least one search source.');
      }

      const promises: Promise<{ source: string; data: TorrentResult[] }>[] = [];

      if (state.sources['The Pirate Bay']) promises.push(searchTPB(state.query).then(data => ({ source: 'The Pirate Bay', data })));
      if (state.sources['Nyaa']) promises.push(searchNyaa(state.query).then(data => ({ source: 'Nyaa', data })));

      if (state.sources['Archive.org']) promises.push(searchArchiveOrg(state.query).then(data => ({ source: 'Archive.org', data })));
      if (state.sources["Anna's Archive"]) promises.push(searchAnnasArchive(state.query).then(data => ({ source: "Anna's Archive", data })));
      if (state.sources['FitGirl']) promises.push(searchFitGirl(state.query).then(data => ({ source: 'FitGirl', data })));
      if (state.sources['ElAmigos']) promises.push(searchElAmigos(state.query).then(data => ({ source: 'ElAmigos', data })));
      if (state.sources['GamesTorrents']) promises.push(searchGamesTorrents(state.query).then(data => ({ source: 'GamesTorrents', data })));
      if (state.sources['SkidrowReloaded']) promises.push(searchSkidrow(state.query).then(data => ({ source: 'SkidrowReloaded', data })));

      const resultsSettled = await Promise.allSettled(promises);

      const allResults: TorrentResult[] = [];
      const partialErrors: string[] = [];

      resultsSettled.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value.data);
        } else {
          const sourceName = activeSources[index];
          partialErrors.push(`${sourceName} is currently down.`);
        }
      });

      // Sort by seeders descending
      allResults.sort((a, b) => b.seeders - a.seeders);

      setState(prev => ({
        ...prev,
        isLoading: false,
        results: allResults,
        error: partialErrors.length > 0 ? partialErrors.join(' | ') : null
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const toggleSource = (source: keyof SearchState['sources']) => {
    setState(prev => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: !prev.sources[source]
      }
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(state.results.length / RESULTS_PER_PAGE);
  const paginatedResults = state.results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sourceColors: Record<string, string> = {
    'The Pirate Bay': 'from-amber-700/20 to-yellow-600/20 text-yellow-500 border-yellow-600/30',
    'Nyaa': 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    'Archive.org': 'from-zinc-500/20 to-zinc-400/20 text-zinc-300 border-zinc-500/30',
    "Anna's Archive": 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    'FitGirl': 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
    'ElAmigos': 'from-lime-500/20 to-green-500/20 text-lime-400 border-lime-500/30',
    'GamesTorrents': 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30',
    'SkidrowReloaded': 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
  };

  const sourceBadgeClasses: Record<string, string> = {
    'The Pirate Bay': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
    'Nyaa': 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    'Archive.org': 'text-zinc-300 border-zinc-500/20 bg-zinc-500/10',
    "Anna's Archive": 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    'FitGirl': 'text-pink-400 border-pink-500/20 bg-pink-500/10',
    'ElAmigos': 'text-lime-400 border-lime-500/20 bg-lime-500/10',
    'GamesTorrents': 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    'SkidrowReloaded': 'text-sky-400 border-sky-500/20 bg-sky-500/10',
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">

        {/* Header section */}
        <header className="text-center mb-12 space-y-4 w-full max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            Seeko Search
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-light">
            Aggregate torrents across the decentralized web. Fast, ad-free, and secure.
          </p>
        </header>

        {/* Search Bar & Controls Segment */}
        <section className="w-full max-w-3xl space-y-8 bg-zinc-900/50 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-zinc-800/50 shadow-2xl">

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-16 pr-6 py-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-lg md:text-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-inner"
              placeholder="Search for movies, software, anime..."
              value={state.query}
              onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
            />
            <button
              type="submit"
              disabled={state.isLoading || !state.query.trim()}
              className="absolute inset-y-2 right-2 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded-xl font-medium transition-all duration-300 flex items-center shadow-lg shadow-indigo-500/20 disabled:shadow-none disabled:text-zinc-500"
            >
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </form>

          {/* Source Toggles */}
          <div className="pt-2">
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-zinc-800" />
              Search Sources
              <span className="flex-1 h-px bg-zinc-800" />
            </h3>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(state.sources) as Array<keyof typeof state.sources>).map((source) => {
                const isActive = state.sources[source];
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => toggleSource(source)}
                    className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all duration-300 flex items-center gap-2 ${isActive
                      ? `bg-gradient-to-br ${sourceColors[source]} shadow-lg`
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-zinc-700'}`} />
                    {source}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results Area */}
        <main className="w-full mt-12">
          {state.error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{state.error}</p>
            </div>
          )}

          {!state.isLoading && state.results.length === 0 && state.query && !state.error && (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
              <div className="inline-flex p-4 rounded-full bg-zinc-800/50 mb-4">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium text-zinc-300">No results found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your search terms or enabling more sources.</p>
            </div>
          )}

          {state.results.length > 0 && (
            <>
              {/* Results count & page info */}
              <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-sm text-zinc-500">
                  Showing <span className="text-zinc-300 font-medium">{(currentPage - 1) * RESULTS_PER_PAGE + 1}</span>–<span className="text-zinc-300 font-medium">{Math.min(currentPage * RESULTS_PER_PAGE, state.results.length)}</span> of <span className="text-zinc-300 font-medium">{state.results.length}</span> results
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-zinc-500">
                    Page <span className="text-zinc-300 font-medium">{currentPage}</span> / <span className="text-zinc-300 font-medium">{totalPages}</span>
                  </p>
                )}
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800/60 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-400 text-sm font-medium">
                        <th className="py-4 px-6 font-medium tracking-wide">Name</th>
                        <th className="py-4 px-6 font-medium tracking-wide w-24"><div className="flex items-center gap-1.5"><HardDrive className="w-4 h-4" /> Size</div></th>
                        <th className="py-4 px-6 font-medium tracking-wide w-32"><div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Peers</div></th>
                        <th className="py-4 px-6 font-medium tracking-wide w-32"><div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Date</div></th>
                        <th className="py-4 px-6 font-medium tracking-wide w-24 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {paginatedResults.map((result) => (
                        <tr key={result.id} className="hover:bg-zinc-800/40 transition-colors duration-200 group">
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-3">
                              <div>
                                <h4 className="text-zinc-200 font-medium line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors duration-200">
                                  {result.name}
                                </h4>
                                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-md border ${sourceBadgeClasses[result.source] || 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10'}`}>
                                  {result.source}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-zinc-400 text-sm whitespace-nowrap">{result.size}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-emerald-400 font-medium flex items-center gap-1" title="Seeders">
                                {result.seeders}
                              </span>
                              <span className="text-zinc-600">/</span>
                              <span className="text-rose-400 flex items-center gap-1" title="Leechers">
                                {result.leechers}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-zinc-500 text-sm whitespace-nowrap">{result.date}</td>
                          <td className="py-4 px-6 text-right">
                            <a
                              href={result.link}
                              className="inline-flex items-center justify-center p-2.5 bg-zinc-800 hover:bg-indigo-600 border border-zinc-700 hover:border-indigo-500 text-zinc-300 hover:text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-indigo-500/25 group/btn"
                              title="Download/Magnet"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-5 h-5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 py-5 px-6 border-t border-zinc-800/60 bg-zinc-900/60">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-all duration-200"
                      title="First page"
                    >
                      <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-all duration-200"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {getPageNumbers().map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600 select-none">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`min-w-[40px] h-10 rounded-lg border font-medium text-sm transition-all duration-200 ${currentPage === page
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-all duration-200"
                      title="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-all duration-200"
                      title="Last page"
                    >
                      <ChevronsRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
