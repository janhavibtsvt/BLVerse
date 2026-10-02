import { Series, ComicWork, Novel } from '../types';

const STORAGE_KEY_SERIES = 'blverse_custom_series';
const STORAGE_KEY_COMICS = 'blverse_custom_comics';
const STORAGE_KEY_NOVELS = 'blverse_custom_novels';

export function getCustomSeries(): Series[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERIES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomSeries(item: Series): void {
  try {
    const list = getCustomSeries().filter(s => s.id !== item.id);
    list.unshift(item);
    localStorage.setItem(STORAGE_KEY_SERIES, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom series:', e);
  }
}

export function getCustomComics(): ComicWork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMICS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomComic(item: ComicWork): void {
  try {
    const list = getCustomComics().filter(c => c.id !== item.id);
    list.unshift(item);
    localStorage.setItem(STORAGE_KEY_COMICS, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom comic:', e);
  }
}

export function getCustomNovels(): Novel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOVELS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomNovel(item: Novel): void {
  try {
    const list = getCustomNovels().filter(n => n.id !== item.id);
    list.unshift(item);
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom novel:', e);
  }
}
