import React, { useState } from 'react';
import { Clock, Filter, Bell, ExternalLink, ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import { sampleUpcomingReleases } from '../data';
import { useUser } from '../context/UserContext';

export const UpcomingPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleNotification, isNotificationSubscribed } = useUser();

  const types = ['All', 'series', 'manga', 'manhwa', 'manhua', 'adaptation'];
  const statuses = ['All', 'Announced', 'Casting', 'Filming', 'Trailer Released', 'Release Date Announced'];

  const filtered = sampleUpcomingReleases.filter(r => {
    const matchType = selectedType === 'All' || r.type === selectedType;
    const matchStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.basedOn && r.basedOn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#F09BC5] text-xs font-bold uppercase tracking-wider mb-2">
          <Clock className="w-4 h-4 text-[#B794F4]" />
          <span>✦ Production Pipeline & Industry Announcements</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5FC] tracking-tight font-display">
          Upcoming Releases & Status Tracker
        </h1>
        <p className="text-sm text-[#B8AFC4] mt-1 max-w-3xl">
          Track verified live-action adaptations, new seasons, and translated comic releases. We strictly adhere to our fact-checking guidelines to separate confirmed productions from social media rumors.
        </p>
      </div>

      {/* Fact-Checking Standards Notice */}
      <div className="p-5 rounded-3xl bg-[#160D20] border border-[#F09BC5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#F09BC5] shrink-0" />
          <div>
            <span className="font-bold text-[#F8F5FC] text-sm">Information Integrity Standards</span>
            <p className="text-[#B8AFC4] mt-0.5">
              Only projects confirmed by official production houses (GMMTV, Watcha, Studio LuluLala, Tencent Video) or licensed publishers are listed. Release dates marked "TBA" are pending official broadcaster schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#160D20] border border-[#241238] rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8AFC4] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming titles, source novels..."
              className="w-full bg-[#1B1126] text-xs sm:text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/50 pl-10 pr-4 py-2.5 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <span>✦</span> Type:
            </span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 uppercase ${
                  selectedType === t
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                    : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#241238] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span>✦</span> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedStatus === st
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                  : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Upcoming Releases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rel) => {
          const subscribed = isNotificationSubscribed(rel.id);
          return (
            <div
              key={rel.id}
              className="bg-[#160D20] border border-[#241238] rounded-3xl p-5 hover:border-[#F09BC5]/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_10px_30px_rgba(159,122,234,0.18)] hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40 uppercase">
                    ✦ {rel.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#1B1126] text-[#B8AFC4] border border-[#241238]">
                    {rel.status}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <img
                    referrerPolicy="no-referrer"
                    src={rel.poster}
                    alt={rel.title}
                    className="w-20 h-28 object-cover rounded-2xl border border-[#241238] shadow-md shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold text-[#F8F5FC] group-hover:text-[#F09BC5] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[#B8AFC4]">
                      {rel.country}
                    </p>
                    {rel.basedOn && (
                      <p className="text-[11px] text-[#F09BC5] line-clamp-1 pt-1 font-medium">
                        Based on: {rel.basedOn}
                      </p>
                    )}
                    {rel.platform && (
                      <p className="text-[11px] text-[#B8AFC4]/70">
                        Platform: {rel.platform}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#B8AFC4] line-clamp-2 leading-relaxed">
                  {rel.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#241238] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8AFC4]">Target Premiere:</span>
                  <div className="flex items-center gap-1">
                    <span className={rel.releaseDateVerified ? 'text-[#F09BC5] font-bold' : 'text-[#B794F4] font-semibold'}>
                      {rel.expectedReleaseDate}
                    </span>
                    {!rel.releaseDateVerified && (
                      <span className="text-[10px] text-[#B8AFC4]/60">(Estimate)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#B8AFC4]/60 truncate max-w-[150px]">
                    Source: {rel.source}
                  </span>

                  <button
                    onClick={() => toggleNotification(rel.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      subscribed
                        ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.4)]'
                        : 'bg-[#1B1126] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238] hover:border-[#F09BC5]/30'
                    }`}
                  >
                    <Bell className={`w-3.5 h-3.5 ${subscribed ? 'fill-current' : ''}`} />
                    <span>{subscribed ? 'Tracking' : 'Get Alerts'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
