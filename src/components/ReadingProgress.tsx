import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  CheckCircle2,
  BookOpen,
  Star,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  Trash2,
  ExternalLink,
  Layers,
  Clock,
  Save,
  Check,
  Award
} from 'lucide-react';
import { ComicWork, Novel, ReadingStatus, ReadingListStatus } from '../types';
import { useUser } from '../context/UserContext';

interface ReadingProgressProps {
  work: ComicWork | Novel;
  className?: string;
  onSaved?: () => void;
  compact?: boolean;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  work,
  className = '',
  onSaved,
  compact = false
}) => {
  const {
    getReadingEntry,
    saveReadingProgress,
    removeFromReadingList,
    showToast
  } = useUser();

  const entry = getReadingEntry(work.id);
  const workType = ('type' in work ? work.type : 'novel') as 'manga' | 'manhwa' | 'manhua' | 'novel';

  // Parse total chapters if available
  const parsedTotalChapters = useMemo(() => {
    if (!work.chapters) return null;
    const num = parseInt(String(work.chapters).replace(/\D+/g, ''), 10);
    return isNaN(num) || num <= 0 ? null : num;
  }, [work.chapters]);

  // Parse total volumes if available
  const parsedTotalVolumes = useMemo(() => {
    if (!work.volumes) return null;
    const num = parseInt(String(work.volumes).replace(/\D+/g, ''), 10);
    return isNaN(num) || num <= 0 ? null : num;
  }, [work.volumes]);

  // Local state initialized from profile context entry or sensible defaults
  const [status, setStatus] = useState<ReadingStatus>(entry?.status || 'Reading');
  const [chaptersRead, setChaptersRead] = useState<number>(entry?.progressChapters ?? 0);
  const [volumesRead, setVolumesRead] = useState<number>(entry?.progressVolumes ?? 0);
  const [rating, setRating] = useState<number>(entry?.rating ?? 10);
  const [notes, setNotes] = useState<string>(entry?.notes ?? '');
  const [showNotesInput, setShowNotesInput] = useState<boolean>(Boolean(entry?.notes));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  // Sync state if context changes externally
  useEffect(() => {
    if (entry) {
      setStatus(entry.status);
      setChaptersRead(entry.progressChapters ?? 0);
      setVolumesRead(entry.progressVolumes ?? 0);
      if (entry.rating !== undefined) setRating(entry.rating);
      if (entry.notes !== undefined) {
        setNotes(entry.notes);
        if (entry.notes.trim()) setShowNotesInput(true);
      }
      setHasUnsavedChanges(false);
    }
  }, [entry?.status, entry?.progressChapters, entry?.progressVolumes, entry?.rating, entry?.notes]);

  // Handle saving to user profile context
  const handleSave = (customOverrides?: Partial<{
    status: ReadingStatus;
    chapters: number;
    volumes: number;
    rating: number;
    notes: string;
  }>) => {
    const finalStatus = customOverrides?.status ?? status;
    const finalChapters = customOverrides?.chapters ?? chaptersRead;
    const finalVolumes = customOverrides?.volumes ?? volumesRead;
    const finalRating = customOverrides?.rating ?? rating;
    const finalNotes = customOverrides?.notes ?? notes;

    saveReadingProgress({
      workId: work.id,
      workTitle: work.title,
      type: workType,
      status: finalStatus,
      progressChapters: finalChapters,
      progressVolumes: finalVolumes,
      totalChapters: work.chapters,
      totalVolumes: work.volumes,
      rating: finalRating,
      notes: finalNotes.trim() || undefined
    });

    setHasUnsavedChanges(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);

    if (onSaved) {
      onSaved();
    }
  };

  // Quick increment/decrement chapters
  const adjustChapters = (delta: number) => {
    const nextVal = Math.max(0, chaptersRead + delta);
    setChaptersRead(nextVal);
    setHasUnsavedChanges(true);

    // Auto-update to Completed if reached total chapters
    let targetStatus = status;
    if (parsedTotalChapters && nextVal >= parsedTotalChapters && status !== 'Completed') {
      targetStatus = 'Completed';
      setStatus('Completed');
    } else if (status === 'Want to Read' && nextVal > 0) {
      targetStatus = 'Reading';
      setStatus('Reading');
    }

    // Auto-save immediately for fluid chapter progression
    handleSave({
      chapters: nextVal,
      status: targetStatus
    });
  };

  // Quick increment/decrement volumes
  const adjustVolumes = (delta: number) => {
    const nextVal = Math.max(0, volumesRead + delta);
    setVolumesRead(nextVal);
    setHasUnsavedChanges(true);

    let targetStatus = status;
    if (parsedTotalVolumes && nextVal >= parsedTotalVolumes && status !== 'Completed') {
      targetStatus = 'Completed';
      setStatus('Completed');
    }

    handleSave({
      volumes: nextVal,
      status: targetStatus
    });
  };

  // Mark all completed
  const handleMarkAllCompleted = () => {
    const targetChapters = parsedTotalChapters || chaptersRead || 1;
    const targetVolumes = parsedTotalVolumes || volumesRead || (parsedTotalVolumes ? parsedTotalVolumes : 0);
    setChaptersRead(targetChapters);
    if (targetVolumes > 0) setVolumesRead(targetVolumes);
    setStatus('Completed');

    handleSave({
      status: 'Completed',
      chapters: targetChapters,
      volumes: targetVolumes
    });
  };

  // Percentage calculations
  const chapterPercentage = useMemo(() => {
    if (!parsedTotalChapters || parsedTotalChapters <= 0) return null;
    return Math.min(100, Math.round((chaptersRead / parsedTotalChapters) * 100));
  }, [chaptersRead, parsedTotalChapters]);

  const volumePercentage = useMemo(() => {
    if (!parsedTotalVolumes || parsedTotalVolumes <= 0) return null;
    return Math.min(100, Math.round((volumesRead / parsedTotalVolumes) * 100));
  }, [volumesRead, parsedTotalVolumes]);

  const ratingLabels: Record<number, string> = {
    10: 'Masterpiece ♡',
    9: 'Incredible',
    8: 'Very Good',
    7: 'Good',
    6: 'Decent',
    5: 'Average',
    4: 'Below Average',
    3: 'Poor',
    2: 'Very Poor',
    1: 'Disastrous'
  };

  const statusConfigs: Record<ReadingStatus, { label: string; activeColor: string; bgBadge: string }> = {
    Reading: {
      label: 'Reading',
      activeColor: 'from-[#DB2777] to-[#F09BC5] text-white shadow-[0_0_12px_rgba(240,155,197,0.4)]',
      bgBadge: 'bg-pink-950/70 text-[#F9A8D4] border-pink-500/40'
    },
    Completed: {
      label: 'Completed',
      activeColor: 'from-emerald-600 to-teal-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]',
      bgBadge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
    },
    'Want to Read': {
      label: 'Want to Read',
      activeColor: 'from-[#7C3AED] to-[#9F7AEA] text-white shadow-[0_0_12px_rgba(159,122,234,0.4)]',
      bgBadge: 'bg-purple-950/70 text-[#C4B5FD] border-purple-500/40'
    },
    'On Hold': {
      label: 'On Hold',
      activeColor: 'from-amber-600 to-yellow-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]',
      bgBadge: 'bg-amber-950/70 text-amber-300 border-amber-500/40'
    },
    Dropped: {
      label: 'Dropped',
      activeColor: 'from-zinc-700 to-zinc-600 text-white shadow-md',
      bgBadge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
    }
  };

  return (
    <div
      className={`bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        hasUnsavedChanges ? 'border-[#F09BC5]/60 ring-1 ring-[#F09BC5]/30' : 'hover:border-[#F09BC5]/40'
      } ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-gradient-to-br from-[#9F7AEA]/15 to-[#F09BC5]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#241238] relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white shadow-md shadow-[rgba(240,155,197,0.3)] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#F8F5FC] font-display flex items-center gap-1.5">
                <span>Reading Progress</span>
                <span className="text-[#F09BC5] text-xs font-semibold">✦</span>
              </h2>
              {entry && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                    statusConfigs[entry.status]?.bgBadge || 'bg-[#241238] text-[#F09BC5]'
                  }`}
                >
                  {entry.status}
                </span>
              )}
            </div>
            <p className="text-xs text-[#B8AFC4]">
              {entry
                ? 'Synced directly with your BLVerse profile context'
                : 'Track your completed chapters, volumes & reading status'}
            </p>
          </div>
        </div>

        {/* Sync status indicator & Profile link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {justSaved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
              <Check className="w-3.5 h-3.5" />
              <span>Saved to Profile!</span>
            </span>
          ) : entry ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1B1126] border border-[#241238] text-[#B8AFC4] text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F09BC5]" />
              <span>Saved in Vault</span>
            </span>
          ) : null}

          <Link
            to="/profile"
            className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-[#241238]/60 transition-colors"
            title="View in your collection profile"
          >
            <span>My Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="space-y-6 pt-6 relative">
        {/* Status Selection Pill Toolbar */}
        <div>
          <label className="text-[11px] font-bold text-[#F09BC5] uppercase tracking-wider block mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(statusConfigs) as ReadingStatus[]).map((st) => {
              const isSelected = status === st;
              const cfg = statusConfigs[st];
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatus(st);
                    setHasUnsavedChanges(true);
                    handleSave({ status: st });
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? `bg-gradient-to-r ${cfg.activeColor}`
                      : 'bg-[#1B1126] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F8F5FC] border border-[#241238]'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Grid: Chapters & Volumes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Chapters Completed Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8F5FC] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#F09BC5]" />
                <span>Chapters Completed</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#F09BC5]">
                {chaptersRead} {parsedTotalChapters ? `/ ${parsedTotalChapters}` : 'chapters'}
              </span>
            </div>

            {/* Stepper + Input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustChapters(-1)}
                disabled={chaptersRead <= 0}
                className="w-10 h-10 rounded-xl bg-[#241238] hover:bg-[#241238]/80 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-[#241238] transition-colors"
                title="Previous chapter"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  min={0}
                  value={chaptersRead}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setChaptersRead(val);
                    setHasUnsavedChanges(true);
                  }}
                  onBlur={() => handleSave()}
                  className="w-full text-center bg-[#160D20] text-base font-bold text-[#F8F5FC] py-2 px-3 rounded-xl border border-[#241238] focus:outline-none focus:border-[#F09BC5] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => adjustChapters(1)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:opacity-90 text-white flex items-center justify-center shadow-md transition-opacity"
                title="Next chapter (+1)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump buttons */}
            <div className="flex items-center justify-between gap-1 text-[11px] pt-1">
              <span className="text-[#B8AFC4]/70">Quick add:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustChapters(1)}
                  className="px-2 py-0.5 rounded-lg bg-[#241238]/60 hover:bg-[#241238] text-[#F09BC5] font-semibold border border-[#241238] hover:border-[#F09BC5]/40 transition-colors"
                >
                  +1 Ch
                </button>
                <button
                  type="button"
                  onClick={() => adjustChapters(5)}
                  className="px-2 py-0.5 rounded-lg bg-[#241238]/60 hover:bg-[#241238] text-[#F09BC5] font-semibold border border-[#241238] hover:border-[#F09BC5]/40 transition-colors"
                >
                  +5 Ch
                </button>
                {parsedTotalChapters && chaptersRead < parsedTotalChapters && (
                  <button
                    type="button"
                    onClick={() => {
                      setChaptersRead(parsedTotalChapters);
                      setStatus('Completed');
                      handleSave({ chapters: parsedTotalChapters, status: 'Completed' });
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#241238]/60 hover:bg-[#241238] text-emerald-300 font-semibold border border-[#241238] hover:border-emerald-500/40 transition-colors"
                  >
                    Finish All ({parsedTotalChapters})
                  </button>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            {chapterPercentage !== null && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-[#160D20] h-2 rounded-full overflow-hidden border border-[#241238]">
                  <div
                    className="h-full bg-gradient-to-r from-[#9F7AEA] via-[#E879A9] to-[#F09BC5] transition-all duration-300 rounded-full"
                    style={{ width: `${chapterPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#B8AFC4]">
                  <span>{chapterPercentage}% Completed</span>
                  {parsedTotalChapters && (
                    <span>
                      {parsedTotalChapters - chaptersRead > 0
                        ? `${parsedTotalChapters - chaptersRead} chapters remaining`
                        : 'All chapters read! ♡'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Volumes Completed Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8F5FC] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#B794F4]" />
                <span>Volumes Completed</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#B794F4]">
                {volumesRead} {parsedTotalVolumes ? `/ ${parsedTotalVolumes}` : 'volumes'}
              </span>
            </div>

            {/* Stepper + Input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustVolumes(-1)}
                disabled={volumesRead <= 0}
                className="w-10 h-10 rounded-xl bg-[#241238] hover:bg-[#241238]/80 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-[#241238] transition-colors"
                title="Previous volume"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  min={0}
                  value={volumesRead}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setVolumesRead(val);
                    setHasUnsavedChanges(true);
                  }}
                  onBlur={() => handleSave()}
                  className="w-full text-center bg-[#160D20] text-base font-bold text-[#F8F5FC] py-2 px-3 rounded-xl border border-[#241238] focus:outline-none focus:border-[#B794F4] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => adjustVolumes(1)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] hover:opacity-90 text-white flex items-center justify-center shadow-md transition-opacity"
                title="Next volume (+1)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump buttons */}
            <div className="flex items-center justify-between gap-1 text-[11px] pt-1">
              <span className="text-[#B8AFC4]/70">Quick add:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustVolumes(1)}
                  className="px-2 py-0.5 rounded-lg bg-[#241238]/60 hover:bg-[#241238] text-[#B794F4] font-semibold border border-[#241238] hover:border-[#B794F4]/40 transition-colors"
                >
                  +1 Vol
                </button>
                {parsedTotalVolumes && volumesRead < parsedTotalVolumes && (
                  <button
                    type="button"
                    onClick={() => {
                      setVolumesRead(parsedTotalVolumes);
                      handleSave({ volumes: parsedTotalVolumes });
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#241238]/60 hover:bg-[#241238] text-[#C4B5FD] font-semibold border border-[#241238] hover:border-purple-500/40 transition-colors"
                  >
                    Finish All ({parsedTotalVolumes} Vols)
                  </button>
                )}
              </div>
            </div>

            {/* Visual Volume Progress Bar */}
            {volumePercentage !== null && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-[#160D20] h-2 rounded-full overflow-hidden border border-[#241238]">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C3AED] to-[#B794F4] transition-all duration-300 rounded-full"
                    style={{ width: `${volumePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#B8AFC4]">
                  <span>{volumePercentage}% Volumes Finished</span>
                  {parsedTotalVolumes && (
                    <span>
                      {parsedTotalVolumes - volumesRead > 0
                        ? `${parsedTotalVolumes - volumesRead} vols left`
                        : 'All volumes completed!'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rating Score Selection */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#F8F5FC] flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Personal Rating</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#F09BC5]">
                {rating} / 10
              </span>
              <span className="text-xs font-semibold text-[#B8AFC4]">
                • {ratingLabels[rating] || ''}
              </span>
            </div>
          </div>

          {/* Interactive Star Buttons 1-10 */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
              const isFilled = starVal <= rating;
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => {
                    setRating(starVal);
                    setHasUnsavedChanges(true);
                    handleSave({ rating: starVal });
                  }}
                  className={`flex-1 min-w-[28px] py-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                    starVal === rating
                      ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md scale-105'
                      : isFilled
                      ? 'bg-[#241238] text-amber-300 hover:bg-[#241238]/80'
                      : 'bg-[#160D20] text-[#B8AFC4]/40 hover:text-[#B8AFC4]'
                  }`}
                  title={`Rate ${starVal} / 10`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFilled || starVal === rating ? 'fill-current' : ''
                    }`}
                  />
                  <span className="text-[10px] font-bold mt-0.5">{starVal}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Notes / Personal Reflections */}
        <div className="space-y-2">
          {!showNotesInput ? (
            <button
              type="button"
              onClick={() => setShowNotesInput(true)}
              className="text-xs text-[#B794F4] hover:text-[#F09BC5] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add personal reading notes / bookmarks log</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-[#1B1126] border border-[#241238] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F8F5FC] block">
                  Personal Reading Notes & Thoughts
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!notes.trim()) setShowNotesInput(false);
                  }}
                  className="text-[11px] text-[#B8AFC4] hover:text-white"
                >
                  Hide
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                onBlur={() => handleSave()}
                rows={2}
                placeholder="e.g. Left off at the festival chapter; volume 3 physical release has extra side stories..."
                className="w-full bg-[#160D20] text-xs text-[#F8F5FC] placeholder-[#B8AFC4]/50 p-3 rounded-xl border border-[#241238] focus:outline-none focus:border-[#F09BC5] transition-colors resize-none"
              />
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#241238]">
          <div className="flex items-center gap-2">
            {entry && (
              <button
                type="button"
                onClick={() => {
                  removeFromReadingList(work.id);
                  setHasUnsavedChanges(false);
                  showToast(`Removed "${work.title}" from your reading list`, 'watch');
                }}
                className="text-xs text-[#E879A9] hover:text-rose-400 font-semibold flex items-center gap-1 p-1 transition-colors"
                title="Remove from Reading List"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from List</span>
              </button>
            )}

            {chaptersRead > 0 && (
              <button
                type="button"
                onClick={() => {
                  setChaptersRead(0);
                  setVolumesRead(0);
                  setHasUnsavedChanges(true);
                  handleSave({ chapters: 0, volumes: 0 });
                }}
                className="text-xs text-[#B8AFC4]/60 hover:text-[#B8AFC4] flex items-center gap-1 p-1 transition-colors"
                title="Reset progress to 0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {status !== 'Completed' && (
              <button
                type="button"
                onClick={handleMarkAllCompleted}
                className="px-4 py-2 rounded-xl bg-[#241238] hover:bg-[#241238]/80 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Completed</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-[0_0_15px_rgba(240,155,197,0.4)] animate-pulse'
                  : 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md hover:opacity-90'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{hasUnsavedChanges ? 'Save Progress' : 'Saved'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
