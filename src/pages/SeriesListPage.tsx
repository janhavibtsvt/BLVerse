import React, { useState, useMemo, useEffect } from 'react';
import { Film, Filter, Search, ArrowUpDown, Plus, Bookmark, Play, Globe, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllSeries } from '../data';
import { ContentCard } from '../components/ContentCard';
import { SectionHeader } from '../components/SectionHeader';
import { AddWorkModal } from '../components/AddWorkModal';
import { useUser } from '../context/UserContext';
import { BLThematicFilter, matchesThematicElement } from '../components/BLThematicFilter';
import { fetchComprehensiveWorldSeries } from '../services/worldCatalog';
import { Series } from '../types';

export const SeriesListPage: React.FC = () => {
  const { preferences } = useUser();
  const [activeCatalog, setActiveCatalog] = useState<'curated' | 'world'>('curated');
  const [selectedMedium, setSelectedMedium] = useState<'all' | 'live_action' | 'anime'>('all');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'bl' | 'yaoi' | 'yuri'>('all');
  const [collectionFilter, setCollectionFilter] = useState<'All' | 'Want to Watch' | 'Watching'>('All');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Worldwide Series (Live-Action & Anime)
  const [worldSeries, setWorldSeries] = useState<Series[]>([]);
  const [isLoadingWorld, setIsLoadingWorld] = useState<boolean>(false);
  const [worldPage, setWorldPage] = useState<number>(1);
  const [worldTotalPages, setWorldTotalPages] = useState<number>(1);

  const countries = ['All', 'Thailand', 'South Korea', 'Japan', 'Taiwan', 'China', 'United Kingdom', 'Sweden', 'Philippines'];
  const statuses = ['All', 'Completed', 'Ongoing'];
  
  const allSeries = useMemo(() => getAllSeries(), []);

  // Fetch world series (comprehensive live-action + anime)
  useEffect(() => {
    if (activeCatalog !== 'world') return;
    setIsLoadingWorld(true);
    fetchComprehensiveWorldSeries({
      medium: selectedMedium,
      demographic: selectedDemographic,
      country: selectedCountry === 'All' ? undefined : selectedCountry,
      search: searchQuery.trim() || undefined,
      page: worldPage,
      perPage: 24,
      sort: sortBy === 'rating' ? 'SCORE_DESC' : sortBy === 'year' ? 'START_DATE_DESC' : 'POPULARITY_DESC'
    })
      .then(res => {
        setWorldSeries(res.items);
        setWorldTotalPages(res.pageInfo.lastPage || 1);
      })
      .catch(err => {
        console.error('Failed to fetch world series:', err);
        setWorldSeries([]);
      })
      .finally(() => setIsLoadingWorld(false));
  }, [activeCatalog, selectedMedium, selectedDemographic, selectedCountry, searchQuery, sortBy, worldPage]);

  const wantToWatchCount = useMemo(() => {
    return preferences.watchlist.filter(w => w.status === 'Want to Watch' || w.status === 'Plan to Watch').length;
  }, [preferences.watchlist]);

  const watchingCount = useMemo(() => {
    return preferences.watchlist.filter(w => w.status === 'Watching').length;
  }, [preferences.watchlist]);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    allSeries.forEach(s => s.genres.forEach(g => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [allSeries]);

  const filteredSeries = useMemo(() => {
    return allSeries.filter(s => {
      // Medium check
      const isAnime = s.genres.includes('Anime') || s.tags.includes('Anime') || s.tags.includes('Donghua');
      if (selectedMedium === 'live_action' && isAnime) return false;
      if (selectedMedium === 'anime' && !isAnime) return false;

      // Demographic check
      const isYuri = s.genres.includes('Yuri') || s.genres.includes("Girls' Love") || s.tags.includes('Yuri') || s.tags.includes('Yuri Series');
      const isBL = s.genres.includes("Boys' Love") || s.genres.includes('BL') || s.genres.includes('Yaoi') || !isYuri;
      if (selectedDemographic === 'yuri' && !isYuri) return false;
      if ((selectedDemographic === 'bl' || selectedDemographic === 'yaoi') && !isBL) return false;

      // Collection Filter
      if (collectionFilter === 'Want to Watch') {
        const inWant = preferences.watchlist.some(
          w => w.seriesId === s.id && (w.status === 'Want to Watch' || w.status === 'Plan to Watch')
        );
        if (!inWant) return false;
      } else if (collectionFilter === 'Watching') {
        const inWatching = preferences.watchlist.some(
          w => w.seriesId === s.id && w.status === 'Watching'
        );
        if (!inWatching) return false;
      }

      const matchCountry = selectedCountry === 'All' || s.country === selectedCountry;
      const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;
      const matchGenre = selectedGenre === 'All' || s.genres.includes(selectedGenre);
      const matchTheme = matchesThematicElement(s, selectedTheme);
      const matchSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.alternativeTitles.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.synopsis.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCountry && matchStatus && matchGenre && matchTheme && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [allSeries, selectedMedium, selectedDemographic, collectionFilter, selectedCountry, selectedStatus, selectedGenre, selectedTheme, searchQuery, sortBy, preferences.watchlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
            <Film className="w-4 h-4 text-[#B794F4]" />
            <span>✦ Global BL & Yuri Series, Anime & Dramas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
            BL & Yuri Series
          </h1>
          <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
            Explore live-action dramas and anime adaptations from South Korea, Thailand, Japan, China, and Taiwan, synced with the worldwide AniList registry.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Missing Series
        </button>
      </div>

      {/* Primary Catalog Switcher: Curated Canon vs Worldwide Index */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-2 bg-[#160D20] border border-[#241238] rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCatalog('world')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCatalog === 'world'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#1B1126]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Live Index</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
              Live Global
            </span>
          </button>

          <button
            onClick={() => setActiveCatalog('curated')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCatalog === 'curated'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#1B1126]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Curated Master Canon</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {allSeries.length}
            </span>
          </button>

          {/* Medium Filter: All Formats, Live-Action, Anime */}
          <div className="flex items-center gap-1 bg-[#1B1126] p-1 rounded-xl border border-[#241238] ml-0 sm:ml-2">
            <button
              onClick={() => setSelectedMedium('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedMedium === 'all'
                  ? 'bg-[#241238] text-[#F8F5FC] border border-[#9F7AEA]/40'
                  : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedMedium('live_action')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedMedium === 'live_action'
                  ? 'bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40'
                  : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
              }`}
            >
              🎬 Live-Action
            </button>
            <button
              onClick={() => setSelectedMedium('anime')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedMedium === 'anime'
                  ? 'bg-[#241238] text-[#B794F4] border border-[#B794F4]/40'
                  : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
              }`}
            >
              🎨 Anime & Donghua
            </button>
          </div>
        </div>

        {/* Demographic Selector: All, BL, Yaoi, Yuri */}
        <div className="flex flex-wrap items-center gap-1 bg-[#1B1126] p-1 rounded-xl border border-[#241238]">
          <button
            onClick={() => setSelectedDemographic('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'all'
                ? 'bg-[#241238] text-[#F8F5FC] border border-[#F09BC5]/40 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            All Works
          </button>
          <button
            onClick={() => setSelectedDemographic('bl')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'bl'
                ? 'bg-[#241238] text-[#B794F4] border border-[#B794F4]/50 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#B794F4]'
            }`}
          >
            💙 BL
          </button>
          <button
            onClick={() => setSelectedDemographic('yuri')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'yuri'
                ? 'bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/50 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#F09BC5]'
            }`}
          >
            🌸 GL & Yuri
          </button>
          <button
            onClick={() => setSelectedDemographic('yaoi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'yaoi'
                ? 'bg-[#241238] text-[#9F7AEA] border border-[#9F7AEA]/50 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#9F7AEA]'
            }`}
          >
            🔥 Yaoi
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by series, actor, character..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

          {/* Sort By Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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
        </div>

        {/* Filter Pills */}
        <div className="pt-3 border-t border-[#241238] space-y-3">
          {/* Collection Status Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <span>✦</span> Collection:
            </span>
            <button
              onClick={() => setCollectionFilter('All')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                collectionFilter === 'All'
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              All Library Titles
            </button>
            <button
              onClick={() => setCollectionFilter('Want to Watch')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                collectionFilter === 'Want to Watch'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white shadow-[0_0_10px_rgba(159,122,234,0.4)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#B794F4] border border-[#241238]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Want to Watch ({wantToWatchCount})</span>
            </button>
            <button
              onClick={() => setCollectionFilter('Watching')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                collectionFilter === 'Watching'
                  ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.4)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>My Watching ({watchingCount})</span>
            </button>
          </div>

          {/* Country Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1">
              Country:
            </span>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedCountry === c
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                    : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Genre / Trope Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#B794F4] uppercase tracking-wider shrink-0 mr-1">
              Genre:
            </span>
            {allGenres.slice(0, 8).map((g) => (
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
          {/* BL Thematic Tropes Filter Component */}
          <BLThematicFilter
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            items={allSeries}
            title="Thematic Tropes & BL Story Dynamics"
            className="pt-3 border-t border-[#241238]"
          />
        </div>
      </div>

      {/* Series Grid */}
      <div>
        {activeCatalog === 'world' ? (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 text-xs text-neutral-400 gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#F09BC5]" />
                <span>Showing <strong>Worldwide AniList Anime & Series</strong></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                  Page {worldPage}
                </span>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                <button
                  disabled={worldPage <= 1 || isLoadingWorld}
                  onClick={() => setWorldPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl bg-[#1B1126] border border-[#241238] disabled:opacity-40 hover:bg-[#241238] text-[#F8F5FC]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#B8AFC4]">Pg {worldPage}</span>
                <button
                  disabled={worldSeries.length < 24 || isLoadingWorld}
                  onClick={() => setWorldPage(p => p + 1)}
                  className="p-1.5 rounded-xl bg-[#1B1126] border border-[#241238] disabled:opacity-40 hover:bg-[#241238] text-[#F8F5FC]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoadingWorld ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#F09BC5] animate-spin mx-auto" />
                <p className="text-sm text-[#B8AFC4]">Loading global BL & Yuri anime/series catalog...</p>
              </div>
            ) : worldSeries.length === 0 ? (
              <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3">
                <Film className="w-10 h-10 text-[#B8AFC4]/40 mx-auto" />
                <p className="text-sm text-[#F8F5FC] font-semibold">No worldwide series found matching your query</p>
                <p className="text-xs text-[#B8AFC4]">Try clearing the search query or switching to "All Works".</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {worldSeries.map(s => (
                  <ContentCard
                    key={s.id}
                    id={s.id}
                    type="series"
                    title={s.title}
                    originalTitle={s.alternativeTitles[0]}
                    poster={s.poster}
                    country={s.country}
                    year={s.year}
                    rating={s.rating}
                    status={s.status}
                    genres={s.genres}
                    sourceMaterialType={s.sourceMaterialType}
                    sourceMaterialTitle={s.sourceMaterialTitle}
                    isDemoSample={false}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 text-xs text-neutral-400 gap-2">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="text-[#F8F5FC]">{filteredSeries.length}</strong> curated series</span>
                {selectedTheme !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                    <span>Theme: {selectedTheme}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTheme('All')}
                      className="hover:text-white ml-0.5"
                      title="Clear theme filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>

            {filteredSeries.length === 0 ? (
              <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
                <Film className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
                <h3 className="text-lg font-bold text-[#F8F5FC]">No series match your filters</h3>
                <p className="text-xs text-[#B8AFC4]">
                  Try adjusting your search query, clearing the thematic trope, or selecting "All" countries.
                </p>
                <button
                  onClick={() => {
                    setSelectedCountry('All');
                    setSelectedGenre('All');
                    setSelectedStatus('All');
                    setSelectedTheme('All');
                    setSelectedDemographic('all');
                    setCollectionFilter('All');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-lg shadow-[rgba(240,155,197,0.3)] hover:opacity-90"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSeries.map((s) => (
                  <ContentCard
                    key={s.id}
                    id={s.id}
                    type="series"
                    title={s.title}
                    originalTitle={s.alternativeTitles[0]}
                    poster={s.poster}
                    country={s.country}
                    year={s.year}
                    rating={s.rating}
                    status={s.status}
                    genres={s.genres}
                    sourceMaterialType={s.sourceMaterialType}
                    sourceMaterialTitle={s.sourceMaterialTitle}
                    isDemoSample={s.isDemoSample}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Missing Series Modal */}
      <AddWorkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="series"
        onAdded={() => window.location.reload()}
      />
    </div>
  );
};
