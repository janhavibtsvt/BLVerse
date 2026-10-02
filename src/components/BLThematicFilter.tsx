import React from 'react';
import { Sparkles, X, Filter, Flame, Heart, Droplets, Zap, Briefcase, GraduationCap, ShieldAlert, Sun, Magnet, Theater } from 'lucide-react';

export interface ThematicTheme {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  borderClass: string;
  badgeClass: string;
  activeClass: string;
}

export const BL_THEMATIC_ELEMENTS: ThematicTheme[] = [
  {
    id: 'Fluff',
    name: 'Fluff & Wholesome',
    shortName: 'Fluff',
    icon: '💖',
    tagline: 'Heartwarming, low-angst sweetness & diabetes-inducing chemistry',
    borderClass: 'hover:border-pink-500/60',
    badgeClass: 'text-pink-300 bg-pink-500/10 border-pink-500/30',
    activeClass: 'bg-gradient-to-r from-pink-600 to-rose-500 text-white border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.45)]'
  },
  {
    id: 'Angst',
    name: 'Angst & Heartache',
    shortName: 'Angst',
    icon: '💔',
    tagline: 'Deep yearning, emotional conflict, bittersweet tears & painful devotion',
    borderClass: 'hover:border-violet-500/60',
    badgeClass: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
    activeClass: 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.45)]'
  },
  {
    id: 'Slow Burn',
    name: 'Slow Burn & Pining',
    shortName: 'Slow Burn',
    icon: '⏳',
    tagline: 'Gradual romantic buildup, unspoken devotion, lingering glances & simmering passion',
    borderClass: 'hover:border-amber-500/60',
    badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    activeClass: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.45)]'
  },
  {
    id: 'Enemies to Lovers',
    name: 'Enemies to Lovers',
    shortName: 'Enemies to Lovers',
    icon: '⚡',
    tagline: 'Rivalries, stubborn pride, fierce banter & electric hate-to-love friction',
    borderClass: 'hover:border-fuchsia-500/60',
    badgeClass: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30',
    activeClass: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.45)]'
  },
  {
    id: 'Office Romance',
    name: 'Office & Workplace',
    shortName: 'Office Romance',
    icon: '💼',
    tagline: 'Secret elevator glances, corporate hierarchy & professional line crossings',
    borderClass: 'hover:border-cyan-500/60',
    badgeClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    activeClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.45)]'
  },
  {
    id: 'Campus & School',
    name: 'Campus & Youth',
    shortName: 'Campus',
    icon: '🎓',
    tagline: 'University faculties, engineering gears, roommates & youth sports rivalries',
    borderClass: 'hover:border-emerald-500/60',
    badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.45)]'
  },
  {
    id: 'Mafia & Action',
    name: 'Mafia & Bodyguard',
    shortName: 'Mafia / Action',
    icon: '⚔️',
    tagline: 'Underworld crime syndicates, protective vows, danger & high-stakes devotion',
    borderClass: 'hover:border-rose-500/60',
    badgeClass: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    activeClass: 'bg-gradient-to-r from-rose-700 to-red-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.45)]'
  },
  {
    id: 'Healing & Comfort',
    name: 'Healing & Comfort',
    shortName: 'Healing',
    icon: '🌿',
    tagline: 'Emotional sanctuary, comforting home cooking, tender acceptance & safe harbor',
    borderClass: 'hover:border-teal-500/60',
    badgeClass: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
    activeClass: 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.45)]'
  },
  {
    id: 'Opposites Attract',
    name: 'Opposites Attract',
    shortName: 'Opposites',
    icon: '🧲',
    tagline: 'Sunshine x Grumpy, methodical logic vs creative chaos & polar opposites',
    borderClass: 'hover:border-purple-500/60',
    badgeClass: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
    activeClass: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.45)]'
  },
  {
    id: 'Fake Dating',
    name: 'Fake Dating',
    shortName: 'Fake Dating',
    icon: '🎭',
    tagline: 'Arranged pacts, pretend boyfriends, and mutual contracts turning real',
    borderClass: 'hover:border-indigo-500/60',
    badgeClass: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
    activeClass: 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.45)]'
  }
];

