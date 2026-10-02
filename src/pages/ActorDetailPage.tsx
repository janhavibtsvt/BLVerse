import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Film, Calendar, Instagram, ExternalLink, ArrowRight, Sparkles, Clock, CheckCircle2, Bookmark, Play, Check } from 'lucide-react';
import { getActorById } from '../data';
import { useUser } from '../context/UserContext';

export const ActorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWatchlistEntry, toggleWatchlistStatus } = useUser();
  const actor = id ? getActorById(id) : undefined;

  if (!actor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-[#9F7AEA]/50 mx-auto" />
        <h2 className="text-2xl font-bold text-[#F8F5FC]">Actor Profile Not Found</h2>
        <Link to="/actors" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90">
          Return to Actors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#241238] bg-[#160D20] group">
            <img
              referrerPolicy="no-referrer"
              src={actor.photo}
              alt={actor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bio Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#241238] to-[#9F7AEA]/80 text-[#F8F5FC] border border-[#9F7AEA]/50 shadow-[0_0_15px_rgba(159,122,234,0.3)]">
                ✦ {actor.nationality}
              </span>
              {actor.birthday && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#241238]/60 text-[#F09BC5] border border-[#F09BC5]/30">
                  Born {actor.birthday}
                </span>
              )}
              {actor.agency && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1126] text-[#B8AFC4] border border-[#241238]">
                  {actor.agency}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] font-display tracking-tight">
                {actor.name}
              </h1>
              {actor.stageName && (
                <p className="text-base text-[#B8AFC4] font-mono mt-0.5">
                  {actor.stageName}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#B8AFC4] leading-relaxed whitespace-pre-line pt-1">
              {actor.biography}
            </p>

            {/* Social & Official Links */}
            <div className="pt-4 flex flex-wrap gap-3">
              {actor.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${actor.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1B1126] hover:bg-[#241238] text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/40 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#F09BC5]" />
                  <span>@{actor.socialLinks.instagram}</span>
                </a>
              )}
              {actor.officialSource && (
                <a
                  href={actor.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1B1126] hover:bg-[#241238] text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/40 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B794F4]" />
                  <span>Official Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filmography Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#F09BC5]" />
          <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
            <span>✦</span> Live-Action BL Filmography ♡
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actor.filmography.map((item, idx) => {
            const watchEntry = getWatchlistEntry(item.seriesId);
            const isWant = watchEntry?.status === 'Want to Watch' || watchEntry?.status === 'Plan to Watch';
            const isWatch = watchEntry?.status === 'Watching';

            return (
              <div
                key={idx}
                className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_10px_30px_rgba(159,122,234,0.18)]"
              >
                <div className="flex gap-4 items-start">
                  <img
                    referrerPolicy="no-referrer"
                    src={item.seriesPoster}
                    alt={item.seriesTitle}
                    className="w-18 h-26 object-cover rounded-2xl border border-[#241238] shadow shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                      {item.roleType}
                    </span>
                    <h3 className="text-base font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors">
                      {item.seriesTitle}
                    </h3>
                    <p className="text-xs text-[#B8AFC4]">
                      Year: {item.year}
                    </p>
                    <p className="text-xs text-[#B794F4] pt-1">
                      Role: <strong className="text-[#F09BC5]">{item.characterName}</strong>
                    </p>
                  </div>
                </div>

                {/* Quick Status Toggle Bar */}
                <div className="mt-3 pt-3 border-t border-[#241238] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleWatchlistStatus(item.seriesId, 'Want to Watch', item.seriesTitle)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border shadow-sm ${
                        isWant
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4]'
                          : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#9F7AEA]/50'
                      }`}
                    >
                      {isWant ? <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" /> : <Bookmark className="w-3.5 h-3.5 text-[#B794F4]" />}
                      <span>{isWant ? 'Want to Watch' : 'Want to Watch'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWatchlistStatus(item.seriesId, 'Watching', item.seriesTitle)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border shadow-sm ${
                        isWatch
                          ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5]'
                          : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#F09BC5]/50'
                      }`}
                    >
                      {isWatch ? <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" /> : <Play className="w-3.5 h-3.5 text-[#F09BC5]" />}
                      <span>{isWatch ? 'Watching' : 'Watching'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Link
                      to={`/characters/${item.characterId}`}
                      className="text-[#B8AFC4] hover:text-[#F8F5FC] transition-colors font-medium"
                    >
                      Character Lore
                    </Link>
                    <Link
                      to={`/series/${item.seriesId}`}
                      className="text-[#B794F4] hover:text-[#F09BC5] font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Series Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming & In-Production Works */}
      {actor.upcomingWorks && actor.upcomingWorks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F09BC5]" />
            <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span>✦</span> Upcoming & Confirmed In-Development Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actor.upcomingWorks.map((work, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-[#160D20] border border-[#241238] hover:border-[#F09BC5]/40 flex flex-col justify-between space-y-3 shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40 uppercase">
                      {work.status}
                    </span>
                    <span className="text-xs text-[#B8AFC4] font-mono">
                      Expected {work.year}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F8F5FC] mt-2">
                    {work.title}
                  </h3>
                  <p className="text-xs text-[#B8AFC4] mt-0.5">
                    Role: {work.role} • Format: {work.type}
                  </p>
                </div>

                {work.source && (
                  <div className="pt-2 border-t border-[#241238] flex items-center justify-between text-xs text-[#B8AFC4]/70">
                    <span>Source: {work.source}</span>
                    {work.verified && (
                      <span className="text-[#F09BC5] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F09BC5]" /> Confirmed
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
