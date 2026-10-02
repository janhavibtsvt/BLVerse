import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, BookOpen, User, Users, Layers, ArrowRight, Globe, Plus, Loader2, Sparkles, Bookmark, Play, Check, Flame, Tag, Compass, Heart } from 'lucide-react';
import { searchAllEntities, SearchResultCategory, getAllSeries, getAllManhwa, getAllManga } from '../data';
import { fetchWorldComics, fetchWorldAnimeSeries } from '../services/worldCatalog';
import { ComicWork, Series } from '../types';
import { AddWorkModal } from '../components/AddWorkModal';
import { ContentCard } from '../components/ContentCard';
import { useUser } from '../context/UserContext';

const TRENDING_BL_SEARCHES = [
  'Bloom Into You',
  'GAP The Series',
  'The Secret of Us',
  'Painter of the Night',
  'Jinx',
  'What Does the Fox Say?',
  'Bad Thinking Diary',
  'Yuri / GL',
  'Yaoi',
  'Danmei',
  'Tamen De Gushi',
  'Citrus',
  'Semantic Error',
  'KinnPorsche',
  'Bad Buddy',
  '2gether',
  'Given',
  'Sasaki and Miyano',
  "Heaven Official's Blessing",
  'Mo Dao Zu Shi',
  'Love in the Air',
  'My School President'
];

const BL_TROPES_LIST = [
  {
    title: 'Enemies to Lovers',
    tag: 'Enemies to Lovers',
    desc: 'Fierce bantering, stubborn pride, electrical tension & irresistible pull',
    icon: '⚡',
    border: 'hover:border-[#F09BC5]/70'
  },
  {
    title: 'Yuri & Girls\' Love (GL)',
    tag: 'Yuri',
    desc: 'Pure devotion, tender longing, blossoms & deep emotional resonance',
    icon: '🌸',
    border: 'hover:border-[#F09BC5]/70'
  },
  {
    title: 'Office & Workplace Romance',
    tag: 'Office Romance',
    desc: 'Secret elevators, late-night deadlines, senior & junior dynamics',
    icon: '💼',
    border: 'hover:border-[#9F7AEA]/70'
  },
  {
    title: 'Campus & University Life',
    tag: 'Campus Romance',
    desc: 'Engineering gears, rival faculties, dorm roommates & sports rivalries',
    icon: '🎓',
    border: 'hover:border-[#B794F4]/70'
  },
  {
    title: 'Omegaverse & Fantasy',
    tag: 'Omegaverse',
    desc: 'Alphas, omegas, soulmate bonding scents & fated partner lore',
    icon: '🐺',
    border: 'hover:border-[#E879A9]/70'
  },
  {
    title: 'Danmei & Cultivation Lore',
    tag: 'Danmei',
    desc: 'Ancient immortals, sects, reincarnated loyalty & poetic devotion',
    icon: '🪷',
    border: 'hover:border-[#F09BC5]/70'
  },
  {
    title: 'Bodyguard & Crime Intrigue',
    tag: 'Mafia',
    desc: 'Underworld danger, sworn protectors, bullets & unshakeable loyalty',
    icon: '⚔️',
    border: 'hover:border-[#9F7AEA]/70'
  }
];

const BL_REGIONS = [
  { label: '🌸 Yuri & Girls\' Love (GL)', query: 'Yuri' },
  { label: '🔥 Yaoi & Mature BL', query: 'Yaoi' },
  { label: '🪷 Danmei & Cultivation', query: 'Danmei' },
  { label: '🇹🇭 Thai Live-Action BL & GL', query: 'Thailand' },
  { label: '🇰🇷 Korean BL & Manhwa', query: 'South Korea' },
  { label: '🇯🇵 Japanese BL & Manga', query: 'Japan' },
  { label: '🇹🇼 Taiwanese BL Dramas', query: 'Taiwan' },
  { label: '🇨🇳 Chinese Danmei Lore', query: 'China' }
];

