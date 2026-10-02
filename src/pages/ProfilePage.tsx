import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Bookmark,
  Heart,
  Bell,
  Star,
  Trash2,
  Calendar,
  Layers,
  Film,
  BookOpen,
  Play,
  Check,
  BarChart3,
  TrendingUp,
  Palette,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme, THEME_PRESETS } from '../context/ThemeContext';
import {
  getSeriesById,
  getComicById,
  getNovelById,
  getActorById,
  getCharacterById,
  sampleUpcomingReleases
} from '../data';
import { WatchlistStatus } from '../types';
import { ReadingAnalyticsChart } from '../components/ReadingAnalyticsChart';

export const ProfilePage: React.FC = () => {
  const {
    preferences,
    toggleFavorite,
    removeFromWatchlist,
    removeFromReadingList,
    toggleNotification,
    toggleWatchlistStatus,
    setWatchlistStatus,
    saveReadingProgress
  } = useUser();

  const { theme, setPreset, savedThemes, openCustomizer, loadSavedTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'reading' | 'favorites' | 'alerts' | 'theme'>('watchlist');
  const [watchlistFilter, setWatchlistFilter] = useState<'All' | 'Want to Watch' | 'Watching' | 'Completed'>('All');
  const [readingCategoryFilter, setReadingCategoryFilter] = useState<'All' | 'manga' | 'manhwa' | 'manhua' | 'novel'>('All');

  // Resolved Series from Watchlist
  const watchlistItems = preferences.watchlist.map(w => {
    const series = getSeriesById(w.seriesId);
    return { ...w, series };
  }).filter(item => Boolean(item.series));

  const wantToWatchCount = preferences.watchlist.filter(
    w => w.status === 'Want to Watch' || w.status === 'Plan to Watch'
  ).length;

  const watchingCount = preferences.watchlist.filter(
    w => w.status === 'Watching'
  ).length;

  const completedCount = preferences.watchlist.filter(
    w => w.status === 'Completed'
  ).length;

  const filteredWatchlistItems = watchlistItems.filter(item => {
    if (watchlistFilter === 'All') return true;
    if (watchlistFilter === 'Want to Watch') return item.status === 'Want to Watch' || item.status === 'Plan to Watch';
    if (watchlistFilter === 'Watching') return item.status === 'Watching';
    if (watchlistFilter === 'Completed') return item.status === 'Completed';
    return true;
  });

  // Resolved Comics / Novels from Reading List
  const readingListItems = preferences.readingList.map(r => {
    const comic = getComicById(r.workId);
    const novel = !comic ? getNovelById(r.workId) : undefined;
    return { ...r, work: comic || novel };
  }).filter(item => Boolean(item.work));

  const filteredReadingListItems = readingListItems.filter(item => {
    if (readingCategoryFilter === 'All') return true;
    const workType = 'type' in item.work! ? item.work!.type : 'novel';
    return workType === readingCategoryFilter;
  });

  // Flattened Favorites
  const allFavorites: { id: string; type: 'series' | 'manga' | 'manhwa' | 'manhua' | 'novel' | 'character' | 'actor' }[] = [
    ...preferences.favorites.seriesIds.map(id => ({ id, type: 'series' as const })),
    ...preferences.favorites.mangaIds.map(id => ({ id, type: 'manga' as const })),
    ...preferences.favorites.manhwaIds.map(id => ({ id, type: 'manhwa' as const })),
    ...preferences.favorites.manhuaIds.map(id => ({ id, type: 'manhua' as const })),
    ...preferences.favorites.novelIds.map(id => ({ id, type: 'novel' as const })),
    ...preferences.favorites.characterIds.map(id => ({ id, type: 'character' as const })),
    ...preferences.favorites.actorIds.map(id => ({ id, type: 'actor' as const }))
  ];

  // Subscribed release alerts
  const subscribedReleases = sampleUpcomingReleases.filter(r =>
    preferences.notifications.includes(r.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Card */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white text-2xl font-black font-display shadow-lg shadow-[rgba(240,155,197,0.3)]">
            BL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#F8F5FC] font-display">
                My BLVerse Collection
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                ✦ Personal Fandom Vault
              </span>
            </div>
            <p className="text-xs text-[#B8AFC4] mt-1">
              Personal Watchlist, Reading Progression & Production Trackers ♡
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center gap-3 text-center">
          <div className="px-4 py-2 rounded-2xl bg-[#1B1126] border border-[#241238]">
            <span className="text-lg font-bold text-[#F8F5FC] block">{preferences.watchlist.length}</span>
            <span className="text-[10px] text-[#F09BC5] uppercase font-semibold">Live-Action Series</span>
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#B8AFC4] mt-0.5">
              <span className="text-[#B794F4] font-bold">{wantToWatchCount} Want</span>
              <span>•</span>
              <span className="text-[#F09BC5] font-bold">{watchingCount} Watching</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#1B1126] border border-[#241238]">
            <span className="text-lg font-bold text-[#F8F5FC] block">{preferences.readingList.length}</span>
            <span className="text-[10px] text-[#B794F4] uppercase font-semibold">Comics / Novels</span>
            <div className="text-[9px] text-[#B8AFC4] mt-0.5">
              Reading Progression
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#1B1126] border border-[#241238]">
            <span className="text-lg font-bold text-[#F8F5FC] block">{allFavorites.length}</span>
            <span className="text-[10px] text-[#F09BC5] uppercase font-semibold">Favorites ♡</span>
            <div className="text-[9px] text-[#B8AFC4] mt-0.5">
              Curated Fandom
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#241238] gap-2 overflow-x-auto no-scrollbar text-xs font-bold pb-2">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'watchlist'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
              : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
          }`}
        >
          <Eye className="w-4 h-4" /> Watchlist ({preferences.watchlist.length})
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reading'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
              : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Reading Analytics & List ({preferences.readingList.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
              : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
          }`}
        >
          <Heart className="w-4 h-4" /> Favorites ({allFavorites.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
              : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
          }`}
        >
          <Bell className="w-4 h-4" /> Subscribed Alerts ({preferences.notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'theme'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
              : 'bg-[#160D20] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
          }`}
        >
          <Palette className="w-4 h-4" /> Theme & Appearance ({theme.name})
        </button>
      </div>

      {/* Tab 1: Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {/* Sub-Filters for Watchlist Status */}
          {watchlistItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#160D20] border border-[#241238]">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider mr-1">
                  Filter By Status:
                </span>
                <button
                  type="button"
                  onClick={() => setWatchlistFilter('All')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    watchlistFilter === 'All'
                      ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                  }`}
                >
                  All ({watchlistItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWatchlistFilter('Want to Watch')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                    watchlistFilter === 'Want to Watch'
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white shadow-[0_0_12px_rgba(159,122,234,0.4)]'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#B794F4] border border-[#241238]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Want to Watch ({wantToWatchCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWatchlistFilter('Watching')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                    watchlistFilter === 'Watching'
                      ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.4)]'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watching ({watchingCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWatchlistFilter('Completed')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                    watchlistFilter === 'Completed'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-emerald-400 border border-[#241238]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Completed ({completedCount})</span>
                </button>
              </div>

              <span className="text-xs text-[#B8AFC4]">
                Showing {filteredWatchlistItems.length} title{filteredWatchlistItems.length === 1 ? '' : 's'}
              </span>
            </div>
          )}

          {filteredWatchlistItems.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
              <Eye className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">
                {watchlistItems.length === 0
                  ? 'Your Watchlist is empty'
                  : `No series found under "${watchlistFilter}"`}
              </h3>
              <p className="text-xs text-[#B8AFC4]">
                {watchlistItems.length === 0
                  ? 'Explore the Live-Action Series catalog and toggle "Want to Watch" or "Watching" on any drama.'
                  : 'Try selecting a different status filter above or browse the catalog.'}
              </p>
              <Link
                to="/series"
                className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-lg shadow-[rgba(240,155,197,0.3)] hover:opacity-90 transition-all"
              >
                Explore Live-Action Series
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWatchlistItems.map((item) => {
                const isWant = item.status === 'Want to Watch' || item.status === 'Plan to Watch';
                const isWatch = item.status === 'Watching';
                const isComp = item.status === 'Completed';

                return (
                  <div
                    key={item.seriesId}
                    className="p-4 sm:p-5 rounded-3xl bg-[#160D20] border border-[#241238] flex flex-col justify-between gap-4 shadow-lg hover:border-[#F09BC5]/40 transition-colors"
                  >
                    <div className="flex gap-3.5 min-w-0">
                      <Link to={`/series/${item.series!.id}`} className="shrink-0 group">
                        <img
                          referrerPolicy="no-referrer"
                          src={item.series!.poster}
                          alt={item.series!.title}
                          className="w-18 h-24 sm:w-20 sm:h-28 object-cover rounded-2xl border border-[#241238] shadow group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider flex items-center gap-1 ${
                              isWatch
                                ? 'bg-pink-950/70 text-[#F9A8D4] border-pink-500/40 shadow-[0_0_10px_rgba(240,155,197,0.2)]'
                                : isWant
                                ? 'bg-purple-950/70 text-[#C4B5FD] border-purple-500/40 shadow-[0_0_10px_rgba(159,122,234,0.2)]'
                                : isComp
                                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                                : 'bg-[#241238] text-[#B8AFC4] border-[#241238]'
                            }`}
                          >
                            {isWatch && <Play className="w-2.5 h-2.5 fill-current" />}
                            {isWant && <Bookmark className="w-2.5 h-2.5 fill-current" />}
                            {isComp && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                            <span>{item.status}</span>
                          </span>

                          <span className="text-[11px] text-[#B8AFC4]">
                            {item.series!.country} • {item.series!.year}
                          </span>
                        </div>

                        <Link to={`/series/${item.series!.id}`}>
                          <h3 className="text-sm sm:text-base font-bold text-[#F8F5FC] hover:text-[#F09BC5] transition-colors truncate">
                            {item.series!.title}
                          </h3>
                        </Link>

                        {item.series!.alternativeTitles[0] && (
                          <p className="text-[11px] text-[#B8AFC4]/80 font-mono truncate">
                            {item.series!.alternativeTitles[0]}
                          </p>
                        )}

                        {item.rating && (
                          <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold pt-0.5">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                            <span>Rated {item.rating} / 10</span>
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-xs text-[#B8AFC4] italic pt-0.5 line-clamp-2 bg-[#1B1126]/60 p-2 rounded-xl border border-[#241238]/60">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Interactive In-Place Status Toggle Toolbar */}
                    <div className="pt-3 border-t border-[#241238] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#B8AFC4] font-semibold uppercase mr-1">
                          Status:
                        </span>
                        
                        {/* Want to Watch Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleWatchlistStatus(item.seriesId, 'Want to Watch', item.series?.title)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                            isWant
                              ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4] shadow-[0_0_10px_rgba(159,122,234,0.4)]'
                              : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#9F7AEA]/50'
                          }`}
                          title="Toggle Want to Watch"
                        >
                          <Bookmark className={`w-3 h-3 ${isWant ? 'fill-current' : ''}`} />
                          <span>Want to Watch</span>
                        </button>

                        {/* Watching Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleWatchlistStatus(item.seriesId, 'Watching', item.series?.title)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                            isWatch
                              ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5] shadow-[0_0_10px_rgba(240,155,197,0.4)]'
                              : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#F09BC5]/50'
                          }`}
                          title="Toggle Watching"
                        >
                          <Play className={`w-3 h-3 ${isWatch ? 'fill-current' : ''}`} />
                          <span>Watching</span>
                        </button>

                        {/* Mark Completed Button */}
                        <button
                          type="button"
                          onClick={() => setWatchlistStatus(item.seriesId, 'Completed')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                            isComp
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                              : 'bg-[#1B1126] text-[#B8AFC4] hover:text-emerald-300 border-[#241238] hover:border-emerald-500/50'
                          }`}
                          title="Mark as Completed"
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Completed</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/series/${item.series!.id}`}
                          className="px-2.5 py-1 rounded-xl bg-[#241238]/60 hover:bg-[#241238] text-xs text-[#B794F4] hover:text-[#F09BC5] font-bold transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(item.seriesId)}
                          className="text-[#B8AFC4]/60 hover:text-rose-400 p-1.5 transition-colors rounded-lg hover:bg-rose-500/10"
                          title="Remove from collection profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reading List & Analytics */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          {/* Recharts Bar Chart: Chapters and Volumes across Categories */}
          <ReadingAnalyticsChart readingList={preferences.readingList} />

          {/* Sub-Filters for Category Breakdown */}
          {readingListItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#160D20] border border-[#241238]">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider mr-1">
                  Category:
                </span>
                <button
                  type="button"
                  onClick={() => setReadingCategoryFilter('All')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    readingCategoryFilter === 'All'
                      ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                  }`}
                >
                  All Works ({readingListItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReadingCategoryFilter('manga')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    readingCategoryFilter === 'manga'
                      ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238]'
                  }`}
                >
                  Manga
                </button>
                <button
                  type="button"
                  onClick={() => setReadingCategoryFilter('manhwa')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    readingCategoryFilter === 'manhwa'
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#B794F4] border border-[#241238]'
                  }`}
                >
                  Manhwa
                </button>
                <button
                  type="button"
                  onClick={() => setReadingCategoryFilter('manhua')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    readingCategoryFilter === 'manhua'
                      ? 'bg-gradient-to-r from-sky-600 to-sky-400 text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-sky-300 border border-[#241238]'
                  }`}
                >
                  Manhua
                </button>
                <button
                  type="button"
                  onClick={() => setReadingCategoryFilter('novel')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    readingCategoryFilter === 'novel'
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-md'
                      : 'bg-[#1B1126] text-[#B8AFC4] hover:text-amber-300 border border-[#241238]'
                  }`}
                >
                  Novels
                </button>
              </div>

              <span className="text-xs text-[#B8AFC4]">
                Showing {filteredReadingListItems.length} title{filteredReadingListItems.length === 1 ? '' : 's'}
              </span>
            </div>
          )}

          {readingListItems.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
              <Bookmark className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">Your Reading List is empty</h3>
              <p className="text-xs text-[#B8AFC4]">
                Browse through Manhwa, Manga, Manhua, or Novels and save titles to your list.
              </p>
              <Link to="/manhwa" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-lg shadow-[rgba(240,155,197,0.3)]">
                Explore Manhwa
              </Link>
            </div>
          ) : filteredReadingListItems.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-8 text-center space-y-2 shadow-xl">
              <BookOpen className="w-10 h-10 text-[#F09BC5]/50 mx-auto" />
              <h4 className="text-sm font-bold text-[#F8F5FC]">
                No {readingCategoryFilter} works currently in your list
              </h4>
              <p className="text-xs text-[#B8AFC4]">
                Try selecting "All Works" or explore the catalog to add titles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReadingListItems.map((item) => {
                const workType = 'type' in item.work! ? item.work!.type : 'novel';
                const totalChapters = item.totalChapters || item.work!.chapters;
                const totalVolumes = item.totalVolumes || item.work!.volumes;
                const chaptersRead = item.progressChapters ?? 0;
                const volumesRead = item.progressVolumes ?? 0;

                return (
                  <div
                    key={item.workId}
                    className="p-4 sm:p-5 rounded-3xl bg-[#160D20] border border-[#241238] flex flex-col justify-between gap-3 shadow-lg hover:border-[#F09BC5]/40 transition-colors"
                  >
                    <div className="flex gap-3.5 min-w-0">
                      <Link
                        to={workType === 'novel' ? `/novels/${item.work!.id}` : `/${workType}/${item.work!.id}`}
                        className="shrink-0 group"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={item.work!.cover}
                          alt={item.work!.title}
                          className="w-18 h-24 sm:w-20 sm:h-28 object-cover rounded-2xl border border-[#241238] shadow group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30 uppercase tracking-wider">
                            {item.status}
                          </span>
                          <span className="text-[11px] text-[#B8AFC4]">
                            {workType.toUpperCase()} • {item.work!.country}
                          </span>
                        </div>

                        <Link
                          to={workType === 'novel' ? `/novels/${item.work!.id}` : `/${workType}/${item.work!.id}`}
                        >
                          <h3 className="text-sm font-bold text-[#F8F5FC] hover:text-[#F09BC5] transition-colors truncate">
                            {item.work!.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#B8AFC4]">
                          By {item.work!.author}
                        </p>

                        {/* Progress Indicators */}
                        <div className="pt-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                            <span className="text-[#F09BC5] font-semibold">
                              Ch. {chaptersRead} {totalChapters ? `/ ${totalChapters}` : 'read'}
                            </span>
                            {volumesRead > 0 && (
                              <span className="text-[#B794F4] font-semibold">
                                Vol. {volumesRead} {totalVolumes ? `/ ${totalVolumes}` : ''}
                              </span>
                            )}
                          </div>

                          {item.rating && (
                            <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                              <span>Rated {item.rating} / 10</span>
                            </div>
                          )}

                          {item.notes && (
                            <p className="text-xs text-[#B8AFC4] italic line-clamp-1 bg-[#1B1126]/60 px-2 py-1 rounded-lg border border-[#241238]/60 mt-1">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Toolbar with Quick Actions */}
                    <div className="pt-2 border-t border-[#241238] flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            saveReadingProgress({
                              workId: item.workId,
                              workTitle: item.work!.title,
                              type: workType as any,
                              status: item.status,
                              progressChapters: chaptersRead + 1,
                              progressVolumes: volumesRead
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#241238] hover:bg-[#241238]/80 text-[#F09BC5] font-bold border border-[#F09BC5]/30 hover:border-[#F09BC5] transition-all"
                          title="Advance to next chapter"
                        >
                          +1 Chapter
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={
                            workType === 'novel'
                              ? `/novels/${item.work!.id}#reading-progress`
                              : `/${workType}/${item.work!.id}#reading-progress`
                          }
                          className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-bold"
                        >
                          Tracker
                        </Link>
                        <button
                          onClick={() => removeFromReadingList(item.workId)}
                          className="text-[#B8AFC4]/60 hover:text-rose-400 p-1 transition-colors"
                          title="Remove from Reading List"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {allFavorites.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
              <Heart className="w-12 h-12 text-[#F09BC5]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">No favorites yet ♡</h3>
              <p className="text-xs text-[#B8AFC4]">
                Click the heart icon on any series, manga, character, or actor to save them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFavorites.map((fav) => {
                const s = getSeriesById(fav.id);
                const c = getComicById(fav.id);
                const n = getNovelById(fav.id);
                const a = getActorById(fav.id);
                const char = getCharacterById(fav.id);
                const title = s?.title || c?.title || n?.title || a?.name || char?.name || fav.id;
                const image = s?.poster || c?.cover || n?.cover || a?.photo || char?.image;

                return (
                  <div
                    key={`${fav.type}-${fav.id}`}
                    className="p-4 rounded-3xl bg-[#160D20] border border-[#241238] flex items-center justify-between gap-3 shadow-md hover:border-[#F09BC5]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {image && (
                        <img
                          referrerPolicy="no-referrer"
                          src={image}
                          alt={title}
                          className="w-12 h-16 object-cover rounded-xl border border-[#241238] shadow shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                          {fav.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#F8F5FC] truncate mt-1">{title}</h4>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(fav.id, fav.type)}
                      className="p-2 text-[#E879A9] hover:text-[#F09BC5] transition-colors"
                      title="Remove favorite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Subscribed Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {subscribedReleases.length === 0 ? (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
              <Bell className="w-12 h-12 text-[#B794F4]/50 mx-auto" />
              <h3 className="text-lg font-bold text-[#F8F5FC]">No active release alerts</h3>
              <p className="text-xs text-[#B8AFC4]">
                Subscribe to upcoming series or adaptation announcements on the Upcoming Releases page.
              </p>
              <Link to="/upcoming" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-lg shadow-[rgba(240,155,197,0.3)]">
                View Upcoming Releases
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscribedReleases.map((rel) => (
                <div
                  key={rel.id}
                  className="p-4 rounded-3xl bg-[#160D20] border border-[#241238] flex items-start gap-4 justify-between shadow-md hover:border-[#F09BC5]/40 transition-colors"
                >
                  <div className="flex gap-3 min-w-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={rel.poster}
                      alt={rel.title}
                      className="w-16 h-22 object-cover rounded-xl border border-[#241238] shadow shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                        {rel.type} • {rel.status}
                      </span>
                      <h3 className="text-sm font-bold text-[#F8F5FC] truncate">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-[#F09BC5] font-semibold">
                        Expected: {rel.expectedReleaseDate}
                      </p>
                      <p className="text-[11px] text-[#B8AFC4]/70">
                        Source: {rel.source}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleNotification(rel.id)}
                    className="p-2 text-[#B8AFC4]/60 hover:text-[#E879A9] transition-colors"
                    title="Unsubscribe alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Themes & Appearance */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* Active Theme Overview Banner */}
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-3xl shadow-lg shrink-0">
                {theme.emoji || '✨'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-[#F8F5FC] font-display">
                    {theme.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                    {theme.isPreset ? 'Curated Preset' : 'Custom Personalized'}
                  </span>
                </div>
                <p className="text-xs text-[#B8AFC4] mt-1">
                  Font Pairing: <strong className="text-[#F8F5FC]">{theme.fontPairing}</strong> • Ambiance:{' '}
                  <strong className="text-[#F8F5FC]">{theme.backgroundPattern}</strong> • Corner Radius:{' '}
                  <strong className="text-[#F8F5FC]">{theme.cardRadius}</strong> • Glow:{' '}
                  <strong className="text-[#F8F5FC]">{theme.glowIntensity}</strong>
                </p>

                {/* Swatches Strip */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.bgBase }}
                    title="Base Canvas"
                  />
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.bgCard }}
                    title="Card Surface"
                  />
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.accentPrimary }}
                    title="Primary Accent"
                  />
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.accentSecondary }}
                    title="Secondary Accent"
                  />
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.accentTertiary }}
                    title="Tertiary Accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={openCustomizer}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black text-xs font-bold shadow-lg shadow-[#F09BC5]/20 hover:opacity-95 transition-all hover:scale-105 active:scale-95"
              >
                <Sliders className="w-4 h-4 stroke-[2.5]" />
                <span>Open Theme Studio & Colors</span>
              </button>
            </div>
          </div>

          {/* User Saved Themes (if any) */}
          {savedThemes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F8F5FC] uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#F43F5E]" />
                  <span>My Saved Custom Themes ({savedThemes.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {savedThemes.map((saved) => {
                  const isCurrent = theme.id === saved.id;
                  return (
                    <div
                      key={saved.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-[#F09BC5] bg-[#1B1126] ring-1 ring-[#F09BC5]/40'
                          : 'border-[#241238] bg-[#160D20] hover:border-[#9F7AEA]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{saved.emoji || '✨'}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F09BC5] text-black">
                            Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#F8F5FC]">{saved.name}</h4>
                      {saved.tagline && (
                        <p className="text-[11px] text-[#B8AFC4] mt-0.5 line-clamp-1">{saved.tagline}</p>
                      )}

                      <div className="flex items-center gap-1.5 mt-3 mb-3">
                        <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: saved.colors.bgBase }} />
                        <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: saved.colors.bgCard }} />
                        <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: saved.colors.accentPrimary }} />
                        <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: saved.colors.accentSecondary }} />
                      </div>

                      <button
                        type="button"
                        onClick={() => loadSavedTheme(saved.id)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#241238] text-[#F09BC5]'
                            : 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black hover:opacity-90'
                        }`}
                      >
                        {isCurrent ? 'Currently Applied' : 'Apply Theme'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Preset Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8F5FC] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F09BC5]" />
                <span>Curated Aesthetic Presets (1-Click Switch)</span>
              </h3>
              <button
                type="button"
                onClick={openCustomizer}
                className="text-xs text-[#F09BC5] hover:underline font-semibold"
              >
                Customize Any Palette →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = theme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPreset(preset.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group hover:scale-[1.01] ${
                      isSelected
                        ? 'border-[#F09BC5] ring-2 ring-[#F09BC5]/30 bg-[#1B1126] shadow-xl'
                        : 'border-[#241238] bg-[#160D20] hover:border-[#9F7AEA]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{preset.emoji}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#F09BC5] text-black flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-[#B8AFC4] mt-0.5 line-clamp-2">
                        {preset.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#241238] flex items-center gap-1.5 mt-3">
                      <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: preset.colors.bgBase }} />
                      <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: preset.colors.bgCard }} />
                      <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: preset.colors.accentPrimary }} />
                      <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: preset.colors.accentSecondary }} />
                      <span className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: preset.colors.accentTertiary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
