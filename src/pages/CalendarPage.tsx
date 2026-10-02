import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { sampleCalendarEvents } from '../data';

export const CalendarPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedType, setSelectedType] = useState('All');

  const months = [
    { label: 'September 2026', key: '2026-09' },
    { label: 'October 2026', key: '2026-10' },
    { label: 'November 2026', key: '2026-11' }
  ];

  const filteredEvents = sampleCalendarEvents.filter(ev => {
    const matchMonth = ev.date.startsWith(selectedMonth);
    const matchType = selectedType === 'All' || ev.type === selectedType;
    return matchMonth && matchType;
  });

  const getBadgeForType = (type: string) => {
    switch (type) {
      case 'series': return 'bg-[#241238] text-[#F09BC5] border-[#F09BC5]/40 shadow-[0_0_10px_rgba(240,155,197,0.2)]';
      case 'manhwa': return 'bg-[#1B1126] text-[#B794F4] border-[#B794F4]/40';
      case 'manga': return 'bg-[#241238]/80 text-[#F09BC5] border-[#F09BC5]/30';
      case 'manhua': return 'bg-[#1B1126] text-[#E879A9] border-[#E879A9]/40';
      default: return 'bg-[#1B1126] text-[#F8F5FC] border-[#241238]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
          <CalendarIcon className="w-4 h-4 text-[#B794F4]" />
          <span>✦ Simulcast & Serialization Schedule</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
          Monthly Release Calendar
        </h1>
        <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
          Track upcoming episode premieres, new manhwa chapters, volume releases, and special adaptation trailers organized chronologically.
        </p>
      </div>

      {/* Month & Filter Controls */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl">
        {/* Month Picker Buttons */}
        <div className="flex items-center gap-2">
          {months.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedMonth === m.key
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.35)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'series', 'manhwa', 'manga', 'manhua'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase ${
                selectedType === t
                  ? 'bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40 shadow-sm'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-12 text-center space-y-3">
            <CalendarIcon className="w-12 h-12 text-[#241238] mx-auto" />
            <h3 className="text-lg font-bold text-[#F8F5FC]">No releases scheduled for this selection</h3>
            <p className="text-xs text-[#B8AFC4]">
              Try selecting another month or switching the type filter to "All".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between space-y-3 group shadow-xl hover:shadow-[0_10px_30px_rgba(159,122,234,0.18)] hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${getBadgeForType(ev.type)}`}>
                      ✦ {ev.type}
                    </span>
                    <span className="text-xs font-mono text-[#F09BC5] font-bold bg-[#241238] px-2.5 py-1 rounded-lg border border-[#F09BC5]/30 shadow-inner">
                      {ev.date}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors">
                      {ev.title}
                    </h3>
                    {ev.episodesOrChapter && (
                      <p className="text-xs text-[#B794F4] font-semibold mt-1">
                        {ev.episodesOrChapter}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#1B1126] text-[#B8AFC4] border border-[#241238]">
                      Status: {ev.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#241238] flex items-center justify-between text-xs">
                  <span className="text-[#B8AFC4]/70 text-[11px]">
                    Platform: <strong className="text-[#F8F5FC]">{ev.platform || 'Broadcaster'}</strong>
                  </span>

                  {ev.linkId && (
                    <Link
                      to={ev.type === 'series' ? `/series/${ev.linkId}` : `/${ev.type}/${ev.linkId}`}
                      className="text-[#B794F4] hover:text-[#F09BC5] font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Inspect Title</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
