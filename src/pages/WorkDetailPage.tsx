import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Layers,
  Star,
  Globe,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { getComicById, getNovelById, sampleAdaptationChains } from '../data';
import { ComicWork, Novel } from '../types';
import { useUser } from '../context/UserContext';
import { AdaptationGraph } from '../components/AdaptationGraph';
import { ReadingProgress } from '../components/ReadingProgress';
import { fetchWorldComicById } from '../services/worldCatalog';

interface WorkDetailPageProps {
  forcedType?: 'manga' | 'manhwa' | 'manhua' | 'novel';
}

export const WorkDetailPage: React.FC<WorkDetailPageProps> = ({ forcedType }) => {
  const { id } = useParams<{ id: string }>();
  const {
    isFavorited,
    toggleFavorite,
    getReadingEntry
  } = useUser();

  const [showReadingModal, setShowReadingModal] = useState(false);
  const [asyncWork, setAsyncWork] = useState<ComicWork | null>(null);
  const [isLoadingAsync, setIsLoadingAsync] = useState<boolean>(false);

  // Retrieve local work
  let localWork: (ComicWork | Novel) | undefined;
  if (forcedType === 'novel') {
    localWork = id ? getNovelById(id) : undefined;
  } else {
    localWork = id ? getComicById(id) : undefined;
    if (!localWork && id) {
      localWork = getNovelById(id);
    }
  }

  // If not found locally, load dynamically from World AniList catalog
  useEffect(() => {
    if (!id || localWork) return;
    setIsLoadingAsync(true);
    fetchWorldComicById(id)
      .then(res => {
        if (res) setAsyncWork(res);
      })
      .catch(err => console.error('Error fetching world comic:', err))
      .finally(() => setIsLoadingAsync(false));
  }, [id, localWork]);

  const work: (ComicWork | Novel) | undefined = localWork || asyncWork || undefined;

  if (isLoadingAsync) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#9F7AEA] animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-[#F8F5FC]">Searching Global BL Catalog...</h2>
        <p className="text-sm text-[#B8AFC4]">
          Querying worldwide AniList database for title details...
        </p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-[#9F7AEA]/50 mx-auto" />
        <h2 className="text-2xl font-bold text-[#F8F5FC]">Work Not Found</h2>
        <p className="text-sm text-[#B8AFC4]">
          The requested manga, manhwa, manhua, or novel could not be found in the catalog.
        </p>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90">
          Return to Discover
        </Link>
      </div>
    );
  }

  const isFav = isFavorited(work.id);
  const currentReadingEntry = getReadingEntry(work.id);
  const workType = 'type' in work ? work.type : 'novel';
  const relatedChain = sampleAdaptationChains.find(ch =>
    ch.originalWork.id === work.id ||
    ch.intermediateWorks?.some(w => w.id === work.id)
  );

  const workRating = (work as any).rating;
  const workPlatform = (work as any).platform || (work as any).publicationPlatform;
  const workPublisher = (work as any).publisher || (work as any).publicationPlatform;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Info Banner */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Cover */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#241238] bg-[#160D20] group">
            <img
              referrerPolicy="no-referrer"
              src={work.cover}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#241238] to-[#9F7AEA]/80 text-[#F8F5FC] border border-[#9F7AEA]/50 shadow-[0_0_15px_rgba(159,122,234,0.3)]">
                ✦ {workType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#241238]/60 text-[#F09BC5] border border-[#F09BC5]/30">
                {work.country}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1126] text-[#B8AFC4] border border-[#241238]">
                {work.status}
              </span>
              {work.year && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1126] text-[#B8AFC4] border border-[#241238]">
                  {work.year}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] font-display tracking-tight">
                {work.title}
              </h1>
              {work.originalTitle && (
                <p className="text-base text-[#B8AFC4] font-mono mt-0.5">
                  {work.originalTitle}
                </p>
              )}
            </div>

            {/* Author / Artist */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#B8AFC4]">
              <span>By <strong className="text-[#F8F5FC]">{work.author}</strong></span>
              {'artist' in work && work.artist && (
                <span>• Art by <strong className="text-[#F8F5FC]">{work.artist}</strong></span>
              )}
              {workRating && (
                <span className="flex items-center gap-1 text-[#F09BC5] font-bold">
                  <Star className="w-4 h-4 fill-current text-[#F09BC5]" />
                  {workRating} / 10
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
                <span className="text-[#B8AFC4]/70 block text-[11px]">Chapters</span>
                <span className="font-bold text-[#F8F5FC] text-sm">{work.chapters}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
                <span className="text-[#B8AFC4]/70 block text-[11px]">Volumes</span>
                <span className="font-bold text-[#F8F5FC] text-sm">{work.volumes || 'N/A'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
                <span className="text-[#B8AFC4]/70 block text-[11px]">Platform / Publisher</span>
                <span className="font-bold text-[#F8F5FC] text-sm truncate block">
                  {workPublisher}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('reading-progress');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    setShowReadingModal(true);
                  }
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                  currentReadingEntry
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.4)]'
                    : 'bg-[#241238] hover:bg-[#241238]/80 text-[#F8F5FC] border border-[#F09BC5]/30'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>
                  {currentReadingEntry
                    ? `Reading Progress: ${currentReadingEntry.status}${
                        currentReadingEntry.progressChapters !== undefined
                          ? ` (Ch. ${currentReadingEntry.progressChapters}${
                              currentReadingEntry.progressVolumes ? `, Vol. ${currentReadingEntry.progressVolumes}` : ''
                            })`
                          : ''
                      }`
                    : 'Track Reading Progress'}
                </span>
              </button>

              <button
                onClick={() => setShowReadingModal(true)}
                className="px-3 py-2.5 rounded-2xl bg-[#1B1126] hover:bg-[#241238] border border-[#241238] hover:border-[#F09BC5]/30 text-xs font-semibold text-[#B8AFC4] hover:text-[#F8F5FC] transition-colors"
                title="Open Reading Progress Dialog"
              >
                Quick Edit
              </button>

              <button
                onClick={() => toggleFavorite(work.id, workType as any)}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isFav
                    ? 'bg-gradient-to-r from-[#E879A9] to-[#F09BC5] border-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.4)]'
                    : 'bg-[#1B1126] border-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] hover:border-[#F09BC5]/30'
                }`}
                title="Favorite this work"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              {work.officialSource && (
                <a
                  href={work.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-[#1B1126] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/30 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B794F4]" />
                  <span>Official Publication</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reading Progress Component (Saves directly to user profile context) */}
      <section id="reading-progress" aria-label="Reading Progress Tracker">
        <ReadingProgress work={work} />
      </section>

      {/* Reading Progress Quick Modal */}
      {showReadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full relative">
            <button
              type="button"
              onClick={() => setShowReadingModal(false)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-[#160D20] border border-[#F09BC5]/50 text-white flex items-center justify-center hover:bg-[#F09BC5] transition-colors shadow-lg"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <ReadingProgress
              work={work}
              onSaved={() => setShowReadingModal(false)}
            />
          </div>
        </div>
      )}

      {/* Synopsis & Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span>✦</span> Synopsis & Narrative Context
            </h2>
            <p className="text-sm text-[#B8AFC4] leading-relaxed whitespace-pre-line">
              {work.synopsis}
            </p>

            <div className="pt-4 border-t border-[#241238] flex flex-wrap gap-2">
              {work.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30"
                >
                  {g}
                </span>
              ))}
              {work.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-[#1B1126] text-[#B8AFC4] border border-[#241238]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Adaptations Ecosystem */}
          {work.adaptations && work.adaptations.length > 0 && (
            <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F09BC5]" />
                <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
                  <span>✦</span> Known Adaptations & Derivatives
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {work.adaptations.map((ad, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] flex flex-col justify-between space-y-2 hover:border-[#F09BC5]/40 transition-colors shadow-md group"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                        {ad.type}
                      </span>
                      <h4 className="text-sm font-bold text-[#F8F5FC] mt-1 group-hover:text-[#F09BC5] transition-colors">
                        {ad.title}
                      </h4>
                      {ad.note && (
                        <p className="text-xs text-[#B8AFC4] mt-1">
                          {ad.note}
                        </p>
                      )}
                    </div>

                    <Link
                      to={ad.type === 'series' ? `/series/${ad.id}` : `/${ad.type}/${ad.id}`}
                      className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-bold flex items-center gap-1 pt-2 transition-colors"
                    >
                      <span>Explore this version</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Adaptation Chain Hub link */}
          {relatedChain && (
            <div className="bg-[#160D20] border border-[#F09BC5]/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[#F09BC5]">
                <Layers className="w-5 h-5 text-[#B794F4]" />
                <h3 className="text-base font-bold text-[#F8F5FC] font-display">
                  Adaptation Hub
                </h3>
              </div>
              <p className="text-xs text-[#B8AFC4] leading-relaxed">
                This title is part of the <strong className="text-[#F8F5FC]">{relatedChain.name}</strong> transmedia universe.
              </p>
              <Link
                to={`/adaptations/${relatedChain.id}`}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[rgba(240,155,197,0.3)]"
              >
                <span>View Transmedia Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Publication Metadata */}
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span>✦</span> Publication Metadata
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#241238]">
                <span className="text-[#B8AFC4]">Language:</span>
                <span className="font-semibold text-[#F8F5FC]">{work.language}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#241238]">
                <span className="text-[#B8AFC4]">Country of Origin:</span>
                <span className="font-semibold text-[#F8F5FC]">{work.country}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#241238]">
                <span className="text-[#B8AFC4]">Publisher:</span>
                <span className="font-semibold text-[#F8F5FC]">{workPublisher}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#241238]">
                <span className="text-[#B8AFC4]">Catalog Verified:</span>
                <span className="text-[#F09BC5] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F09BC5]" /> Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Transmedia Graph if part of a chain */}
      {relatedChain && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F09BC5]" /> Transmedia Adaptation Lineage ♡
          </h2>
          <AdaptationGraph chain={relatedChain} />
        </div>
      )}
    </div>
  );
};
