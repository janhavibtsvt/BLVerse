import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bookmark, Film, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface MobileBottomNavProps {
  onOpenAiChat: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAiChat }) => {
  const { preferences } = useUser();
  const totalSaved =
    preferences.watchlist.length +
    preferences.readingList.length +
    preferences.favorites.seriesIds.length;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0712]/95 backdrop-blur-xl border-t border-[#241238] px-2 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(36,18,56,0.5)]">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            isActive ? 'text-[#F09BC5]' : 'text-[#B8AFC4] hover:text-white'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </NavLink>

      <NavLink
        to="/series"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            isActive ? 'text-[#F09BC5]' : 'text-[#B8AFC4] hover:text-white'
          }`
        }
      >
        <Film className="w-4 h-4" />
        <span className="text-[10px] font-medium tracking-tight">Series</span>
      </NavLink>

      {/* Center Action: Ask AI */}
      <button
        onClick={onOpenAiChat}
        className="flex flex-col items-center gap-1 -mt-4 p-2 rounded-2xl bg-gradient-to-tr from-[#241238] via-[#9F7AEA] to-[#F09BC5] text-[#0B0712] shadow-[0_4px_20px_rgba(240,155,197,0.45)] hover:scale-105 active:scale-95 transition-all"
        title="Ask BLVerse AI"
      >
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-[9px] font-bold text-white tracking-wider">AI</span>
      </button>

      <NavLink
        to="/adaptations"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            isActive ? 'text-[#F09BC5]' : 'text-[#B8AFC4] hover:text-white'
          }`
        }
      >
        <Compass className="w-4 h-4" />
        <span className="text-[10px] font-medium tracking-tight">Adaptations</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            isActive ? 'text-[#F09BC5]' : 'text-[#B8AFC4] hover:text-white'
          }`
        }
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-[10px] font-medium tracking-tight">Library</span>
        {totalSaved > 0 && (
          <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-[#E879A9] text-[9px] font-bold text-white flex items-center justify-center">
            {totalSaved}
          </span>
        )}
      </NavLink>
    </div>
  );
};
