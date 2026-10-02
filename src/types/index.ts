export type ContentType = 'series' | 'manga' | 'manhwa' | 'manhua' | 'novel';

export type SeriesStatus = 'Completed' | 'Airing' | 'Upcoming' | 'Announced' | 'Post-Production';
export type ComicStatus = 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled';
export type NovelStatus = 'Completed' | 'Ongoing' | 'Licensed';

export type WatchlistStatus = 'Want to Watch' | 'Plan to Watch' | 'Watching' | 'Completed' | 'On Hold' | 'Dropped';
export type ReadingListStatus = 'Want to Read' | 'Reading' | 'Completed' | 'On Hold' | 'Dropped';
export type ReadingStatus = ReadingListStatus;

export type AdaptationStepType = 'novel' | 'manga' | 'manhwa' | 'manhua' | 'series' | 'anime' | 'audio_drama';

export interface AdaptationRef {
  id: string;
  type: AdaptationStepType;
  title: string;
  year?: number;
  status?: string;
  note?: string;
}

export interface CastMember {
  actorId: string;
  actorName: string;
  actorPhoto?: string;
  characterId: string;
  characterName: string;
  characterPhoto?: string;
  roleType: 'Main Lead' | 'Second Lead' | 'Supporting' | 'Guest';
}

export interface EpisodeInfo {
  episodeNumber: number;
  title: string;
  airDate: string;
  status: 'Aired' | 'Scheduled' | 'Delayed';
  synopsis?: string;
  duration?: string;
}

export interface TrailerInfo {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  releaseDate: string;
  type: 'Teaser' | 'Official Trailer' | 'OST Video' | 'Behind The Scenes';
}

export interface UpdateItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'Announcement' | 'Casting' | 'Filming' | 'Trailer' | 'Premiere' | 'Release Date' | 'Production';
  relatedEntityId: string;
  entityType: ContentType | 'actor';
  source: string;
  verified: boolean;
}

export interface Series {
  id: string;
  title: string;
  alternativeTitles: string[];
  poster: string;
  backdrop: string;
  country: 'Thailand' | 'Japan' | 'South Korea' | 'Taiwan' | 'China' | 'Philippines' | 'Vietnam' | string;
  language: string;
  status: SeriesStatus;
  releaseDate: string;
  year: number;
  episodes: number;
  runtime: string;
  genres: string[];
  tags: string[];
  synopsis: string;
  platform: string;
  network: string;
  productionCompany: string;
  rating?: number; // e.g., 8.9 / 10
  sourceMaterialId?: string;
  sourceMaterialType?: 'novel' | 'manga' | 'manhwa' | 'manhua';
  sourceMaterialTitle?: string;
  cast: CastMember[];
  characterIds: string[];
  trailers: TrailerInfo[];
  episodesList: EpisodeInfo[];
  updates: UpdateItem[];
  officialSource: string;
  lastUpdated: string;
  isDemoSample?: boolean;
}

export interface ComicWork {
  id: string;
  type: 'manga' | 'manhwa' | 'manhua';
  title: string;
  originalTitle?: string;
  alternativeTitles: string[];
  cover: string;
  author: string;
  artist?: string;
  country: 'Japan' | 'South Korea' | 'China' | 'Taiwan' | string;
  language: string;
  status: ComicStatus;
  year: number;
  chapters: number | string;
  volumes?: number | string;
  genres: string[];
  tags: string[];
  synopsis: string;
  platform: string;
  publisher: string;
  rating?: number;
  sourceMaterialId?: string;
  sourceMaterialType?: 'novel';
  sourceMaterialTitle?: string;
  adaptations: AdaptationRef[];
  characterIds: string[];
  officialSource: string;
  lastUpdated: string;
  isDemoSample?: boolean;
}

export interface Novel {
  id: string;
  title: string;
  originalTitle?: string;
  alternativeTitles: string[];
  cover: string;
  author: string;
  type: 'web_novel' | 'light_novel' | 'published_novel';
  country: string;
  language: string;
  publicationPlatform: string;
  platform?: string;
  publisher?: string;
  status: NovelStatus;
  rating?: number;
  year?: number;
  chapters: number | string;
  volumes?: number | string;
  genres: string[];
  tags: string[];
  synopsis: string;
  adaptations: AdaptationRef[];
  characterIds: string[];
  officialSource: string;
  lastUpdated: string;
  isDemoSample?: boolean;
}

