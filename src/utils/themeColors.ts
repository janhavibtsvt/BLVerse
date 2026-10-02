// Color manipulation and harmony generator utilities for BLVerse Theme Customizer

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export function parseHex(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 159, g: 122, b: 234 }; // fallback
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255)
  };
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(parseHex(hex));
}

// Relative luminance for WCAG contrast calculation
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const a = [r, g, b].map(v => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Returns contrast ratio between 1 and 21
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function getContrastRating(ratio: number): {
  label: 'AAA' | 'AA' | 'AA Large' | 'Poor';
  color: string;
  isGood: boolean;
} {
  if (ratio >= 7.0) {
    return { label: 'AAA', color: '#10B981', isGood: true }; // Emerald green
  }
  if (ratio >= 4.5) {
    return { label: 'AA', color: '#34D399', isGood: true }; // Mint
  }
  if (ratio >= 3.0) {
    return { label: 'AA Large', color: '#F59E0B', isGood: true }; // Amber
  }
  return { label: 'Poor', color: '#EF4444', isGood: false }; // Red
}

// Generate harmonious palettes from a single seed color
export type HarmonyType = 'velvet' | 'romantic' | 'cyber' | 'complementary' | 'analogous' | 'triadic' | 'lightParchment';

export function generateFullPaletteFromSeed(seedHex: string, type: HarmonyType = 'velvet') {
  const baseHsl = hexToHsl(seedHex);
  const h = baseHsl.h;

  if (type === 'lightParchment') {
    return {
      bgBase: hslToHex({ h: (h + 30) % 360, s: 15, l: 97 }),
      bgCard: '#FFFFFF',
      bgSurface: hslToHex({ h: (h + 30) % 360, s: 20, l: 94 }),
      borderColor: hslToHex({ h, s: 25, l: 86 }),
      accentPrimary: hslToHex({ h, s: 75, l: 45 }),
      accentSecondary: hslToHex({ h: (h + 40) % 360, s: 80, l: 50 }),
      accentTertiary: hslToHex({ h: (h + 20) % 360, s: 70, l: 55 }),
      textPrimary: hslToHex({ h, s: 30, l: 12 }),
      textMuted: hslToHex({ h, s: 15, l: 40 }),
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.08)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.05)`
    };
  }

  if (type === 'cyber') {
    return {
      bgBase: '#07080D',
      bgCard: '#0F111A',
      bgSurface: '#161926',
      borderColor: hslToHex({ h, s: 35, l: 20 }),
      accentPrimary: hslToHex({ h, s: 95, l: 55 }),
      accentSecondary: hslToHex({ h: (h + 60) % 360, s: 95, l: 60 }),
      accentTertiary: hslToHex({ h: (h - 40 + 360) % 360, s: 90, l: 50 }),
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.28)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.16)`
    };
  }

  if (type === 'romantic') {
    // Soft blush & rose tinted ambiance
    return {
      bgBase: hslToHex({ h, s: 40, l: 5 }),
      bgCard: hslToHex({ h, s: 35, l: 10 }),
      bgSurface: hslToHex({ h, s: 30, l: 15 }),
      borderColor: hslToHex({ h, s: 35, l: 22 }),
      accentPrimary: hslToHex({ h, s: 85, l: 65 }),
      accentSecondary: hslToHex({ h: (h + 35) % 360, s: 85, l: 72 }),
      accentTertiary: hslToHex({ h: (h + 15) % 360, s: 75, l: 80 }),
      textPrimary: '#FFF5F8',
      textMuted: hslToHex({ h, s: 20, l: 75 }),
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.22)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.14)`
    };
  }

  if (type === 'complementary') {
    const compH = (h + 180) % 360;
    return {
      bgBase: hslToHex({ h, s: 30, l: 4 }),
      bgCard: hslToHex({ h, s: 25, l: 9 }),
      bgSurface: hslToHex({ h, s: 25, l: 14 }),
      borderColor: hslToHex({ h, s: 30, l: 20 }),
      accentPrimary: hslToHex({ h, s: 80, l: 62 }),
      accentSecondary: hslToHex({ h: compH, s: 85, l: 65 }),
      accentTertiary: hslToHex({ h: (h + 30) % 360, s: 75, l: 72 }),
      textPrimary: '#F8F5FC',
      textMuted: hslToHex({ h, s: 15, l: 70 }),
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.22)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.12)`
    };
  }

  if (type === 'analogous') {
    const ana1 = (h + 30) % 360;
    const ana2 = (h - 30 + 360) % 360;
    return {
      bgBase: hslToHex({ h, s: 35, l: 5 }),
      bgCard: hslToHex({ h, s: 30, l: 10 }),
      bgSurface: hslToHex({ h, s: 28, l: 15 }),
      borderColor: hslToHex({ h, s: 30, l: 22 }),
      accentPrimary: hslToHex({ h, s: 80, l: 65 }),
      accentSecondary: hslToHex({ h: ana1, s: 85, l: 68 }),
      accentTertiary: hslToHex({ h: ana2, s: 75, l: 72 }),
      textPrimary: '#FAF7FD',
      textMuted: hslToHex({ h, s: 15, l: 72 }),
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.2)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.12)`
    };
  }

  if (type === 'triadic') {
    const tri1 = (h + 120) % 360;
    const tri2 = (h + 240) % 360;
    return {
      bgBase: hslToHex({ h, s: 30, l: 5 }),
      bgCard: hslToHex({ h, s: 25, l: 10 }),
      bgSurface: hslToHex({ h, s: 25, l: 15 }),
      borderColor: hslToHex({ h, s: 30, l: 22 }),
      accentPrimary: hslToHex({ h, s: 85, l: 64 }),
      accentSecondary: hslToHex({ h: tri1, s: 80, l: 66 }),
      accentTertiary: hslToHex({ h: tri2, s: 75, l: 70 }),
      textPrimary: '#F8F9FA',
      textMuted: hslToHex({ h, s: 15, l: 70 }),
      glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.22)`,
      glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.12)`
    };
  }

  // Default: Velvet Romance
  return {
    bgBase: hslToHex({ h, s: 35, l: 4 }),
    bgCard: hslToHex({ h, s: 30, l: 9 }),
    bgSurface: hslToHex({ h, s: 28, l: 14 }),
    borderColor: hslToHex({ h, s: 32, l: 20 }),
    accentPrimary: hslToHex({ h, s: 78, l: 64 }),
    accentSecondary: hslToHex({ h: (h + 45) % 360, s: 82, l: 70 }),
    accentTertiary: hslToHex({ h: (h + 20) % 360, s: 70, l: 75 }),
    textPrimary: '#F8F5FC',
    textMuted: hslToHex({ h, s: 15, l: 72 }),
    glow1: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.2)`,
    glow2: `rgba(${parseHex(seedHex).r},${parseHex(seedHex).g},${parseHex(seedHex).b},0.12)`
  };
}
