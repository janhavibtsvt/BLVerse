import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Film,
  Star,
  Heart,
  Eye,
  Layers,
  BookOpen,
  User,
  Tv,
  Calendar,
  Clock,
  Play,
  Share2,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageSquare,
  Bookmark,
  Loader2
} from 'lucide-react';
import { getSeriesById, getSourceMaterialByEntity } from '../data';
import { useUser } from '../context/UserContext';
import { WatchlistStatus, Series } from '../types';
import { fetchWorldSeriesById } from '../services/worldCatalog';

export const SeriesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const localSeries = id ? getSeriesById(id) : undefined;
  const [asyncSeries, setAsyncSeries] = useState<Series | null>(null);
  const [isLoadingAsync, setIsLoadingAsync] = useState<boolean>(false);

  useEffect(() => {
    if (!id || localSeries) return;
    setIsLoadingAsync(true);
    fetchWorldSeriesById(id)
      .then(res => {
        if (res) setAsyncSeries(res);
      })
      .catch(err => console.error('Failed to load world series:', err))
      .finally(() => setIsLoadingAsync(false));
  }, [id, localSeries]);

  const series = localSeries || asyncSeries;
  const { isFavorited, toggleFavorite, getWatchlistEntry, updateWatchlist, removeFromWatchlist, toggleWatchlistStatus } = useUser();

  const [activeTab, setActiveTab] = useState<'cast' | 'episodes' | 'trailers' | 'updates'>('cast');
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WatchlistStatus>('Want to Watch');
  const [selectedRating, setSelectedRating] = useState<number>(10);
  const [userNotes, setUserNotes] = useState<string>('');

  if (isLoadingAsync) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#F09BC5] animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-[#F8F5FC]">Fetching Global Series Details...</h2>
        <p className="text-sm text-[#B8AFC4]">Querying the worldwide AniList registry for complete drama & anime intelligence.</p>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Film className="w-12 h-12 text-[#9F7AEA]/50 mx-auto" />
        <h2 className="text-2xl font-bold text-[#F8F5FC]">Series Not Found</h2>
        <p className="text-sm text-[#B8AFC4]">The requested BL series could not be found in our repository.</p>
        <Link to="/series" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90">
          Return to Series Catalog
        </Link>
      </div>
    );
  }

  const favorited = isFavorited(series.id);
  const watchEntry = getWatchlistEntry(series.id);
  const sourceMaterial = getSourceMaterialByEntity(series);

  const isWantToWatch = watchEntry?.status === 'Want to Watch' || watchEntry?.status === 'Plan to Watch';
  const isWatching = watchEntry?.status === 'Watching';

  const handleSaveWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    updateWatchlist(series.id, selectedStatus, selectedRating, userNotes);
    setIsWatchlistModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Cinematic Backdrop Hero */}
      <div className="relative w-full min-h-[460px] lg:min-h-[520px] flex items-end pb-10 bg-[#0B0712] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={series.backdrop || series.poster}
            alt={series.title}
            className="w-full h-full object-cover object-center opacity-35 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0712] via-[#0B0712]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0712] via-[#0B0712]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#241238] bg-[#160D20] group">
              <img
                referrerPolicy="no-referrer"
                src={series.poster}
                alt={series.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Header Meta */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#241238] to-[#9F7AEA]/80 text-[#F8F5FC] border border-[#9F7AEA]/50 shadow-[0_0_15px_rgba(159,122,234,0.3)]">
                  ✦ Live Action Series
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#160D20]/80 text-[#B8AFC4] border border-[#241238]">
                  {series.country} • {series.year}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#241238]/60 text-[#F09BC5] border border-[#F09BC5]/30">
                  {series.status}
                </span>
                {series.rating && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#0B0712]/80 text-amber-300 border border-[#241238]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{series.rating.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8F5FC] font-display tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
                  {series.title}
                </h1>
                {series.alternativeTitles.length > 0 && (
                  <p className="text-sm sm:text-base text-[#B8AFC4] mt-1 font-mono">
                    {series.alternativeTitles.join(' • ')}
                  </p>
                )}
              </div>

              {/* Source Material Callout Card */}
              {series.sourceMaterialTitle && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1B1126] to-[#241238] border border-[#F09BC5]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#241238] border border-[#F09BC5]/40 flex items-center justify-center text-[#F09BC5] shrink-0 shadow-inner">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider flex items-center gap-1">
                        <span>✦</span> Source Material Origin
                      </span>
                      <p className="text-sm font-bold text-[#F8F5FC]">
                        {series.sourceMaterialTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {series.sourceMaterialId && (
                      <Link
                        to={series.sourceMaterialType === 'novel' ? `/novels/${series.sourceMaterialId}` : `/manga/${series.sourceMaterialId}`}
                        className="px-3.5 py-2 rounded-xl bg-[#241238] hover:bg-[#32194d] text-[#F8F5FC] text-xs font-semibold border border-[#9F7AEA]/40 transition-colors flex items-center gap-1.5 shadow"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#F09BC5]" />
                        <span>Original Work</span>
                      </Link>
                    )}
                    <Link
                      to="/adaptations"
                      className="px-3.5 py-2 rounded-xl bg-[#160D20]/90 hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] text-xs font-semibold border border-[#241238] transition-colors"
                    >
                      Story Matrix →
                    </Link>
                  </div>
                </div>
              )}

              {/* Actions: Want to Watch, Watching, Rating/Review & Favorite */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Toggle Want to Watch */}
                <button
                  type="button"
                  onClick={() => toggleWatchlistStatus(series.id, 'Want to Watch', series.title)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border shadow-lg ${
                    isWantToWatch
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4] shadow-[0_0_20px_rgba(159,122,234,0.45)] scale-105'
                      : 'bg-[#160D20]/90 border-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] hover:border-[#9F7AEA]/60 hover:bg-[#241238]'
                  }`}
                  title={isWantToWatch ? 'Click to remove from Want to Watch' : 'Click to save as Want to Watch in your collection profile'}
                >
                  {isWantToWatch ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-[#B794F4]" />
                  )}
                  <span>{isWantToWatch ? 'Want to Watch ✓' : '+ Want to Watch'}</span>
                </button>

                {/* Toggle Watching */}
                <button
                  type="button"
                  onClick={() => toggleWatchlistStatus(series.id, 'Watching', series.title)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border shadow-lg ${
                    isWatching
                      ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5] shadow-[0_0_20px_rgba(240,155,197,0.45)] scale-105'
                      : 'bg-[#160D20]/90 border-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] hover:border-[#F09BC5]/60 hover:bg-[#241238]'
                  }`}
                  title={isWatching ? 'Click to remove from Watching' : 'Click to save as Watching in your collection profile'}
                >
                  {isWatching ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#F09BC5]" />
                  )}
                  <span>{isWatching ? 'Watching Now ▶' : '▶ Mark Watching'}</span>
                </button>

                {/* Additional Watch Options & Rating Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus(watchEntry?.status || 'Want to Watch');
                    setSelectedRating(watchEntry?.rating || 10);
                    setUserNotes(watchEntry?.notes || '');
                    setIsWatchlistModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#160D20]/90 hover:bg-[#241238] border border-[#241238] hover:border-[#F09BC5]/40 text-[#B8AFC4] hover:text-[#F8F5FC] font-semibold text-xs transition-colors flex items-center gap-2"
                  title="Configure rating, personal review, or custom statuses like Completed"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F09BC5]" />
                  <span>{watchEntry ? `Status: ${watchEntry.status}` : 'More Options'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(series.id, 'series')}
                  className={`px-4 py-2.5 rounded-2xl font-semibold text-xs border transition-all flex items-center gap-2 ${
                    favorited
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 border-rose-500 text-white shadow-[0_0_15px_rgba(232,121,169,0.4)]'
                      : 'bg-[#160D20]/80 border-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] hover:border-[#F09BC5]/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  <span>{favorited ? 'Favorited ♡' : 'Favorite ♡'}</span>
                </button>

                {series.officialSource && (
                  <a
                    href={series.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-[#160D20]/80 border border-[#241238] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Official Streaming</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Synopsis, Cast, Episodes, Trailers */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 space-y-3 shadow-xl">
              <h2 className="text-base font-bold text-[#F8F5FC] font-display flex items-center gap-2">
                <span className="text-[#F09BC5]">✦</span> Story Synopsis
              </h2>
              <p className="text-sm text-[#B8AFC4] leading-relaxed whitespace-pre-line">
                {series.synopsis}
              </p>

              {series.tags && series.tags.length > 0 && (
                <div className="pt-3 border-t border-[#241238] flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs text-[#B8AFC4]/70 mr-1">Tags:</span>
                  {series.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] bg-[#241238]/60 text-[#F09BC5] border border-[#241238]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#241238] text-xs font-semibold gap-6 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('cast')}
                className={`pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'cast'
                    ? 'border-b-2 border-[#F09BC5] text-[#F09BC5] font-bold'
                    : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
              >
                <User className="w-4 h-4" /> Cast & Characters ({series.cast.length})
              </button>

              <button
                onClick={() => setActiveTab('episodes')}
                className={`pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'episodes'
                    ? 'border-b-2 border-[#F09BC5] text-[#F09BC5] font-bold'
                    : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
              >
                <Tv className="w-4 h-4" /> Episode Guide ({series.episodesList.length})
              </button>

              <button
                onClick={() => setActiveTab('trailers')}
                className={`pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'trailers'
                    ? 'border-b-2 border-[#F09BC5] text-[#F09BC5] font-bold'
                    : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
              >
                <Play className="w-4 h-4" /> Official Trailers ({series.trailers.length})
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={`pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'updates'
                    ? 'border-b-2 border-[#F09BC5] text-[#F09BC5] font-bold'
                    : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> News & Awards ({series.updates.length})
              </button>
            </div>

            {/* Tab: Cast & Characters */}
            {activeTab === 'cast' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {series.cast.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#160D20] border border-[#241238] hover:border-[#F09BC5]/40 transition-all flex items-center gap-3.5 group shadow-md"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={item.actorPhoto || item.characterPhoto}
                      alt={item.actorName}
                      className="w-14 h-18 object-cover rounded-xl shrink-0 shadow border border-[#241238] group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30 uppercase">
                        {item.roleType}
                      </span>
                      <h4 className="text-xs font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors truncate">
                        {item.characterName}
                      </h4>
                      <p className="text-xs text-[#B8AFC4] truncate">
                        Played by <strong className="text-[#F8F5FC]">{item.actorName}</strong>
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[11px]">
                        {item.actorId && (
                          <Link to={`/actors/${item.actorId}`} className="text-[#B794F4] hover:underline">
                            Actor bio →
                          </Link>
                        )}
                        {item.characterId && (
                          <Link to={`/characters/${item.characterId}`} className="text-[#F09BC5] hover:underline">
                            Character lore →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Episode Guide */}
            {activeTab === 'episodes' && (
              <div className="space-y-3">
                {series.episodesList.map((ep) => (
                  <div
                    key={ep.episodeNumber}
                    className="p-4 rounded-2xl bg-[#160D20] border border-[#241238] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8F5FC]">
                        Episode {ep.episodeNumber}: {ep.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#B8AFC4] font-mono">
                        {ep.duration && <span>{ep.duration}</span>}
                        {ep.airDate && <span>• {ep.airDate}</span>}
                      </div>
                    </div>
                    {ep.synopsis && (
                      <p className="text-xs text-[#B8AFC4] leading-relaxed">
                        {ep.synopsis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Trailers */}
            {activeTab === 'trailers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {series.trailers.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-[#160D20] border border-[#241238] rounded-2xl overflow-hidden group hover:border-[#F09BC5]/40 transition-all shadow-md"
                  >
                    <div className="relative aspect-video bg-black">
                      <img
                        referrerPolicy="no-referrer"
                        src={tr.thumbnailUrl}
                        alt={tr.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider">
                        {tr.type}
                      </span>
                      <h4 className="text-xs font-bold text-[#F8F5FC] truncate">{tr.title}</h4>
                      <p className="text-[11px] text-[#B8AFC4] font-mono">{tr.releaseDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Updates & Awards */}
            {activeTab === 'updates' && (
              <div className="space-y-3">
                {series.updates.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#160D20] border border-[#241238] space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase">
                        {item.type}
                      </span>
                      <span className="text-xs font-bold text-[#F8F5FC]">{item.title}</span>
                      <span className="text-[11px] text-[#B8AFC4] font-mono ml-auto">{item.date}</span>
                    </div>
                    <p className="text-xs text-[#B8AFC4]">{item.description}</p>
                    <p className="text-[10px] text-[#B8AFC4]/60 pt-1">Source: {item.source}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Production Meta & Technical Data */}
          <div className="space-y-6">
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-[#F09BC5] uppercase tracking-wider pb-2 border-b border-[#241238] flex items-center gap-1.5">
                <span>✦</span> Production Intelligence
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Country of Origin</span>
                  <span className="text-[#F8F5FC] font-medium">{series.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Audio Language</span>
                  <span className="text-[#F8F5FC] font-medium">{series.language}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Episodes</span>
                  <span className="text-[#F8F5FC] font-medium">{series.episodes} episodes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Runtime per Ep</span>
                  <span className="text-[#F8F5FC] font-medium">{series.runtime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Release Date</span>
                  <span className="text-[#F8F5FC] font-medium font-mono">{series.releaseDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Primary Network</span>
                  <span className="text-[#F8F5FC] font-medium">{series.network || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Production Studio</span>
                  <span className="text-[#F8F5FC] font-medium">{series.productionCompany || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#241238]">
                  <span className="text-[#B8AFC4]">Streaming Platforms</span>
                  <span className="text-[#F8F5FC] font-medium text-right">{series.platform}</span>
                </div>
              </div>
            </div>

            {/* Cross-Media Navigation Box */}
            <div className="bg-gradient-to-br from-[#1F1230] to-[#160D20] border border-[#F09BC5]/30 rounded-3xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Story Tree Navigation</span>
              </div>
              <p className="text-xs text-[#B8AFC4] leading-relaxed">
                Connect the screen characters back to their original literature and manga illustrations.
              </p>
              <Link
                to="/adaptations"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:brightness-110 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(240,155,197,0.3)]"
              >
                <span>Launch Adaptation Flowchart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Status Modal */}
      {isWatchlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#160D20] border border-[#F09BC5]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <h3 className="text-base font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span className="text-[#F09BC5]">✦</span> Update Watchlist: {series.title}
            </h3>

            <form onSubmit={handleSaveWatchlist} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#B8AFC4] mb-1.5 font-medium">Watch Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Want to Watch', 'Watching', 'Completed', 'On Hold', 'Dropped'] as WatchlistStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedStatus === st
                          ? 'bg-[#241238] border-[#F09BC5] text-[#F8F5FC] font-bold shadow-[0_0_10px_rgba(240,155,197,0.25)]'
                          : 'bg-[#1B1126] border-[#241238] text-[#B8AFC4] hover:border-[#F09BC5]/40'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#B8AFC4] mb-1.5 font-medium">
                  Your Rating: <span className="text-amber-300 font-bold">{selectedRating} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="w-full accent-[#F09BC5]"
                />
              </div>

              <div>
                <label className="block text-[#B8AFC4] mb-1.5 font-medium">Personal Review / Notes</label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="What did you think of the chemistry, pacing, or adaptation fidelity?"
                  rows={3}
                  className="w-full bg-[#1B1126] text-[#F8F5FC] border border-[#241238] rounded-xl p-3 focus:outline-none focus:border-[#F09BC5] text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {watchEntry ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeFromWatchlist(series.id);
                      setIsWatchlistModalOpen(false);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Remove from Watchlist
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWatchlistModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#241238]/60 hover:bg-[#241238] text-[#B8AFC4] border border-[#241238]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)]"
                  >
                    Save Status
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