export const SearchPage: React.FC = () => {
  const { getWatchlistEntry, toggleWatchlistStatus } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'bl' | 'yaoi' | 'yuri' | 'danmei'>('all');

  const [worldResults, setWorldResults] = useState<(ComicWork | Series)[]>([]);
  const [isLoadingWorld, setIsLoadingWorld] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Curated popular BL items for quick discovery
  const popularBLHighlights = useMemo(() => {
    const series = getAllSeries().slice(0, 4);
    const manhwa = getAllManhwa().slice(0, 4);
    return [...series, ...manhwa].slice(0, 6);
  }, []);

  const handleSelectSearchTag = (searchWord: string) => {
    setQuery(searchWord);
    setSearchParams({ q: searchWord });
  };

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const rawResults: SearchResultCategory[] = searchAllEntities(query);

  // Filter local results by demographic if selected
  const results = useMemo(() => {
    if (selectedDemographic === 'all') return rawResults;

    return rawResults.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        const itemObj = item as any;
        const genres = itemObj.genres || [];
        const tags = itemObj.tags || [];
        const country = itemObj.country || '';

        const isYuri = genres.includes('Yuri') || genres.includes("Girls' Love") || tags.includes('Yuri');
        const isYaoi = genres.includes('Yaoi') || tags.includes('Yaoi') || tags.some((t: string) => /mature|nsfw|yaoi/i.test(t));
        const isDanmei = genres.includes('Danmei') || tags.includes('Danmei') || country === 'China';
        const isBL = genres.includes("Boys' Love") || genres.includes('BL') || isYaoi || !isYuri;

        if (selectedDemographic === 'yuri') return isYuri;
        if (selectedDemographic === 'yaoi') return isYaoi || (isBL && !isYuri);
        if (selectedDemographic === 'danmei') return isDanmei;
        if (selectedDemographic === 'bl') return isBL;
        return true;
      })
    })).filter(cat => cat.items.length > 0);
  }, [rawResults, selectedDemographic]);

  // Fetch worldwide AniList database results (comics and anime/series) when query is present
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setWorldResults([]);
      setIsLoadingWorld(false);
      return;
    }

    setIsLoadingWorld(true);
    const timeout = setTimeout(() => {
      let demo: 'all' | 'bl' | 'yaoi' | 'yuri' | 'danmei' = selectedDemographic;
      if (demo === 'all') {
        if (/yuri|gl|girls|bloom|citrus|tamen|shim|fox say/i.test(trimmed)) {
          demo = 'yuri';
        } else if (/yaoi/i.test(trimmed)) {
          demo = 'yaoi';
        } else if (/danmei/i.test(trimmed)) {
          demo = 'danmei';
        }
      }

      Promise.all([
        fetchWorldComics({ search: trimmed, demographic: demo, perPage: 20 }),
        fetchWorldAnimeSeries({ search: trimmed, demographic: demo === 'danmei' ? 'bl' : demo, perPage: 12 })
      ])
        .then(([comicsData, seriesData]) => {
          const localIds = new Set(results.flatMap(r => r.items.map(i => i.id)));
          const combined = [
            ...(comicsData.items || []),
            ...(seriesData.items || [])
          ];
          const filtered = combined.filter(d => !localIds.has(d.id));
          setWorldResults(filtered);
        })
        .catch(err => {
          console.error('Error fetching AniList world catalog:', err);
          setWorldResults([]);
        })
        .finally(() => setIsLoadingWorld(false));
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, selectedDemographic, results]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const localTotalCount = results.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalCount = localTotalCount + worldResults.length;

  const filteredCategories = activeCategory === 'All'
    ? results
    : activeCategory === 'Worldwide AniList'
    ? []
    : results.filter(cat => cat.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Series': return <Film className="w-4 h-4 text-[#F09BC5]" />;
      case 'Manhwa':
      case 'Manga':
      case 'Manhua':
      case 'Novels': return <BookOpen className="w-4 h-4 text-[#B794F4]" />;
      case 'Characters': return <Users className="w-4 h-4 text-[#F09BC5]" />;
      case 'Actors': return <User className="w-4 h-4 text-[#9F7AEA]" />;
      default: return <Layers className="w-4 h-4 text-[#B794F4]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider">
            <span>✦ Transmedia Search & Worldwide BL Catalog</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#241238] to-[#160D20] text-[#F09BC5] hover:text-white border border-[#F09BC5]/40 text-xs font-bold transition-all hover:scale-105 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Any Missing Title</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
          Search Global BL Intelligence
        </h1>
        <p className="text-sm text-[#B8AFC4] max-w-2xl">
          Search across verified series, Japanese manga, Korean manhwa, Chinese danmei manhua, novels, and the complete worldwide AniList database.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#B8AFC4] absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search BL series, manhwa, danmei, tropes (e.g. Enemies to Lovers, KinnPorsche, Jinx)..."
              className="w-full bg-[#160D20] text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-11 pr-4 py-3 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5] shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:opacity-90 text-white font-bold text-xs transition-all shadow-lg shadow-[rgba(240,155,197,0.3)] shrink-0"
          >
            Search
          </button>
        </form>

        {/* Trending BL Search Tags */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-[#F09BC5]" /> Trending Searches:
          </span>
          {TRENDING_BL_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectSearchTag(term)}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#241238] hover:border-[#F09BC5]/40 border border-[#241238] transition-all shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span>{term}</span>
            </button>
          ))}
        </div>

        {/* Demographic Selector: All, Boys' Love, Yaoi, Yuri, Danmei */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider shrink-0 mr-1">
            Demographic:
          </span>
          {[
            { id: 'all', label: 'All Global Works' },
            { id: 'bl', label: "Boys' Love (BL)" },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: '🌸 Yuri & Girls\' Love (GL)' },
            { id: 'danmei', label: 'Danmei (耽美)' }
          ].map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDemographic(d.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedDemographic === d.id
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-sm'
                  : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      {query.trim() && (
        <div className="flex border-b border-[#241238] overflow-x-auto no-scrollbar gap-2 pb-2 text-xs">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
              activeCategory === 'All'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            ✦ All Results ({totalCount})
          </button>

          {results.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
                activeCategory === cat.category
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                  : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              {cat.category} ({cat.items.length})
            </button>
          ))}

          {worldResults.length > 0 && (
            <button
              onClick={() => setActiveCategory('Worldwide AniList')}
              className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'Worldwide AniList'
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                  : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#F09BC5]" />
              AniList Global ({worldResults.length})
            </button>
          )}
        </div>
      )}

      {/* Results Rendering */}
      {!query.trim() ? (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Quick BL Regional Exploration */}
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#B794F4]" />
                <span>Explore by BL Tradition & Country</span>
              </span>
              <span className="text-xs text-[#B8AFC4]">Tap to browse</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {BL_REGIONS.map((region) => (
                <button
                  key={region.label}
                  type="button"
                  onClick={() => handleSelectSearchTag(region.query)}
                  className="px-4 py-2 rounded-2xl bg-[#1B1126] hover:bg-[#241238] border border-[#241238] hover:border-[#F09BC5]/50 text-xs font-semibold text-[#F8F5FC] transition-all shadow-sm hover:scale-105"
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular BL Tropes & Dynamics Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#241238] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F09BC5]" />
                <h2 className="text-lg font-bold text-[#F8F5FC] font-display">
                  Popular BL Tropes & Relationship Dynamics
                </h2>
              </div>
              <span className="text-xs text-[#B8AFC4]">Select a trope to search</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BL_TROPES_LIST.map((trope) => (
                <button
                  key={trope.tag}
                  type="button"
                  onClick={() => handleSelectSearchTag(trope.tag)}
                  className={`p-4 rounded-2xl bg-[#160D20] border border-[#241238] ${trope.border} text-left transition-all group shadow-md hover:shadow-[0_8px_25px_rgba(159,122,234,0.18)] hover:-translate-y-0.5`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-[#1B1126] border border-[#241238] group-hover:scale-110 transition-transform">
                      {trope.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors">
                        {trope.title}
                      </h3>
                      <p className="text-xs text-[#B8AFC4] mt-1 leading-relaxed line-clamp-2">
                        {trope.desc}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider group-hover:underline">
                        Explore #{trope.tag} →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Curated Popular BL Titles to Explore */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#241238] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F09BC5]" />
                <h2 className="text-lg font-bold text-[#F8F5FC] font-display">
                  Featured Worldwide BL Discoveries
                </h2>
              </div>
              <span className="text-xs text-[#B8AFC4]">Live-Action & Comics</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularBLHighlights.map((item) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  type={'country' in item && 'status' in item && 'runtime' in item ? 'series' : ('type' in item ? (item.type as any) : 'manga')}
                  title={item.title}
                  poster={'poster' in item ? (item.poster as string) : (item as any).cover}
                  country={item.country}
                  year={item.year}
                  rating={item.rating}
                  status={item.status}
                  genres={item.genres}
                />
              ))}
            </div>
          </div>

          {/* Add Missing Work Footer Banner */}
          <div className="bg-gradient-to-r from-[#160D20] via-[#1B1126] to-[#160D20] border border-[#241238] rounded-3xl p-6 text-center space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-[#F8F5FC]">
              Can't Find a Specific BL Series, Webtoon, or Doujinshi?
            </h3>
            <p className="text-xs text-[#B8AFC4] max-w-lg mx-auto">
              Our registry connects live with AniList worldwide, and allows you to register any custom BL adaptation or novel into your personal collection instantly.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Add Custom BL Title
            </button>
          </div>
        </div>
      ) : totalCount === 0 && !isLoadingWorld ? (
        <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <Search className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
          <h3 className="text-lg font-bold text-[#F8F5FC]">No matches found for "{query}"</h3>
          <p className="text-xs text-[#B8AFC4] max-w-md mx-auto">
            Can't find your specific series, webtoon, or doujinshi? You can manually register any title into your personal BLVerse intelligence catalog in seconds.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold transition-all shadow-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add "{query}" Now
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Local / Verified Results */}
          {(activeCategory === 'All' || activeCategory !== 'Worldwide AniList') &&
            filteredCategories.map((cat) => (
              <div key={cat.category} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#241238] pb-2">
                  {getCategoryIcon(cat.category)}
                  <h2 className="text-lg font-bold text-[#F8F5FC] font-display">
                    {cat.category}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1B1126] text-[#F09BC5] border border-[#241238]">
                    {cat.items.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cat.items.map((item) => {
                    const isSeries = item.type === 'series';
                    const watchEntry = isSeries ? getWatchlistEntry(item.id) : undefined;
                    const isWant = watchEntry?.status === 'Want to Watch' || watchEntry?.status === 'Plan to Watch';
                    const isWatch = watchEntry?.status === 'Watching';

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#160D20] border border-[#241238] hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between gap-3 group shadow-md hover:shadow-[0_10px_25px_rgba(159,122,234,0.15)] hover:-translate-y-0.5"
                      >
                        <Link to={item.url} className="flex items-center gap-3.5">
                          <img
                            referrerPolicy="no-referrer"
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-18 object-cover rounded-xl border border-[#241238] shrink-0 shadow group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                              {item.type}
                            </span>
                            <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors truncate mt-1">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-xs text-[#B8AFC4] truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#B8AFC4]/50 group-hover:text-[#F09BC5] transition-colors shrink-0" />
                        </Link>

                        {/* Series Status Quick Toggle Bar */}
                        {isSeries && (
                          <div className="pt-2 border-t border-[#241238] grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWatchlistStatus(item.id, 'Want to Watch', item.title);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                isWant
                                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4] shadow-sm'
                                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#9F7AEA]/50'
                              }`}
                              title={isWant ? 'Remove from Want to Watch' : 'Add to Want to Watch'}
                            >
                              {isWant ? <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" /> : <Bookmark className="w-2.5 h-2.5" />}
                              <span>Want</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWatchlistStatus(item.id, 'Watching', item.title);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                isWatch
                                  ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5] shadow-sm'
                                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#F09BC5]/50'
                              }`}
                              title={isWatch ? 'Remove from Watching' : 'Mark as Watching'}
                            >
                              {isWatch ? <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" /> : <Play className="w-2.5 h-2.5" />}
                              <span>Watching</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Worldwide Live AniList Registry Results */}
          {(activeCategory === 'All' || activeCategory === 'Worldwide AniList') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#241238] pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#F09BC5]" />
                  <h2 className="text-lg font-bold text-[#F8F5FC] font-display">
                    Worldwide AniList Registry
                  </h2>
                  {isLoadingWorld ? (
                    <Loader2 className="w-4 h-4 text-[#F09BC5] animate-spin ml-2" />
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1B1126] text-[#F09BC5] border border-[#241238]">
                      {worldResults.length}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#B8AFC4]">
                  Global AniList BL Database
                </span>
              </div>

              {isLoadingWorld && worldResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#B8AFC4] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9F7AEA]" /> Searching global AniList database...
                </div>
              ) : worldResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {worldResults.map((work) => {
                    const image = 'cover' in work ? work.cover : work.poster;
                    const targetLink = 'type' in work ? `/${work.type}/${work.id}` : `/series/${work.id}`;
                    const workTypeLabel = 'type' in work ? work.type : 'series';
                    const subtitle = 'author' in work ? `${work.author} • ${work.status}` : `${work.country} • ${work.year}`;

                    return (
                      <Link
                        key={work.id}
                        to={targetLink}
                        className="p-3.5 rounded-2xl bg-[#160D20] border border-[#241238] hover:border-[#9F7AEA]/50 transition-all flex items-center gap-3.5 group shadow-md hover:shadow-[0_10px_25px_rgba(159,122,234,0.15)] hover:-translate-y-0.5"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={image}
                          alt={work.title}
                          className="w-14 h-18 object-cover rounded-xl border border-[#241238] shrink-0 shadow group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#241238] text-[#9F7AEA] uppercase border border-[#9F7AEA]/30">
                              {workTypeLabel}
                            </span>
                            <span className="text-[10px] text-[#B8AFC4]">
                              {work.country}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#9F7AEA] transition-colors truncate mt-1">
                            {work.title}
                          </h4>
                          <p className="text-xs text-[#B8AFC4] truncate mt-0.5">
                            {subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#B8AFC4]/50 group-hover:text-[#9F7AEA] transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Add Missing Work Modal */}
      <AddWorkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTitle={query}
        onAdded={() => {
          // Re-trigger search or update
          window.location.reload();
        }}
      />
    </div>
  );
};
