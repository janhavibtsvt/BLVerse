import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserPreferences, WatchlistStatus, ReadingStatus, ReadingListEntry, ContentType } from '../types';
import { CheckCircle2, Bookmark, PlayCircle, X } from 'lucide-react';

interface UserContextType {
  preferences: UserPreferences;
  isFavorited: (id: string) => boolean;
  toggleFavorite: (id: string, type: ContentType | 'actor' | 'character') => void;
  getWatchlistEntry: (seriesId: string) => { status: WatchlistStatus; rating?: number; notes?: string; addedAt?: string } | undefined;
  updateWatchlist: (seriesId: string, status: WatchlistStatus, rating?: number, notes?: string) => void;
  removeFromWatchlist: (seriesId: string) => void;
  toggleWatchlistStatus: (seriesId: string, status: 'Want to Watch' | 'Watching', seriesTitle?: string) => void;
  setWatchlistStatus: (seriesId: string, status: WatchlistStatus, rating?: number, notes?: string) => void;
  getReadingEntry: (workId: string) => ReadingListEntry | undefined;
  updateReadingList: (
    workId: string,
    type: 'manga' | 'manhwa' | 'manhua' | 'novel',
    status: ReadingStatus,
    progressChapters?: number,
    rating?: number,
    progressVolumes?: number,
    notes?: string,
    totalChapters?: number | string,
    totalVolumes?: number | string
  ) => void;
  saveReadingProgress: (entry: {
    workId: string;
    workTitle?: string;
    type: 'manga' | 'manhwa' | 'manhua' | 'novel';
    status?: ReadingStatus;
    progressChapters?: number;
    progressVolumes?: number;
    totalChapters?: number | string;
    totalVolumes?: number | string;
    rating?: number;
    notes?: string;
  }) => void;
  removeFromReadingList: (workId: string) => void;
  toggleNotification: (releaseId: string) => void;
  isNotificationSubscribed: (releaseId: string) => boolean;
  showToast: (message: string, iconType?: 'watch' | 'favorite' | 'general') => void;
}

const STORAGE_KEY = 'blverse_user_preferences_v1';

