import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { generateFullPaletteFromSeed, HarmonyType } from '../utils/themeColors';

export interface ThemeColors {
  bgBase: string;
  bgCard: string;
  bgSurface: string;
  borderColor: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  textPrimary: string;
  textMuted: string;
  glow1: string;
  glow2: string;
}

export type FontPairing = 'modern' | 'editorial' | 'cyber' | 'classic' | 'poetic' | 'retro';
export type GlowIntensity = 'none' | 'subtle' | 'medium' | 'intense' | 'ultra';
export type CardRadius = 'sharp' | 'subtle' | 'standard' | 'extra';
export type BackgroundPattern = 'nebula' | 'stars' | 'sakura' | 'grid' | 'aurora' | 'minimal';
export type FontScale = 'compact' | 'normal' | 'relaxed';
export type ButtonStyle = 'gradient' | 'solid' | 'glow';

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  category: 'romantic' | 'dark' | 'light' | 'vibrant' | 'cozy';
  isLight?: boolean;
  colors: ThemeColors;
  fontPairing: FontPairing;
  glowIntensity: GlowIntensity;
  cardRadius: CardRadius;
  backgroundPattern: BackgroundPattern;
  fontScale: FontScale;
  buttonStyle: ButtonStyle;
}

export interface CustomSavedTheme {
  id: string;
  name: string;
  tagline?: string;
  emoji: string;
  createdAt: number;
  isLight?: boolean;
  colors: ThemeColors;
  fontPairing: FontPairing;
  glowIntensity: GlowIntensity;
  cardRadius: CardRadius;
  backgroundPattern: BackgroundPattern;
  fontScale: FontScale;
  buttonStyle: ButtonStyle;
}

