import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Film,
  User,
  Users,
  Layers,
  ArrowRight,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  GitBranch,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  Award
} from 'lucide-react';
import { AdaptationChain } from '../types';
import { sampleCharacters } from '../data';

interface AdaptationGraphProps {
  chain: AdaptationChain;
}

// Curated creative adaptation divergence notes for the universe
const adaptationDivergences: Record<
  string,
  {
    fidelityScore: number;
    castingAccuracy: number;
    keyChanges: { label: string; novel: string; adaptation: string }[];
    curatorNote: string;
  }
> = {
  'chain-semantic-error': {
    fidelityScore: 94,
    castingAccuracy: 99,
    keyChanges: [
      {
        label: 'Pacing & Tone',
        novel: 'Internal monologue-heavy with granular CS algorithm metaphors and explicit adult rating in later volumes.',
        adaptation: 'Streamlined into a punchy 8-episode college rom-com format with heightened visual humor and iconic red jacket motif.'
      },
      {
        label: 'Height & Chemistry Dynamics',
        novel: 'Jae-young is described as towering and imposing; Sang-woo is compact and rigid.',
        adaptation: 'Park Seo-ham (193cm) and Park Jae-chan (177cm) replicated the iconic 16cm height gap and visual silhouettes with uncanny fidelity.'
      },
      {
        label: 'Secondary Arcs',
        novel: 'Extended subplot with restaurant part-time jobs, software competitions, and graduate showcase.',
        adaptation: 'Focused tightly on the core mobile game programming collaboration and emotional thaw.'
      }
    ],
    curatorNote: 'Considered one of the gold standards of K-BL adaptation. The webtoon established the aesthetic vocabulary that the live-action production meticulously brought to life.'
  },
  'chain-cherry-magic': {
    fidelityScore: 92,
    castingAccuracy: 98,
    keyChanges: [
      {
        label: 'Cultural Transposition (Thai Remake)',
        novel: 'Japanese corporate stationery company hierarchy with quiet unspoken courtesies.',
        adaptation: 'GMMTV adaptation adapted the setting into a vibrant Bangkok office environment with localized humor, OSTs, and TayNew’s legendary off-screen chemistry.'
      },
      {
        label: 'Secondary Couple Balance',
        novel: 'Tsuge and Minato have dedicated chapter arcs.',
        adaptation: 'Both the Japanese TV drama and the Thai version expanded the secondary couple’s screen presence into complete parallel romantic arcs.'
      },
      {
        label: 'Film Sequel vs TV Series',
        novel: 'Ongoing episodic manga serialization.',
        adaptation: 'The Japanese franchise produced a TV season plus a dedicated theatrical sequel film focusing on long-distance relationship hurdles and coming out.'
      }
    ],
    curatorNote: 'A rare cross-border phenomenon: Yuu Toyota’s manga proved so universal that it succeeded wildly in both Japan and an official high-profile Thai adaptation.'
  },
  'chain-kinnporsche': {
    fidelityScore: 89,
    castingAccuracy: 97,
    keyChanges: [
      {
        label: 'Action & Production Scale',
        novel: 'Written as a raw, suspenseful mafia thriller on Tunwalai with gritty underground fights.',
        adaptation: 'Be On Cloud elevated the adaptation into a cinematic blockbuster with movie-grade stunt choreography, lavish sets, and an orchestral rock soundtrack.'
      },
      {
        label: 'Vegas & Pete Arc',
        novel: 'Extremely dark, controversial psychological torture dynamic.',
        adaptation: 'Infused with nuanced emotional depth by Bible and Build, turning their dynamic into a standout complex anti-hero narrative.'
      },
      {
        label: 'Worldbuilding & Minor Families',
        novel: 'Focused heavily on Kinn’s immediate mafia bodyguards.',
        adaptation: 'Expanded the political rivalry between the Main Family and Minor Family into a rich ensemble mafia saga.'
      }
    ],
    curatorNote: 'Revolutionized Thai BL production standards globally. The adaptation redefined what budget, cinematography, and adult action storytelling could look like in the medium.'
  },
  'chain-utsukushii-kare': {
    fidelityScore: 98,
    castingAccuracy: 100,
    keyChanges: [
      {
        label: 'Dual Perspective Structure',
        novel: 'Book 1 is strictly from Hira’s obsessive, idolizing POV; Book 2 shifts to Kiyoi’s desperate craving to be loved as a real human.',
        adaptation: 'Director Mai Sakai brilliantly preserved this structural reveal, dedicating late-season episodes entirely to Kiyoi’s private vulnerability.'
      },
      {
        label: 'Cinematic Language',
        novel: 'Poetic prose capturing Hira’s stutter and psychological isolation.',
        adaptation: 'Visualized through breathless close-ups, water reflections, ginger ale bubbles, and sensory sound design.'
      }
    ],
    curatorNote: 'A masterclass in literary fidelity. Winner of the Galaxy Award, celebrated for treating the characters’ psychological peculiarities with profound visual grace.'
  },
  'chain-mdzs': {
    fidelityScore: 86,
    castingAccuracy: 99,
    keyChanges: [
      {
        label: 'Medium Transformation & Censorship',
        novel: 'Explicit Xianxia Danmei romance featuring resurrection, dark cultivation, and intense romance.',
        adaptation: 'Broadcast as "The Untamed" under Chinese broadcasting guidelines, ingeniously translating explicit romantic bond into profound soulmate kinship ("Zhigong").'
      },
      {
        label: 'Narrative Flashback Structure',
        novel: 'Non-linear jumps between the present day and 13-year past memories.',
        adaptation: 'The live action organized the past into a continuous 33-episode chronological tragedy before returning to the present.'
      }
    ],
    curatorNote: 'Achieved astronomical global popularity with over 10 billion streams. Xiao Zhan and Wang Yibo’s nuanced performances conveyed deep romance purely through eye contact and physical devotion.'
  }
};

