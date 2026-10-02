import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, Sparkles, Search, Filter, BookOpen, Film, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sampleAdaptationChains } from '../data';
import { AdaptationGraph } from '../components/AdaptationGraph';

export const AdaptationsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [selectedChainId, setSelectedChainId] = useState<string>(id || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'novel' | 'manga' | 'manhwa' | 'multiscreen'>('all');

  useEffect(() => {
    if (id) {
      setSelectedChainId(id);
    }
  }, [id]);

  const filteredChains = sampleAdaptationChains.filter(ch => {
    const matchSelected = selectedChainId === 'all' || ch.id === selectedChainId;
    const matchSearch =
      !searchQuery.trim() ||
      ch.universeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.originalWork.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchMedia =
      mediaFilter === 'all' ||
      (mediaFilter === 'novel' && ch.originalWork.type === 'novel') ||
      (mediaFilter === 'manga' && (ch.originalWork.type === 'manga' || ch.intermediateWorks?.some(i => i.type === 'manga'))) ||
      (mediaFilter === 'manhwa' && ch.intermediateWorks?.some(i => i.type === 'manhwa')) ||
      (mediaFilter === 'multiscreen' && ch.screenWorks.length > 1);

    return matchSelected && matchSearch && matchMedia;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-[#B794F4]" />
          <span>✦ Cross-Media Relationship Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#F8F5FC] tracking-tight font-display">
          Adaptation Flowcharts & Story Trees
        </h1>
        <p className="text-sm sm:text-base text-[#B8AFC4] mt-2 max-w-3xl leading-relaxed">
          The heart of BLVerse: Track how stories cross boundaries between original web novels, serialized comics, and live-action series. Inspect creative fidelity, casting choices, and production milestones.
        </p>
      </div>

      {/* Selector & Search Bar */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search adaptation universe, author, title..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
            <button
              onClick={() => setSelectedChainId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedChainId === 'all'
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/30'
              }`}
            >
              All Universes
            </button>
            {sampleAdaptationChains.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChainId(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedChainId === c.id
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                    : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/30'
                }`}
              >
                {c.universeTitle.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Media Pipeline Filters */}
        <div className="pt-3 border-t border-[#241238] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1">
            Filter by Pipeline:
          </span>
          <button
            onClick={() => setMediaFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              mediaFilter === 'all'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => setMediaFilter('novel')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              mediaFilter === 'novel'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            Web Novel Roots
          </button>
          <button
            onClick={() => setMediaFilter('manhwa')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              mediaFilter === 'manhwa'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            Includes Webtoon / Manhwa
          </button>
          <button
            onClick={() => setMediaFilter('manga')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              mediaFilter === 'manga'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            Manga Origins
          </button>
          <button
            onClick={() => setMediaFilter('multiscreen')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              mediaFilter === 'multiscreen'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_10px_rgba(240,155,197,0.3)]'
                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
            }`}
          >
            Multiple Adaptations / Remakes
          </button>
        </div>
      </div>

      {/* Adaptation Chains List */}
      <div className="space-y-12">
        {filteredChains.map((chain) => (
          <div key={chain.id} id={chain.id}>
            <AdaptationGraph chain={chain} />
          </div>
        ))}

        {filteredChains.length === 0 && (
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3 shadow-xl">
            <Layers className="w-12 h-12 text-[#9F7AEA]/50 mx-auto" />
            <h3 className="text-lg font-bold text-[#F8F5FC]">No adaptation networks found</h3>
            <p className="text-xs text-[#B8AFC4]">
              Try adjusting your search terms or selecting "All Universes".
            </p>
            <button
              onClick={() => {
                setSelectedChainId('all');
                setSearchQuery('');
                setMediaFilter('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