export function matchesThematicElement(
  item: { genres?: string[]; tags?: string[]; synopsis?: string; title?: string },
  themeId: string
): boolean {
  if (!themeId || themeId === 'All') return true;

  const genres = (item.genres || []).map(g => g.toLowerCase());
  const tags = (item.tags || []).map(t => t.toLowerCase());
  const text = `${item.title || ''} ${item.synopsis || ''}`.toLowerCase();

  const hasAnyGenreOrTag = (keywords: string[]) => {
    return keywords.some(kw => {
      const lower = kw.toLowerCase();
      return (
        genres.some(g => g.includes(lower)) ||
        tags.some(t => t.includes(lower)) ||
        text.includes(lower)
      );
    });
  };

  switch (themeId) {
    case 'Fluff':
      return hasAnyGenreOrTag([
        'fluff',
        'wholesome',
        'warm & fluffy',
        'pure & wholesome',
        'heartwarming',
        'tender healing',
        'healing',
        'sweet',
        'cute',
        'pancake dates',
        'sincere youth'
      ]);

    case 'Angst':
      return hasAnyGenreOrTag([
        'angst',
        'heartbreak',
        'emotional',
        'melodrama',
        'tears',
        'high emotion',
        'tragic',
        'pain',
        'suffering',
        'mental health',
        'yearning',
        'heart transplant'
      ]);

    case 'Slow Burn':
      return hasAnyGenreOrTag([
        'slow burn',
        'slow-burn',
        'pining',
        'unspoken devotion',
        'gradual',
        'soulmates',
        'fated',
        'lingering',
        'identity exploration',
        'delicate',
        'subtle'
      ]);

    case 'Enemies to Lovers':
      return hasAnyGenreOrTag([
        'enemies to lovers',
        'rivals to lovers',
        'opposites attract',
        'rival',
        'rivalry',
        'architecture vs engineering',
        'next door neighbors',
        'hate to love',
        'competing',
        'twin switch',
        'first place vs second place'
      ]);

    case 'Office Romance':
      return hasAnyGenreOrTag([
        'office',
        'workplace',
        'boss',
        'subordinate',
        'corporate',
        'adult bl',
        'game studio',
        'telepathy',
        'colleague'
      ]);

    case 'Campus & School':
      return hasAnyGenreOrTag([
        'campus',
        'school',
        'college',
        'university',
        'high school',
        'dormitory',
        'roommates',
        'student council',
        'music club',
        'sports science'
      ]);

    case 'Mafia & Action':
      return hasAnyGenreOrTag([
        'mafia',
        'bodyguard',
        'crime',
        'underworld',
        'action',
        'yakuza',
        'gangster',
        'cop and mob boss',
        'thriller',
        'shootout',
        'underworld'
      ]);

    case 'Healing & Comfort':
      return hasAnyGenreOrTag([
        'healing',
        'comfort',
        'food',
        'recovery',
        'tender healing',
        'pancake dates',
        'forest ranger',
        'seaside town',
        'slice of life'
      ]);

    case 'Opposites Attract':
      return hasAnyGenreOrTag([
        'opposites attract',
        'logic vs chaos',
        'sunshine',
        'grumpy',
        'polar opposites',
        'disciplined',
        'reserved chef'
      ]);

    case 'Fake Dating':
      return hasAnyGenreOrTag([
        'fake dating',
        'contract',
        'arranged',
        'arranged engagement',
        'pretend',
        'agreement'
      ]);

    default:
      return true;
  }
}

export interface BLThematicFilterProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
  items?: { genres?: string[]; tags?: string[]; synopsis?: string; title?: string }[];
  title?: string;
  className?: string;
}

export const BLThematicFilter: React.FC<BLThematicFilterProps> = ({
  selectedTheme,
  onSelectTheme,
  items,
  title = 'BL Story Dynamics & Thematic Genres',
  className = ''
}) => {
  const currentThemeObj = BL_THEMATIC_ELEMENTS.find(t => t.id === selectedTheme);

  // Compute item counts for each theme if catalog items are provided
  const themeCounts = React.useMemo(() => {
    if (!items || items.length === 0) return {};
    const map: Record<string, number> = {};
    BL_THEMATIC_ELEMENTS.forEach(t => {
      map[t.id] = items.filter(item => matchesThematicElement(item, t.id)).length;
    });
    return map;
  }, [items]);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Filter Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white text-xs shadow-md">
            ✦
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#F8F5FC] font-display flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#241238] text-[#F09BC5] font-semibold border border-[#F09BC5]/30">
              Thematic BL Tropes
            </span>
          </span>
        </div>

        {selectedTheme !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectTheme('All')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
            title="Reset to all themes"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Theme</span>
          </button>
        )}
      </div>

      {/* Thematic Element Buttons Carousel / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* All Themes Pill */}
        <button
          type="button"
          onClick={() => onSelectTheme('All')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-sm ${
            selectedTheme === 'All'
              ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white border-transparent shadow-[0_0_15px_rgba(240,155,197,0.35)] scale-105'
              : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] hover:border-[#F09BC5]/40'
          }`}
        >
          <span>All Themes</span>
          {items && items.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px] text-white/90">
              {items.length}
            </span>
          )}
        </button>

        {/* Thematic BL Pills */}
        {BL_THEMATIC_ELEMENTS.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const count = themeCounts[theme.id];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(isSelected ? 'All' : theme.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
                isSelected
                  ? `${theme.activeClass} scale-105`
                  : `bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border-[#241238] ${theme.borderClass}`
              }`}
              title={`${theme.name}: ${theme.tagline}`}
            >
              <span>{theme.icon}</span>
              <span>{theme.shortName}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-semibold ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-[#241238] text-[#F09BC5]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Theme Highlight Banner */}
      {currentThemeObj && (
        <div className="p-3 rounded-2xl bg-[#160D20] border border-[#F09BC5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-1.5 rounded-xl bg-[#241238] border border-[#F09BC5]/30">
              {currentThemeObj.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8F5FC]">
                  {currentThemeObj.name}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-purple-950/70 text-[#C4B5FD] border border-purple-500/30 uppercase font-semibold">
                  Active Filter
                </span>
              </div>
              <p className="text-[11px] text-[#B8AFC4]">
                {currentThemeObj.tagline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectTheme('All')}
            className="self-start sm:self-center px-2.5 py-1 rounded-xl bg-[#241238] hover:bg-[#32194d] text-[11px] text-[#F09BC5] hover:text-white transition-colors border border-[#F09BC5]/30 shrink-0 flex items-center gap-1"
          >
            <span>Show All Themes</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
