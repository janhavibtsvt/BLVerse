import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, User, Heart, Film, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { getCharacterById, sampleCharacters } from '../data';

export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const character = id ? getCharacterById(id) : undefined;

  if (!character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Users className="w-12 h-12 text-[#9F7AEA]/50 mx-auto" />
        <h2 className="text-2xl font-bold text-[#F8F5FC]">Character Not Found</h2>
        <Link to="/characters" className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white text-xs font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90">
          Return to Character Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Portrait */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#241238] bg-[#160D20] group">
            <img
              referrerPolicy="no-referrer"
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#241238] to-[#9F7AEA]/80 text-[#F8F5FC] border border-[#9F7AEA]/50 shadow-[0_0_15px_rgba(159,122,234,0.3)]">
                ✦ {character.role}
              </span>
              {character.seriesTitle && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#241238]/60 text-[#F09BC5] border border-[#F09BC5]/30">
                  {character.seriesTitle}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] font-display tracking-tight">
                {character.name}
              </h1>
              {character.alternativeNames.length > 0 && (
                <p className="text-base text-[#B8AFC4] font-mono mt-0.5">
                  {character.alternativeNames.join(' • ')}
                </p>
              )}
            </div>

            {/* Actor Bridge Card */}
            {character.actorName && (
              <div className="p-4 rounded-2xl bg-[#1B1126] border border-[#F09BC5]/30 flex items-center justify-between gap-4 max-w-md shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#241238] border border-[#F09BC5]/40 flex items-center justify-center text-[#F09BC5] shadow-inner">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#F09BC5] uppercase tracking-wider flex items-center gap-1">
                      <span>✦</span> Portrayed by Live-Action Actor
                    </span>
                    <p className="text-xs font-bold text-[#F8F5FC]">
                      {character.actorName}
                    </p>
                  </div>
                </div>

                {character.actorId && (
                  <Link
                    to={`/actors/${character.actorId}`}
                    className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Actor Bio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )}

            {/* Personality Summary */}
            {character.personality && (
              <div className="p-3 rounded-xl bg-[#241238]/60 border border-[#F09BC5]/30 text-xs text-[#F8F5FC]">
                <strong className="text-[#F09BC5]">Personality & Archetype:</strong> {character.personality}
              </div>
            )}

            {/* Bio / Description */}
            <p className="text-xs sm:text-sm text-[#B8AFC4] leading-relaxed whitespace-pre-line pt-1">
              {character.description}
            </p>
          </div>
        </div>
      </div>

      {/* Relationships Matrix */}
      {character.relationships && character.relationships.length > 0 && (
        <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#F09BC5] fill-[#F09BC5]/30" />
            <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span>✦</span> Character Relationships & Dynamic Chemistry ♡
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {character.relationships.map((rel, idx) => {
              const targetChar = sampleCharacters.find(c => c.id === rel.targetCharacterId);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between space-y-3 shadow-md group"
                >
                  <div className="flex gap-3 items-start">
                    {targetChar && (
                      <img
                        referrerPolicy="no-referrer"
                        src={targetChar.image}
                        alt={rel.targetCharacterName}
                        className="w-14 h-18 object-cover rounded-xl shrink-0 border border-[#241238] shadow group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                        {rel.type}
                      </span>
                      <h3 className="text-sm font-bold text-[#F8F5FC] mt-1 truncate group-hover:text-[#F09BC5] transition-colors">
                        {rel.targetCharacterName}
                      </h3>
                      <p className="text-xs text-[#B8AFC4] mt-1 leading-relaxed">
                        {rel.description}
                      </p>
                    </div>
                  </div>

                  {targetChar && (
                    <Link
                      to={`/characters/${targetChar.id}`}
                      className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-semibold flex items-center gap-1 pt-2 border-t border-[#241238] transition-colors"
                    >
                      <span>Inspect Character Lore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-Media Canon Appearances */}
      {character.appearances && character.appearances.length > 0 && (
        <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F09BC5]" />
            <h2 className="text-xl font-bold text-[#F8F5FC] font-display flex items-center gap-2">
              <span>✦</span> Canon Appearances Across Adaptations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {character.appearances.map((app, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] hover:border-[#9F7AEA]/40 flex flex-col justify-between space-y-3 transition-all shadow-md group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#241238] text-[#F09BC5] uppercase border border-[#F09BC5]/30">
                    {app.type}
                  </span>
                  <h3 className="text-sm font-bold text-[#F8F5FC] mt-1 group-hover:text-[#F09BC5] transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-xs text-[#B8AFC4] mt-0.5">
                    Portrayal / format: {app.type}
                  </p>
                </div>

                <Link
                  to={app.type === 'series' ? `/series/${app.id}` : app.type === 'novel' ? `/novels/${app.id}` : `/${app.type}/${app.id}`}
                  className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-semibold flex items-center gap-1 pt-2 border-t border-[#241238] transition-colors"
                >
                  <span>View Title Page</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
