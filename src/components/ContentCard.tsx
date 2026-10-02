import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Bookmark, Eye, BookOpen, Layers, Play, Check } from 'lucide-react';
import { ContentType } from '../types';
import { useUser } from '../context/UserContext';

interface ContentCardProps {
  id: string;
  type: ContentType;
  title: string;
  originalTitle?: string;
  poster: string;
  country?: string;
  year?: number;
  rating?: number;
  status?: string;
  genres?: string[];
  sourceMaterialType?: string;
  sourceMaterialTitle?: string;
  isDemoSample?: boolean;
  extraSubtitle?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  type,
  title,
  originalTitle,
  poster,
  country,
  year,
  rating,
  status,
  genres = [],
  sourceMaterialType,
  sourceMaterialTitle,
  isDemoSample,
  extraSubtitle
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const { isFavorited, toggleFavorite, getWatchlistEntry, getReadingEntry, toggleWatchlistStatus } = useUser();
  const favorited = isFavorited(id);
  const watchEntry = type === 'series' ? getWatchlistEntry(id) : undefined;
  const readEntry = type !== 'series' ? getReadingEntry(id) : undefined;

  const isWantToWatch = watchEntry?.status === 'Want to Watch' || watchEntry?.status === 'Plan to Watch';
  const isWatching = watchEntry?.status === 'Watching';

  const getDetailPath = () => {
    switch (type) {
      case 'series': return `/series/${id}`;
      case 'manga': return `/manga/${id}`;
      case 'manhwa': return `/manhwa/${id}`;
      case 'manhua': return `/manhua/${id}`;
      case 'novel': return `/novels/${id}`;
      default: return `/series/${id}`;
    }
  };

  const getTypeBadgeClass = () => {
    switch (type) {
      case 'series': return 'bg-gradient-to-r from-[#241238] to-[#9F7AEA]/70 text-[#F8F5FC] border-[#9F7AEA]/50';
      case 'manga': return 'bg-gradient-to-r from-[#241238] to-[#F09BC5]/70 text-[#F8F5FC] border-[#F09BC5]/50';
      case 'manhwa': return 'bg-gradient-to-r from-[#241238] to-[#B794F4]/70 text-[#F8F5FC] border-[#B794F4]/50';
      case 'manhua': return 'bg-gradient-to-r from-[#241238] to-[#E879A9]/70 text-[#F8F5FC] border-[#E879A9]/50';
      case 'novel': return 'bg-gradient-to-r from-[#241238] to-[#D8B4FE]/70 text-[#F8F5FC] border-[#D8B4FE]/50';
      default: return 'bg-[#241238] text-[#F8F5FC] border-[#381E57]';
    }
  };

