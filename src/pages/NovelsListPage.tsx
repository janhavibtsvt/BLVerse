import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Search, ArrowUpDown, Layers, Plus, Globe, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllNovels } from '../data';
import { ContentCard } from '../components/ContentCard';
import { AddWorkModal } from '../components/AddWorkModal';
import { fetchWorldComics } from '../services/worldCatalog';
import { ComicWork, Novel } from '../types';

export const NovelsListPage: React.FC = () => {
  const [activeCatalog, setActiveCatalog] = useState<'curated' | 'world'>('world');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'bl' | 'yaoi' | 'yuri'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Worldwide live browsing for novels
  const [worldNovels, setWorldNovels] = useState<ComicWork[]>([]);
  const [isLoadingWorld, setIsLoadingWorld] = useState<boolean>(false);
  const [worldPage, setWorldPage] = useState<number>(1);

  const countries = ['All', 'South Korea', 'Thailand', 'Japan', 'China', 'Taiwan'];

  const allNovels = useMemo(() => getAllNovels(), []);

  // Fetch world light novels from AniList
  useEffect(() => {
    if (activeCatalog !== 'world') return;
    setIsLoadingWorld(true);
    fetchWorldComics({
      type: 'novel',
      demographic: selectedDemographic,
      search: searchQuery.trim() || undefined,
      page: worldPage,
      perPage: 24
    })
      .then(res => setWorldNovels(res.items))
      .catch(err => {
        console.error('Failed to fetch world novels:', err);
        setWorldNovels([]);
      })
      .finally(() => setIsLoadingWorld(false));
  }, [activeCatalog, selectedDemographic, searchQuery, worldPage]);

  const filteredNovels = useMemo(() => {
    return allNovels.filter(n => {
      const isYuri = n.genres.includes('Yuri') || n.genres.includes("Girls' Love") || n.tags.includes('Yuri');
      const isBL = n.genres.includes("Boys' Love") || n.genres.includes('BL') || n.genres.includes('Danmei') || !isYuri;
      if (selectedDemographic === 'yuri' && !isYuri) return false;
      if ((selectedDemographic === 'bl' || selectedDemographic === 'yaoi') && !isBL) return false;

      const matchCountry = selectedCountry === 'All' || n.country === selectedCountry;
      const matchSearch =
        !searchQuery.trim() ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.originalTitle && n.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCountry && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
      return a.title.localeCompare(b.title);
    });
  }, [allNovels, selectedDemographic, selectedCountry, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-[#B794F4]" />
            <span>✦ Original Web Novels & Worldwide Light Novels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
            BL & Yuri Novels
          </h1>
          <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
            The literary foundation: Discover celebrated original web novels from JJWXC, Ridi Books, Tunwalai, and light novels indexed in the global AniList database.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Missing Novel
        </button>
      </div>

      {/* Catalog Switcher & Demographic Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[#160D20] border border-[#241238] rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCatalog('world')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCatalog === 'world'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#1B1126]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#F09BC5]" />
            <span>Worldwide AniList Light Novels</span>
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
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Literary Canon</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {allNovels.length}
            </span>
          </button>
        </div>

        {/* Demographic Selector */}
        <div className="flex items-center gap-1 bg-[#1B1126] p-1 rounded-xl border border-[#241238]">
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
            Boys' Love (BL)
          </button>
          <button
            onClick={() => setSelectedDemographic('yaoi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'yaoi'
                ? 'bg-[#241238] text-[#9F7AEA] border border-[#9F7AEA]/50 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#9F7AEA]'
            }`}
          >
            Yaoi
          </button>
          <button
            onClick={() => setSelectedDemographic('yuri')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDemographic === 'yuri'
                ? 'bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/50 shadow-sm'
                : 'text-[#B8AFC4] hover:text-[#F09BC5]'
            }`}
          >
            🌸 Yuri & GL
          </button>
        </div>
      </div>

      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search original novels by title, author..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

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
        </div>

        {activeCatalog === 'curated' && (
          <div className="pt-3 border-t border-[#241238] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
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
        )}
      </div>

      {activeCatalog === 'world' ? (
        <div>
          <div className="flex flex-wrap items-center justify-between mb-4 text-xs text-neutral-400 gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#F09BC5]" />
              <span>Showing <strong>Worldwide AniList Light Novels</strong></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                Page {worldPage}
              </span>
            </div>

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
                disabled={worldNovels.length < 24 || isLoadingWorld}
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
              <p className="text-sm text-[#B8AFC4]">Loading global BL & Yuri novels from AniList registry...</p>
            </div>
          ) : worldNovels.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#B8AFC4]/40 mx-auto" />
              <p className="text-sm text-[#F8F5FC] font-semibold">No worldwide novels found matching your query</p>
              <p className="text-xs text-[#B8AFC4]">Try adjusting the demographic or clearing search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {worldNovels.map(n => (
                <ContentCard
                  key={n.id}
                  id={n.id}
                  type="novel"
                  title={n.title}
                  originalTitle={n.originalTitle}
                  poster={n.cover}
                  country={n.country}
                  year={n.year}
                  rating={n.rating}
                  status={n.status}
                  genres={n.genres}
                  extraSubtitle={`${n.author} • ${n.chapters} Chapters`}
                  isDemoSample={false}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredNovels.map((n) => (
            <ContentCard
              key={n.id}
              id={n.id}
              type="novel"
              title={n.title}
              originalTitle={n.originalTitle}
              poster={n.cover}
              country={n.country}
              year={n.year}
              rating={n.rating}
              status={n.status}
              genres={n.genres}
              extraSubtitle={`${n.author} • ${n.chapters} Chapters`}
              isDemoSample={n.isDemoSample}
            />
          ))}
        </div>
      )}

      {/* Add Missing Novel Modal */}
      <AddWorkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="novel"
        onAdded={() => window.location.reload()}
      />
    </div>
  );
};