export const AdaptationGraph: React.FC<AdaptationGraphProps> = ({ chain }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'characters' | 'divergences' | 'timeline'>('pipeline');
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number>(0);

  // Find characters linked to this chain's works
  const linkedCharacters = sampleCharacters.filter(char => {
    const screenIds = chain.screenWorks.map(s => s.id);
    const intermediateIds = chain.intermediateWorks?.map(i => i.id) || [];
    return (
      (char.seriesId && screenIds.includes(char.seriesId)) ||
      (char.sourceMaterialId && (char.sourceMaterialId === chain.originalWork.id || intermediateIds.includes(char.sourceMaterialId))) ||
      char.appearances.some(app =>
        app.id === chain.originalWork.id ||
        screenIds.includes(app.id) ||
        intermediateIds.includes(app.id)
      )
    );
  });

  const divergences = adaptationDivergences[chain.id];
  const activeScreenWork = chain.screenWorks[selectedScreenIndex] || chain.screenWorks[0];

  return (
    <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 sm:p-8 shadow-[0_16px_48px_rgba(11,7,18,0.85)] relative overflow-hidden transition-all">
      {/* Soft Ambient Glow in Graph Header */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(ellipse_at_center,rgba(240,155,197,0.09),transparent_70%)] pointer-events-none filter blur-2xl" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[radial-gradient(ellipse_at_center,rgba(159,122,234,0.06),transparent_70%)] pointer-events-none filter blur-2xl" />

      {/* Chain Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#241238] gap-4 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#241238] to-[#9F7AEA]/30 text-[#F09BC5] border border-[#F09BC5]/40 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F09BC5]" />
              <span>Cross-Media Universe</span>
            </span>
            {divergences && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B1126] text-[#B794F4] border border-[#381E57]">
                ✦ {divergences.fidelityScore}% Canon Fidelity
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#F8F5FC] font-display tracking-tight">
            {chain.universeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#B8AFC4] mt-1.5 max-w-2xl font-normal leading-relaxed">
            {chain.description}
          </p>
        </div>

        {/* View Mode Tabs inside the Graph */}
        <div className="flex items-center gap-1.5 bg-[#1B1126] p-1 rounded-2xl border border-[#241238] self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Story Flow</span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Casting Matrix ({linkedCharacters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('divergences')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'divergences'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Fidelity & Changes</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STORY FLOW PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="py-6 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Interactive Pipeline — Click a stage to inspect creative canon:</span>
            </span>
            {chain.screenWorks.length > 1 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#B8AFC4]">Screen Version:</span>
                <div className="flex bg-[#1B1126] p-0.5 rounded-lg border border-[#241238]">
                  {chain.screenWorks.map((sw, idx) => (
                    <button
                      key={sw.id}
                      onClick={() => setSelectedScreenIndex(idx)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                        selectedScreenIndex === idx
                          ? 'bg-[#9F7AEA] text-white'
                          : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                      }`}
                    >
                      {sw.year} {sw.title.includes('Thai') ? 'Thai' : 'Original'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Node 1: Original Source Material */}
            <div
              onClick={() => setSelectedStep(1)}
              className={`cursor-pointer relative bg-[#1B1126] rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                selectedStep === 1
                  ? 'border-2 border-[#F09BC5] shadow-[0_0_24px_rgba(240,155,197,0.3)] scale-[1.02]'
                  : 'border border-[#241238] hover:border-[#9F7AEA]/60'
              }`}
            >
              <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-[#241238] border border-[#9F7AEA]/60 text-[#D8B4FE] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                <BookOpen className="w-3 h-3 text-[#B794F4]" />
                <span>Step 1: Original Literature</span>
              </div>

              <div className="pt-2 flex gap-4 items-start">
                {chain.originalWork.cover && (
                  <img
                    referrerPolicy="no-referrer"
                    src={chain.originalWork.cover}
                    alt={chain.originalWork.title}
                    className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#D8B4FE] uppercase tracking-wider">
                    {chain.originalWork.type}
                  </span>
                  <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors line-clamp-2">
                    {chain.originalWork.title}
                  </h4>
                  {chain.originalWork.author && (
                    <p className="text-xs text-[#B8AFC4] mt-1">
                      By {chain.originalWork.author}
                    </p>
                  )}
                  {chain.originalWork.year && (
                    <p className="text-[11px] text-[#B8AFC4]/70 mt-0.5">
                      First Published {chain.originalWork.year}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#241238] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#B8AFC4]/70">Root canon text</span>
                <Link
                  to={chain.originalWork.type === 'novel' ? `/novels/${chain.originalWork.id}` : `/manga/${chain.originalWork.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#F09BC5] hover:text-white font-semibold flex items-center gap-1"
                >
                  View entry <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Node 2: Intermediate Visual Adaptation (Manga / Manhwa / Manhua) */}
            <div
              onClick={() => setSelectedStep(2)}
              className={`cursor-pointer relative bg-[#1B1126] rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                selectedStep === 2
                  ? 'border-2 border-[#F09BC5] shadow-[0_0_24px_rgba(240,155,197,0.3)] scale-[1.02]'
                  : 'border border-[#241238] hover:border-[#B794F4]/60'
              }`}
            >
              <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-[#241238] border border-[#B794F4]/60 text-[#F09BC5] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                <Layers className="w-3 h-3 text-[#F09BC5]" />
                <span>Step 2: Comic / Webtoon</span>
              </div>

              {chain.intermediateWorks && chain.intermediateWorks.length > 0 ? (
                <div className="pt-2 flex gap-4 items-start">
                  {chain.intermediateWorks[0].cover && (
                    <img
                      referrerPolicy="no-referrer"
                      src={chain.intermediateWorks[0].cover}
                      alt={chain.intermediateWorks[0].title}
                      className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider">
                      {chain.intermediateWorks[0].type}
                    </span>
                    <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors line-clamp-2">
                      {chain.intermediateWorks[0].title}
                    </h4>
                    {chain.intermediateWorks[0].notes && (
                      <p className="text-xs text-[#B8AFC4] mt-1 line-clamp-2">
                        {chain.intermediateWorks[0].notes}
                      </p>
                    )}
                    {chain.intermediateWorks[0].year && (
                      <p className="text-[11px] text-[#B8AFC4]/70 mt-0.5">
                        Serialized {chain.intermediateWorks[0].year}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-4 flex flex-col items-center justify-center text-center text-[#B8AFC4] py-4">
                  <Info className="w-6 h-6 text-[#9F7AEA] mb-1" />
                  <p className="text-xs font-semibold text-[#F8F5FC]">Direct Adaptation</p>
                  <span className="text-[11px] text-[#B8AFC4]/70">Adapted directly from original story to screen</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#241238] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#B8AFC4]/70">Visual illustration</span>
                {chain.intermediateWorks && chain.intermediateWorks[0] ? (
                  <Link
                    to={`/${chain.intermediateWorks[0].type}/${chain.intermediateWorks[0].id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#F09BC5] hover:text-white font-semibold flex items-center gap-1"
                  >
                    View comic <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-[11px] text-[#B8AFC4]/50">No intermediate comic</span>
                )}
              </div>
            </div>

            {/* Node 3: Live-Action Screen Adaptation */}
            <div
              onClick={() => setSelectedStep(3)}
              className={`cursor-pointer relative bg-[#1B1126] rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                selectedStep === 3
                  ? 'border-2 border-[#F09BC5] shadow-[0_0_24px_rgba(240,155,197,0.3)] scale-[1.02]'
                  : 'border border-[#241238] hover:border-[#F09BC5]/60'
              }`}
            >
              <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#241238] to-[#E879A9]/40 border border-[#F09BC5]/70 text-[#F8F5FC] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                <Film className="w-3 h-3 text-[#F09BC5]" />
                <span>Step 3: Live-Action Series</span>
              </div>

              <div className="pt-2 flex gap-4 items-start">
                {activeScreenWork.poster && (
                  <img
                    referrerPolicy="no-referrer"
                    src={activeScreenWork.poster}
                    alt={activeScreenWork.title}
                    className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#E879A9] uppercase tracking-wider">
                    {activeScreenWork.type}
                  </span>
                  <h4 className="text-sm font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors line-clamp-2">
                    {activeScreenWork.title}
                  </h4>
                  {activeScreenWork.platform && (
                    <p className="text-xs text-[#B8AFC4] mt-1">
                      {activeScreenWork.platform}
                    </p>
                  )}
                  <p className="text-[11px] text-[#B8AFC4]/70 mt-0.5">
                    Released {activeScreenWork.year} • {activeScreenWork.status}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#241238] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#B8AFC4]/70">Screen canon</span>
                <Link
                  to={`/series/${activeScreenWork.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#F09BC5] hover:text-white font-semibold flex items-center gap-1"
                >
                  Series page <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Deep Node Inspector Drawer */}
          <div className="bg-[#1B1126] border border-[#241238] rounded-2xl p-5 shadow-inner transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#241238]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F09BC5] animate-ping" />
                <span className="text-xs font-bold text-[#F8F5FC] uppercase tracking-wider">
                  Inspecting Step {selectedStep}:{' '}
                  {selectedStep === 1
                    ? `Original Work (${chain.originalWork.title})`
                    : selectedStep === 2
                    ? `Comic Adaptation (${chain.intermediateWorks?.[0]?.title || 'Direct-to-Screen'})`
                    : `Live-Action Screen (${activeScreenWork.title})`}
                </span>
              </div>
              <span className="text-[11px] text-[#B8AFC4]">
                Click any step above to inspect creative details
              </span>
            </div>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#B8AFC4]">
              {selectedStep === 1 && (
                <>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#F09BC5] uppercase">Original Creator</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">{chain.originalWork.author}</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">Authored the foundational plot, psychological character arcs, and worldbuilding.</p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#B794F4] uppercase">Publication Format</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">{chain.originalWork.type.toUpperCase()}</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">Serialized in {chain.originalWork.year}. Formed the primary canon followed by subsequent adaptations.</p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#9F7AEA] uppercase">Explore Literature</span>
                    <p className="text-[11px] text-[#B8AFC4]">Read complete synopsis, review ratings, and find licensed reading platforms.</p>
                    <Link
                      to={chain.originalWork.type === 'novel' ? `/novels/${chain.originalWork.id}` : `/manga/${chain.originalWork.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F09BC5] hover:text-white pt-1"
                    >
                      <span>Open Work Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </>
              )}

              {selectedStep === 2 && (
                <>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#F09BC5] uppercase">Visual Adaptation</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">{chain.intermediateWorks?.[0]?.title || 'Direct-to-Screen'}</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">
                      {chain.intermediateWorks?.[0]?.notes || 'This series made the creative leap directly from literature to live-action screen.'}
                    </p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#B794F4] uppercase">Artistic Role</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">Character Visual Design</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">Established the iconic hair styles, clothing palettes, and visual comedy beats.</p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#9F7AEA] uppercase">Comic Canon</span>
                    {chain.intermediateWorks?.[0] ? (
                      <Link
                        to={`/${chain.intermediateWorks[0].type}/${chain.intermediateWorks[0].id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F09BC5] hover:text-white pt-1"
                      >
                        <span>View Comic Listing</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <p className="text-[11px] text-[#B8AFC4]/70">No separate comic entry required.</p>
                    )}
                  </div>
                </>
              )}

              {selectedStep === 3 && (
                <>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#F09BC5] uppercase">Production Broadcast</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">{activeScreenWork.platform}</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">Status: {activeScreenWork.status} ({activeScreenWork.year})</p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#B794F4] uppercase">Live-Action Execution</span>
                    <p className="text-sm font-bold text-[#F8F5FC]">Screen Direction & Casting</p>
                    <p className="text-[11px] text-[#B8AFC4]/70">Brought fictional chemistry into palpable physical performances and international acclaim.</p>
                  </div>
                  <div className="space-y-1 bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                    <span className="text-[10px] font-bold text-[#9F7AEA] uppercase">Series Hub</span>
                    <p className="text-[11px] text-[#B8AFC4]">Explore full episode guides, trailers, cast lists, and fan ratings.</p>
                    <Link
                      to={`/series/${activeScreenWork.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F09BC5] hover:text-white pt-1"
                    >
                      <span>Go to Series Page</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARACTER CASTING MATRIX */}
      {activeTab === 'characters' && (
        <div className="py-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Character Cross-Media Alignment & Casting Dynamics</span>
            </span>
            <span className="text-xs text-[#B8AFC4]">
              {linkedCharacters.length} Core Pairing Profiles
            </span>
          </div>

          {linkedCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedCharacters.map(char => (
                <div
                  key={char.id}
                  className="bg-[#1B1126] border border-[#241238] rounded-2xl p-4 space-y-3 hover:border-[#F09BC5]/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      referrerPolicy="no-referrer"
                      src={char.image}
                      alt={char.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#9F7AEA]/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#F8F5FC] truncate">{char.name}</h4>
                        <span className="text-[10px] font-bold text-[#F09BC5] bg-[#241238] px-2 py-0.5 rounded-md">
                          {char.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#B8AFC4] mt-0.5 line-clamp-2 leading-relaxed">
                        {char.description}
                      </p>
                    </div>
                  </div>

                  {/* Cross-Media Character Evolution Mapping */}
                  <div className="pt-2 border-t border-[#241238] grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#160D20] p-2.5 rounded-xl border border-[#241238]">
                      <span className="text-[10px] font-bold text-[#B794F4] uppercase block">
                        Literary Personality
                      </span>
                      <p className="text-[11px] text-[#F8F5FC] mt-0.5 line-clamp-2">
                        {char.personality}
                      </p>
                    </div>

                    <div className="bg-[#160D20] p-2.5 rounded-xl border border-[#241238]">
                      <span className="text-[10px] font-bold text-[#F09BC5] uppercase block">
                        Live-Action Actor
                      </span>
                      {char.actorName ? (
                        <Link
                          to={char.actorId ? `/actors/${char.actorId}` : '#'}
                          className="text-[11px] font-bold text-[#F09BC5] hover:text-white mt-0.5 block truncate"
                        >
                          {char.actorName} →
                        </Link>
                      ) : (
                        <p className="text-[11px] text-[#B8AFC4]">Actor casting pending</p>
                      )}
                    </div>
                  </div>

                  {/* Character Pairing Dynamics */}
                  {char.relationships && char.relationships[0] && (
                    <div className="bg-[#241238]/40 p-2 rounded-xl border border-[#381E57] text-[11px] text-[#B8AFC4] flex items-center gap-1.5">
                      <span className="text-[#F09BC5]">♡ Dynamic with {char.relationships[0].targetCharacterName}:</span>
                      <span className="truncate italic text-[#F8F5FC]">{char.relationships[0].description}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <Link
                      to={`/characters/${char.id}`}
                      className="text-xs font-semibold text-[#B794F4] hover:text-[#F09BC5] flex items-center gap-1"
                    >
                      <span>Full Character Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1B1126] border border-[#241238] rounded-2xl p-8 text-center text-xs text-[#B8AFC4] space-y-2">
              <Users className="w-8 h-8 text-[#9F7AEA] mx-auto opacity-60" />
              <p className="text-[#F8F5FC] font-semibold">Character files being indexed for this adaptation</p>
              <p>Explore character directory to see full relationship network.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FIDELITY & DIVERGENCES */}
      {activeTab === 'divergences' && (
        <div className="py-6 space-y-5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Creative Divergence Analysis & Fidelity Index</span>
            </span>
          </div>

          {divergences ? (
            <div className="space-y-4">
              {/* Score Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1B1126] border border-[#241238] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider">
                      Narrative Fidelity Rating
                    </span>
                    <h5 className="text-2xl font-black text-[#F8F5FC] font-display mt-0.5">
                      {divergences.fidelityScore}%
                    </h5>
                    <p className="text-[11px] text-[#B8AFC4]">
                      Fidelity to the author's original plot beats and core relationship milestones.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#241238] to-[#9F7AEA]/30 border border-[#F09BC5]/40 flex items-center justify-center text-lg font-black text-[#F09BC5]">
                    {divergences.fidelityScore}
                  </div>
                </div>

                <div className="bg-[#1B1126] border border-[#241238] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider">
                      Casting Silhouette Accuracy
                    </span>
                    <h5 className="text-2xl font-black text-[#F8F5FC] font-display mt-0.5">
                      {divergences.castingAccuracy}%
                    </h5>
                    <p className="text-[11px] text-[#B8AFC4]">
                      Visual alignment with official comic designs, height contrast, and dynamic energy.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#241238] to-[#F09BC5]/30 border border-[#F09BC5]/40 flex items-center justify-center text-lg font-black text-[#F09BC5]">
                    {divergences.castingAccuracy}
                  </div>
                </div>
              </div>

              {/* Key Divergences Table */}
              <div className="bg-[#1B1126] border border-[#241238] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[#241238] flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5FC] flex items-center gap-2">
                    <span>✦</span> Key Adaptation Creative Changes
                  </h4>
                  <span className="text-[11px] text-[#F09BC5]">Literature vs Screen</span>
                </div>
                <div className="divide-y divide-[#241238]">
                  {divergences.keyChanges.map((change, idx) => (
                    <div key={idx} className="p-4 space-y-2 text-xs">
                      <span className="font-bold text-[#F8F5FC] text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F09BC5]" />
                        {change.label}
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3">
                        <div className="bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                          <span className="text-[10px] font-bold text-[#B794F4] uppercase block mb-1">
                            In Source Literature:
                          </span>
                          <p className="text-xs text-[#B8AFC4] leading-relaxed">{change.novel}</p>
                        </div>
                        <div className="bg-[#160D20] p-3 rounded-xl border border-[#241238]">
                          <span className="text-[10px] font-bold text-[#F09BC5] uppercase block mb-1">
                            In Live-Action Series:
                          </span>
                          <p className="text-xs text-[#B8AFC4] leading-relaxed">{change.adaptation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curator Note */}
              <div className="bg-gradient-to-r from-[#241238] to-[#160D20] border border-[#F09BC5]/30 rounded-2xl p-4 text-xs text-[#B8AFC4] space-y-1">
                <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider flex items-center gap-1">
                  <span>♡</span> BLVerse Curator Commentary:
                </span>
                <p className="italic text-[#F8F5FC] leading-relaxed">{divergences.curatorNote}</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#1B1126] border border-[#241238] rounded-2xl p-8 text-center text-xs text-[#B8AFC4] space-y-2">
              <Info className="w-8 h-8 text-[#9F7AEA] mx-auto opacity-60" />
              <p className="text-[#F8F5FC] font-semibold">Adaptation commentary being compiled</p>
              <p>Our editorial team tracks plot shifts and casting choices across releases.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUCTION CHRONOLOGY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="py-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Production Chronology & Release Milestones</span>
            </span>
            <span className="text-xs text-[#B8AFC4]">{chain.timeline.length} Recorded Stages</span>
          </div>

          <div className="space-y-3">
            {chain.timeline.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238] hover:border-[#F09BC5]/40 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#241238] to-[#9F7AEA]/40 border border-[#F09BC5]/50 flex items-center justify-center text-[11px] font-bold text-[#F8F5FC] shadow">
                    {idx + 1}
                  </div>
                  {idx < chain.timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-[#241238] my-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#F8F5FC]">{step.title}</span>
                    <span className="text-[10px] font-bold text-[#F09BC5] bg-[#241238] border border-[#381E57] px-2 py-0.5 rounded-md">
                      {step.date}
                    </span>
                    <span className="text-[10px] text-[#B794F4] bg-[#160D20] px-2 py-0.5 rounded-md border border-[#241238]">
                      {step.stage}
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AFC4] mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer link to direct story page */}
      <div className="pt-4 border-t border-[#241238] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#B8AFC4] relative z-10">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F09BC5]" />
          <span>Connected cross-media universe verified by BLVerse editorial staff.</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            to={`/series/${activeScreenWork.id}`}
            className="text-[#F09BC5] hover:text-white font-bold flex items-center gap-1"
          >
            Explore live-action series <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
