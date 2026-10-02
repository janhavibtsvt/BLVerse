import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#241238] bg-[#08050D] pt-16 pb-12 mt-24 text-[#B8AFC4] text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#241238]/60">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#241238] via-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-xs shadow-[0_0_15px_rgba(240,155,197,0.3)] border border-[#F09BC5]/30">
                <span>🌙</span>
              </div>
              <span className="text-lg font-black font-display tracking-tight text-[#F8F5FC]">
                <span className="bg-gradient-to-r from-[#F09BC5] to-[#B794F4] bg-clip-text text-transparent">BL</span>Verse
              </span>
            </Link>
            <p className="text-xs text-[#B8AFC4] leading-relaxed">
              Discover the stories behind the stories. Connecting original novels, manga, manhwa, manhua, live-action BL series, characters, and actors.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241238]/60 border border-[#381E57] text-[11px] text-[#F09BC5]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B794F4]" />
              <span>Fact-Checked & Sourced Data</span>
            </div>
          </div>

          {/* Col 2: Content Discovery */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F8F5FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#F09BC5]">✦</span> Explore Content
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/series" className="hover:text-[#F09BC5] transition-colors">Live-Action BL Series</Link>
              </li>
              <li>
                <Link to="/manga" className="hover:text-[#F09BC5] transition-colors">Japanese BL Manga</Link>
              </li>
              <li>
                <Link to="/manhwa" className="hover:text-[#F09BC5] transition-colors">Korean BL Manhwa</Link>
              </li>
              <li>
                <Link to="/manhua" className="hover:text-[#F09BC5] transition-colors">Chinese Danmei Manhua</Link>
              </li>
              <li>
                <Link to="/novels" className="hover:text-[#F09BC5] transition-colors">Original Web Novels</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Relations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F8F5FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#F09BC5]">✦</span> Intelligence & Releases
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/adaptations" className="hover:text-white transition-colors text-[#F09BC5] font-semibold">Adaptation Flowcharts</Link>
              </li>
              <li>
                <Link to="/upcoming" className="hover:text-[#F09BC5] transition-colors">Upcoming Releases & Status</Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-[#F09BC5] transition-colors">Monthly Release Calendar</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#F09BC5] transition-colors">Worldwide Media Registry</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Standards & Policy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F8F5FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#F09BC5]">✦</span> Editorial Integrity
            </h3>
            <p className="text-xs text-[#B8AFC4] leading-relaxed">
              We strictly distinguish verified official industry news from unconfirmed rumors. Demo/sample data is explicitly badged to prevent misinformation.
            </p>
            <div className="pt-1">
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 text-xs text-[#F09BC5] hover:text-[#F8F5FC] font-semibold"
              >
                Manage My Library & Lists →
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8AFC4]/70">
          <p>© {new Date().getFullYear()} BLVerse. Discover the stories behind the stories.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#B8AFC4]">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#F09BC5] fill-[#F09BC5]" /> for BL enthusiasts worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
