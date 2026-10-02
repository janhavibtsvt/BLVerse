import { sampleNovels } from './novels';
import { sampleManga } from './manga';
import { sampleManhwa } from './manhwa';
import { sampleManhua } from './manhua';
import { sampleSeries } from './series';
import { curatedAdditionalSeries, curatedAdditionalManga, curatedAdditionalManhwa } from './curatedWorks';
import { sampleActors } from './actors';
import { sampleCharacters } from './characters';
import { sampleAdaptationChains } from './adaptations';
import { sampleUpcomingReleases } from './upcoming';
import { sampleUpdates } from './updates';
import { sampleCalendarEvents } from './calendar';
import { ContentType, Series, ComicWork, Novel, Character, Actor, AdaptationChain } from '../types';
import { getCustomSeries, getCustomComics, getCustomNovels } from '../services/customWorks';

export {
  sampleNovels,
  sampleManga,
  sampleManhwa,
  sampleManhua,
  sampleSeries,
  sampleActors,
  sampleCharacters,
  sampleAdaptationChains,
  sampleUpcomingReleases,
  sampleUpdates,
  sampleCalendarEvents
};

function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

export const masterSeriesList: Series[] = deduplicateById([
  ...sampleSeries,
  ...curatedAdditionalSeries
]);

export const masterMangaList: ComicWork[] = deduplicateById([
  ...sampleManga,
  ...curatedAdditionalManga
]);

export const masterManhwaList: ComicWork[] = deduplicateById([
  ...sampleManhwa,
  ...curatedAdditionalManhwa
]);

export const masterManhuaList: ComicWork[] = deduplicateById([
  ...sampleManhua
]);

export const allComics: ComicWork[] = [
  ...masterMangaList,
  ...masterManhwaList,
  ...masterManhuaList
];

export function getAllSeries(): Series[] {
  return [...getCustomSeries(), ...masterSeriesList];
}

export function getAllComics(): ComicWork[] {
  return [...getCustomComics(), ...allComics];
}

export function getAllManga(): ComicWork[] {
  const custom = getCustomComics().filter(c => c.type === 'manga');
  return [...custom, ...masterMangaList];
}

export function getAllManhwa(): ComicWork[] {
  const custom = getCustomComics().filter(c => c.type === 'manhwa');
  return [...custom, ...masterManhwaList];
}

export function getAllManhua(): ComicWork[] {
  const custom = getCustomComics().filter(c => c.type === 'manhua');
  return [...custom, ...masterManhuaList];
}

export function getAllNovels(): Novel[] {
  return [...getCustomNovels(), ...sampleNovels];
}

export function getSeriesById(id: string): Series | undefined {
  const custom = getCustomSeries().find(s => s.id === id);
  if (custom) return custom;
  return masterSeriesList.find(s => s.id === id);
}

export function getComicById(id: string): ComicWork | undefined {
  const custom = getCustomComics().find(c => c.id === id);
  if (custom) return custom;
  return allComics.find(c => c.id === id);
}

export function getMangaById(id: string): ComicWork | undefined {
  const custom = getCustomComics().find(c => c.id === id && c.type === 'manga');
  if (custom) return custom;
  return masterMangaList.find(c => c.id === id);
}

export function getManhwaById(id: string): ComicWork | undefined {
  const custom = getCustomComics().find(c => c.id === id && c.type === 'manhwa');
  if (custom) return custom;
  return masterManhwaList.find(c => c.id === id);
}

export function getManhuaById(id: string): ComicWork | undefined {
  const custom = getCustomComics().find(c => c.id === id && c.type === 'manhua');
  if (custom) return custom;
  return masterManhuaList.find(c => c.id === id);
}

export function getNovelById(id: string): Novel | undefined {
  const custom = getCustomNovels().find(n => n.id === id);
  if (custom) return custom;
  return sampleNovels.find(n => n.id === id);
}

export function getCharacterById(id: string): Character | undefined {
  return sampleCharacters.find(c => c.id === id);
}

export function getActorById(id: string): Actor | undefined {
  return sampleActors.find(a => a.id === id);
}

export function getAdaptationChainById(id: string): AdaptationChain | undefined {
  return sampleAdaptationChains.find(ch => ch.id === id);
}

export function getSourceMaterialByEntity(entity: { sourceMaterialId?: string; sourceMaterialType?: string }) {
  if (!entity.sourceMaterialId) return undefined;
  if (entity.sourceMaterialType === 'novel') {
    return { type: 'novel' as const, data: getNovelById(entity.sourceMaterialId) };
  }
  if (entity.sourceMaterialType === 'manga') {
    return { type: 'manga' as const, data: getMangaById(entity.sourceMaterialId) };
  }
  if (entity.sourceMaterialType === 'manhwa') {
    return { type: 'manhwa' as const, data: getManhwaById(entity.sourceMaterialId) };
  }
  if (entity.sourceMaterialType === 'manhua') {
    return { type: 'manhua' as const, data: getManhuaById(entity.sourceMaterialId) };
  }
  return undefined;
}

export interface SearchResultCategory {
  category: 'Series' | 'Manga' | 'Manhwa' | 'Manhua' | 'Novels' | 'Actors' | 'Characters';
  items: {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    type: ContentType | 'actor' | 'character';
    url: string;
    genres?: string[];
    tags?: string[];
    country?: string;
  }[];
}

