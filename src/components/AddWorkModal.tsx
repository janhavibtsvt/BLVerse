import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Sparkles, BookOpen, Film } from 'lucide-react';
import { saveCustomSeries, saveCustomComic, saveCustomNovel } from '../services/customWorks';
import { Series, ComicWork, Novel } from '../types';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'series' | 'manga' | 'manhwa' | 'manhua' | 'novel';
  initialTitle?: string;
  onAdded?: () => void;
}

export const AddWorkModal: React.FC<AddWorkModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'series',
  initialTitle = '',
  onAdded
}) => {
  const [workType, setWorkType] = useState<'series' | 'manga' | 'manhwa' | 'manhua' | 'novel'>(defaultType);
  const [title, setTitle] = useState(initialTitle);
  const [originalTitle, setOriginalTitle] = useState('');
  const [country, setCountry] = useState('Thailand');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('Completed');
  const [count, setCount] = useState(''); // episodes or chapters
  const [coverUrl, setCoverUrl] = useState('');
  const [authorOrCreator, setAuthorOrCreator] = useState('');
  const [genres, setGenres] = useState('Romance, Drama');
  const [synopsis, setSynopsis] = useState('');
  const [platform, setPlatform] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const genreList = genres.split(',').map(g => g.trim()).filter(Boolean);
    const id = `custom-${workType}-${Date.now()}`;
    const finalCover = coverUrl.trim() || (workType === 'series' ? '/images/series/kinnporsche.jpg' : '/images/manga/cherry-magic.jpg');

    if (workType === 'series') {
      const newSeries: Series = {
        id,
        title: title.trim(),
        alternativeTitles: originalTitle ? [originalTitle.trim()] : [],
        poster: finalCover,
        backdrop: finalCover,
        country,
        language: country === 'Thailand' ? 'Thai' : country === 'South Korea' ? 'Korean' : country === 'Japan' ? 'Japanese' : country === 'Taiwan' ? 'Mandarin' : 'English',
        status: status as any,
        releaseDate: `${year}-01-01`,
        year: Number(year),
        episodes: Number(count) || 12,
        runtime: '45 min',
        genres: genreList.length > 0 ? genreList : ['Romance', 'BL Series'],
        tags: ['Worldwide Registry', country],
        synopsis: synopsis.trim() || `${title} is a Boys' Love series from ${country}.`,
        platform: platform.trim() || 'Global Streaming / Local Broadcast',
        network: platform.trim() || 'Independent / Television',
        productionCompany: authorOrCreator.trim() || 'Production Studio',
        rating: 9.0,
        cast: [],
        characterIds: [],
        trailers: [],
        episodesList: [],
        updates: [],
        officialSource: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        isDemoSample: false
      };
      saveCustomSeries(newSeries);
    } else if (workType === 'novel') {
      const newNovel: Novel = {
        id,
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        alternativeTitles: originalTitle ? [originalTitle.trim()] : [],
        cover: finalCover,
        author: authorOrCreator.trim() || 'Author',
        type: 'web_novel',
        country,
        language: country === 'Thailand' ? 'Thai' : country === 'South Korea' ? 'Korean' : country === 'Japan' ? 'Japanese' : country === 'China' ? 'Chinese' : 'English',
        publicationPlatform: platform.trim() || 'Web Novel Publisher',
        status: status as any,
        year: Number(year),
        chapters: Number(count) || 50,
        volumes: 1,
        genres: genreList.length > 0 ? genreList : ['Romance', 'Danmei'],
        tags: ['Worldwide Registry'],
        synopsis: synopsis.trim() || `${title} is an original Boys' Love web novel from ${country}.`,
        adaptations: [],
        characterIds: [],
        officialSource: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        isDemoSample: false
      };
      saveCustomNovel(newNovel);
    } else {
      const newComic: ComicWork = {
        id,
        type: workType,
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        alternativeTitles: originalTitle ? [originalTitle.trim()] : [],
        cover: finalCover,
        author: authorOrCreator.trim() || 'Creator',
        artist: authorOrCreator.trim() || undefined,
        country,
        language: country === 'South Korea' ? 'Korean' : country === 'Japan' ? 'Japanese' : country === 'China' ? 'Chinese' : 'English',
        status: status as any,
        year: Number(year),
        chapters: count.trim() || 'Ongoing',
        genres: genreList.length > 0 ? genreList : ['Romance', "Boys' Love"],
        tags: ['Worldwide Registry', country],
        synopsis: synopsis.trim() || `${title} is a ${workType} comic from ${country}.`,
        platform: platform.trim() || 'Digital Platform',
        publisher: 'Publisher',
        rating: 9.0,
        adaptations: [],
        characterIds: [],
        officialSource: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        isDemoSample: false
      };
      saveCustomComic(newComic);
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      if (onAdded) onAdded();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#160D20] border border-[#3B1F56] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#F8F5FC]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#241238] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F09BC5]" />
            <h2 className="text-xl font-bold tracking-tight">Add Any Title to World BL Registry</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#B8AFC4] hover:text-white p-1 rounded-xl hover:bg-[#241238] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Title Successfully Added to World Registry!</h3>
            <p className="text-sm text-[#B8AFC4]">
              {title} is now available across your entire library, search, and detail views.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <p className="text-xs text-[#B8AFC4]">
              Add any series, manga, manhwa, manhua, or novel in existence — indie webcomics, upcoming 2026 dramas, or classic serials.
            </p>

            {/* Type selector */}
            <div className="grid grid-cols-5 gap-2">
              {(['series', 'manga', 'manhwa', 'manhua', 'novel'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setWorkType(t);
                    if (t === 'manga') setCountry('Japan');
                    else if (t === 'manhwa') setCountry('South Korea');
                    else if (t === 'manhua') setCountry('China');
                    else if (t === 'series') setCountry('Thailand');
                  }}
                  className={`py-2 px-1 text-center font-bold rounded-xl border text-[11px] capitalize transition-all ${
                    workType === t
                      ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white border-transparent shadow-[0_0_12px_rgba(240,155,197,0.3)]'
                      : 'bg-[#1B1126] border-[#241238] text-[#B8AFC4] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Title & Native Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My School President"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Original / Native Script
                </label>
                <input
                  type="text"
                  placeholder="e.g. แฟนผมเป็นประธานนักเรียน"
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
            </div>

            {/* Country & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                >
                  <option value="Thailand">Thailand</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Japan">Japan</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="China">China</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Release Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                >
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing / Airing</option>
                  <option value="Upcoming">Upcoming / Announced</option>
                </select>
              </div>
            </div>

            {/* Author / Creator & Episodes / Chapters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  {workType === 'series' ? 'Director / Studio' : 'Author / Creator'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. GMMTV / Author Name"
                  value={authorOrCreator}
                  onChange={(e) => setAuthorOrCreator(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  {workType === 'series' ? 'Episode Count' : 'Total Chapters'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
            </div>

            {/* Cover URL & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Cover / Poster Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://... (or leave blank for theme default)"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                  Platform / Network
                </label>
                <input
                  type="text"
                  placeholder="e.g. YouTube, Viki, Ridi, Bilibili"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Romance, School, Comedy, Mafia, Xianxia..."
                className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
              />
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-[11px] font-bold text-[#B8AFC4] uppercase tracking-wider mb-1">
                Synopsis / Description
              </label>
              <textarea
                rows={3}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Brief summary of the story, main pairing dynamics, and theme..."
                className="w-full bg-[#1B1126] border border-[#241238] rounded-xl px-3 py-2 text-[#F8F5FC] focus:outline-none focus:border-[#F09BC5]"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1B1126] border border-[#241238] text-[#B8AFC4] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white font-bold shadow-[0_0_15px_rgba(240,155,197,0.3)] hover:opacity-90 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Register Title
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
