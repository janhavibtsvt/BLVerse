import { ComicWork, Series, Novel } from '../types';
import { getAllSeries } from '../data';

export interface AniListMedia {
  id: number;
  type?: 'MANGA' | 'ANIME';
  format?: string;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  countryOfOrigin?: string;
  description?: string;
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  chapters?: number | null;
  volumes?: number | null;
  episodes?: number | null;
  duration?: number | null;
  status?: string;
  startDate?: {
    year?: number;
  };
  genres?: string[];
  tags?: {
    name: string;
  }[];
  averageScore?: number;
  staff?: {
    nodes?: {
      name?: {
        full?: string;
      };
    }[];
  };
  studios?: {
    nodes?: {
      name?: string;
    }[];
  };
  siteUrl?: string;
}

// In-memory cache for fast responsive lookups
const mediaCache = new Map<string, ComicWork | Series | Novel>();

// Clean HTML tags and entities from descriptions
function sanitizeDescription(raw?: string): string {
  if (!raw) return 'No synopsis available for this title in the global registry.';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Convert AniList media node to our ComicWork interface
export function formatAniListToComicWork(media: AniListMedia): ComicWork {
  const origin = media.countryOfOrigin || 'JP';
  let type: 'manga' | 'manhwa' | 'manhua' = 'manga';
  let country = 'Japan';
  let language = 'Japanese';

  if (origin === 'KR') {
    type = 'manhwa';
    country = 'South Korea';
    language = 'Korean';
  } else if (origin === 'CN' || origin === 'TW') {
    type = 'manhua';
    country = origin === 'TW' ? 'Taiwan' : 'China';
    language = 'Chinese';
  }

  const title = media.title.english || media.title.romaji || media.title.native || 'Untitled Work';
  const originalTitle = media.title.native || media.title.romaji || undefined;
  const altTitles: string[] = [];
  if (media.title.romaji && media.title.romaji !== title) altTitles.push(media.title.romaji);
  if (media.title.native && media.title.native !== originalTitle) altTitles.push(media.title.native);

  const author = media.staff?.nodes?.[0]?.name?.full || 'Official Creator';
  const artist = media.staff?.nodes?.[1]?.name?.full || undefined;

  let status: 'Ongoing' | 'Completed' | 'Hiatus' = 'Ongoing';
  if (media.status === 'FINISHED') status = 'Completed';
  else if (media.status === 'HIATUS') status = 'Hiatus';

  const cover = media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || '/images/manga/cherry-magic.jpg';
  const rating = media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 8.5;

  // Determine if it is Yuri or Yaoi/BL
  const tagNames = (media.tags || []).map(t => t.name);
  const isYuri = tagNames.some(t => /yuri|girls/i.test(t)) || (media.genres || []).some(g => /yuri/i.test(g));
  const isYaoi = tagNames.some(t => /yaoi|boys/i.test(t)) || (media.genres || []).some(g => /boys|yaoi/i.test(g));

  const genres = [...(media.genres || ['Romance'])];
  if (isYuri && !genres.includes('Yuri')) genres.push('Yuri', "Girls' Love");
  if (isYaoi && !genres.includes("Boys' Love")) genres.push("Boys' Love", 'BL', 'Yaoi');

  const tags = [...tagNames.slice(0, 8)];
  if (isYuri && !tags.includes('Yuri')) tags.unshift('Yuri', "Girls' Love");
  if (isYaoi && !tags.includes("Boys' Love")) tags.unshift("Boys' Love", 'Yaoi');
  tags.push('Worldwide Registry');

  const work: ComicWork = {
    id: `anilist-${media.id}`,
    type,
    title,
    originalTitle,
    alternativeTitles: altTitles,
    cover,
    author,
    artist,
    country,
    language,
    status,
    year: media.startDate?.year || 2022,
    chapters: media.chapters || (status === 'Completed' ? 'Complete' : 'Ongoing'),
    volumes: media.volumes || undefined,
    genres,
    tags,
    synopsis: sanitizeDescription(media.description),
    platform: country === 'South Korea' ? 'Korean Webtoon Platform (Ridi/Bomtoon/Lezhin)' : country === 'China' ? 'Chinese Danmei Platform (Bilibili/Kuaikan)' : 'Japanese Manga Magazine',
    publisher: 'Global Comic Publisher',
    rating,
    adaptations: [],
    characterIds: [],
    officialSource: media.siteUrl || `https://anilist.co/manga/${media.id}`,
    lastUpdated: 'Live Global Index',
    isDemoSample: false
  };

  mediaCache.set(work.id, work);
  return work;
}

// Convert AniList media node to our Series interface
export function formatAniListToSeries(media: AniListMedia): Series {
  const origin = media.countryOfOrigin || 'JP';
  let country = 'Japan';
  let language = 'Japanese';
  if (origin === 'KR') {
    country = 'South Korea';
    language = 'Korean';
  } else if (origin === 'CN') {
    country = 'China';
    language = 'Chinese';
  }

  const title = media.title.english || media.title.romaji || media.title.native || 'Untitled Series';
  const altTitles: string[] = [];
  if (media.title.romaji && media.title.romaji !== title) altTitles.push(media.title.romaji);
  if (media.title.native) altTitles.push(media.title.native);

  const tagNames = (media.tags || []).map(t => t.name);
  const isYuri = tagNames.some(t => /yuri|girls/i.test(t));
  const isYaoi = tagNames.some(t => /yaoi|boys/i.test(t));

  const genres = [...(media.genres || ['Romance', 'Drama'])];
  if (isYuri && !genres.includes('Yuri')) genres.push('Yuri', "Girls' Love");
  if (isYaoi && !genres.includes("Boys' Love")) genres.push("Boys' Love", 'BL', 'Yaoi');

  const studioName = media.studios?.nodes?.[0]?.name || 'Animation Studio';
  const rating = media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 8.8;

  const series: Series = {
    id: `anilist-series-${media.id}`,
    title,
    alternativeTitles: altTitles,
    poster: media.coverImage?.extraLarge || media.coverImage?.large || '/images/series/bad-buddy.jpg',
    backdrop: media.bannerImage || media.coverImage?.extraLarge || '/images/series/bad-buddy.jpg',
    country,
    language,
    status: media.status === 'FINISHED' ? 'Completed' : 'Airing',
    releaseDate: media.startDate?.year ? `${media.startDate.year}-01-01` : '2023-01-01',
    year: media.startDate?.year || 2023,
    episodes: media.episodes || 12,
    runtime: media.duration ? `${media.duration} min` : '24 min',
    genres,
    tags: [...tagNames.slice(0, 6), 'Worldwide Series', isYuri ? 'Yuri Series' : 'BL Series'],
    synopsis: sanitizeDescription(media.description),
    platform: 'Worldwide Broadcast & Streaming',
    network: studioName,
    productionCompany: studioName,
    rating,
    cast: [],
    characterIds: [],
    trailers: [],
    episodesList: [],
    updates: [],
    officialSource: media.siteUrl || `https://anilist.co/anime/${media.id}`,
    lastUpdated: 'Live AniList Index',
    isDemoSample: false
  };

  mediaCache.set(series.id, series);
  return series;
}

// Convert AniList novel to Novel interface
export function formatAniListToNovel(media: AniListMedia): Novel {
  const title = media.title.english || media.title.romaji || media.title.native || 'Untitled Novel';
  const author = media.staff?.nodes?.[0]?.name?.full || 'Novel Author';
  const rating = media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 9.0;
  const tagNames = (media.tags || []).map(t => t.name);

  const novel: Novel = {
    id: `anilist-novel-${media.id}`,
    title,
    originalTitle: media.title.native || media.title.romaji,
    alternativeTitles: media.title.romaji && media.title.romaji !== title ? [media.title.romaji] : [],
    cover: media.coverImage?.extraLarge || media.coverImage?.large || '/images/manga/cherry-magic.jpg',
    author,
    type: 'light_novel',
    country: media.countryOfOrigin === 'KR' ? 'South Korea' : media.countryOfOrigin === 'CN' ? 'China' : 'Japan',
    language: media.countryOfOrigin === 'KR' ? 'Korean' : media.countryOfOrigin === 'CN' ? 'Chinese' : 'Japanese',
    publicationPlatform: 'Official Novel Publisher',
    status: media.status === 'FINISHED' ? 'Completed' : 'Ongoing',
    rating,
    year: media.startDate?.year || 2021,
    chapters: media.chapters || (media.status === 'FINISHED' ? 'Complete' : 'Ongoing'),
    volumes: media.volumes || undefined,
    genres: [...(media.genres || ['Romance']), "Boys' Love"],
    tags: [...tagNames.slice(0, 6), 'Global Novel'],
    synopsis: sanitizeDescription(media.description),
    adaptations: [],
    characterIds: [],
    officialSource: media.siteUrl || `https://anilist.co/manga/${media.id}`,
    lastUpdated: 'Live Global Index',
    isDemoSample: false
  };

  mediaCache.set(novel.id, novel);
  return novel;
}

export interface FetchWorldOptions {
  type?: 'manga' | 'manhwa' | 'manhua' | 'novel' | 'all';
  demographic?: 'all' | 'bl' | 'yuri' | 'yaoi' | 'gl' | 'danmei' | 'baihe';
  country?: string;
  genre?: string;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC' | 'TRENDING_DESC';
}

export interface WorldCatalogResult<T = ComicWork> {
  items: T[];
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export async function fetchWorldComics(options: FetchWorldOptions = {}): Promise<WorldCatalogResult<ComicWork>> {
  const {
    type = 'all',
    demographic = 'all',
    country: customCountry,
    genre,
    page = 1,
    perPage = 24,
    search,
    sort = 'POPULARITY_DESC'
  } = options;

  let countryOfOrigin: string | null = customCountry || null;
  if (!countryOfOrigin) {
    if (type === 'manga') countryOfOrigin = 'JP';
    else if (type === 'manhwa') countryOfOrigin = 'KR';
    else if (type === 'manhua') countryOfOrigin = 'CN';
  }

  // Determine tag filter based on demographic
  let targetTag: string | null = null;
  let targetTags: string[] | null = null;

  if (demographic === 'yuri' || demographic === 'gl') {
    targetTag = 'Yuri';
  } else if (demographic === 'baihe') {
    targetTag = 'Yuri';
    if (!countryOfOrigin) countryOfOrigin = 'CN';
  } else if (demographic === 'danmei') {
    targetTag = "Boys' Love";
    if (!countryOfOrigin) countryOfOrigin = 'CN';
  } else if (demographic === 'bl' || demographic === 'yaoi') {
    targetTag = "Boys' Love";
  } else {
    // 'all' demographic: search all global Boys' Love & Yuri works
    targetTags = ["Boys' Love", "Yuri"];
  }

  // Construct GraphQL query
  const query = `
    query ($page: Int, $perPage: Int, $search: String, $country: CountryCode, $tag: String, $tag_in: [String], $format: MediaFormat, $genre: String, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(
          type: MANGA,
          tag: $tag,
          tag_in: $tag_in,
          format: $format,
          genre: $genre,
          search: $search,
          countryOfOrigin: $country,
          sort: $sort
        ) {
          id
          title {
            romaji
            english
            native
          }
          countryOfOrigin
          description
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          chapters
          volumes
          status
          startDate {
            year
          }
          genres
          tags {
            name
          }
          averageScore
          staff(perPage: 2) {
            nodes {
              name {
                full
              }
            }
          }
          siteUrl
        }
      }
    }
  `;

  const variables: Record<string, any> = {
    page,
    perPage,
    sort: [sort]
  };

  if (targetTag) variables.tag = targetTag;
  else if (targetTags) variables.tag_in = targetTags;

  if (type === 'novel') variables.format = 'NOVEL';
  if (genre && genre !== 'All') variables.genre = genre;
  if (countryOfOrigin) variables.country = countryOfOrigin;
  if (search && search.trim()) variables.search = search.trim();

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`AniList returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    const mediaList: AniListMedia[] = data?.data?.Page?.media || [];
    const pageInfo = data?.data?.Page?.pageInfo || {
      total: mediaList.length,
      currentPage: page,
      lastPage: page,
      hasNextPage: false
    };

    const items = mediaList.map(formatAniListToComicWork);
    return { items, pageInfo };
  } catch (error) {
    console.error('Failed to fetch world BL/Yaoi/Yuri catalog:', error);
    return {
      items: [],
      pageInfo: {
        total: 0,
        currentPage: 1,
        lastPage: 1,
        hasNextPage: false
      }
    };
  }
}

// Fetch World Anime & Series Adaptations (Given, Sasaki and Miyano, Bloom Into You, etc.)
export async function fetchWorldAnimeSeries(options: {
  search?: string;
  demographic?: 'all' | 'bl' | 'yaoi' | 'yuri' | 'gl';
  country?: string;
  page?: number;
  perPage?: number;
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC' | 'TRENDING_DESC';
} = {}): Promise<WorldCatalogResult<Series>> {
  const { search, demographic = 'all', country, page = 1, perPage = 18, sort = 'POPULARITY_DESC' } = options;

  let targetTag: string | null = null;
  let targetTags: string[] | null = null;
  if (demographic === 'yuri' || demographic === 'gl') targetTag = 'Yuri';
  else if (demographic === 'bl' || demographic === 'yaoi') targetTag = "Boys' Love";
  else targetTags = ["Boys' Love", "Yuri"];

  const query = `
    query ($page: Int, $perPage: Int, $search: String, $tag: String, $tag_in: [String], $country: CountryCode, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(
          type: ANIME,
          tag: $tag,
          tag_in: $tag_in,
          countryOfOrigin: $country,
          search: $search,
          sort: $sort
        ) {
          id
          title {
            romaji
            english
            native
          }
          countryOfOrigin
          description
          coverImage {
            extraLarge
            large
          }
          bannerImage
          episodes
          duration
          status
          startDate {
            year
          }
          genres
          tags {
            name
          }
          averageScore
          studios(isMain: true) {
            nodes {
              name
            }
          }
          siteUrl
        }
      }
    }
  `;

  const variables: Record<string, any> = { page, perPage, sort: [sort] };
  if (targetTag) variables.tag = targetTag;
  else if (targetTags) variables.tag_in = targetTags;
  if (country) variables.country = country;
  if (search && search.trim()) variables.search = search.trim();

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) return { items: [], pageInfo: { total: 0, currentPage: 1, lastPage: 1, hasNextPage: false } };
    const data = await response.json();
    const mediaList: AniListMedia[] = data?.data?.Page?.media || [];
    const pageInfo = data?.data?.Page?.pageInfo || { total: mediaList.length, currentPage: page, lastPage: page, hasNextPage: false };
    const items = mediaList.map(formatAniListToSeries);
    return { items, pageInfo };
  } catch (error) {
    console.error('Failed to fetch world anime/series:', error);
    return { items: [], pageInfo: { total: 0, currentPage: 1, lastPage: 1, hasNextPage: false } };
  }
}

export interface FetchWorldSeriesOptions {
  medium?: 'all' | 'live_action' | 'anime';
  demographic?: 'all' | 'bl' | 'yaoi' | 'yuri' | 'gl';
  country?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC' | 'TRENDING_DESC';
}

// Fetch comprehensive world BL & GL series across all live action dramas and anime
export async function fetchComprehensiveWorldSeries(options: FetchWorldSeriesOptions = {}): Promise<WorldCatalogResult<Series>> {
  const {
    medium = 'all',
    demographic = 'all',
    country,
    search,
    page = 1,
    perPage = 24,
    sort = 'POPULARITY_DESC'
  } = options;

  let liveActionList: Series[] = [];
  if (medium === 'all' || medium === 'live_action') {
    const all = getAllSeries();
    liveActionList = all.filter(s => {
      const isAnime = s.genres.includes('Anime') || s.tags.includes('Anime') || s.tags.includes('Donghua');
      if (medium === 'live_action' && isAnime) return false;

      const isYuri = s.genres.includes('Yuri') || s.genres.includes("Girls' Love") || s.tags.includes('Yuri') || s.tags.includes('Yuri Series');
      const isBL = s.genres.includes("Boys' Love") || s.genres.includes('BL') || s.genres.includes('Yaoi') || !isYuri;

      if ((demographic === 'yuri' || demographic === 'gl') && !isYuri) return false;
      if ((demographic === 'bl' || demographic === 'yaoi') && !isBL) return false;

      if (country && country !== 'All' && s.country !== country) return false;

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchAlt = s.alternativeTitles?.some(t => t.toLowerCase().includes(q));
        const matchSynopsis = s.synopsis?.toLowerCase().includes(q);
        const matchTags = s.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAlt && !matchSynopsis && !matchTags) return false;
      }

      return true;
    });
  }

  let animeList: Series[] = [];
  let animeTotal = 0;
  if (medium === 'all' || medium === 'anime') {
    if (!country || country === 'All' || country === 'Japan' || country === 'China' || country === 'South Korea') {
      const animeResult = await fetchWorldAnimeSeries({
        search,
        demographic,
        country: country === 'Japan' ? 'JP' : country === 'China' ? 'CN' : country === 'South Korea' ? 'KR' : undefined,
        page: medium === 'anime' ? page : 1,
        perPage: medium === 'anime' ? perPage : 16,
        sort
      });
      animeList = animeResult.items;
      animeTotal = animeResult.pageInfo.total;
    }
  }

  if (medium === 'anime') {
    return {
      items: animeList,
      pageInfo: {
        total: animeTotal,
        currentPage: page,
        lastPage: Math.max(1, Math.ceil(animeTotal / perPage)),
        hasNextPage: page < Math.ceil(animeTotal / perPage)
      }
    };
  }

  // De-duplicate live action vs anime by title or id
  const seenIds = new Set<string>();
  const combined: Series[] = [];
  for (const s of [...liveActionList, ...animeList]) {
    if (!seenIds.has(s.id)) {
      seenIds.add(s.id);
      combined.push(s);
    }
  }

  combined.sort((a, b) => {
    if (sort === 'SCORE_DESC') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'START_DATE_DESC') return (b.year || 0) - (a.year || 0);
    return (b.rating || 0) - (a.rating || 0);
  });

  const total = combined.length;
  const startIdx = (page - 1) * perPage;
  const paginated = combined.slice(startIdx, startIdx + perPage);

  return {
    items: paginated,
    pageInfo: {
      total,
      currentPage: page,
      lastPage: Math.max(1, Math.ceil(total / perPage)),
      hasNextPage: startIdx + perPage < total
    }
  };
}

// Fetch World Comic by ID
export async function fetchWorldComicById(id: string): Promise<ComicWork | undefined> {
  const cleanId = id.replace(/^anilist-/, '').replace(/^series-/, '').replace(/^novel-/, '');
  const numericId = parseInt(cleanId, 10);
  if (isNaN(numericId)) return undefined;

  const cached = mediaCache.get(`anilist-${numericId}`);
  if (cached && 'chapters' in cached) return cached as ComicWork;

  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        countryOfOrigin
        description
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        chapters
        volumes
        status
        startDate {
          year
        }
        genres
        tags {
          name
        }
        averageScore
        staff(perPage: 3) {
          nodes {
            name {
              full
            }
          }
        }
        siteUrl
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables: { id: numericId } })
    });

    if (!response.ok) return undefined;

    const data = await response.json();
    const media: AniListMedia | undefined = data?.data?.Media;
    if (!media) return undefined;

    return formatAniListToComicWork(media);
  } catch (error) {
    console.error('Error fetching world comic by id:', error);
    return undefined;
  }
}

// Fetch World Series/Anime by ID
export async function fetchWorldSeriesById(id: string): Promise<Series | undefined> {
  const cleanId = id.replace(/^anilist-series-/, '').replace(/^anilist-/, '').replace(/^series-/, '');
  const numericId = parseInt(cleanId, 10);
  if (isNaN(numericId)) return undefined;

  const cached = mediaCache.get(`anilist-series-${numericId}`);
  if (cached && 'episodes' in cached) return cached as Series;

  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        countryOfOrigin
        description
        coverImage {
          extraLarge
          large
        }
        bannerImage
        episodes
        duration
        status
        startDate {
          year
        }
        genres
        tags {
          name
        }
        averageScore
        studios(isMain: true) {
          nodes {
            name
          }
        }
        siteUrl
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables: { id: numericId } })
    });

    if (!response.ok) return undefined;

    const data = await response.json();
    const media: AniListMedia | undefined = data?.data?.Media;
    if (!media) return undefined;

    return formatAniListToSeries(media);
  } catch (error) {
    console.error('Error fetching world series by id:', error);
    return undefined;
  }
}

// Fetch World Novel by ID
export async function fetchWorldNovelById(id: string): Promise<Novel | undefined> {
  const cleanId = id.replace(/^anilist-novel-/, '').replace(/^anilist-/, '').replace(/^novel-/, '');
  const numericId = parseInt(cleanId, 10);
  if (isNaN(numericId)) return undefined;

  const cached = mediaCache.get(`anilist-novel-${numericId}`);
  if (cached && 'type' in cached && (cached as Novel).type === 'light_novel') return cached as Novel;

  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        countryOfOrigin
        description
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        chapters
        volumes
        status
        startDate {
          year
        }
        genres
        tags {
          name
        }
        averageScore
        staff(perPage: 3) {
          nodes {
            name {
              full
            }
          }
        }
        siteUrl
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables: { id: numericId } })
    });

    if (!response.ok) return undefined;

    const data = await response.json();
    const media: AniListMedia | undefined = data?.data?.Media;
    if (!media) return undefined;

    return formatAniListToNovel(media);
  } catch (error) {
    console.error('Error fetching world novel by id:', error);
    return undefined;
  }
}