export interface RelationshipEdge {
  targetCharacterId: string;
  targetCharacterName: string;
  type: 'Love interest' | 'Partner' | 'Friend' | 'Rival' | 'Family' | 'Colleague' | 'Ex-Partner';
  description: string;
}

export interface Character {
  id: string;
  name: string;
  alternativeNames: string[];
  image: string;
  description: string;
  personality: string;
  role: 'Main Character' | 'Protagonist' | 'Deuteragonist' | 'Supporting Character';
  seriesId?: string;
  seriesTitle?: string;
  sourceMaterialId?: string;
  sourceMaterialType?: 'novel' | 'manga' | 'manhwa' | 'manhua';
  sourceMaterialTitle?: string;
  actorId?: string;
  actorName?: string;
  relationships: RelationshipEdge[];
  appearances: {
    id: string;
    type: ContentType;
    title: string;
  }[];
  isDemoSample?: boolean;
}

export interface FilmographyItem {
  seriesId: string;
  seriesTitle: string;
  seriesPoster: string;
  year: number;
  characterId: string;
  characterName: string;
  roleType: string;
}

export interface UpcomingWork {
  title: string;
  role: string;
  type: 'Series' | 'Movie' | 'Special';
  year: string;
  status: string;
  verified: boolean;
  source?: string;
}

export interface Actor {
  id: string;
  name: string;
  stageName?: string;
  photo: string;
  country: string;
  nationality: string;
  birthday?: string;
  agency?: string;
  biography: string;
  filmography: FilmographyItem[];
  upcomingWorks: UpcomingWork[];
  officialSource: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
  blWorksCount: number;
  isDemoSample?: boolean;
}

export interface AdaptationChain {
  id: string;
  name: string;
  universeTitle: string;
  description: string;
  originalWork: {
    id: string;
    type: 'novel' | 'manga';
    title: string;
    author: string;
    cover: string;
    year: number;
  };
  intermediateWorks?: {
    id: string;
    type: 'manga' | 'manhwa' | 'manhua' | 'audio_drama';
    title: string;
    cover: string;
    year: number;
    notes?: string;
  }[];
  screenWorks: {
    id: string;
    type: 'series' | 'movie' | 'anime';
    title: string;
    poster: string;
    year: number;
    status: string;
    platform: string;
  }[];
  timeline: {
    stage: string;
    date: string;
    title: string;
    description: string;
  }[];
}

export interface UpcomingReleaseItem {
  id: string;
  title: string;
  type: 'BL Series' | 'Manga' | 'Manhwa' | 'Manhua' | 'Adaptation';
  expectedReleaseDate: string;
  releaseDateVerified: boolean;
  country: string;
  status: 'Announced' | 'Casting' | 'Filming' | 'Trailer Released' | 'Release Date Announced' | 'Upcoming' | 'Delayed' | 'Completed';
  source: string;
  lastUpdated: string;
  poster: string;
  genres: string[];
  platform?: string;
  description?: string;
  linkId?: string;
  linkType?: ContentType;
  basedOn?: string;
  isDemoSample?: boolean;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'series' | 'manga' | 'manhwa' | 'manhua';
  linkId?: string;
  status: string;
  episodesOrChapter?: string;
  platform?: string;
  poster?: string;
}

export interface WatchlistEntry {
  seriesId: string;
  status: WatchlistStatus;
  rating?: number;
  notes?: string;
  addedAt: string;
}

export interface ReadingListEntry {
  workId: string;
  type: 'manga' | 'manhwa' | 'manhua' | 'novel';
  status: ReadingListStatus;
  progressChapters?: number;
  progressVolumes?: number;
  totalChapters?: number | string;
  totalVolumes?: number | string;
  rating?: number;
  notes?: string;
  lastReadAt?: string;
  addedAt: string;
}

export interface UserPreferences {
  favorites: {
    seriesIds: string[];
    mangaIds: string[];
    manhwaIds: string[];
    manhuaIds: string[];
    novelIds: string[];
    characterIds: string[];
    actorIds: string[];
  };
  watchlist: WatchlistEntry[];
  readingList: ReadingListEntry[];
  notifications: string[];
  theme?: string;
  recentlyViewed?: {
    id: string;
    type: ContentType | 'actor' | 'character';
    title: string;
    image: string;
    viewedAt: string;
  }[];
}
