import { AdaptationChain } from '../types';

export const sampleAdaptationChains: AdaptationChain[] = [
  {
    id: 'chain-semantic-error',
    name: 'The Semantic Error Universe',
    universeTitle: 'Semantic Error (시맨틱 에러)',
    description: 'Traces the evolution from Jeo Soori\'s 2018 hit Ridi web novel into an acclaimed full-color webtoon by Angy, culminating in Watcha\'s culture-defining 2022 live-action drama.',
    originalWork: {
      id: 'novel-semantic-error',
      type: 'novel',
      title: 'Semantic Error (Original Web Novel)',
      author: 'Jeo Soori (저수리)',
      cover: '/images/novels/semantic-error.jpg',
      year: 2018
    },
    intermediateWorks: [
      {
        id: 'manhwa-semantic-error',
        type: 'manhwa',
        title: 'Semantic Error Webtoon Adaptation',
        cover: '/images/manhwa/semantic-error.jpg',
        year: 2020,
        notes: 'Art by Angy (Kim Angy); serialized on Ridi Books & Manta Comics.'
      }
    ],
    screenWorks: [
      {
        id: 'series-semantic-error',
        type: 'series',
        title: 'Semantic Error: Watcha Original Series',
        poster: '/images/series/semantic-error.jpg',
        year: 2022,
        status: 'Completed (8 Episodes + The Movie)',
        platform: 'Watcha / Viki / GagaOOLala'
      }
    ],
    timeline: [
      {
        stage: 'Original Web Novel Serialized',
        date: '2018',
        title: 'Web Novel Debut on Ridi Books',
        description: 'Jeo Soori publishes the 5-volume story of Chu Sang-woo and Jang Jae-young, winning the Ridi Web Novel Grand Prize.'
      },
      {
        stage: 'Webtoon Adaptation Launched',
        date: '2020',
        title: 'Full-Color Manhwa by Angy',
        description: 'Illustrated by Angy, the manhwa visualizes Jae-young\'s teasing smirk and iconic crimson jacket, building massive international fandom.'
      },
      {
        stage: 'Live-Action Drama Announced & Cast',
        date: 'Late 2021',
        title: 'Watcha Production Announcement',
        description: 'Watcha announces live-action drama with Park Seo-ham and DKZ\'s Jaechan officially cast as the leads.'
      },
      {
        stage: 'Live-Action Premiere & Phenomenon',
        date: 'February 2022',
        title: 'Series Release & Chart Domination',
        description: 'The series tops Watcha streaming rankings for months and wins multiple awards at the Blue Dragon Series Awards.'
      },
      {
        stage: 'Theatrical Release',
        date: 'August 2022',
        title: 'Semantic Error: The Movie',
        description: 'Remastered theatrical compilation version premieres in CGV theaters across South Korea.'
      }
    ]
  },
  {
    id: 'chain-cherry-magic',
    name: 'The Cherry Magic Multi-Adaptation Universe',
    universeTitle: 'Cherry Magic! (30歳まで童貞だと魔法使いになれるらしい)',
    description: 'Originating as a Twitter and Pixiv manga by Yuu Toyota, CheriMaho spawned a hit Japanese live-action TV series, a feature film, an anime adaptation, and an official Thai remake by GMMTV.',
    originalWork: {
      id: 'manga-cherry-magic',
      type: 'manga',
      title: 'Cherry Magic! Manga',
      author: 'Yuu Toyota (豊田悠)',
      cover: '/images/manga/cherry-magic.jpg',
      year: 2018
    },
    screenWorks: [
      {
        id: 'series-cherry-magic-jp',
        type: 'series',
        title: 'Cherry Magic Japan (TV Tokyo Series)',
        poster: '/images/series/cherry-magic.jpg',
        year: 2020,
        status: 'Completed (12 Episodes)',
        platform: 'TV Tokyo'
      },
      {
        id: 'series-cherry-magic-th',
        type: 'series',
        title: 'Cherry Magic Thailand (GMMTV)',
        poster: '/images/series/cherry-magic.jpg',
        year: 2023,
        status: 'Completed (12 Episodes)',
        platform: 'GMMTV / Viu'
      }
    ],
    timeline: [
      {
        stage: 'Manga Web Debut',
        date: '2018',
        title: 'Pixiv Serialization',
        description: 'Yuu Toyota begins publishing the comedy on Pixiv; Square Enix serializes official volumes.'
      },
      {
        stage: 'Japanese Live Action Premiere',
        date: 'October 2020',
        title: 'TV Tokyo Series starring Eiji Akaso & Keita Machida',
        description: 'The series becomes a global sensation, praising healthy communication and gentle pacing.'
      },
      {
        stage: 'Feature Film Release',
        date: 'April 2022',
        title: 'Cherry Magic: The Movie',
        description: 'Theatrical release in Japan exploring Adachi\'s transfer to Nagasaki.'
      },
      {
        stage: 'International Adaptation',
        date: 'December 2023',
        title: 'Thai Remake starring Tay Tawan & New Thitipoom',
        description: 'GMMTV produces official Thai adaptation "Cherry Magic 30 ยังซิง with TayNew.'
      }
    ]
  },
  {
    id: 'chain-kinnporsche',
    name: 'The KinnPorsche Underworld Universe',
    universeTitle: 'KinnPorsche Story (รักโคตรร้าย สุดท้ายโคตรรัก)',
    description: 'From online serial novel on Tunwalai to Be On Cloud\'s groundbreaking high-budget mafia production that revolutionized Thai BL production scale.',
    originalWork: {
      id: 'novel-kinnporsche',
      type: 'novel',
      title: 'KinnPorsche Story Novel',
      author: 'Daemi',
      cover: '/images/novels/kinnporsche.jpg',
      year: 2020
    },
    screenWorks: [
      {
        id: 'series-kinnporsche',
        type: 'series',
        title: 'KinnPorsche The Series: La Forte',
        poster: '/images/series/kinnporsche.jpg',
        year: 2022,
        status: 'Completed (14 Episodes)',
        platform: 'iQIYI / One31'
      }
    ],
    timeline: [
      {
        stage: 'Novel Publication',
        date: '2020',
        title: 'Tunwalai / Dek-D Serialization',
        description: 'Authored by Daemi, depicting the raw, high-intensity mafia intrigue between Kinn and Porsche.'
      },
      {
        stage: 'Production Relaunch with Be On Cloud',
        date: '2021',
        title: 'Be On Cloud Takes Helm',
        description: 'Pond Krisda and Be On Cloud take over production, completely elevating stunt choreography and cinematography.'
      },
      {
        stage: 'Global Premiere on iQIYI',
        date: 'April 2022',
        title: 'International Phenomenon',
        description: 'KinnPorsche The Series premieres uncensored on iQIYI, trending #1 worldwide on Twitter each Saturday.'
      },
      {
        stage: 'World Tour',
        date: 'July - October 2022',
        title: 'KinnPorsche World Tour',
        description: 'Cast embarks on high-production stadium concerts across Asia.'
      }
    ]
  },
  {
    id: 'chain-utsukushii-kare',
    name: 'The Utsukushii Kare (My Beautiful Man) Universe',
    universeTitle: 'Utsukushii Kare (美しい彼)',
    description: 'Yu Nagira\'s psychological novel series adapted into manga by Megumi Kitano, followed by MBS\'s Galaxy Award-winning drama series and eternal movie conclusion.',
    originalWork: {
      id: 'novel-utsukushii-kare',
      type: 'novel',
      title: 'Utsukushii Kare (Chara Bunko)',
      author: 'Yu Nagira (凪良ゆう)',
      cover: '/images/novels/utsukushii-kare.jpg',
      year: 2014
    },
    intermediateWorks: [
      {
        id: 'manga-utsukushii-kare',
        type: 'manga',
        title: 'Utsukushii Kare Manga Adaptation',
        cover: '/images/manga/my-beautiful-man.jpg',
        year: 2021,
        notes: 'Serialized in Chara Selection with art by Megumi Kitano.'
      }
    ],
    screenWorks: [
      {
        id: 'series-utsukushii-kare',
        type: 'series',
        title: 'My Beautiful Man (Season 1 & 2)',
        poster: '/images/series/my-beautiful-man.jpg',
        year: 2021,
        status: 'Completed',
        platform: 'MBS / GagaOOLala'
      }
    ],
    timeline: [
      {
        stage: 'Novel Debut',
        date: '2014',
        title: 'Chara Bunko Publication',
        description: 'Yu Nagira releases the first volume of the Hira & Kiyoi story.'
      },
      {
        stage: 'MBS Season 1 Broadcast',
        date: 'November 2021',
        title: 'Drama Tokku Debut',
        description: 'Directed by Mai Sakai, starring Riku Hagiwara and Yusei Yagi.'
      },
      {
        stage: 'Season 2 & Feature Film',
        date: 'Early 2023',
        title: 'My Beautiful Man: Eternal Film',
        description: 'Season 2 airs on MBS, followed by the nationwide Japanese theatrical release of "Eternal".'
      }
    ]
  },
  {
    id: 'chain-mdzs',
    name: 'The Grandmaster of Demonic Cultivation Saga',
    universeTitle: 'Mo Dao Zu Shi (魔道祖师)',
    description: 'Mo Xiang Tong Xiu\'s epic Xianxia web novel adapted across manhua, audio drama, donghua anime, and the landmark 50-episode live action series The Untamed.',
    originalWork: {
      id: 'novel-mdzs',
      type: 'novel',
      title: 'Mo Dao Zu Shi (JJWXC Web Novel)',
      author: 'Mo Xiang Tong Xiu (墨香铜臭)',
      cover: '/images/novels/mdzs.jpg',
      year: 2015
    },
    intermediateWorks: [
      {
        id: 'manhua-mdzs',
        type: 'manhua',
        title: 'Mo Dao Zu Shi Manhua',
        cover: '/images/manhua/mdzs.jpg',
        year: 2017,
        notes: '259 chapters by Luo Di Cheng Qiu on Kuaikan Manhua.'
      }
    ],
    screenWorks: [
      {
        id: 'series-the-untamed',
        type: 'series',
        title: 'The Untamed (陈情令)',
        poster: '/images/series/the-untamed.jpg',
        year: 2019,
        status: 'Completed (50 Episodes)',
        platform: 'Tencent Video / WeTV / Netflix'
      }
    ],
    timeline: [
      {
        stage: 'Web Novel Serialized',
        date: '2015 - 2016',
        title: 'JJWXC Serialization',
        description: 'Mo Xiang Tong Xiu publishes the tale of Wei Wuxian and Lan Wangji.'
      },
      {
        stage: 'Audio Drama & Manhua',
        date: '2017',
        title: 'Multi-Media Expansion',
        description: 'Critically acclaimed audio drama and Kuaikan manhua launched.'
      },
      {
        stage: 'Live Action Release',
        date: 'June 2019',
        title: 'The Untamed Broadcast on Tencent',
        description: 'Starring Xiao Zhan and Wang Yibo, achieving over 10 billion streams worldwide.'
      }
    ]
  }
];