const defaultPreferences: UserPreferences = {
  favorites: {
    seriesIds: ['series-semantic-error', 'series-kinnporsche'],
    mangaIds: ['manga-cherry-magic'],
    manhwaIds: ['manhwa-semantic-error'],
    manhuaIds: ['manhua-mdzs'],
    novelIds: ['novel-mdzs'],
    characterIds: ['char-sangwoo', 'char-jaeyoung'],
    actorIds: ['actor-park-seoham', 'actor-park-jaechan']
  },
  watchlist: [
    {
      seriesId: 'series-semantic-error',
      status: 'Completed',
      rating: 10,
      notes: 'Absolute masterpiece. Incredible chemistry between Jaechan and Seoham!',
      addedAt: '2026-05-10'
    },
    {
      seriesId: 'series-kinnporsche',
      status: 'Completed',
      rating: 10,
      notes: 'Revolutionary cinematography and stunt choreography for Thai BL.',
      addedAt: '2026-06-01'
    },
    {
      seriesId: 'series-utsukushii-kare',
      status: 'Want to Watch',
      addedAt: '2026-07-20'
    },
    {
      seriesId: 'series-bad-buddy',
      status: 'Watching',
      addedAt: '2026-08-05'
    }
  ],
  readingList: [
    {
      workId: 'manga-cherry-magic',
      type: 'manga',
      status: 'Reading',
      progressChapters: 65,
      rating: 9,
      addedAt: '2026-06-15'
    },
    {
      workId: 'manhwa-semantic-error',
      type: 'manhwa',
      status: 'Completed',
      progressChapters: 85,
      rating: 10,
      addedAt: '2026-05-12'
    },
    {
      workId: 'novel-mdzs',
      type: 'novel',
      status: 'Reading',
      progressChapters: 80,
      rating: 10,
      addedAt: '2026-07-01'
    }
  ],
  notifications: ['up-rel-1', 'up-rel-3'],
  theme: 'dark'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse local preferences:', e);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to persist preferences:', e);
    }
  }, [preferences]);

  const [toast, setToast] = useState<{ message: string; iconType: 'watch' | 'favorite' | 'general' } | null>(null);

  const showToast = useCallback((message: string, iconType: 'watch' | 'favorite' | 'general' = 'general') => {
    setToast({ message, iconType });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleWatchlistStatus = useCallback((seriesId: string, status: 'Want to Watch' | 'Watching', seriesTitle?: string) => {
    setPreferences(prev => {
      const current = prev.watchlist.find(w => w.seriesId === seriesId);
      // Check if already in target status (accounting for legacy 'Plan to Watch')
      const isAlreadyTarget = current && (
        current.status === status || 
        (status === 'Want to Watch' && current.status === 'Plan to Watch')
      );

      if (isAlreadyTarget) {
        // Toggle OFF (remove from collection profile)
        const updated = prev.watchlist.filter(w => w.seriesId !== seriesId);
        showToast(
          seriesTitle 
            ? `Removed "${seriesTitle}" from your collection profile`
            : `Removed from ${status}`,
          'watch'
        );
        return { ...prev, watchlist: updated };
      } else {
        // Toggle ON or Switch to target status (save to collection profile)
        const others = prev.watchlist.filter(w => w.seriesId !== seriesId);
        const newEntry = {
          seriesId,
          status,
          rating: current?.rating,
          notes: current?.notes,
          addedAt: current?.addedAt || new Date().toISOString().split('T')[0]
        };
        showToast(
          seriesTitle
            ? `Saved "${seriesTitle}" to your collection (${status}) ✦`
            : `Saved to collection profile (${status}) ✦`,
          'watch'
        );
        return {
          ...prev,
          watchlist: [...others, newEntry]
        };
      }
    });
  }, [showToast]);

  const setWatchlistStatus = useCallback((seriesId: string, status: WatchlistStatus, rating?: number, notes?: string) => {
    setPreferences(prev => {
      const existing = prev.watchlist.filter(w => w.seriesId !== seriesId);
      const prevEntry = prev.watchlist.find(w => w.seriesId === seriesId);
      return {
        ...prev,
        watchlist: [
          ...existing,
          {
            seriesId,
            status,
            rating: rating !== undefined ? rating : prevEntry?.rating,
            notes: notes !== undefined ? notes : prevEntry?.notes,
            addedAt: prevEntry?.addedAt || new Date().toISOString().split('T')[0]
          }
        ]
      };
    });
  }, []);

  const isFavorited = (id: string): boolean => {
    const { favorites } = preferences;
    return (
      favorites.seriesIds.includes(id) ||
      favorites.mangaIds.includes(id) ||
      favorites.manhwaIds.includes(id) ||
      favorites.manhuaIds.includes(id) ||
      favorites.novelIds.includes(id) ||
      favorites.characterIds.includes(id) ||
      favorites.actorIds.includes(id)
    );
  };

  const toggleFavorite = (id: string, type: ContentType | 'actor' | 'character') => {
    setPreferences(prev => {
      const favs = { ...prev.favorites };
      let key: keyof typeof favs;

      switch (type) {
        case 'series': key = 'seriesIds'; break;
        case 'manga': key = 'mangaIds'; break;
        case 'manhwa': key = 'manhwaIds'; break;
        case 'manhua': key = 'manhuaIds'; break;
        case 'novel': key = 'novelIds'; break;
        case 'character': key = 'characterIds'; break;
        case 'actor': key = 'actorIds'; break;
        default: return prev;
      }

      const list = favs[key];
      const exists = list.includes(id);
      favs[key] = exists ? list.filter(item => item !== id) : [...list, id];

      return { ...prev, favorites: favs };
    });
  };

  const getWatchlistEntry = (seriesId: string) => {
    return preferences.watchlist.find(w => w.seriesId === seriesId);
  };

  const updateWatchlist = (seriesId: string, status: WatchlistStatus, rating?: number, notes?: string) => {
    setPreferences(prev => {
      const existing = prev.watchlist.filter(w => w.seriesId !== seriesId);
      return {
        ...prev,
        watchlist: [
          ...existing,
          {
            seriesId,
            status,
            rating,
            notes,
            addedAt: new Date().toISOString().split('T')[0]
          }
        ]
      };
    });
  };

  const removeFromWatchlist = (seriesId: string) => {
    setPreferences(prev => ({
      ...prev,
      watchlist: prev.watchlist.filter(w => w.seriesId !== seriesId)
    }));
  };

  const getReadingEntry = (workId: string): ReadingListEntry | undefined => {
    return preferences.readingList.find(r => r.workId === workId);
  };

  const updateReadingList = (
    workId: string,
    type: 'manga' | 'manhwa' | 'manhua' | 'novel',
    status: ReadingStatus,
    progressChapters?: number,
    rating?: number,
    progressVolumes?: number,
    notes?: string,
    totalChapters?: number | string,
    totalVolumes?: number | string
  ) => {
    setPreferences(prev => {
      const existing = prev.readingList.filter(r => r.workId !== workId);
      const prevEntry = prev.readingList.find(r => r.workId === workId);
      return {
        ...prev,
        readingList: [
          ...existing,
          {
            workId,
            type,
            status,
            progressChapters: progressChapters !== undefined ? progressChapters : prevEntry?.progressChapters,
            progressVolumes: progressVolumes !== undefined ? progressVolumes : prevEntry?.progressVolumes,
            totalChapters: totalChapters !== undefined ? totalChapters : prevEntry?.totalChapters,
            totalVolumes: totalVolumes !== undefined ? totalVolumes : prevEntry?.totalVolumes,
            rating: rating !== undefined ? rating : prevEntry?.rating,
            notes: notes !== undefined ? notes : prevEntry?.notes,
            lastReadAt: new Date().toISOString(),
            addedAt: prevEntry?.addedAt || new Date().toISOString().split('T')[0]
          }
        ]
      };
    });
  };

  const saveReadingProgress = useCallback((data: {
    workId: string;
    workTitle?: string;
    type: 'manga' | 'manhwa' | 'manhua' | 'novel';
    status?: ReadingStatus;
    progressChapters?: number;
    progressVolumes?: number;
    totalChapters?: number | string;
    totalVolumes?: number | string;
    rating?: number;
    notes?: string;
  }) => {
    setPreferences(prev => {
      const prevEntry = prev.readingList.find(r => r.workId === data.workId);
      const existing = prev.readingList.filter(r => r.workId !== data.workId);

      const targetStatus: ReadingStatus = data.status || prevEntry?.status || 'Reading';
      const updatedChapters = data.progressChapters !== undefined ? data.progressChapters : (prevEntry?.progressChapters ?? 0);
      const updatedVolumes = data.progressVolumes !== undefined ? data.progressVolumes : (prevEntry?.progressVolumes ?? 0);

      const newEntry: ReadingListEntry = {
        workId: data.workId,
        type: data.type,
        status: targetStatus,
        progressChapters: updatedChapters,
        progressVolumes: updatedVolumes,
        totalChapters: data.totalChapters !== undefined ? data.totalChapters : prevEntry?.totalChapters,
        totalVolumes: data.totalVolumes !== undefined ? data.totalVolumes : prevEntry?.totalVolumes,
        rating: data.rating !== undefined ? data.rating : prevEntry?.rating,
        notes: data.notes !== undefined ? data.notes : prevEntry?.notes,
        lastReadAt: new Date().toISOString(),
        addedAt: prevEntry?.addedAt || new Date().toISOString().split('T')[0]
      };

      const title = data.workTitle || 'Reading Progress';
      showToast(
        `Updated "${title}" progress: Ch. ${updatedChapters}${updatedVolumes > 0 ? `, Vol. ${updatedVolumes}` : ''} (${targetStatus}) ✦`,
        'watch'
      );

      return {
        ...prev,
        readingList: [...existing, newEntry]
      };
    });
  }, [showToast]);

  const removeFromReadingList = (workId: string) => {
    setPreferences(prev => ({
      ...prev,
      readingList: prev.readingList.filter(r => r.workId !== workId)
    }));
  };

  const toggleNotification = (releaseId: string) => {
    setPreferences(prev => {
      const exists = prev.notifications.includes(releaseId);
      return {
        ...prev,
        notifications: exists
          ? prev.notifications.filter(id => id !== releaseId)
          : [...prev.notifications, releaseId]
      };
    });
  };

  const isNotificationSubscribed = (releaseId: string): boolean => {
    return preferences.notifications.includes(releaseId);
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
        isFavorited,
        toggleFavorite,
        getWatchlistEntry,
        updateWatchlist,
        removeFromWatchlist,
        toggleWatchlistStatus,
        setWatchlistStatus,
        getReadingEntry,
        updateReadingList,
        saveReadingProgress,
        removeFromReadingList,
        toggleNotification,
        isNotificationSubscribed,
        showToast
      }}
    >
      {children}

      {/* Floating Status Notification Toast */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#160D20]/95 border border-[#F09BC5]/40 backdrop-blur-xl text-white text-xs font-semibold shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(240,155,197,0.25)] animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <p className="flex-1 text-[#F8F5FC] leading-snug">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-[#B8AFC4] hover:text-white transition-colors p-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
