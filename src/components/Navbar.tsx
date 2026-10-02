import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bookmark,
  Menu,
  X,
  Compass,
  Film,
  BookOpen,
  Users,
  Calendar,
  Layers,
  Clock,
  ChevronRight,
  Plus,
  Globe,
  Palette
} from 'lucide-react';
import { searchAllEntities, SearchResultCategory } from '../data';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAiChat: () => void;
  onOpenAddWork?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiChat, onOpenAddWork }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultCategory[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUser();
  const { openCustomizer, theme } = useTheme();

  const totalSaved =
    preferences.watchlist.length +
    preferences.readingList.length +
    preferences.favorites.seriesIds.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchAllEntities(searchQuery);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSelectResult = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(url);
  };

  const navLinks = [
    { label: 'Series', path: '/series', icon: Film },
    { label: 'Manga', path: '/manga', icon: BookOpen },
    { label: 'Manhwa', path: '/manhwa', icon: BookOpen },
    { label: 'Manhua', path: '/manhua', icon: BookOpen },
    { label: 'Novels', path: '/novels', icon: BookOpen },
    { label: 'Adaptations', path: '/adaptations', icon: Layers, highlight: true },
    { label: 'Upcoming', path: '/upcoming', icon: Clock },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0712]/92 backdrop-blur-xl border-b border-[#241238] shadow-[0_8px_32px_rgba(11,7,18,0.85)] py-3'
          : 'bg-gradient-to-b from-[#0B0712]/95 via-[#0B0712]/75 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo with Midnight Romance Emblem */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#241238] via-[#9F7AEA] to-[#F09BC5] flex items-center justify-center shadow-[0_0_20px_rgba(240,155,197,0.35)] group-hover:shadow-[0_0_25px_rgba(240,155,197,0.6)] transition-all group-hover:scale-105 border border-[#F09BC5]/30">
            <span className="text-base select-none">🌙</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight">
                <span className="bg-gradient-to-r from-[#F09BC5] via-[#B794F4] to-[#F8F5FC] bg-clip-text text-transparent">
                  BL
                </span>
                <span className="text-[#F8F5FC]">Verse</span>
              </span>
              <span className="text-[10px] text-[#F09BC5] animate-pulse">✦</span>
            </div>
            <span className="hidden sm:block text-[9px] text-[#B8AFC4] font-medium tracking-wider uppercase">
              Stories behind the stories
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#241238] to-[#160D20] text-[#F09BC5] border border-[#F09BC5]/40 shadow-[0_0_15px_rgba(240,155,197,0.2)]'
                    : item.highlight
                    ? 'text-[#F09BC5] hover:text-white hover:bg-[#241238]/60 border border-[#9F7AEA]/30'
                    : 'text-[#B8AFC4] hover:text-[#F8F5FC] hover:bg-[#160D20]/80'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar: Search, AI Concierge, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative hidden md:block w-52 lg:w-60 xl:w-68">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#B8AFC4] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setIsSearchOpen(true)}
                placeholder="Search BL series, manhwa, danmei, tropes..."
                className="w-full bg-[#160D20]/90 text-xs text-[#F8F5FC] placeholder-[#B8AFC4]/60 pl-8 pr-7 py-2 rounded-xl border border-[#241238] focus:outline-none focus:border-[#9F7AEA] focus:ring-1 focus:ring-[#9F7AEA]/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-xs text-[#B8AFC4] hover:text-[#F8F5FC]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Search Dropdown Preview */}
            {isSearchOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#160D20] border border-[#241238] rounded-2xl shadow-[0_12px_40px_rgba(11,7,18,0.95)] overflow-hidden max-h-96 overflow-y-auto z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center space-y-2 text-xs">
                    <p className="text-[#B8AFC4]">No curated title found for "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Search Worldwide Catalog →</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-2 divide-y divide-[#241238]/60">
                    {searchResults.map((cat) => (
                      <div key={cat.category} className="p-2">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F09BC5]">
                          ✦ {cat.category}
                        </div>
                        <div className="space-y-1">
                          {cat.items.slice(0, 3).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectResult(item.url)}
                              className="w-full text-left flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#241238]/60 transition-colors group"
                            >
                              <img
                                referrerPolicy="no-referrer"
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-10 object-cover rounded-lg shadow border border-white/5"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#F8F5FC] truncate group-hover:text-[#F09BC5] transition-colors">
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="text-[10px] text-[#B8AFC4] truncate">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#B8AFC4] group-hover:text-[#F09BC5] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="p-2 bg-[#0B0712]/40 text-center">
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="text-xs text-[#F09BC5] hover:text-[#F8F5FC] font-semibold"
                      >
                        View all results for "{searchQuery}" →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Customizer Toggle Button */}
          <button
            onClick={openCustomizer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#160D20] hover:bg-[#241238] text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/50 text-xs font-semibold transition-all hover:scale-105 active:scale-95 group"
            title={`Theme Studio: ${theme.emoji || '✨'} ${theme.name} (Click to Customize)`}
          >
            <span className="text-xs group-hover:scale-110 transition-transform">{theme.emoji || '✨'}</span>
            <span className="hidden md:inline text-xs font-medium">Theme</span>
          </button>

          {/* Add Missing Work Button */}
          {onOpenAddWork && (
            <button
              id="navbar-add-work-btn"
              onClick={onOpenAddWork}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#160D20] hover:bg-[#241238] text-[#F8F5FC] border border-[#241238] hover:border-[#9F7AEA]/50 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              title="Add Any BL Series, Manga, Manhwa, or Manhua"
            >
              <Plus className="w-3.5 h-3.5 text-[#F09BC5]" />
              <span className="hidden sm:inline text-xs">Add Title</span>
            </button>
          )}

          {/* Ask BLVerse AI Button */}
          <button
            id="open-ai-chat-btn"
            onClick={onOpenAiChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#241238] via-[#9F7AEA]/30 to-[#F09BC5]/30 hover:from-[#9F7AEA]/40 hover:to-[#F09BC5]/50 text-[#F8F5FC] border border-[#F09BC5]/35 shadow-[0_0_16px_rgba(240,155,197,0.2)] text-xs font-bold transition-all hover:scale-105 active:scale-95"
            title="Ask BLVerse Concierge AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F09BC5] animate-spin" />
            <span className="hidden sm:inline">Ask BLVerse</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* My List / Profile Button */}
          <Link
            to="/profile"
            className="relative p-2 rounded-xl bg-[#160D20] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238] transition-colors"
            title="My Watchlist & Reading Lists"
          >
            <Bookmark className="w-4 h-4" />
            {totalSaved > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-[#9F7AEA] to-[#E879A9] text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#0B0712]">
                {totalSaved}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#160D20] text-[#B8AFC4] hover:text-white hover:bg-[#241238] border border-[#241238]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0712]/98 border-b border-[#241238] px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-[0_16px_40px_rgba(11,7,18,0.9)] backdrop-blur-xl">
          {/* Mobile Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BL series, manhwa, actors..."
              className="w-full bg-[#160D20] text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/60 pl-9 pr-4 py-2 rounded-xl border border-[#241238] focus:border-[#9F7AEA]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setIsMobileMenuOpen(false);
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-gradient-to-r from-[#241238] to-[#160D20] text-[#F09BC5] border border-[#F09BC5]/40'
                    : 'bg-[#160D20]/70 text-[#B8AFC4] hover:bg-[#241238]'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#B794F4]" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#241238] flex flex-wrap justify-between items-center gap-2 text-xs text-[#B8AFC4]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCustomizer();
              }}
              className="text-[#F8F5FC] font-semibold flex items-center gap-1.5 hover:text-[#F09BC5]"
            >
              <Palette className="w-3.5 h-3.5 text-[#F09BC5]" /> Theme & Aesthetic
            </button>
            {onOpenAddWork && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAddWork();
                }}
                className="text-[#F8F5FC] font-semibold flex items-center gap-1 hover:text-[#F09BC5]"
              >
                <Plus className="w-3.5 h-3.5 text-[#F09BC5]" /> Add Missing Title
              </button>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAiChat();
              }}
              className="text-[#F09BC5] font-semibold flex items-center gap-1 hover:underline ml-auto"
            >
              <Sparkles className="w-3 h-3" /> Ask BLVerse AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
