import React, { useState } from 'react';
import {
  Palette,
  X,
  RotateCcw,
  Check,
  Sparkles,
  Sliders,
  Type,
  Copy,
  Download,
  Upload,
  Heart,
  Eye,
  BookOpen,
  Plus,
  Trash2,
  Bookmark,
  Share2,
  Wand2,
  Layers,
  Sun,
  Moon,
  Compass,
  AlertCircle
} from 'lucide-react';
import {
  useTheme,
  THEME_PRESETS,
  FontPairing,
  GlowIntensity,
  CardRadius,
  BackgroundPattern,
  FontScale,
  ButtonStyle,
  ThemeColors
} from '../context/ThemeContext';
import {
  getContrastRatio,
  getContrastRating,
  HarmonyType
} from '../utils/themeColors';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    theme,
    activePresetId,
    savedThemes,
    isCustomizerOpen,
    closeCustomizer,
    setPreset,
    updateColor,
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
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'saved' | 'colors' | 'ambiance' | 'share'>('presets');
  const [presetCategory, setPresetCategory] = useState<'all' | 'romantic' | 'dark' | 'light' | 'vibrant' | 'cozy'>('all');
  
  // Color Generator seed state
  const [seedColor, setSeedColor] = useState('#9F7AEA');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('velvet');

  // Save Modal state
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeEmoji, setCustomThemeEmoji] = useState('✨');
  const [customThemeTagline, setCustomThemeTagline] = useState('');

  // Import / Export state
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!isCustomizerOpen) return null;

  // WCAG Contrast calculations
  const textOnCardContrast = getContrastRatio(theme.colors.textPrimary, theme.colors.bgCard);
  const cardRating = getContrastRating(textOnCardContrast);

  const textOnBaseContrast = getContrastRatio(theme.colors.textPrimary, theme.colors.bgBase);
  const baseRating = getContrastRating(textOnBaseContrast);

  const handleCopy = () => {
    const json = exportTheme();
    navigator.clipboard.writeText(json);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownload = () => {
    const json = exportTheme();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blverse-theme-${theme.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const ok = importTheme(text);
        if (ok) {
          setImportError(null);
          setActiveTab('saved');
        } else {
          setImportError('Invalid theme JSON format in uploaded file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setImportError(null);
    if (!importJsonText.trim()) return;
    const ok = importTheme(importJsonText.trim());
    if (ok) {
      setImportJsonText('');
      setActiveTab('saved');
    } else {
      setImportError('Invalid theme configuration JSON format.');
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customThemeName.trim()) return;
    saveCurrentThemeAsCustom(customThemeName, customThemeEmoji, customThemeTagline);
    setIsSavingCustom(false);
    setActiveTab('saved');
  };

  const COLOR_CONTROLS: { key: keyof ThemeColors; label: string; desc: string }[] = [
    { key: 'accentPrimary', label: 'Primary Accent', desc: 'Main buttons, active indicators, and hero highlights' },
    { key: 'accentSecondary', label: 'Secondary Accent', desc: 'Gradient endpoints, romance tags, and badges' },
    { key: 'accentTertiary', label: 'Tertiary Accent', desc: 'Glowing badges, subheadings, and secondary links' },
    { key: 'bgBase', label: 'Base Canvas Background', desc: 'Main screen background under all pages' },
    { key: 'bgCard', label: 'Card Container Surface', desc: 'Series cards, modal bodies, and content sections' },
    { key: 'bgSurface', label: 'Inset / Input Surface', desc: 'Search inputs, pill bars, and filter strips' },
    { key: 'borderColor', label: 'Border & Divider Lines', desc: 'Outlines, grid card borders, and dividers' },
    { key: 'textPrimary', label: 'Primary Text', desc: 'Titles, major headings, and primary content' },
    { key: 'textMuted', label: 'Muted Text', desc: 'Dates, descriptions, metadata, and subtitles' },
    { key: 'glow1', label: 'Atmospheric Glow 1', desc: 'Primary atmospheric background haze and hover glow' },
    { key: 'glow2', label: 'Atmospheric Glow 2', desc: 'Secondary soft ambient cloud and button backglow' }
  ];

  const EMOJI_OPTIONS = ['✨', '🌌', '🌸', '🏙️', '🎋', '🌊', '☕', '🔮', '☀️', '🌅', '🍷', '🍬', '🍵', '🦋', '🍓', '💎', '🌙', '🔥'];

  const filteredPresets = THEME_PRESETS.filter(p => presetCategory === 'all' || p.category === presetCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#160D20] border border-[#241238] rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#241238] flex items-center justify-between gap-4 shrink-0 bg-[#160D20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white shadow-md shadow-[#9F7AEA]/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#F8F5FC] font-display flex items-center gap-1.5">
                  <span>Theme Studio & Aesthetic Customizer</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30 flex items-center gap-1">
                  <span>{theme.emoji || '✨'}</span>
                  <span>{theme.name}</span>
                </span>
              </div>
              <p className="text-xs text-[#B8AFC4] hidden sm:block">
                Choose curated aesthetics, craft your custom colors, or generate harmonious palettes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCustomThemeName(theme.isPreset ? `${theme.name} Custom` : theme.name);
                setCustomThemeEmoji(theme.emoji || '✨');
                setCustomThemeTagline('My customized fandom aesthetic');
                setIsSavingCustom(true);
              }}
              title="Save current styling as a custom theme"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-[#0B0712] text-xs font-bold shadow-md hover:opacity-95 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save As New Theme</span>
            </button>

            <button
              onClick={resetTheme}
              title="Reset to default Midnight theme"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1B1126] border border-[#241238] hover:border-[#F09BC5]/40 text-[#B8AFC4] hover:text-[#F8F5FC] text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={closeCustomizer}
              className="p-2 rounded-xl bg-[#1B1126] hover:bg-[#241238] text-[#B8AFC4] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#241238] px-3 sm:px-6 gap-2 bg-[#1B1126]/70 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'presets'
                ? 'border-[#F09BC5] text-[#F8F5FC]'
                : 'border-transparent text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F09BC5]" />
            <span>Preset Aesthetics ({THEME_PRESETS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'saved'
                ? 'border-[#F09BC5] text-[#F8F5FC]'
                : 'border-transparent text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#F43F5E]" />
            <span>My Custom Themes ({savedThemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'colors'
                ? 'border-[#F09BC5] text-[#F8F5FC]'
                : 'border-transparent text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#9F7AEA]" />
            <span>Color Studio & Harmonies</span>
          </button>

          <button
            onClick={() => setActiveTab('ambiance')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ambiance'
                ? 'border-[#F09BC5] text-[#F8F5FC]'
                : 'border-transparent text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Atmosphere & Typography</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'share'
                ? 'border-[#F09BC5] text-[#F8F5FC]'
                : 'border-transparent text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Import & Export</span>
          </button>
        </div>

        {/* Save Custom Theme Popover Modal */}
        {isSavingCustom && (
          <div className="p-4 sm:p-5 bg-[#1B1126] border-b border-[#241238] animate-in slide-in-from-top-4 duration-200">
            <form onSubmit={handleSaveSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F8F5FC] flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#F09BC5]" />
                  <span>Save Current Theme to My Custom Themes</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSavingCustom(false)}
                  className="text-xs text-[#B8AFC4] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#B8AFC4] block">Choose an Icon / Emoji</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCustomThemeEmoji(em)}
                      className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center transition-all ${
                        customThemeEmoji === em
                          ? 'bg-[#F09BC5] text-black scale-110 shadow-md font-bold'
                          : 'bg-[#160D20] hover:bg-[#241238] text-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#B8AFC4] block mb-1">Theme Name</label>
                  <input
                    type="text"
                    required
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    placeholder="e.g. My Vampire Night"
                    className="w-full bg-[#160D20] text-xs text-[#F8F5FC] px-3 py-2 rounded-xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#B8AFC4] block mb-1">Tagline (Optional)</label>
                  <input
                    type="text"
                    value={customThemeTagline}
                    onChange={(e) => setCustomThemeTagline(e.target.value)}
                    placeholder="e.g. Moody crimson & gold highlights"
                    className="w-full bg-[#160D20] text-xs text-[#F8F5FC] px-3 py-2 rounded-xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSavingCustom(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#B8AFC4] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black text-xs font-bold shadow-md hover:opacity-90"
                >
                  Save to My Themes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRESET PALETTES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1B1126] border border-[#241238] rounded-xl">
                  {[
                    { id: 'all', label: 'All Presets' },
                    { id: 'romantic', label: 'Romantic BL & Yuri' },
                    { id: 'dark', label: 'Nocturnal & Mafia' },
                    { id: 'vibrant', label: 'Imperial & Dynamic' },
                    { id: 'cozy', label: 'Cozy & Autumn' },
                    { id: 'light', label: 'Light Mode' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPresetCategory(cat.id as any)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        presetCategory === cat.id
                          ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-[#0B0712] shadow-sm'
                          : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-[#F09BC5] font-mono">
                  ✦ Click any preset for live instant transformation
                </span>
              </div>

              {/* Grid of Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredPresets.map((preset) => {
                  const isSelected = activePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between group hover:scale-[1.01] ${
                        isSelected
                          ? 'border-[#F09BC5] ring-2 ring-[#F09BC5]/30 bg-[#1B1126] shadow-xl'
                          : 'border-[#241238] hover:border-[#9F7AEA]/50 bg-[#160D20]'
                      }`}
                    >
                      <div>
                        {/* Header with Emoji & Checkmark */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{preset.emoji}</span>
                          <div className="flex items-center gap-1">
                            {preset.isLight && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF7F5] text-[#1E1423]">
                                Light
                              </span>
                            )}
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#F09BC5] text-black flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-[#F8F5FC] mb-1 group-hover:text-[#F09BC5] transition-colors">
                          {preset.name}
                        </h3>
                        <p className="text-[11px] text-[#B8AFC4] leading-relaxed line-clamp-2 mb-3">
                          {preset.tagline}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#241238]">
                        {/* Color Swatch Strip */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.colors.bgBase }}
                            title={`Base: ${preset.colors.bgBase}`}
                          />
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.colors.bgCard }}
                            title={`Card: ${preset.colors.bgCard}`}
                          />
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.colors.accentPrimary }}
                            title={`Primary Accent: ${preset.colors.accentPrimary}`}
                          />
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.colors.accentSecondary }}
                            title={`Secondary Accent: ${preset.colors.accentSecondary}`}
                          />
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.colors.accentTertiary }}
                            title={`Tertiary Accent: ${preset.colors.accentTertiary}`}
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setPreset(preset.id)}
                            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black shadow-sm'
                                : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#241238]'
                            }`}
                          >
                            {isSelected ? 'Applied Active' : 'Apply Theme'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPreset(preset.id);
                              setActiveTab('colors');
                            }}
                            title="Customize this preset"
                            className="p-1.5 rounded-xl bg-[#1B1126] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238]"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MY SAVED THEMES */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#B8AFC4]">
                  Themes you have created, saved, or imported into your personal collection:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomThemeName(`My Custom Palette ${savedThemes.length + 1}`);
                    setCustomThemeEmoji('✨');
                    setCustomThemeTagline('Personal fandom palette');
                    setIsSavingCustom(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black font-bold shadow-md hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Save Current</span>
                </button>
              </div>

              {savedThemes.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#1B1126] border border-[#241238] text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#241238] flex items-center justify-center text-[#F09BC5] mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#F8F5FC]">No Custom Themes Saved Yet</h3>
                  <p className="text-xs text-[#B8AFC4] max-w-md mx-auto">
                    You can customize any preset in the <strong>Color Studio</strong> tab or tweak colors and click "Save As New Theme" to save your bespoke look here!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomThemeName('My First Custom Theme');
                      setCustomThemeEmoji('✨');
                      setCustomThemeTagline('A custom blend of my favorite BL colors');
                      setIsSavingCustom(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black text-xs font-bold shadow-md hover:opacity-90"
                  >
                    Save Current Look As Theme
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {savedThemes.map((saved) => {
                    const isSelected = theme.id === saved.id;
                    return (
                      <div
                        key={saved.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#F09BC5] ring-2 ring-[#F09BC5]/30 bg-[#1B1126]'
                            : 'border-[#241238] bg-[#160D20] hover:border-[#9F7AEA]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{saved.emoji || '✨'}</span>
                            <div className="flex items-center gap-1.5">
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F09BC5] text-black">
                                  Active
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteSavedTheme(saved.id)}
                                title="Delete this custom theme"
                                className="p-1 rounded-lg text-[#B8AFC4] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-[#F8F5FC]">{saved.name}</h3>
                          {saved.tagline && (
                            <p className="text-[11px] text-[#B8AFC4] mt-0.5 line-clamp-1">{saved.tagline}</p>
                          )}
                          <p className="text-[10px] text-[#B8AFC4]/60 font-mono mt-1">
                            Created {new Date(saved.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#241238] space-y-2.5">
                          {/* Swatches */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-5 h-5 rounded-md border border-white/20"
                              style={{ backgroundColor: saved.colors.bgBase }}
                              title="Base"
                            />
                            <span
                              className="w-5 h-5 rounded-md border border-white/20"
                              style={{ backgroundColor: saved.colors.bgCard }}
                              title="Card"
                            />
                            <span
                              className="w-5 h-5 rounded-md border border-white/20"
                              style={{ backgroundColor: saved.colors.accentPrimary }}
                              title="Primary Accent"
                            />
                            <span
                              className="w-5 h-5 rounded-md border border-white/20"
                              style={{ backgroundColor: saved.colors.accentSecondary }}
                              title="Secondary Accent"
                            />
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => loadSavedTheme(saved.id)}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40'
                                  : 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black shadow-md hover:opacity-90'
                              }`}
                            >
                              {isSelected ? 'Currently Applied' : 'Apply Theme'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                loadSavedTheme(saved.id);
                                setActiveTab('colors');
                              }}
                              title="Edit colors of this theme"
                              className="p-1.5 rounded-xl bg-[#1B1126] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238]"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COLOR STUDIO & HARMONIES */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Harmony Generator Tool */}
              <div className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#F09BC5]" />
                    <h3 className="text-xs font-bold text-[#F8F5FC] uppercase tracking-wider">
                      Automatic Color Harmony Generator
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#B8AFC4]">
                    Pick 1 seed color and generate an entire coordinated aesthetic
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#160D20] px-3 py-1.5 rounded-xl border border-[#241238]">
                    <span className="text-xs text-[#B8AFC4] font-medium">Seed Color:</span>
                    <input
                      type="color"
                      value={seedColor}
                      onChange={(e) => setSeedColor(e.target.value)}
                      className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={seedColor}
                      onChange={(e) => setSeedColor(e.target.value)}
                      className="w-20 bg-transparent text-xs font-mono text-[#F8F5FC] focus:outline-none"
                    />
                  </div>

                  {/* Harmony Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'velvet' as HarmonyType, label: 'Velvet Nocturnal' },
                      { id: 'romantic' as HarmonyType, label: 'Blushing Rose' },
                      { id: 'cyber' as HarmonyType, label: 'Cyberpunk Neon' },
                      { id: 'complementary' as HarmonyType, label: 'Complementary Contrast' },
                      { id: 'analogous' as HarmonyType, label: 'Analogous Soft' },
                      { id: 'triadic' as HarmonyType, label: 'Triadic Dynamic' },
                      { id: 'lightParchment' as HarmonyType, label: 'Light Sepia' }
                    ].map((harm) => (
                      <button
                        key={harm.id}
                        type="button"
                        onClick={() => {
                          setSelectedHarmony(harm.id);
                          generateFromSeed(seedColor, harm.id);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                          selectedHarmony === harm.id
                            ? 'bg-[#241238] border-[#F09BC5] text-[#F09BC5]'
                            : 'bg-[#160D20] border-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC]'
                        }`}
                      >
                        {harm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contrast Meter */}
              <div className="p-3.5 rounded-2xl bg-[#160D20] border border-[#241238] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#F8F5FC]">WCAG Legibility Meter:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#B8AFC4]">Text on Card:</span>
                    <span className="font-mono font-bold" style={{ color: cardRating.color }}>
                      {textOnCardContrast}:1 ({cardRating.label})
                    </span>
                  </div>
                  <span className="text-neutral-600">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#B8AFC4]">Text on Canvas:</span>
                    <span className="font-mono font-bold" style={{ color: baseRating.color }}>
                      {textOnBaseContrast}:1 ({baseRating.label})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateColor('textPrimary', '#FFFFFF');
                      updateColor('textMuted', '#D1D5DB');
                    }}
                    className="text-[11px] text-[#F09BC5] hover:underline"
                  >
                    Auto-fix for Maximum Contrast
                  </button>
                </div>
              </div>

              {/* Individual Color Channel Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {COLOR_CONTROLS.map(({ key, label, desc }) => {
                  const currentValue = theme.colors[key];
                  const isRgba = currentValue.startsWith('rgba');
                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-2 hover:border-[#9F7AEA]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F8F5FC]">{label}</span>
                        <div className="flex items-center gap-2">
                          {!isRgba ? (
                            <input
                              type="color"
                              value={currentValue.startsWith('#') ? currentValue : '#9F7AEA'}
                              onChange={(e) => updateColor(key, e.target.value)}
                              className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                            />
                          ) : (
                            <span className="text-[10px] text-[#F09BC5] font-mono">Alpha / Glow</span>
                          )}
                        </div>
                      </div>

                      <p className="text-[10px] text-[#B8AFC4] leading-tight line-clamp-1">{desc}</p>

                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: currentValue }}
                        />
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => updateColor(key, e.target.value)}
                          className="w-full bg-[#160D20] text-xs font-mono text-[#F8F5FC] px-2.5 py-1 rounded-lg border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ATMOSPHERE & TYPOGRAPHY */}
          {activeTab === 'ambiance' && (
            <div className="space-y-6">
              {/* Background Atmosphere Pattern */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Atmospheric Background Pattern & Sky</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {[
                    { id: 'nebula' as BackgroundPattern, label: 'Romantic Nebula', icon: '🌌', desc: 'Soft pulsing cloud glows' },
                    { id: 'stars' as BackgroundPattern, label: 'Star Cosmos', icon: '✨', desc: 'Twinkling celestial night' },
                    { id: 'sakura' as BackgroundPattern, label: 'Sakura Drift', icon: '🌸', desc: 'Floating petal particles' },
                    { id: 'grid' as BackgroundPattern, label: 'Cyber Matrix', icon: '🏙️', desc: 'High-tech perspective grid' },
                    { id: 'aurora' as BackgroundPattern, label: 'Aurora Waves', icon: '🌊', desc: 'Luminous shifting tides' },
                    { id: 'minimal' as BackgroundPattern, label: 'Pure Minimal', icon: '◻️', desc: 'Clean, distraction-free' }
                  ].map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setBackgroundPattern(pat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        theme.backgroundPattern === pat.id
                          ? 'border-[#38BDF8] bg-[#1B1126] ring-1 ring-[#38BDF8]/40 shadow-lg'
                          : 'border-[#241238] bg-[#160D20] hover:border-[#38BDF8]/30'
                      }`}
                    >
                      <div className="text-xl mb-1">{pat.icon}</div>
                      <div className="text-xs font-bold text-[#F8F5FC]">{pat.label}</div>
                      <div className="text-[10px] text-[#B8AFC4] leading-tight mt-0.5">{pat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Atmospheric Glow Level */}
              <div className="space-y-3 pt-4 border-t border-[#241238]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9F7AEA] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Ambient Romantic Glow Level</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'none' as GlowIntensity, label: 'Pure Dark (0%)' },
                    { id: 'subtle' as GlowIntensity, label: 'Subtle Ambiance (50%)' },
                    { id: 'medium' as GlowIntensity, label: 'Medium (100%)' },
                    { id: 'intense' as GlowIntensity, label: 'Vibrant (135%)' },
                    { id: 'ultra' as GlowIntensity, label: 'Ultra Neon (175%)' }
                  ].map((glow) => (
                    <button
                      key={glow.id}
                      type="button"
                      onClick={() => setGlowIntensity(glow.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        theme.glowIntensity === glow.id
                          ? 'border-[#F09BC5] bg-gradient-to-r from-[#9F7AEA]/20 to-[#F09BC5]/20 text-white'
                          : 'border-[#241238] bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC]'
                      }`}
                    >
                      {glow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Pairings */}
              <div className="space-y-3 pt-4 border-t border-[#241238]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F09BC5] flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>Typography Hierarchy Pairings</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'modern' as FontPairing,
                      name: 'Modern Sans',
                      display: 'Outfit Display',
                      body: 'Plus Jakarta Sans',
                      sample: 'Semantic Error • Given • Cherry Magic'
                    },
                    {
                      id: 'editorial' as FontPairing,
                      name: 'Editorial Literary Serif',
                      display: 'Playfair Display',
                      body: 'Plus Jakarta Sans',
                      sample: 'Doukyuusei • Bad Buddy • Old Fashion Cupcake'
                    },
                    {
                      id: 'cyber' as FontPairing,
                      name: 'Cyber & Graphic Noir',
                      display: 'Space Grotesk',
                      body: 'Plus Jakarta Sans',
                      sample: 'KinnPorsche • Pit Babe • Shutline'
                    },
                    {
                      id: 'classic' as FontPairing,
                      name: 'Imperial Danmei & Wuxia',
                      display: 'Cinzel Classical',
                      body: 'Plus Jakarta Sans',
                      sample: 'The Untamed • TGCF • Qiang Jin Jiu'
                    },
                    {
                      id: 'poetic' as FontPairing,
                      name: 'Romantic Poetic',
                      display: 'Playfair Italic',
                      body: 'Plus Jakarta Sans',
                      sample: 'To My Star • I Told Sunset About You'
                    },
                    {
                      id: 'retro' as FontPairing,
                      name: 'Retro Modern Fusion',
                      display: 'Cinzel + Space Grotesk',
                      body: 'Space Grotesk',
                      sample: 'Not Me • Dead Friend Forever'
                    }
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFontPairing(font.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        theme.fontPairing === font.id
                          ? 'border-[#F09BC5] bg-[#1B1126] ring-1 ring-[#F09BC5]/30'
                          : 'border-[#241238] bg-[#160D20] hover:border-[#9F7AEA]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#F8F5FC]">{font.name}</span>
                        {theme.fontPairing === font.id && (
                          <span className="text-[#F09BC5] text-xs font-bold">Active</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#B8AFC4] mb-2 font-mono">
                        {font.display} + {font.body}
                      </p>
                      <p className="text-xs text-[#F8F5FC] italic opacity-90 truncate">
                        "{font.sample}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interface Scale & Radius Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#241238]">
                {/* Font Scale */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#B8AFC4] uppercase tracking-wider">Font & UI Density</h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'compact' as FontScale, label: 'Compact' },
                      { id: 'normal' as FontScale, label: 'Standard' },
                      { id: 'relaxed' as FontScale, label: 'Readable' }
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setFontScale(sc.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          theme.fontScale === sc.id
                            ? 'border-[#F09BC5] bg-[#1B1126] text-white'
                            : 'border-[#241238] bg-[#160D20] text-[#B8AFC4] hover:text-white'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Corner Radius */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#B8AFC4] uppercase tracking-wider">Corner Curvature</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'sharp' as CardRadius, label: '6px' },
                      { id: 'subtle' as CardRadius, label: '12px' },
                      { id: 'standard' as CardRadius, label: '18px' },
                      { id: 'extra' as CardRadius, label: '28px' }
                    ].map((rad) => (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() => setCardRadius(rad.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          theme.cardRadius === rad.id
                            ? 'border-[#F09BC5] bg-[#1B1126] text-white'
                            : 'border-[#241238] bg-[#160D20] text-[#B8AFC4] hover:text-white'
                        }`}
                      >
                        {rad.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Style */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#B8AFC4] uppercase tracking-wider">Button Styling</h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'gradient' as ButtonStyle, label: 'Gradient' },
                      { id: 'solid' as ButtonStyle, label: 'Solid' },
                      { id: 'glow' as ButtonStyle, label: 'Neon Glow' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setButtonStyle(btn.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          theme.buttonStyle === btn.id
                            ? 'border-[#F09BC5] bg-[#1B1126] text-white'
                            : 'border-[#241238] bg-[#160D20] text-[#B8AFC4] hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMPORT & EXPORT */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              {/* Export Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8F5FC]">Active Theme Configuration JSON</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1B1126] border border-[#241238] text-[#F8F5FC] text-xs font-semibold hover:border-[#F09BC5]/40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .json</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black text-xs font-bold shadow-md hover:opacity-90"
                    >
                      {copyFeedback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback ? 'Copied to Clipboard!' : 'Copy Theme Code'}</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3.5 rounded-2xl bg-[#0B0712] border border-[#241238] text-[11px] font-mono text-[#F09BC5] overflow-x-auto max-h-48 leading-relaxed">
                  {exportTheme()}
                </pre>
              </div>

              {/* Import Box */}
              <div className="space-y-2 pt-4 border-t border-[#241238]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8F5FC]">Import Custom Theme</span>
                  <label className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1B1126] border border-[#241238] text-[#B8AFC4] hover:text-white cursor-pointer text-xs font-medium">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .json file</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-[#B8AFC4]">
                  Paste a theme JSON configuration from another user to apply and save it immediately.
                </p>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste theme JSON here..."
                  className="w-full bg-[#0B0712] text-xs font-mono text-[#F8F5FC] p-3 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
                />
                {importError && (
                  <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{importError}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#241238] hover:bg-[#381E57] text-[#F8F5FC] disabled:opacity-50 text-xs font-bold transition-all"
                >
                  Import and Apply Theme
                </button>
              </div>
            </div>
          )}

          {/* LIVE INTERACTIVE CARD PREVIEW STRIP (Always visible) */}
          <div className="pt-4 border-t border-[#241238] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#F09BC5]" /> Live Interactive Interface Sandbox:
              </span>
              <span className="text-[10px] text-[#B8AFC4]">
                Radius: <strong className="text-[#F8F5FC]">{theme.cardRadius}</strong> • Glow:{' '}
                <strong className="text-[#F8F5FC]">{theme.glowIntensity}</strong> • Font:{' '}
                <strong className="text-[#F8F5FC]">{theme.fontPairing}</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#160D20] border border-[#241238] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl bl-glow-card">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-14 h-20 rounded-xl bg-gradient-to-tr from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white shrink-0 shadow-lg"
                  style={{
                    boxShadow: `0 8px 24px ${theme.colors.glow1}`
                  }}
                >
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-[#F8F5FC] font-display">
                      Semantic Error (시맨틱 에러)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/30">
                      Korean Manhwa
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B1126] text-[#B794F4]">
                      Enemies to Lovers
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AFC4] mt-1 line-clamp-1">
                    Computer science senior Chu Sangwoo meets carefree campus star Jang Jaeyoung...
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#B8AFC4] mt-1.5">
                    <span>★ 9.8 Rating</span>
                    <span>•</span>
                    <span className="text-[#F09BC5] font-semibold">Volume 1-4 Complete</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  className="bl-signature-btn px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all"
                >
                  Start Reading Ch. 1
                </button>
                <button
                  type="button"
                  className="p-2 rounded-xl bg-[#1B1126] text-[#F09BC5] border border-[#241238] hover:border-[#F09BC5]/50 transition-colors"
                  title="Add to Favorites"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-xl bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]"
                  title="Add to Watchlist"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#241238] bg-[#160D20] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#B8AFC4]">
              Active: <strong className="text-[#F8F5FC]">{theme.emoji || '✨'} {theme.name}</strong>
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-[#B8AFC4] hidden sm:inline">
              Changes apply instantly across all pages and save to your browser.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCustomThemeName(theme.isPreset ? `${theme.name} Custom` : theme.name);
                setCustomThemeEmoji(theme.emoji || '✨');
                setCustomThemeTagline('My custom fandom palette');
                setIsSavingCustom(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1B1126] border border-[#241238] hover:border-[#F09BC5]/40 text-[#F8F5FC] font-semibold text-xs transition-all"
            >
              Save As Custom
            </button>
            <button
              type="button"
              onClick={closeCustomizer}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-black font-bold text-xs shadow-md hover:opacity-90 transition-all"
            >
              Done Customizing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
