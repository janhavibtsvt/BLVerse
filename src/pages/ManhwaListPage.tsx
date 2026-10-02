import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Search, ArrowUpDown, Globe, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllManhwa } from '../data';
import { ContentCard } from '../components/ContentCard';
import { fetchWorldComics } from '../services/worldCatalog';
import { ComicWork } from '../types';
import { AddWorkModal } from '../components/AddWorkModal';

export const ManhwaListPage: React.FC = () => {
  const [activeCatalog, setActiveCatalog] = useState<'curated' | 'world'>('curated');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'bl' | 'yaoi' | 'yuri'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  // Worldwide live browsing
  const [worldManhwa, setWorldManhwa] = useState<ComicWork[]>([]);
  const [isLoadingWorld, setIsLoadingWorld] = useState<boolean>(false);
  const [worldPage, setWorldPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const localManhwa = useMemo(() => getAllManhwa(), []);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    localManhwa.forEach(m => m.genres.forEach(g => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [localManhwa]);

  // Load from AniList when World Catalog is chosen or search/demographic changes
  useEffect(() => {
    if (activeCatalog !== 'world') return;
    setIsLoadingWorld(true);
    fetchWorldComics({
      country: 'KR',
      demographic: selectedDemographic,
      search: searchQuery.trim() || undefined,
      genre: selectedGenre === 'All' ? undefined : selectedGenre,
      page: worldPage,
      perPage: 24
    })
      .then(data => setWorldManhwa(data.items))
      .catch(err => {
        console.error('Error fetching world manhwa:', err);
        setWorldManhwa([]);
      })
      .finally(() => setIsLoadingWorld(false));
  }, [activeCatalog, searchQuery, selectedGenre, selectedDemographic, worldPage]);

  const filteredManhwa = useMemo(() => {
    return localManhwa.filter(m => {
      const isYuri = m.genres.includes('Yuri') || m.genres.includes("Girls' Love") || m.tags.includes('Yuri');
      const isYaoi = m.genres.includes('Yaoi') || m.tags.includes('Yaoi') || m.tags.some(t => /mature|nsfw|yaoi/i.test(t));
      const isBL = m.genres.includes("Boys' Love") || m.genres.includes('BL') || m.genres.includes('Yaoi') || !isYuri;
      
      let matchDemo = true;
      if (selectedDemographic === 'yuri') matchDemo = isYuri;
      else if (selectedDemographic === 'yaoi') matchDemo = isYaoi || (isBL && !isYuri);
      else if (selectedDemographic === 'bl') matchDemo = isBL;

      const matchGenre = selectedGenre === 'All' || m.genres.includes(selectedGenre);
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDemo && matchGenre && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [localManhwa, selectedDemographic, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-[#B794F4]" />
            <span>✦ Korean BL & GL Webtoons, Yuri & Yaoi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
            BL & GL Manhwa Universe
          </h1>
          <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
            Full-color Korean webtoons, Yaoi, and Yuri from Ridi, Lezhin, Bomtoon, and Kakao. Browse curated legends and explore the complete worldwide AniList registry.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Missing Manhwa
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
            <BookOpen className="w-3.5 h-3.5" /> Curated Catalog ({filteredManhwa.length})
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

        {/* Demographic Selector: All, BL/Yaoi, Yuri/GL */}
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
              placeholder="Search manhwa by title, artist, author..."
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
      </div>

      {/* Grid Content */}
      {activeCatalog === 'curated' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredManhwa.map((m) => (
            <ContentCard
              key={m.id}
              id={m.id}
              type="manhwa"
              title={m.title}
              originalTitle={m.originalTitle}
              poster={m.cover}
              country={m.country}
              year={m.year}
              rating={m.rating}
              status={m.status}
              genres={m.genres}
              extraSubtitle={`${m.author} • ${m.chapters} Chapters`}
              isDemoSample={m.isDemoSample}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {isLoadingWorld ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#9F7AEA] animate-spin mx-auto" />
              <p className="text-sm text-[#B8AFC4]">Querying worldwide Korean BL manhwa webtoons database...</p>
            </div>
          ) : worldManhwa.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">No webtoons found in global registry</h3>
              <p className="text-xs text-[#B8AFC4]">
                Try adjusting your search keywords, or add this manhwa directly to your catalog using the button below.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold"
              >
                + Add This Manhwa Manually
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {worldManhwa.map((m) => (
                  <ContentCard
                    key={m.id}
                    id={m.id}
                    type="manhwa"
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

      {/* Add Missing Manhwa Modal */}
      <AddWorkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="manhwa"
        onAdded={() => window.location.reload()}
      />
    </div>
  );
};
