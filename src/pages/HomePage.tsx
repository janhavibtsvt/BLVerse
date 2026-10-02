import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Film,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Play,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bell,
  Bookmark,
  Check,
  Heart,
  Flame
} from 'lucide-react';
import {
  getAllSeries,
  getAllManga,
  getAllManhwa,
  getAllManhua,
  sampleAdaptationChains,
  sampleUpcomingReleases,
  sampleUpdates
} from '../data';
import { ContentCard } from '../components/ContentCard';
import { SectionHeader } from '../components/SectionHeader';
import { AdaptationGraph } from '../components/AdaptationGraph';
import { useUser } from '../context/UserContext';

interface HomePageProps {
  onOpenAiChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAiChat }) => {
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const { toggleNotification, isNotificationSubscribed, getWatchlistEntry, toggleWatchlistStatus } = useUser();

  const allSeries = getAllSeries();
  const allManga = getAllManga();
  const allManhwa = getAllManhwa();
  const allManhua = getAllManhua();

  const yuriWorks = useMemo(() => {
    const glSeries = allSeries.filter(s => s.genres.includes('Yuri') || s.genres.includes("Girls' Love") || s.tags.includes('Yuri') || s.tags.includes('Yuri Series'));
    const glComics = [...allManga, ...allManhwa, ...allManhua].filter(c => c.genres.includes('Yuri') || c.genres.includes("Girls' Love") || c.tags.includes('Yuri') || c.tags.includes('Baihe'));
    return [...glSeries, ...glComics];
  }, [allSeries, allManga, allManhwa, allManhua]);

  const yaoiWorks = useMemo(() => {
    return [...allManhwa, ...allManga].filter(c => c.genres.includes('Yaoi') || c.tags.includes('Yaoi') || c.genres.includes('Mature') || c.tags.some(t => /mature|nsfw|yaoi/i.test(t)));
  }, [allManhwa, allManga]);

  const danmeiWorks = useMemo(() => {
    const danSeries = allSeries.filter(s => s.genres.includes('Danmei') || s.tags.includes('Danmei') || (s.country === 'China' && !s.genres.includes('Yuri')));
    const danManhua = allManhua.filter(m => m.genres.includes('Danmei') || m.genres.includes("Boys' Love") || m.tags.includes('Danmei'));
    return [...danSeries, ...danManhua];
  }, [allSeries, allManhua]);

  const heroTitles = allSeries.slice(0, 5);
  const currentHero = heroTitles[selectedHeroIndex] || heroTitles[0];

  const heroWatchEntry = getWatchlistEntry(currentHero.id);
  const isHeroWantToWatch = heroWatchEntry?.status === 'Want to Watch' || heroWatchEntry?.status === 'Plan to Watch';
  const isHeroWatching = heroWatchEntry?.status === 'Watching';

  return (
    <div className="space-y-16 pb-12">
      {/* Cinematic Hero Section */}
      <section className="relative w-full min-h-[620px] lg:min-h-[720px] flex items-end pb-16 overflow-hidden bg-[#0B0712]">
        {/* Background Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={currentHero.backdrop || currentHero.poster}
            alt={currentHero.title}
            className="w-full h-full object-cover object-center opacity-35 filter blur-[2px] scale-105 transition-all duration-700"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0712] via-[#0B0712]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0712] via-[#0B0712]/85 to-transparent" />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#241238] to-[#9F7AEA]/80 text-[#F8F5FC] border border-[#9F7AEA]/50 shadow-[0_0_15px_rgba(159,122,234,0.3)]">
                ✦ Featured Live Action
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#160D20]/80 backdrop-blur-md text-[#B8AFC4] border border-[#241238]">
                {currentHero.country} • {currentHero.year}
              </span>
              {currentHero.rating && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#0B0712]/80 text-amber-300 border border-[#241238] shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentHero.rating.toFixed(1)} / 10</span>
                </div>
              )}
            </div>

            {/* Title & Korean/Native Name */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F8F5FC] tracking-tight font-display drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {currentHero.title}
              </h1>
              {currentHero.alternativeTitles[0] && (
                <p className="text-lg sm:text-xl text-[#B8AFC4] mt-1 font-mono">
                  {currentHero.alternativeTitles[0]}
                </p>
              )}
            </div>

            {/* Cross-Media Adapt Connection Highlight */}
            {currentHero.sourceMaterialTitle && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#241238]/80 border border-[#F09BC5]/40 text-xs text-[#F8F5FC] shadow-md">
                <Layers className="w-4 h-4 text-[#F09BC5]" />
                <span>
                  Adapted from: <strong className="text-[#F09BC5]">{currentHero.sourceMaterialTitle}</strong>
                </span>
                <Link
                  to={`/adaptations`}
                  className="ml-2 text-[#B794F4] hover:text-white underline font-semibold"
                >
                  View Story Tree →
                </Link>
              </div>
            )}

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-[#B8AFC4] line-clamp-3 leading-relaxed max-w-2xl pt-1">
              {currentHero.synopsis}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to={`/series/${currentHero.id}`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:brightness-110 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(240,155,197,0.35)] hover:scale-105 flex items-center gap-2"
              >
                <span>View Full Details & Cast</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Quick Toggle: Want to Watch */}
              <button
                type="button"
                onClick={() => toggleWatchlistStatus(currentHero.id, 'Want to Watch', currentHero.title)}
                className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border shadow-md ${
                  isHeroWantToWatch
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white border-[#B794F4] shadow-[0_0_15px_rgba(159,122,234,0.4)]'
                    : 'bg-[#160D20]/80 hover:bg-[#241238] border-[#241238] hover:border-[#9F7AEA]/50 text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
                title={isHeroWantToWatch ? 'Click to remove from Want to Watch' : 'Click to save as Want to Watch in your collection profile'}
              >
                {isHeroWantToWatch ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  <Bookmark className="w-4 h-4 text-[#B794F4]" />
                )}
                <span>{isHeroWantToWatch ? 'Want to Watch ✓' : '+ Want to Watch'}</span>
              </button>

              {/* Quick Toggle: Watching */}
              <button
                type="button"
                onClick={() => toggleWatchlistStatus(currentHero.id, 'Watching', currentHero.title)}
                className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border shadow-md ${
                  isHeroWatching
                    ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white border-[#F09BC5] shadow-[0_0_15px_rgba(240,155,197,0.4)]'
                    : 'bg-[#160D20]/80 hover:bg-[#241238] border-[#241238] hover:border-[#F09BC5]/50 text-[#B8AFC4] hover:text-[#F8F5FC]'
                }`}
                title={isHeroWatching ? 'Click to remove from Watching' : 'Click to save as Watching in your collection profile'}
              >
                {isHeroWatching ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  <Play className="w-4 h-4 text-[#F09BC5]" />
                )}
                <span>{isHeroWatching ? 'Watching Now ▶' : '▶ Mark Watching'}</span>
              </button>

              <Link
                to="/adaptations"
                className="px-5 py-3 rounded-2xl bg-[#160D20]/80 hover:bg-[#241238] text-[#F8F5FC] font-semibold text-sm backdrop-blur-md border border-[#241238] hover:border-[#F09BC5]/40 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-[#F09BC5]" />
                <span>Adaptation Matrix</span>
              </Link>
            </div>
          </div>

          {/* Hero Slider Switcher Thumbnails */}
          <div className="mt-8 pt-6 border-t border-[#241238] flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] mr-2 shrink-0 flex items-center gap-1">
              <span>✦</span> Trending Spotlight:
            </span>
            {heroTitles.map((title, idx) => (
              <button
                key={title.id}
                onClick={() => setSelectedHeroIndex(idx)}
                className={`flex items-center gap-2.5 p-1.5 pr-4 rounded-xl border text-left transition-all shrink-0 ${
                  selectedHeroIndex === idx
                    ? 'bg-[#241238] border-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.25)]'
                    : 'bg-[#160D20]/70 border-[#241238] text-[#B8AFC4] hover:text-white hover:bg-[#241238]/60'
                }`}
              >
                <img
                  referrerPolicy="no-referrer"
                  src={title.poster}
                  alt={title.title}
                  className="w-8 h-11 object-cover rounded-lg"
                />
                <div>
                  <p className="text-xs font-bold leading-tight line-clamp-1">{title.title}</p>
                  <p className="text-[10px] text-[#B8AFC4]">{title.country} • {title.year}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Value Proposition Strip: Discover the stories behind the stories */}
        <section className="bg-gradient-to-r from-[#160D20] via-[#1F1230] to-[#26133B] border border-[#F09BC5]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_16px_40px_rgba(11,7,18,0.8)]">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Core Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8F5FC] font-display">
              Discover the stories behind the stories.
            </h2>
            <p className="text-sm text-[#B8AFC4] leading-relaxed">
              Every iconic live-action BL drama has deep roots. BLVerse connects original web novels to their manga, manhwa, and manhua adaptations, mapping out character relationships, actor filmographies, and verified production announcements.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#F8F5FC] bg-[#0B0712]/80 px-3 py-1.5 rounded-xl border border-[#241238]">
                <span className="w-2 h-2 rounded-full bg-[#B794F4]" />
                Original Novel
              </div>
              <span className="text-[#F09BC5]">→</span>
              <div className="flex items-center gap-2 text-xs font-medium text-[#F8F5FC] bg-[#0B0712]/80 px-3 py-1.5 rounded-xl border border-[#241238]">
                <span className="w-2 h-2 rounded-full bg-[#F09BC5]" />
                Manga / Manhwa / Manhua
              </div>
              <span className="text-[#F09BC5]">→</span>
              <div className="flex items-center gap-2 text-xs font-medium text-[#F8F5FC] bg-[#0B0712]/80 px-3 py-1.5 rounded-xl border border-[#241238]">
                <span className="w-2 h-2 rounded-full bg-[#9F7AEA]" />
                Live-Action BL Series
              </div>
              <span className="text-[#F09BC5]">→</span>
              <div className="flex items-center gap-2 text-xs font-medium text-[#F8F5FC] bg-[#0B0712]/80 px-3 py-1.5 rounded-xl border border-[#241238]">
                <span className="w-2 h-2 rounded-full bg-[#E879A9]" />
                Anime & Worldwide Fandom
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cross-Media Adaptation Flowchart */}
        <section>
          <SectionHeader
            title="Featured Adaptation Network"
            subtitle="Explore how a single story transforms across literature, comic art, and live-action cinema"
            viewAllLink="/adaptations"
            viewAllText="View All Adaptation Networks"
            icon={Layers}
            badge="Signature Feature"
          />
          <AdaptationGraph chain={sampleAdaptationChains[0]} />
        </section>

        {/* Trending Live-Action BL Series */}
        <section>
          <SectionHeader
            title="Top Live-Action BL Series"
            subtitle="Acclaimed dramas from South Korea, Thailand, Japan, Taiwan, and China"
            viewAllLink="/series"
            icon={Film}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allSeries.slice(0, 8).map((s) => (
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
        </section>

        {/* Popular Webtoons & Manga (Manhwa / Manga / Manhua) */}
        <section>
          <SectionHeader
            title="Trending Manga & Manhwa Adaptations"
            subtitle="The celebrated visual stories inspiring screen productions worldwide"
            viewAllLink="/manhwa"
            icon={BookOpen}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allManhwa.slice(0, 4).map((m) => (
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
                extraSubtitle={`${m.author} • ${m.chapters} Ch.`}
                isDemoSample={m.isDemoSample}
              />
            ))}
            {allManga.slice(0, 4).map((m) => (
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
                extraSubtitle={`${m.author} • ${m.volumes} Vols.`}
                isDemoSample={m.isDemoSample}
              />
            ))}
          </div>
        </section>

        {/* Yuri & Girls' Love (GL) Spotlight */}
        <section>
          <SectionHeader
            title="🌸 Yuri & Girls' Love (GL) Universe"
            subtitle="Acclaimed dramas, anime, and webtoons celebrating women loving women"
            viewAllLink="/series"
            icon={Heart}
            badge="Top Trending"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {yuriWorks.slice(0, 8).map((w: any) => (
              <ContentCard
                key={w.id}
                id={w.id}
                type={w.type || (w.episodes ? 'series' : 'manhwa')}
                title={w.title}
                originalTitle={w.originalTitle || w.alternativeTitles?.[0]}
                poster={w.poster || w.cover}
                country={w.country}
                year={w.year}
                rating={w.rating}
                status={w.status}
                genres={w.genres}
                extraSubtitle={w.author ? `${w.author}` : w.episodes ? `${w.episodes} Ep.` : undefined}
                isDemoSample={w.isDemoSample}
              />
            ))}
          </div>
        </section>

        {/* Yaoi & Mature BL Masterpieces */}
        <section>
          <SectionHeader
            title="🔥 Yaoi & Mature BL Masterpieces"
            subtitle="Iconic high-heat webtoons and manga exploring intense relationships and devotion"
            viewAllLink="/manhwa"
            icon={Flame}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {yaoiWorks.slice(0, 8).map((w: any) => (
              <ContentCard
                key={w.id}
                id={w.id}
                type={w.type || 'manhwa'}
                title={w.title}
                originalTitle={w.originalTitle || w.alternativeTitles?.[0]}
                poster={w.cover || w.poster}
                country={w.country}
                year={w.year}
                rating={w.rating}
                status={w.status}
                genres={w.genres}
                extraSubtitle={w.author ? `${w.author} • ${w.chapters || w.volumes || ''}` : undefined}
                isDemoSample={w.isDemoSample}
              />
            ))}
          </div>
        </section>

        {/* Danmei & Baihe Epics */}
        <section>
          <SectionHeader
            title="🪷 Danmei & Baihe Cultivation Epics"
            subtitle="Grand xianxia, wuxia, and modern Chinese classics spanning screens and webcomics"
            viewAllLink="/manhua"
            icon={Layers}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {danmeiWorks.slice(0, 8).map((w: any) => (
              <ContentCard
                key={w.id}
                id={w.id}
                type={w.type || (w.episodes ? 'series' : 'manhua')}
                title={w.title}
                originalTitle={w.originalTitle || w.alternativeTitles?.[0]}
                poster={w.poster || w.cover}
                country={w.country}
                year={w.year}
                rating={w.rating}
                status={w.status}
                genres={w.genres}
                extraSubtitle={w.author ? `${w.author}` : w.episodes ? `${w.episodes} Ep.` : undefined}
                isDemoSample={w.isDemoSample}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Releases & Announcements */}
        <section>
          <SectionHeader
            title="Upcoming Releases & Production Tracker"
            subtitle="Verified industry production schedules and officially announced adaptations"
            viewAllLink="/upcoming"
            icon={Clock}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleUpcomingReleases.slice(0, 4).map((rel) => {
              const subscribed = isNotificationSubscribed(rel.id);
              return (
                <div
                  key={rel.id}
                  className="bg-[#160D20] border border-[#241238] rounded-2xl p-4 flex flex-col justify-between hover:border-[#F09BC5]/50 transition-all hover:shadow-[0_8px_30px_rgba(159,122,234,0.18)] hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30 uppercase">
                        {rel.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0B0712]/80 text-[#B8AFC4] border border-[#241238]">
                        {rel.status}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start">
                      <img
                        referrerPolicy="no-referrer"
                        src={rel.poster}
                        alt={rel.title}
                        className="w-14 h-20 object-cover rounded-xl shrink-0 border border-[#241238] shadow"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#F8F5FC] line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-[#B8AFC4] mt-1">
                          {rel.country}
                        </p>
                        {rel.basedOn && (
                          <p className="text-[10px] text-[#F09BC5] truncate mt-0.5">
                            Based on: {rel.basedOn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#241238] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#B8AFC4]">Target Date:</span>
                      <span className={rel.releaseDateVerified ? 'text-emerald-400 font-semibold' : 'text-[#F09BC5] font-semibold'}>
                        {rel.expectedReleaseDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#B8AFC4]/70 truncate max-w-[150px]">
                        Ref: {rel.source}
                      </span>
                      <button
                        onClick={() => toggleNotification(rel.id)}
                        className={`p-1.5 rounded-xl text-xs transition-all flex items-center gap-1 ${
                          subscribed
                            ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.4)]'
                            : 'bg-[#241238]/60 text-[#B8AFC4] hover:text-[#F09BC5] hover:bg-[#241238] border border-white/5'
                        }`}
                        title={subscribed ? 'Tracking notification enabled' : 'Notify me on updates'}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">{subscribed ? 'Tracking' : 'Alert'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chronological Industry Updates Feed */}
        <section className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-xl">
          <SectionHeader
            title="Verified Industry Updates & Press Notices"
            subtitle="Transparent reporting from production houses, agencies, and publishers"
            icon={ShieldCheck}
          />
          <div className="space-y-3">
            {sampleUpdates.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] hover:border-[#9F7AEA]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30 uppercase">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-[#F8F5FC]">{item.title}</span>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#B8AFC4] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 text-xs text-[#B8AFC4]/70">
                  <span className="font-mono text-[11px] text-[#F09BC5]">{item.date}</span>
                  <span className="text-[10px] text-[#B8AFC4]/60">Source: {item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