export interface ThemeConfig {
  id: string;
  name: string;
  emoji?: string;
  isPreset: boolean;
  isCustomSaved?: boolean;
  isLight?: boolean;
  colors: ThemeColors;
  fontPairing: FontPairing;
  glowIntensity: GlowIntensity;
  cardRadius: CardRadius;
  backgroundPattern: BackgroundPattern;
  fontScale: FontScale;
  buttonStyle: ButtonStyle;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight Velvet',
    tagline: 'Classic BL romance in deep nocturnal plum and starlight amethyst',
    emoji: '🌌',
    category: 'romantic',
    colors: {
      bgBase: '#0B0712',
      bgCard: '#160D20',
      bgSurface: '#1B1126',
      borderColor: '#241238',
      accentPrimary: '#9F7AEA',
      accentSecondary: '#F09BC5',
      accentTertiary: '#B794F4',
      textPrimary: '#F8F5FC',
      textMuted: '#B8AFC4',
      glow1: 'rgba(159,122,234,0.22)',
      glow2: 'rgba(240,155,197,0.14)'
    },
    fontPairing: 'modern',
    glowIntensity: 'medium',
    cardRadius: 'standard',
    backgroundPattern: 'nebula',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'sakura',
    name: 'Sakura Petals & Strawberry',
    tagline: 'Warm blushing rose and sweet pink for heartfelt Yuri & fluffy romances',
    emoji: '🌸',
    category: 'romantic',
    colors: {
      bgBase: '#12070D',
      bgCard: '#1F0E17',
      bgSurface: '#2B1321',
      borderColor: '#3D1A2E',
      accentPrimary: '#F43F5E',
      accentSecondary: '#FB7185',
      accentTertiary: '#FDA4AF',
      textPrimary: '#FFF1F2',
      textMuted: '#FECDD3',
      glow1: 'rgba(244,63,94,0.24)',
      glow2: 'rgba(251,113,133,0.16)'
    },
    fontPairing: 'modern',
    glowIntensity: 'intense',
    cardRadius: 'extra',
    backgroundPattern: 'sakura',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'cyber',
    name: 'Cyber Noir & Crimson',
    tagline: 'Sleek mafia underworld aesthetic inspired by KinnPorsche and high-heat thrillers',
    emoji: '🏙️',
    category: 'dark',
    colors: {
      bgBase: '#08080C',
      bgCard: '#111217',
      bgSurface: '#181A22',
      borderColor: '#262936',
      accentPrimary: '#EF4444',
      accentSecondary: '#F97316',
      accentTertiary: '#DC2626',
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
      glow1: 'rgba(239,68,68,0.25)',
      glow2: 'rgba(249,115,22,0.15)'
    },
    fontPairing: 'cyber',
    glowIntensity: 'medium',
    cardRadius: 'sharp',
    backgroundPattern: 'grid',
    fontScale: 'normal',
    buttonStyle: 'solid'
  },
  {
    id: 'jade',
    name: 'Emerald Danmei & Jiangnan Mist',
    tagline: 'Imperial jade, lotus water, and bamboo silk inspired by TGCF & MDZS',
    emoji: '🎋',
    category: 'vibrant',
    colors: {
      bgBase: '#040E0A',
      bgCard: '#0A1B14',
      bgSurface: '#10261D',
      borderColor: '#18382C',
      accentPrimary: '#10B981',
      accentSecondary: '#34D399',
      accentTertiary: '#6EE7B7',
      textPrimary: '#F0FDF4',
      textMuted: '#A7F3D0',
      glow1: 'rgba(16,185,129,0.24)',
      glow2: 'rgba(52,211,153,0.14)'
    },
    fontPairing: 'classic',
    glowIntensity: 'medium',
    cardRadius: 'standard',
    backgroundPattern: 'nebula',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'ocean',
    name: 'Ocean Trench & Sapphire Ice',
    tagline: 'Deep cobalt waters, moonlit tides, and cool melancholic beauty',
    emoji: '🌊',
    category: 'vibrant',
    colors: {
      bgBase: '#040A14',
      bgCard: '#0A1426',
      bgSurface: '#101F38',
      borderColor: '#192E52',
      accentPrimary: '#3B82F6',
      accentSecondary: '#38BDF8',
      accentTertiary: '#60A5FA',
      textPrimary: '#F0F9FF',
      textMuted: '#BAE6FD',
      glow1: 'rgba(59,130,246,0.24)',
      glow2: 'rgba(56,189,248,0.15)'
    },
    fontPairing: 'modern',
    glowIntensity: 'medium',
    cardRadius: 'standard',
    backgroundPattern: 'aurora',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'mocha',
    name: 'Mocha Latte & Roasted Amber',
    tagline: 'Rich warm espresso, cozy autumn blankets, and comforting slow-burn sweetness',
    emoji: '☕',
    category: 'cozy',
    colors: {
      bgBase: '#0F0906',
      bgCard: '#1C120C',
      bgSurface: '#291A12',
      borderColor: '#3D271B',
      accentPrimary: '#F59E0B',
      accentSecondary: '#D97706',
      accentTertiary: '#FCD34D',
      textPrimary: '#FFFBEB',
      textMuted: '#FDE68A',
      glow1: 'rgba(245,158,11,0.2)',
      glow2: 'rgba(217,119,6,0.12)'
    },
    fontPairing: 'editorial',
    glowIntensity: 'subtle',
    cardRadius: 'standard',
    backgroundPattern: 'minimal',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'amethyst',
    name: 'Imperial Amethyst & Neon Orchid',
    tagline: 'Electric ultraviolet royal glamour for intense dramatic passions',
    emoji: '🔮',
    category: 'vibrant',
    colors: {
      bgBase: '#090410',
      bgCard: '#140A22',
      bgSurface: '#1E0E32',
      borderColor: '#2F164D',
      accentPrimary: '#A855F7',
      accentSecondary: '#EC4899',
      accentTertiary: '#C084FC',
      textPrimary: '#FAF5FF',
      textMuted: '#E9D5FF',
      glow1: 'rgba(168,85,247,0.26)',
      glow2: 'rgba(236,72,153,0.16)'
    },
    fontPairing: 'poetic',
    glowIntensity: 'ultra',
    cardRadius: 'extra',
    backgroundPattern: 'stars',
    fontScale: 'normal',
    buttonStyle: 'glow'
  },
  {
    id: 'sunset',
    name: 'Twilight Sunset & Tangerine',
    tagline: 'Golden hour warmth, peach sunsets, and nostalgic summer memories',
    emoji: '🌅',
    category: 'romantic',
    colors: {
      bgBase: '#0F0606',
      bgCard: '#1D0D0C',
      bgSurface: '#2B1412',
      borderColor: '#3E1C1A',
      accentPrimary: '#FB923C',
      accentSecondary: '#F43F5E',
      accentTertiary: '#FDE047',
      textPrimary: '#FFF7ED',
      textMuted: '#FED7AA',
      glow1: 'rgba(251,146,60,0.24)',
      glow2: 'rgba(244,63,94,0.16)'
    },
    fontPairing: 'editorial',
    glowIntensity: 'medium',
    cardRadius: 'standard',
    backgroundPattern: 'aurora',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'gothic',
    name: 'Blood Wine & Obsidian Gothic',
    tagline: 'Nocturnal vampire nobility, dark burgundy wine, and dangerous secrets',
    emoji: '🍷',
    category: 'dark',
    colors: {
      bgBase: '#070305',
      bgCard: '#12070A',
      bgSurface: '#1C0B10',
      borderColor: '#2D101A',
      accentPrimary: '#E11D48',
      accentSecondary: '#BE123C',
      accentTertiary: '#FDA4AF',
      textPrimary: '#FFF1F2',
      textMuted: '#E2B8C3',
      glow1: 'rgba(225,29,72,0.24)',
      glow2: 'rgba(190,18,60,0.16)'
    },
    fontPairing: 'classic',
    glowIntensity: 'medium',
    cardRadius: 'sharp',
    backgroundPattern: 'stars',
    fontScale: 'normal',
    buttonStyle: 'glow'
  },
  {
    id: 'lilac',
    name: 'Dreamy Lilac & Cotton Candy',
    tagline: 'Sweet pastel lavender clouds and sugar-sweet first loves',
    emoji: '🍬',
    category: 'romantic',
    colors: {
      bgBase: '#0E0914',
      bgCard: '#181022',
      bgSurface: '#231830',
      borderColor: '#342347',
      accentPrimary: '#C084FC',
      accentSecondary: '#F472B6',
      accentTertiary: '#E879F9',
      textPrimary: '#FAF5FF',
      textMuted: '#E9D5FF',
      glow1: 'rgba(192,132,252,0.24)',
      glow2: 'rgba(244,114,182,0.16)'
    },
    fontPairing: 'modern',
    glowIntensity: 'intense',
    cardRadius: 'extra',
    backgroundPattern: 'sakura',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'mint',
    name: 'Matcha & Cool Raindrop',
    tagline: 'Calm herbal green tea, gentle raindrops, and peaceful quiet mornings',
    emoji: '🍵',
    category: 'cozy',
    colors: {
      bgBase: '#060B08',
      bgCard: '#0C1610',
      bgSurface: '#122219',
      borderColor: '#1B3125',
      accentPrimary: '#14B8A6',
      accentSecondary: '#84CC16',
      accentTertiary: '#5EEAD4',
      textPrimary: '#F0FDFA',
      textMuted: '#A7F3D0',
      glow1: 'rgba(20,184,166,0.22)',
      glow2: 'rgba(132,204,22,0.14)'
    },
    fontPairing: 'modern',
    glowIntensity: 'subtle',
    cardRadius: 'standard',
    backgroundPattern: 'nebula',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  },
  {
    id: 'daylight',
    name: 'Morning Parchment & Rose Gold',
    tagline: 'Clean, luminous sepia-light mode with high-contrast velvet typography',
    emoji: '☀️',
    category: 'light',
    isLight: true,
    colors: {
      bgBase: '#FAF7F5',
      bgCard: '#FFFFFF',
      bgSurface: '#F3EDE7',
      borderColor: '#E2D5CC',
      accentPrimary: '#9333EA',
      accentSecondary: '#BE185D',
      accentTertiary: '#7E22CE',
      textPrimary: '#1E1423',
      textMuted: '#6B5B6E',
      glow1: 'rgba(147,51,234,0.08)',
      glow2: 'rgba(190,24,93,0.05)'
    },
    fontPairing: 'editorial',
    glowIntensity: 'subtle',
    cardRadius: 'standard',
    backgroundPattern: 'minimal',
    fontScale: 'normal',
    buttonStyle: 'gradient'
  }
];

