import { UpdateItem } from '../types';

export const sampleUpdates: UpdateItem[] = [
  {
    id: 'up-item-1',
    title: 'Be On Cloud Announces New Drama Project "Shine"',
    description: 'During their annual executive showcase, Be On Cloud officially revealed "Shine", uniting Mile Phakphum and Apo Nattawin in a brand new romantic period production.',
    date: '2026-08-14',
    type: 'Announcement',
    relatedEntityId: 'series-kinnporsche',
    entityType: 'series',
    source: 'Be On Cloud Official Press Conference',
    verified: true
  },
  {
    id: 'up-item-2',
    title: 'Cherry Magic! Manga Reaches 3 Million Copies in Print',
    description: 'Square Enix and Yuu Toyota announced that the cumulative circulation of "Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!" has surpassed 3 million physical and digital copies.',
    date: '2026-08-01',
    type: 'Production',
    relatedEntityId: 'manga-cherry-magic',
    entityType: 'manga',
    source: 'Gangan Pixiv Official Twitter',
    verified: true
  },
  {
    id: 'up-item-3',
    title: 'Park Seo-ham Wraps Principal Photography on Period Epic',
    description: 'Actor Park Seo-ham has concluded filming on the upcoming historical drama "The Murky Stream", scheduled for worldwide streaming release in late 2026.',
    date: '2026-07-28',
    type: 'Filming',
    relatedEntityId: 'actor-park-seoham',
    entityType: 'actor',
    source: 'npio Entertainment Agency Statement',
    verified: true
  },
  {
    id: 'up-item-4',
    title: 'Mo Dao Zu Shi (The Untamed) 7th Anniversary Commemoration',
    description: 'Tencent Video and NewStyle Media commemorate the 7th anniversary of "The Untamed" with exclusive behind-the-scenes unreleased cuts and remastered soundtrack audio.',
    date: '2026-06-27',
    type: 'Premiere',
    relatedEntityId: 'series-the-untamed',
    entityType: 'series',
    source: 'Tencent Video Official Weibo',
    verified: true
  },
  {
    id: 'up-item-5',
    title: 'Bad Buddy Live Fan Gathering Welcomes International Fans in Bangkok',
    description: 'Nanon Korapat and Ohm Pawat greeted fans from across 30 countries at Union Hall Bangkok, celebrating the enduring legacy of the acclaimed GMMTV series.',
    date: '2026-08-20',
    type: 'Premiere',
    relatedEntityId: 'series-bad-buddy',
    entityType: 'series',
    source: 'GMMTV Official Press Release',
    verified: true
  }
];