export function searchAllEntities(query: string): SearchResultCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultCategory[] = [];

  // Series
  const seriesMatches = getAllSeries().filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.alternativeTitles.some(t => t.toLowerCase().includes(q)) ||
    s.country.toLowerCase().includes(q) ||
    s.genres.some(g => g.toLowerCase().includes(q)) ||
    s.tags.some(t => t.toLowerCase().includes(q)) ||
    s.cast.some(c => c.actorName.toLowerCase().includes(q) || c.characterName.toLowerCase().includes(q))
  ).map(s => ({
    id: s.id,
    title: s.title,
    subtitle: `${s.country} • ${s.year} • ${s.status}`,
    image: s.poster,
    type: 'series' as const,
    url: `/series/${s.id}`,
    genres: s.genres,
    tags: s.tags,
    country: s.country
  }));

  if (seriesMatches.length > 0) {
    results.push({ category: 'Series', items: seriesMatches });
  }

  // Manga
  const mangaMatches = getAllManga().filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
    m.alternativeTitles.some(t => t.toLowerCase().includes(q)) ||
    m.author.toLowerCase().includes(q) ||
    (m.artist && m.artist.toLowerCase().includes(q)) ||
    m.genres.some(g => g.toLowerCase().includes(q)) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  ).map(m => ({
    id: m.id,
    title: m.title,
    subtitle: `${m.author} • ${m.chapters} Chapters`,
    image: m.cover,
    type: 'manga' as const,
    url: `/manga/${m.id}`,
    genres: m.genres,
    tags: m.tags,
    country: m.country
  }));

  if (mangaMatches.length > 0) {
    results.push({ category: 'Manga', items: mangaMatches });
  }

  // Manhwa
  const manhwaMatches = getAllManhwa().filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
    m.alternativeTitles.some(t => t.toLowerCase().includes(q)) ||
    m.author.toLowerCase().includes(q) ||
    (m.artist && m.artist.toLowerCase().includes(q)) ||
    m.genres.some(g => g.toLowerCase().includes(q)) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  ).map(m => ({
    id: m.id,
    title: m.title,
    subtitle: `${m.author} • ${m.chapters} Chapters`,
    image: m.cover,
    type: 'manhwa' as const,
    url: `/manhwa/${m.id}`,
    genres: m.genres,
    tags: m.tags,
    country: m.country
  }));

  if (manhwaMatches.length > 0) {
    results.push({ category: 'Manhwa', items: manhwaMatches });
  }

  // Manhua
  const manhuaMatches = getAllManhua().filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
    m.alternativeTitles.some(t => t.toLowerCase().includes(q)) ||
    m.author.toLowerCase().includes(q) ||
    (m.artist && m.artist.toLowerCase().includes(q)) ||
    m.genres.some(g => g.toLowerCase().includes(q)) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  ).map(m => ({
    id: m.id,
    title: m.title,
    subtitle: `${m.author} • ${m.chapters} Chapters`,
    image: m.cover,
    type: 'manhua' as const,
    url: `/manhua/${m.id}`,
    genres: m.genres,
    tags: m.tags,
    country: m.country
  }));

  if (manhuaMatches.length > 0) {
    results.push({ category: 'Manhua', items: manhuaMatches });
  }

  // Novels
  const novelMatches = getAllNovels().filter(n =>
    n.title.toLowerCase().includes(q) ||
    (n.originalTitle && n.originalTitle.toLowerCase().includes(q)) ||
    n.alternativeTitles.some(t => t.toLowerCase().includes(q)) ||
    n.author.toLowerCase().includes(q) ||
    n.genres.some(g => g.toLowerCase().includes(q)) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  ).map(n => ({
    id: n.id,
    title: n.title,
    subtitle: `${n.author} • ${n.country} Novel`,
    image: n.cover,
    type: 'novel' as const,
    url: `/novels/${n.id}`,
    genres: n.genres,
    tags: n.tags,
    country: n.country
  }));

  if (novelMatches.length > 0) {
    results.push({ category: 'Novels', items: novelMatches });
  }

  // Actors
  const actorMatches = sampleActors.filter(a =>
    a.name.toLowerCase().includes(q) ||
    (a.stageName && a.stageName.toLowerCase().includes(q)) ||
    a.country.toLowerCase().includes(q)
  ).map(a => ({
    id: a.id,
    title: a.name,
    subtitle: `${a.country} • ${a.blWorksCount} Works`,
    image: a.photo,
    type: 'actor' as const,
    url: `/actors/${a.id}`
  }));

  if (actorMatches.length > 0) {
    results.push({ category: 'Actors', items: actorMatches });
  }

  // Characters
  const charMatches = sampleCharacters.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.alternativeNames.some(t => t.toLowerCase().includes(q)) ||
    (c.actorName && c.actorName.toLowerCase().includes(q)) ||
    (c.seriesTitle && c.seriesTitle.toLowerCase().includes(q))
  ).map(c => ({
    id: c.id,
    title: c.name,
    subtitle: c.seriesTitle ? `From ${c.seriesTitle}` : c.role,
    image: c.image,
    type: 'character' as const,
    url: `/characters/${c.id}`
  }));

  if (charMatches.length > 0) {
    results.push({ category: 'Characters', items: charMatches });
  }

  return results;
}
