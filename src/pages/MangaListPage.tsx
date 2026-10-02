import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Search, ArrowUpDown, Globe, Plus, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getAllManga } from '../data';
import { ContentCard } from '../components/ContentCard';
import { fetchWorldComics } from '../services/worldCatalog';
import { ComicWork } from '../types';
import { AddWorkModal } from '../components/AddWorkModal';
import { BLThematicFilter, matchesThematicElement } from '../components/BLThematicFilter';

export const MangaListPage: React.FC = () => {
  const [activeCatalog, setActiveCatalog] = useState<'curated' | 'world'>('curated');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'bl' | 'yaoi' | 'yuri'>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  // Worldwide live browsing
  const [worldManga, setWorldManga] = useState<ComicWork[]>([]);
  const [isLoadingWorld, setIsLoadingWorld] = useState<boolean>(false);
  const [worldPage, setWorldPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const localManga = useMemo(() => getAllManga(), []);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    localManga.forEach(m => m.genres.forEach(g => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [localManga]);

  // Load from AniList when World Catalog is chosen or search/demographic changes
  useEffect(() => {
    if (activeCatalog !== 'world') return;
    setIsLoadingWorld(true);
    fetchWorldComics({
      country: 'JP',
      demographic: selectedDemographic,
      search: searchQuery.trim() || undefined,
      genre: selectedGenre === 'All' ? undefined : selectedGenre,
      page: worldPage,
      perPage: 24
    })
      .then(data => setWorldManga(data.items))
      .catch(err => {
        console.error('Error fetching world manga:', err);
        setWorldManga([]);
      })
      .finally(() => setIsLoadingWorld(false));
  }, [activeCatalog, searchQuery, selectedGenre, selectedDemographic, worldPage]);

  const filteredManga = useMemo(() => {
    return localManga.filter(m => {
      const isYuri = m.genres.includes('Yuri') || m.genres.includes("Girls' Love") || m.tags.includes('Yuri');
      const isYaoi = m.genres.includes('Yaoi') || m.tags.includes('Yaoi') || m.tags.some(t => /mature|nsfw|yaoi/i.test(t));
      const isBL = m.genres.includes("Boys' Love") || m.genres.includes('BL') || m.genres.includes('Yaoi') || !isYuri;
      
      let matchDemo = true;
      if (selectedDemographic === 'yuri') matchDemo = isYuri;
      else if (selectedDemographic === 'yaoi') matchDemo = isYaoi || (isBL && !isYuri);
      else if (selectedDemographic === 'bl') matchDemo = isBL;

      const matchGenre = selectedGenre === 'All' || m.genres.includes(selectedGenre);
      const matchTheme = matchesThematicElement(m, selectedTheme);
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDemo && matchGenre && matchTheme && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [localManga, selectedDemographic, selectedGenre, selectedTheme, searchQuery, sortBy]);

  const displayedWorldManga = useMemo(() => {
    if (selectedTheme === 'All') return worldManga;
    return worldManga.filter(m => matchesThematicElement(m, selectedTheme));
  }, [worldManga, selectedTheme]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-[#B794F4]" />
            <span>✦ Japanese BL & GL Comics, Yaoi & Yuri</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
            BL & GL Manga Universe
          </h1>
          <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
            Explore Japanese BL, Yaoi, and Yuri manga from verified masterworks to the complete worldwide AniList manga database covering every serialized title.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Missing Manga
        </button>
      </div>

      {/* Catalog Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#241238] pb-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveCatalog('curated');
              setWorldPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeCatalog === 'curated'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.3)]'
                : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Curated Catalog ({filteredManga.length})
          </button>

          <button
            onClick={() => {
              setActiveCatalog('world');
              setWorldPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeCatalog === 'world'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.3)]'
                : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#F09BC5]" /> Worldwide Database (Live)
          </button>
        </div>

        {/* Demographic Selector: All, BL, Yaoi, Yuri */}
        <div className="flex items-center gap-1 p-1 bg-[#160D20] border border-[#241238] rounded-2xl">
          <button
            type="button"
            onClick={() => { setSelectedDemographic('all'); setWorldPage(1); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDemographic === 'all'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            All Works
          </button>
          <button
            type="button"
            onClick={() => { setSelectedDemographic('bl'); setWorldPage(1); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDemographic === 'bl'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#B794F4]'
            }`}
          >
            Boys' Love (BL)
          </button>
          <button
            type="button"
            onClick={() => { setSelectedDemographic('yaoi'); setWorldPage(1); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDemographic === 'yaoi'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#9F7AEA]'
            }`}
          >
            Yaoi
          </button>
          <button
            type="button"
            onClick={() => { setSelectedDemographic('yuri'); setWorldPage(1); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDemographic === 'yuri'
                ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#F09BC5]'
            }`}
          >
            🌸 Yuri & GL
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manga by title, author, artist..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

          {activeCatalog === 'curated' && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-[#B8AFC4] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#F09BC5]" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1B1126] text-xs text-[#F8F5FC] border border-[#241238] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#F09BC5]"
              >
                <option value="rating">Highest Rated</option>
                <option value="year">Newest Release</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          )}
        </div>

        {activeCatalog === 'curated' && (
          <div className="pt-3 border-t border-[#241238] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1">
              Genre:
            </span>
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                    : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* BL Thematic Tropes Filter Component (Fluff, Angst, Slow Burn, Enemies to Lovers, etc.) */}
        <BLThematicFilter
          selectedTheme={selectedTheme}
          onSelectTheme={setSelectedTheme}
          items={activeCatalog === 'curated' ? localManga : worldManga}
          title="Thematic Tropes & BL Story Dynamics"
          className="pt-3 border-t border-[#241238]"
        />
      </div>

      {/* Grid Content */}
      {activeCatalog === 'curated' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-[#F8F5FC]">{filteredManga.length}</strong> curated manga</span>
              {selectedTheme !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                  <span>Theme: {selectedTheme}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('All')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {selectedGenre !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#241238] text-[#9F7AEA] border border-[#9F7AEA]/30">
                  <span>Genre: {selectedGenre}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedGenre('All')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
            </div>
            {(selectedTheme !== 'All' || selectedGenre !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTheme('All');
                  setSelectedGenre('All');
                  setSearchQuery('');
                }}
                className="text-[#F09BC5] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredManga.map((m) => (
              <ContentCard
                key={m.id}
                id={m.id}
                type="manga"
                title={m.title}
                originalTitle={m.originalTitle}
                poster={m.cover}
                country={m.country}
                year={m.year}
                rating={m.rating}
                status={m.status}
                genres={m.genres}
                extraSubtitle={`${m.author} • ${m.volumes} Volumes`}
                isDemoSample={m.isDemoSample}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-[#F8F5FC]">{displayedWorldManga.length}</strong> global titles</span>
              {selectedTheme !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                  <span>Theme: {selectedTheme}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('All')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
            </div>
          </div>

          {isLoadingWorld ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#9F7AEA] animate-spin mx-auto" />
              <p className="text-sm text-[#B8AFC4]">Querying worldwide Japanese BL manga database...</p>
            </div>
          ) : displayedWorldManga.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">No titles found in global registry</h3>
              <p className="text-xs text-[#B8AFC4]">
                Try adjusting your search keywords or theme filter, or add this manga directly to your catalog using the button below.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold"
              >
                + Add This Manga Manually
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedWorldManga.map((m) => (
                  <ContentCard
                    key={m.id}
                    id={m.id}
                    type="manga"
                    title={m.title}
                    originalTitle={m.originalTitle}
                    poster={m.cover}
                    country={m.country}
                    year={m.year}
                    rating={m.rating}
                    status={m.status}
                    genres={m.genres}
                    extraSubtitle={`${m.author} • ${m.status}`}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  disabled={worldPage <= 1}
                  onClick={() => setWorldPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#160D20] border border-[#241238] text-xs font-bold text-[#F8F5FC] disabled:opacity-40 hover:border-[#9F7AEA]"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-[#B8AFC4] font-semibold">
                  Page {worldPage}
                </span>
                <button
                  onClick={() => setWorldPage(p => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#160D20] border border-[#241238] text-xs font-bold text-[#F8F5FC] hover:border-[#9F7AEA]"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add Missing Manga Modal */}
      <AddWorkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="manga"
        onAdded={() => window.location.reload()}
      />
    </div>
  );
};