const DEFAULT_THEME = THEME_PRESETS[0];
const STORAGE_KEY = 'blverse_custom_theme_v3';
const SAVED_THEMES_KEY = 'blverse_saved_custom_themes_v3';

interface ThemeContextType {
  theme: ThemeConfig;
  activePresetId: string;
  savedThemes: CustomSavedTheme[];
  isCustomizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  setPreset: (presetId: string) => void;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  applyPalette: (colors: Partial<ThemeColors>) => void;
  generateFromSeed: (seedHex: string, harmonyType?: HarmonyType) => void;
  setFontPairing: (fontPairing: FontPairing) => void;
  setGlowIntensity: (glowIntensity: GlowIntensity) => void;
  setCardRadius: (cardRadius: CardRadius) => void;
  setBackgroundPattern: (backgroundPattern: BackgroundPattern) => void;
  setFontScale: (fontScale: FontScale) => void;
  setButtonStyle: (buttonStyle: ButtonStyle) => void;
  saveCurrentThemeAsCustom: (name: string, emoji?: string, tagline?: string) => CustomSavedTheme;
  deleteSavedTheme: (id: string) => void;
  loadSavedTheme: (id: string) => void;
  duplicateCurrentTheme: () => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (jsonStr: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved themes in localStorage
  const [savedThemes, setSavedThemes] = useState<CustomSavedTheme[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_THEMES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved themes:', e);
    }
    return [];
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.colors && parsed.colors.bgBase) {
          return {
            ...parsed,
            backgroundPattern: parsed.backgroundPattern || 'nebula',
            fontScale: parsed.fontScale || 'normal',
            buttonStyle: parsed.buttonStyle || 'gradient'
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse saved theme:', e);
    }
    return {
      id: DEFAULT_THEME.id,
      name: DEFAULT_THEME.name,
      emoji: DEFAULT_THEME.emoji,
      isPreset: true,
      isLight: DEFAULT_THEME.isLight,
      colors: { ...DEFAULT_THEME.colors },
      fontPairing: DEFAULT_THEME.fontPairing,
      glowIntensity: DEFAULT_THEME.glowIntensity,
      cardRadius: DEFAULT_THEME.cardRadius,
      backgroundPattern: DEFAULT_THEME.backgroundPattern,
      fontScale: DEFAULT_THEME.fontScale,
      buttonStyle: DEFAULT_THEME.buttonStyle
    };
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch (e) {
      console.error('Failed to persist theme:', e);
    }
  }, [theme]);

  // Sync saved custom themes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(savedThemes));
    } catch (e) {
      console.error('Failed to persist saved themes list:', e);
    }
  }, [savedThemes]);

  // Inject dynamic CSS rules into DOM document
  useEffect(() => {
    let styleEl = document.getElementById('blverse-dynamic-theme') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'blverse-dynamic-theme';
      document.head.appendChild(styleEl);
    }

    const { colors, fontPairing, glowIntensity, cardRadius, fontScale, buttonStyle, isLight } = theme;

    let fontDisplay = "'Outfit', sans-serif";
    let fontSans = "'Plus Jakarta Sans', sans-serif";

    if (fontPairing === 'editorial') {
      fontDisplay = "'Playfair Display', serif";
      fontSans = "'Plus Jakarta Sans', sans-serif";
    } else if (fontPairing === 'cyber') {
      fontDisplay = "'Space Grotesk', sans-serif";
      fontSans = "'Plus Jakarta Sans', sans-serif";
    } else if (fontPairing === 'classic') {
      fontDisplay = "'Cinzel', serif";
      fontSans = "'Plus Jakarta Sans', sans-serif";
    } else if (fontPairing === 'poetic') {
      fontDisplay = "'Playfair Display', italic, serif";
      fontSans = "'Plus Jakarta Sans', sans-serif";
    } else if (fontPairing === 'retro') {
      fontDisplay = "'Cinzel', serif";
      fontSans = "'Space Grotesk', sans-serif";
    }

    let radiusStyle = '1rem'; // 16px standard
    if (cardRadius === 'sharp') radiusStyle = '0.375rem'; // 6px
    else if (cardRadius === 'subtle') radiusStyle = '0.75rem'; // 12px
    else if (cardRadius === 'extra') radiusStyle = '1.75rem'; // 28px

    let glowOpacity = 1;
    if (glowIntensity === 'none') glowOpacity = 0;
    else if (glowIntensity === 'subtle') glowOpacity = 0.5;
    else if (glowIntensity === 'intense') glowOpacity = 1.35;
    else if (glowIntensity === 'ultra') glowOpacity = 1.75;

    let scalePercent = '100%';
    if (fontScale === 'compact') scalePercent = '92%';
    else if (fontScale === 'relaxed') scalePercent = '108%';

    const cssContent = `
      :root {
        --bg-base: ${colors.bgBase};
        --bg-card: ${colors.bgCard};
        --bg-surface: ${colors.bgSurface};
        --border-color: ${colors.borderColor};
        --accent-primary: ${colors.accentPrimary};
        --accent-secondary: ${colors.accentSecondary};
        --accent-tertiary: ${colors.accentTertiary};
        --text-primary: ${colors.textPrimary};
        --text-muted: ${colors.textMuted};
        --font-display: ${fontDisplay};
        --font-sans: ${fontSans};
        --card-radius: ${radiusStyle};
        --font-scale: ${scalePercent};
        --glow-1: ${colors.glow1};
        --glow-2: ${colors.glow2};
        --glow-opacity: ${glowOpacity};
        
        /* Map custom Tailwind palette variables */
        --color-midnight: ${colors.bgBase};
        --color-plum: ${colors.bgCard};
        --color-violet-deep: ${colors.borderColor};
        --color-lavender: ${colors.accentTertiary};
        --color-purple-soft: ${colors.accentPrimary};
        --color-pink-romantic: ${colors.accentSecondary};
        --color-rose: ${colors.accentSecondary};
        --color-moon: ${colors.textPrimary};
        --color-lavender-muted: ${colors.textMuted};
        --color-charcoal: ${colors.bgSurface};
      }

      html {
        font-size: ${scalePercent};
      }

      body {
        background-color: var(--bg-base) !important;
        color: var(--text-primary) !important;
        font-family: var(--font-sans) !important;
      }

      h1, h2, h3, h4, h5, h6, .font-display {
        font-family: var(--font-display) !important;
      }

      /* Base App Container Backgrounds */
      [class*="bg-[#0B0712]"], [class*="bg-[#0b0c10]"], .theme-bg-base {
        background-color: var(--bg-base) !important;
      }

      /* Card Backgrounds */
      [class*="bg-[#160D20]"], .theme-bg-card {
        background-color: var(--bg-card) !important;
      }

      /* Surface / Input / Inset Backgrounds */
      [class*="bg-[#1B1126]"], [class*="bg-[#17131C]"], .theme-bg-surface {
        background-color: var(--bg-surface) !important;
      }

      /* Border Colors */
      [class*="border-[#241238]"], .theme-border {
        border-color: var(--border-color) !important;
      }
      [class*="border-[#381E57]"] {
        border-color: var(--accent-primary) !important;
        opacity: 0.45;
      }

      /* Text Colors */
      [class*="text-[#F8F5FC]"], [class*="text-[#e2e4ea]"], .theme-text-primary {
        color: var(--text-primary) !important;
      }
      [class*="text-[#B8AFC4]"], [class*="text-[#B8AFC4]/"], .theme-text-muted {
        color: var(--text-muted) !important;
      }
      [class*="text-[#F09BC5]"], .theme-text-secondary {
        color: var(--accent-secondary) !important;
      }
      [class*="text-[#9F7AEA]"], .theme-text-primary-accent {
        color: var(--accent-primary) !important;
      }
      [class*="text-[#B794F4]"], .theme-text-tertiary {
        color: var(--accent-tertiary) !important;
      }

      /* Gradients & Buttons */
      [class*="from-[#9F7AEA]"][class*="to-[#F09BC5]"] {
        background-image: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important;
      }
      [class*="from-[#7C3AED]"][class*="to-[#9F7AEA]"] {
        background-image: linear-gradient(135deg, var(--accent-tertiary) 0%, var(--accent-primary) 100%) !important;
      }
      [class*="from-[#DB2777]"][class*="to-[#F09BC5]"] {
        background-image: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-tertiary) 100%) !important;
      }

      /* Glow Effects */
      .bl-glow-card {
        border-radius: var(--card-radius) !important;
      }
      .bl-glow-card:hover {
        box-shadow: 0 14px 44px 0 ${colors.glow1}, 0 0 20px 0 ${colors.glow2} !important;
      }

      .bl-signature-btn {
        ${buttonStyle === 'solid' 
          ? `background: var(--accent-primary) !important;` 
          : buttonStyle === 'glow'
          ? `background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important; box-shadow: 0 0 25px ${colors.glow1} !important;`
          : `background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important;`
        }
        color: ${isLight ? '#FFFFFF' : '#0B0712'} !important;
      }

      .bl-gradient-text {
        background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-tertiary) 45%, var(--accent-secondary) 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }

      .bl-gradient-badge {
        background: linear-gradient(135deg, ${colors.glow1} 0%, ${colors.glow2} 100%) !important;
        border: 1px solid var(--accent-secondary) !important;
        color: var(--text-primary) !important;
      }

      /* Scrollbars */
      ::-webkit-scrollbar-track {
        background: var(--bg-base) !important;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--border-color) !important;
        border: 1px solid var(--accent-primary) !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--accent-primary) !important;
      }
    `;

    styleEl.innerHTML = cssContent;
  }, [theme]);

  const activePresetId = theme.isPreset ? theme.id : theme.isCustomSaved ? `custom-${theme.id}` : 'custom';

  const setPreset = useCallback((presetId: string) => {
    const found = THEME_PRESETS.find(p => p.id === presetId);
    if (!found) return;

    setTheme({
      id: found.id,
      name: found.name,
      emoji: found.emoji,
      isPreset: true,
      isCustomSaved: false,
      isLight: found.isLight,
      colors: { ...found.colors },
      fontPairing: found.fontPairing,
      glowIntensity: found.glowIntensity,
      cardRadius: found.cardRadius,
      backgroundPattern: found.backgroundPattern,
      fontScale: found.fontScale,
      buttonStyle: found.buttonStyle
    });
  }, []);

  const updateColor = useCallback((key: keyof ThemeColors, value: string) => {
    setTheme(prev => ({
      ...prev,
      id: 'custom',
      name: prev.name.includes('(Edited)') ? prev.name : `${prev.name} (Edited)`,
      isPreset: false,
      isCustomSaved: false,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  }, []);

  const applyPalette = useCallback((newColors: Partial<ThemeColors>) => {
    setTheme(prev => ({
      ...prev,
      id: 'custom',
      name: 'Custom Palette',
      isPreset: false,
      isCustomSaved: false,
      colors: {
        ...prev.colors,
        ...newColors
      }
    }));
  }, []);

  const generateFromSeed = useCallback((seedHex: string, harmonyType: HarmonyType = 'velvet') => {
    const generated = generateFullPaletteFromSeed(seedHex, harmonyType);
    setTheme(prev => ({
      ...prev,
      id: 'custom',
      name: `${harmonyType.charAt(0).toUpperCase() + harmonyType.slice(1)} Palette`,
      isPreset: false,
      isCustomSaved: false,
      isLight: harmonyType === 'lightParchment',
      colors: generated
    }));
  }, []);

  const setFontPairing = useCallback((fontPairing: FontPairing) => {
    setTheme(prev => ({ ...prev, fontPairing, isPreset: false }));
  }, []);

  const setGlowIntensity = useCallback((glowIntensity: GlowIntensity) => {
    setTheme(prev => ({ ...prev, glowIntensity, isPreset: false }));
  }, []);

  const setCardRadius = useCallback((cardRadius: CardRadius) => {
    setTheme(prev => ({ ...prev, cardRadius, isPreset: false }));
  }, []);

  const setBackgroundPattern = useCallback((backgroundPattern: BackgroundPattern) => {
    setTheme(prev => ({ ...prev, backgroundPattern, isPreset: false }));
  }, []);

  const setFontScale = useCallback((fontScale: FontScale) => {
    setTheme(prev => ({ ...prev, fontScale, isPreset: false }));
  }, []);

  const setButtonStyle = useCallback((buttonStyle: ButtonStyle) => {
    setTheme(prev => ({ ...prev, buttonStyle, isPreset: false }));
  }, []);

  const saveCurrentThemeAsCustom = useCallback((name: string, emoji = '✨', tagline = 'Custom fandom palette') => {
    const newCustom: CustomSavedTheme = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'My Custom Aesthetic',
      tagline,
      emoji: emoji || '✨',
      createdAt: Date.now(),
      isLight: theme.isLight,
      colors: { ...theme.colors },
      fontPairing: theme.fontPairing,
      glowIntensity: theme.glowIntensity,
      cardRadius: theme.cardRadius,
      backgroundPattern: theme.backgroundPattern,
      fontScale: theme.fontScale,
      buttonStyle: theme.buttonStyle
    };

    setSavedThemes(prev => [newCustom, ...prev.filter(t => t.name !== newCustom.name)]);
    setTheme({
      ...newCustom,
      isPreset: false,
      isCustomSaved: true
    });

    return newCustom;
  }, [theme]);

  const deleteSavedTheme = useCallback((id: string) => {
    setSavedThemes(prev => prev.filter(t => t.id !== id));
    // If deleting the active theme, fallback to default
    if (theme.id === id) {
      setPreset(DEFAULT_THEME.id);
    }
  }, [theme.id, setPreset]);

  const loadSavedTheme = useCallback((id: string) => {
    const found = savedThemes.find(t => t.id === id);
    if (!found) return;

    setTheme({
      ...found,
      isPreset: false,
      isCustomSaved: true
    });
  }, [savedThemes]);

  const duplicateCurrentTheme = useCallback(() => {
    const copyName = `${theme.name} (Copy)`;
    saveCurrentThemeAsCustom(copyName, theme.emoji || '✨', theme.name);
  }, [theme, saveCurrentThemeAsCustom]);

  const resetTheme = useCallback(() => {
    setPreset(DEFAULT_THEME.id);
  }, [setPreset]);

  const exportTheme = useCallback(() => {
    return JSON.stringify(theme, null, 2);
  }, [theme]);

  const importTheme = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.colors && parsed.colors.bgBase && parsed.colors.accentPrimary) {
        setTheme({
          id: parsed.id || `custom-${Date.now()}`,
          name: parsed.name || 'Imported Aesthetic',
          emoji: parsed.emoji || '🎨',
          isPreset: false,
          isCustomSaved: true,
          isLight: Boolean(parsed.isLight),
          colors: {
            bgBase: parsed.colors.bgBase,
            bgCard: parsed.colors.bgCard || '#160D20',
            bgSurface: parsed.colors.bgSurface || '#1B1126',
            borderColor: parsed.colors.borderColor || '#241238',
            accentPrimary: parsed.colors.accentPrimary,
            accentSecondary: parsed.colors.accentSecondary || '#F09BC5',
            accentTertiary: parsed.colors.accentTertiary || '#B794F4',
            textPrimary: parsed.colors.textPrimary || '#F8F5FC',
            textMuted: parsed.colors.textMuted || '#B8AFC4',
            glow1: parsed.colors.glow1 || 'rgba(159,122,234,0.2)',
            glow2: parsed.colors.glow2 || 'rgba(240,155,197,0.12)'
          },
          fontPairing: parsed.fontPairing || 'modern',
          glowIntensity: parsed.glowIntensity || 'medium',
          cardRadius: parsed.cardRadius || 'standard',
          backgroundPattern: parsed.backgroundPattern || 'nebula',
          fontScale: parsed.fontScale || 'normal',
          buttonStyle: parsed.buttonStyle || 'gradient'
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid theme JSON:', e);
    }
    return false;
  }, []);

  const openCustomizer = useCallback(() => setIsCustomizerOpen(true), []);
  const closeCustomizer = useCallback(() => setIsCustomizerOpen(false), []);
  const toggleCustomizer = useCallback(() => setIsCustomizerOpen(v => !v), []);

  const value = useMemo(
    () => ({
      theme,
      activePresetId,
      savedThemes,
      isCustomizerOpen,
      openCustomizer,
      closeCustomizer,
      toggleCustomizer,
      setPreset,
      updateColor,
      applyPalette,
      generateFromSeed,
      setFontPairing,
      setGlowIntensity,
      setCardRadius,
      setBackgroundPattern,
      setFontScale,
      setButtonStyle,
      saveCurrentThemeAsCustom,
      deleteSavedTheme,
      loadSavedTheme,
      duplicateCurrentTheme,
      resetTheme,
      exportTheme,
      importTheme
    }),
    [
      theme,
      activePresetId,
      savedThemes,
      isCustomizerOpen,
      openCustomizer,
      closeCustomizer,
      toggleCustomizer,
      setPreset,
      updateColor,
      applyPalette,
      generateFromSeed,
      setFontPairing,
      setGlowIntensity,
      setCardRadius,
      setBackgroundPattern,
      setFontScale,
      setButtonStyle,
      saveCurrentThemeAsCustom,
      deleteSavedTheme,
      loadSavedTheme,
      duplicateCurrentTheme,
      resetTheme,
      exportTheme,
      importTheme
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