  return (
    <div className="group relative bg-[#160D20]/95 rounded-2xl border border-[#241238] hover:border-[#9F7AEA]/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_12px_36px_rgba(159,122,234,0.2)] hover:-translate-y-1">
      {/* Poster Image Area */}
      <Link to={getDetailPath()} className="relative aspect-[3/4] overflow-hidden bg-[#0B0712] block">
        {!imgFailed && poster ? (
          <img
            referrerPolicy="no-referrer"
            src={poster}
            alt={title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-end p-4 bg-gradient-to-br from-[#241238] via-[#160D20] to-[#0B0712]">
            <span className="text-2xl mb-2">✦</span>
            <p className="font-bold text-sm text-[#F8F5FC] leading-snug line-clamp-2">{title}</p>
            {originalTitle && <p className="text-[11px] text-[#B8AFC4] mt-0.5 line-clamp-1">{originalTitle}</p>}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#160D20] via-transparent to-black/50" />

        {/* Type & Status Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-md ${getTypeBadgeClass()}`}>
            {type}
          </span>
          {status && (
            <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-medium bg-[#0B0712]/75 backdrop-blur-md text-[#B8AFC4] border border-white/10">
              {status}
            </span>
          )}
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(id, type);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            favorited
              ? 'bg-gradient-to-tr from-[#E879A9] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.6)] scale-105'
              : 'bg-[#0B0712]/60 text-[#B8AFC4] hover:text-[#F09BC5] hover:bg-[#241238] border border-white/10'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Demo Sample Pill */}
        {isDemoSample && (
          <div className="absolute top-10 left-2.5 z-10">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-500/30 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              SAMPLE DATA
            </span>
          </div>
        )}

        {/* Rating and Country Pill (Bottom of Image) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs">
          {rating ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0B0712]/80 backdrop-blur-md border border-[#241238] text-amber-300 font-semibold shadow">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          ) : <div />}

          {country && (
            <span className="text-[11px] font-medium text-[#F8F5FC] bg-[#0B0712]/80 px-2 py-0.5 rounded-lg backdrop-blur-md border border-[#241238]">
              {country}
            </span>
          )}
        </div>
      </Link>

      {/* Content Meta */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <Link to={getDetailPath()}>
            <h3 className="font-bold text-sm text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors line-clamp-1 leading-snug">
              {title}
            </h3>
          </Link>
          {originalTitle && (
            <p className="text-[11px] text-[#B8AFC4] line-clamp-1 font-mono">
              {originalTitle}
            </p>
          )}
          {extraSubtitle && (
            <p className="text-xs text-[#B8AFC4] line-clamp-1 mt-0.5">
              {extraSubtitle}
            </p>
          )}

          {/* Adapted From Pill */}
          {sourceMaterialTitle && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-[#F09BC5] bg-[#241238]/70 px-2 py-1 rounded-lg border border-[#381E57] truncate">
              <Layers className="w-3 h-3 text-[#B794F4] shrink-0" />
              <span className="truncate">Based on: <strong className="text-[#F8F5FC]">{sourceMaterialTitle}</strong></span>
            </div>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-[#241238]/60 text-[#B8AFC4] border border-[#381E57]/50"
                >
                  {g}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="text-[10px] text-[#B8AFC4]/70 self-center">
                  +{genres.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Series Watchlist Toggles OR Comic Reading Status */}
        {type === 'series' ? (
          <div className="pt-2.5 border-t border-[#241238] space-y-2">
            {/* Quick Status Toggle Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchlistStatus(id, 'Want to Watch', title);
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isWantToWatch
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4] shadow-[0_0_12px_rgba(159,122,234,0.45)]'
                    : 'bg-[#1B1126]/90 text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#9F7AEA]/50 hover:bg-[#241238]'
                }`}
                title={isWantToWatch ? 'Click to remove from Want to Watch' : 'Click to save as Want to Watch in your collection'}
              >
                {isWantToWatch ? (
                  <Check className="w-3 h-3 text-white stroke-[2.5]" />
                ) : (
                  <Bookmark className="w-3 h-3" />
                )}
                <span className="truncate">{isWantToWatch ? 'Want to Watch' : 'Want to Watch'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchlistStatus(id, 'Watching', title);
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isWatching
                    ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5] shadow-[0_0_12px_rgba(240,155,197,0.45)]'
                    : 'bg-[#1B1126]/90 text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#F09BC5]/50 hover:bg-[#241238]'
                }`}
                title={isWatching ? 'Click to remove from Watching' : 'Click to save as Watching in your collection'}
              >
                {isWatching ? (
                  <Check className="w-3 h-3 text-white stroke-[2.5]" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span className="truncate">{isWatching ? 'Watching' : 'Watching'}</span>
              </button>
            </div>

            {/* Bottom Meta Bar */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#B8AFC4]/80">
                {year ? `${year}` : 'Date TBA'}
              </span>

              {watchEntry ? (
                <span
                  className={`flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded-lg border ${
                    isWatching
                      ? 'text-[#F09BC5] bg-[#F09BC5]/15 border-[#F09BC5]/30'
                      : isWantToWatch
                      ? 'text-[#B794F4] bg-[#9F7AEA]/15 border-[#9F7AEA]/30'
                      : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{watchEntry.status}</span>
                </span>
              ) : (
                <Link
                  to={getDetailPath()}
                  className="text-[#F09BC5]/90 hover:text-[#F09BC5] font-semibold text-[11px] hover:underline"
                >
                  Details →
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Comic / Novel Status Line */
          <div className="pt-2 border-t border-[#241238] flex items-center justify-between text-[11px]">
            <span className="text-[#B8AFC4]">
              {year ? `${year}` : 'Date TBA'}
            </span>

            {readEntry && (
              <span className="flex items-center gap-1 text-[#B794F4] font-medium">
                <BookOpen className="w-3 h-3" />
                {readEntry.status}
              </span>
            )}
            {!readEntry && (
              <Link
                to={getDetailPath()}
                className="text-[#F09BC5] hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                Explore ✦
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
