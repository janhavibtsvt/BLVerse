import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, User, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { sampleCharacters } from '../data';

export const CharactersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filtered = sampleCharacters.filter(c => {
    const matchRole = selectedRole === 'All' || c.role === selectedRole;
    const matchSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alternativeNames.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.actorName && c.actorName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
          <Users className="w-4 h-4 text-[#B794F4]" />
          <span>✦ Character Profiles & Chemistry Lore</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
          BL Character Directory
        </h1>
        <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
          Explore iconic BL characters, their personality traits, relationship networks, and the actors who portrayed them in live-action series.
        </p>
      </div>

      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters by name, actor..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <span>✦</span> Role:
            </span>
            {['All', 'Protagonist', 'Main Character', 'Deuteragonist'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedRole === r
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                    : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((char) => (
          <div
            key={char.id}
            className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_10px_30px_rgba(159,122,234,0.18)] hover:-translate-y-0.5"
          >
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <img
                  referrerPolicy="no-referrer"
                  src={char.image}
                  alt={char.name}
                  className="w-20 h-26 object-cover rounded-2xl border border-[#241238] shadow-md shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                    {char.role}
                  </span>
                  <h3 className="text-base font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors mt-1 truncate">
                    {char.name}
                  </h3>
                  {char.alternativeNames[0] && (
                    <p className="text-xs text-[#B8AFC4] font-mono">
                      {char.alternativeNames[0]}
                    </p>
                  )}
                  {char.actorName && (
                    <p className="text-xs text-[#B8AFC4] mt-2">
                      Portrayed by{' '}
                      {char.actorId ? (
                        <Link
                          to={`/actors/${char.actorId}`}
                          className="text-[#F09BC5] font-semibold hover:underline"
                        >
                          {char.actorName}
                        </Link>
                      ) : (
                        <strong className="text-[#F8F5FC]">{char.actorName}</strong>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#B8AFC4] line-clamp-3 leading-relaxed">
                {char.description}
              </p>

              {/* Key Relationships preview */}
              {char.relationships && char.relationships.length > 0 && (
                <div className="pt-2 border-t border-[#241238] space-y-1">
                  <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider block flex items-center gap-1">
                    <span>♡</span> Dynamic Bond:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {char.relationships.slice(0, 2).map((rel, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#1B1126] text-[#F8F5FC] border border-[#241238]"
                      >
                        {rel.type} with <strong className="text-[#F09BC5]">{rel.targetCharacterName}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#241238] flex items-center justify-between">
              <span className="text-[11px] text-[#B8AFC4]/70 font-mono">
                {char.seriesTitle || 'Adaptation Series'}
              </span>
              <Link
                to={`/characters/${char.id}`}
                className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-bold flex items-center gap-1 transition-colors"
              >
                <span>Lore & Relations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
