import { CalendarEvent } from '../types';

export const sampleCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    date: '2026-09-04',
    title: 'Twilight Out of Focus Special Chapter',
    type: 'manga',
    linkId: 'manga-twilight-outfocus',
    status: 'Released',
    episodesOrChapter: 'Bonus Chapter',
    platform: 'Kodansha Honey Milk',
    poster: '/images/manga/twilight-out-of-focus.jpg'
  },
  {
    id: 'cal-2',
    date: '2026-09-12',
    title: 'Cherry Magic! Monthly Serialization Drop',
    type: 'manga',
    linkId: 'manga-cherry-magic',
    status: 'Released',
    episodesOrChapter: 'Chapter 76',
    platform: 'Pixiv Comic / Square Enix',
    poster: '/images/manga/cherry-magic.jpg'
  },
  {
    id: 'cal-3',
    date: '2026-09-22',
    title: 'BJ Alex Physical Deluxe Collector Boxset',
    type: 'manhwa',
    linkId: 'manhwa-bj-alex',
    status: 'Scheduled',
    episodesOrChapter: 'Collector Edition',
    platform: 'Seven Seas / Lezhin',
    poster: '/images/manhwa/bj-alex.jpg'
  },
  {
    id: 'cal-4',
    date: '2026-09-28',
    title: 'Heaven Official\'s Blessing - Autumn Serialization',
    type: 'manhua',
    linkId: 'manhua-tgcf',
    status: 'Scheduled',
    episodesOrChapter: 'New Episode Drop',
    platform: 'Bilibili Comics',
    poster: '/images/manhua/tgcf.jpg'
  },
  {
    id: 'cal-5',
    date: '2026-10-05',
    title: 'Jazz for Two - Special Blu-Ray Boxset Release',
    type: 'series',
    linkId: 'series-jazz-for-two',
    status: 'Upcoming',
    episodesOrChapter: 'Director\'s Cut Edition',
    platform: 'Wavve / IPQ Media',
    poster: '/images/series/jazz-for-two.jpg'
  },
  {
    id: 'cal-6',
    date: '2026-10-18',
    title: 'Shine (Be On Cloud) - Production Special Q&A',
    type: 'series',
    linkId: 'series-kinnporsche',
    status: 'Scheduled',
    episodesOrChapter: 'Press Showcase',
    platform: 'YouTube Live',
    poster: '/images/actors/mile-phakphum.jpg'
  },
  {
    id: 'cal-7',
    date: '2026-10-22',
    title: 'Cherry Magic! Volume 14 Release',
    type: 'manga',
    linkId: 'manga-cherry-magic',
    status: 'Upcoming',
    episodesOrChapter: 'Tankobon Volume 14',
    platform: 'Gangan Pixiv',
    poster: '/images/manga/cherry-magic.jpg'
  },
  {
    id: 'cal-8',
    date: '2026-11-15',
    title: 'Sasaki and Miyano Volume 11 Release',
    type: 'manga',
    linkId: 'manga-sasaki-to-miyano',
    status: 'Upcoming',
    episodesOrChapter: 'Volume 11 Release',
    platform: 'Kadokawa Media Factory',
    poster: '/images/manga/sasaki-to-miyano.jpg'
  }
];
