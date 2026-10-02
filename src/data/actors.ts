import { Actor } from '../types';

export const sampleActors: Actor[] = [
  {
    id: 'actor-park-seoham',
    name: 'Park Seo-ham (박서함)',
    stageName: 'Park Seo-ham (formerly Park Seung-jun)',
    photo: '/images/actors/park-seoham.jpg',
    country: 'South Korea',
    nationality: 'South Korean',
    birthday: '1993-10-28',
    agency: 'npio Entertainment',
    biography: 'South Korean actor and former member of K-pop boy group KNK. Towering at 193 cm, Park garnered widespread critical acclaim and international breakout fame for his charismatic, nuanced portrayal of visual design star Jang Jae-young in the 2022 hit series "Semantic Error".',
    filmography: [
      {
        seriesId: 'series-semantic-error',
        seriesTitle: 'Semantic Error',
        seriesPoster: '/images/series/semantic-error.jpg',
        year: 2022,
        characterId: 'char-jaeyoung',
        characterName: 'Jang Jae-young',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [
      {
        title: 'The Murky Stream (Takryu)',
        role: 'Leading Role',
        type: 'Series',
        year: '2026',
        status: 'Post-Production',
        verified: true,
        source: 'Disney+ / Industry Press'
      }
    ],
    officialSource: 'https://www.instagram.com/parkseoham/',
    socialLinks: {
      instagram: 'parkseoham'
    },
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-park-jaechan',
    name: 'Park Jae-chan (박재찬)',
    stageName: 'Jaechan (DKZ)',
    photo: '/images/actors/park-jaechan.png',
    country: 'South Korea',
    nationality: 'South Korean',
    birthday: '2001-11-28',
    agency: 'Dongyo Entertainment',
    biography: 'South Korean idol singer and actor, member of DKZ. Jaechan received widespread accolades for his deadpan, razor-sharp, and endearing performance as computer science genius Chu Sang-woo in "Semantic Error", winning the Popularity Award at the 1st Blue Dragon Series Awards.',
    filmography: [
      {
        seriesId: 'series-semantic-error',
        seriesTitle: 'Semantic Error',
        seriesPoster: '/images/series/semantic-error.jpg',
        year: 2022,
        characterId: 'char-sangwoo',
        characterName: 'Chu Sang-woo',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [
      {
        title: 'Check-in Hanyang',
        role: 'Go Su-ra',
        type: 'Series',
        year: '2025/2026',
        status: 'Completed',
        verified: true,
        source: 'Channel A Drama'
      }
    ],
    officialSource: 'https://www.instagram.com/dkz_dy/',
    socialLinks: {
      instagram: 'jaechan_dkz'
    },
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-mile-phakphum',
    name: 'Mile Phakphum Romsaithong',
    stageName: 'Mile (มาย)',
    photo: '/images/actors/mile-phakphum.jpg',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1992-01-05',
    agency: 'Be On Cloud',
    biography: 'Thai actor, singer-songwriter, and businessman. Renowned for playing mafia heir Kinn Anakinn Theerapanyakul in "KinnPorsche The Series" and starring in the period mystery film "Man Suang". Appointed Dior Ambassador alongside Apo Nattawin.',
    filmography: [
      {
        seriesId: 'series-kinnporsche',
        seriesTitle: 'KinnPorsche The Series',
        seriesPoster: '/images/series/kinnporsche.jpg',
        year: 2022,
        characterId: 'char-kinn',
        characterName: 'Kinn Anakinn Theerapanyakul',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [
      {
        title: 'Shine (Be On Cloud)',
        role: 'Co-Lead',
        type: 'Series',
        year: '2026',
        status: 'Announced',
        verified: true,
        source: 'Be On Cloud Annual Showcase'
      }
    ],
    officialSource: 'https://www.instagram.com/milephakphum/',
    socialLinks: {
      instagram: 'milephakphum',
      twitter: 'milephakphum'
    },
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-apo-nattawin',
    name: 'Apo Nattawin Wattanagitiphat',
    stageName: 'Apo (อาโป)',
    photo: '/images/actors/apo-nattawin.jpg',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1994-02-24',
    agency: 'Be On Cloud',
    biography: 'Thai actor and model. Gained immense worldwide recognition for his physical prowess and charismatic charm portraying Porsche Pitchaya in "KinnPorsche The Series". Dior Global Brand Ambassador and lead of "Man Suang".',
    filmography: [
      {
        seriesId: 'series-kinnporsche',
        seriesTitle: 'KinnPorsche The Series',
        seriesPoster: '/images/series/kinnporsche.jpg',
        year: 2022,
        characterId: 'char-porsche',
        characterName: 'Porsche Pachara Kittisawat',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [
      {
        title: 'Shine',
        role: 'Co-Lead',
        type: 'Series',
        year: '2026',
        status: 'Announced',
        verified: true,
        source: 'Be On Cloud Official'
      }
    ],
    officialSource: 'https://www.instagram.com/nnattawin/',
    socialLinks: {
      instagram: 'nnattawin'
    },
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-bible-wichapas',
    name: 'Bible Wichapas Sumettikul',
    stageName: 'Bible (ไบเบิ้ล)',
    photo: '/images/actors/bible-wichapas.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1997-12-25',
    agency: 'Be On Cloud',
    biography: 'Thai-Chinese actor and mechanical engineering graduate. Rose to prominence for his complex, magnetic turn as Vegas in "KinnPorsche", followed by lead roles in "4MINUTES".',
    filmography: [
      {
        seriesId: 'series-kinnporsche',
        seriesTitle: 'KinnPorsche The Series',
        seriesPoster: '/images/series/kinnporsche.jpg',
        year: 2022,
        characterId: 'char-vegas',
        characterName: 'Vegas Kornwit Theerapanyakul',
        roleType: 'Second Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/biblesumett/',
    blWorksCount: 2,
    isDemoSample: false
  },
  {
    id: 'actor-build-jakapan',
    name: 'Build Jakapan Puttha',
    stageName: 'Build (บิว)',
    photo: '/images/actors/build-jakapan.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1994-06-04',
    agency: 'Independent',
    biography: 'Thai actor and musician known for portraying Pete, the loyal chief bodyguard of the main mafia family in "KinnPorsche The Series".',
    filmography: [
      {
        seriesId: 'series-kinnporsche',
        seriesTitle: 'KinnPorsche The Series',
        seriesPoster: '/images/series/kinnporsche.jpg',
        year: 2022,
        characterId: 'char-pete',
        characterName: 'Pete Phongsakorn Saengtham',
        roleType: 'Second Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/buildurluv/',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-akasow-eiji',
    name: 'Eiji Akaso (赤楚衛二)',
    stageName: 'Eiji Akaso',
    photo: '/images/actors/eiji-akaso.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1994-03-01',
    agency: 'Tristone Entertainment',
    biography: 'Prolific Japanese actor known for "Kamen Rider Build" before captivating audiences internationally as the endearing, mind-reading salaryman Kiyoshi Adachi in "Cherry Magic!".',
    filmography: [
      {
        seriesId: 'series-cherry-magic-jp',
        seriesTitle: 'Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!',
        seriesPoster: '/images/series/cherry-magic.jpg',
        year: 2020,
        characterId: 'char-adachi',
        characterName: 'Kiyoshi Adachi',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://tristone.co.jp/actors/akaso/',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-keita-machida',
    name: 'Keita Machida (町田啓太)',
    stageName: 'Keita Machida',
    photo: '/images/actors/keita-machida.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1990-07-04',
    agency: 'LDH Japan (Gekidan EXILE)',
    biography: 'Acclaimed Japanese actor, member of Gekidan EXILE. Known for "Alice in Borderland" and his polished, affectionate portrayal of Yuichi Kurosawa in "Cherry Magic!".',
    filmography: [
      {
        seriesId: 'series-cherry-magic-jp',
        seriesTitle: 'Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!',
        seriesPoster: '/images/series/cherry-magic.jpg',
        year: 2020,
        characterId: 'char-kurosawa',
        characterName: 'Yuichi Kurosawa',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://m.tribe-m.jp/artist/index/40',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-riku-hagiwara',
    name: 'Riku Hagiwara (萩原利久)',
    stageName: 'Riku Hagiwara',
    photo: '/images/actors/riku-hagiwara.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1999-02-28',
    agency: 'TopCoat',
    biography: 'Japanese actor with deep character immersion. Critically celebrated for his intense, gaze-driven depiction of Hira Kazunari in "Utsukushii Kare (My Beautiful Man)".',
    filmography: [
      {
        seriesId: 'series-utsukushii-kare',
        seriesTitle: 'My Beautiful Man (Utsukushii Kare)',
        seriesPoster: '/images/series/my-beautiful-man.jpg',
        year: 2021,
        characterId: 'char-hira',
        characterName: 'Hira Kazunari',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://topcoat.co.jp/riku_hagiwara',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-yusei-yagi',
    name: 'Yusei Yagi (八木勇征)',
    stageName: 'Yusei Yagi',
    photo: '/images/actors/yusei-yagi.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1997-05-06',
    agency: 'LDH Japan',
    biography: 'Vocalist of J-pop group FANTASTICS from EXILE TRIBE. Won the Asian Star Prize at the Seoul International Drama Awards for his performance as Kiyoi Sou in "My Beautiful Man".',
    filmography: [
      {
        seriesId: 'series-utsukushii-kare',
        seriesTitle: 'My Beautiful Man (Utsukushii Kare)',
        seriesPoster: '/images/series/my-beautiful-man.jpg',
        year: 2021,
        characterId: 'char-kiyoi',
        characterName: 'Kiyoi Sou',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://m.tribe-m.jp/artist/index/168',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-nanon-korapat',
    name: 'Nanon Korapat Kirdpan',
    stageName: 'Nanon (นนน)',
    photo: '/images/actors/nanon-korapat.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '2000-12-18',
    agency: 'GMMTV',
    biography: 'Prominent Thai actor and singer under RISER MUSIC / GMMTV. Starred in "The Gifted" before his celebrated role as Pran in "Bad Buddy Series", which won widespread domestic and international accolades.',
    filmography: [
      {
        seriesId: 'series-bad-buddy',
        seriesTitle: 'Bad Buddy Series',
        seriesPoster: '/images/series/bad-buddy.jpg',
        year: 2021,
        characterId: 'char-pran',
        characterName: 'Pran Parakul',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.gmm-tv.com/artists/nanon-korapat/',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-ohm-pawat',
    name: 'Ohm Pawat Chittsawangdee',
    stageName: 'Ohm (โอม)',
    photo: '/images/actors/ohm-pawat.jpg',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '2000-03-22',
    agency: 'GMMTV',
    biography: 'Thai actor with an extensive filmography including "He\'s Coming To Me" and "Bad Buddy Series" as Pat Napat, known for his high energy and emotional depth on screen.',
    filmography: [
      {
        seriesId: 'series-bad-buddy',
        seriesTitle: 'Bad Buddy Series',
        seriesPoster: '/images/series/bad-buddy.jpg',
        year: 2021,
        characterId: 'char-pat',
        characterName: 'Pat Napat',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.gmm-tv.com/artists/ohm-pawat/',
    blWorksCount: 4,
    isDemoSample: false
  },
  {
    id: 'actor-xiao-zhan',
    name: 'Xiao Zhan (肖战)',
    stageName: 'Sean Xiao',
    photo: '/images/actors/xiao-zhan.jpg',
    country: 'China',
    nationality: 'Chinese',
    birthday: '1991-10-05',
    agency: 'Xiao Zhan Studio',
    biography: 'Chinese actor and singer, member of X Nine. Achieved historic worldwide acclaim for his spirited and deeply moving portrayal of Wei Wuxian in "The Untamed (Chen Qing Ling)", breaking global streaming records.',
    filmography: [
      {
        seriesId: 'series-the-untamed',
        seriesTitle: 'The Untamed (Chen Qing Ling)',
        seriesPoster: '/images/series/the-untamed.jpg',
        year: 2019,
        characterId: 'char-weiwuxian',
        characterName: 'Wei Wuxian',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://weibo.com/u/1792951112',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-wang-yibo',
    name: 'Wang Yibo (王一博)',
    stageName: 'Wang Yibo',
    photo: '/images/actors/wang-yibo.jpg',
    country: 'China',
    nationality: 'Chinese',
    birthday: '1997-08-05',
    agency: 'Yuehua Entertainment',
    biography: 'Chinese actor, dancer, singer, and professional motorcycle racer. Won global acclaim for his dignified, subtle, and iconic portrayal of Lan Wangji in "The Untamed".',
    filmography: [
      {
        seriesId: 'series-the-untamed',
        seriesTitle: 'The Untamed (Chen Qing Ling)',
        seriesPoster: '/images/series/the-untamed.jpg',
        year: 2019,
        characterId: 'char-lanwangji',
        characterName: 'Lan Wangji',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://weibo.com/u/5492443184',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-shunsuke-michieda',
    name: 'Shunsuke Michieda (道枝駿佑)',
    stageName: 'Michie (Naniwa Danshi)',
    photo: '/images/actors/shunsuke-michieda.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '2002-07-25',
    agency: 'STARTO ENTERTAINMENT (Naniwa Danshi)',
    biography: 'Japanese idol and actor with Naniwa Danshi. Rose to prominence for his delicate, highly expressive comedy and tenderness as Aoki in TV Asahi\'s "Kieta Hatsukoi (My Love Mix-Up!)".',
    filmography: [
      {
        seriesId: 'series-kieta-hatsukoi-jp',
        seriesTitle: 'My Love Mix-Up! (Kieta Hatsukoi)',
        seriesPoster: '/images/series/my-love-mixup.jpg',
        year: 2021,
        characterId: 'char-aoki',
        characterName: 'Sota Aoki',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.johnnys-net.jp',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-ren-meguro',
    name: 'Ren Meguro (目黒蓮)',
    stageName: 'Meme (Snow Man)',
    photo: '/images/actors/ren-meguro.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1997-02-16',
    agency: 'STARTO ENTERTAINMENT (Snow Man)',
    biography: 'Japanese idol and actor with Snow Man. Gained immense praise for his sincere, principled portrayal of high-schooler Kousuke Ida in "Kieta Hatsukoi (My Love Mix-Up!)" and subsequent dramatic roles like "Silent".',
    filmography: [
      {
        seriesId: 'series-kieta-hatsukoi-jp',
        seriesTitle: 'My Love Mix-Up! (Kieta Hatsukoi)',
        seriesPoster: '/images/series/my-love-mixup.jpg',
        year: 2021,
        characterId: 'char-ida',
        characterName: 'Kousuke Ida',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://mentrecording.jp/snowman/',
    blWorksCount: 1,
    isDemoSample: false
  },
  {
    id: 'actor-billkin',
    name: 'Billkin Putthipong Assaratanakul',
    stageName: 'Billkin (บิวกิ้น)',
    photo: '/images/actors/billkin.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1999-10-08',
    agency: 'Billkin Entertainment',
    biography: 'Acclaimed Thai singer and actor. Won numerous Best Actor awards for his tour-de-force performance as Teh in Nadao Bangkok\'s "I Told Sunset About You" and starred in the blockbuster film "How to Make Millions Before Grandma Dies".',
    filmography: [
      {
        seriesId: 'series-i-told-sunset-about-you',
        seriesTitle: 'I Told Sunset About You',
        seriesPoster: '/images/series/i-told-sunset.jpg',
        year: 2020,
        characterId: 'char-teh',
        characterName: 'Teh Kritpratheep',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/bbillkin/',
    blWorksCount: 2,
    isDemoSample: false
  },
  {
    id: 'actor-pp-krit',
    name: 'PP Krit Amnuaydechkorn',
    stageName: 'PP Krit (พีพี)',
    photo: '/images/actors/pp-krit.jpg',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1999-04-30',
    agency: 'PP Krit Entertainment',
    biography: 'Thai singer, actor, and fashion icon. Appointed Balenciaga Brand Ambassador. Won international critical acclaim for his performance as Oh-aew in "I Told Sunset About You" and "I Promised You the Moon".',
    filmography: [
      {
        seriesId: 'series-i-told-sunset-about-you',
        seriesTitle: 'I Told Sunset About You',
        seriesPoster: '/images/series/i-told-sunset.jpg',
        year: 2020,
        characterId: 'char-oh-aew',
        characterName: 'Oh-aew',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/pp.kritt/',
    blWorksCount: 2,
    isDemoSample: false
  },
  {
    id: 'actor-gun-atthaphan',
    name: 'Gun Atthaphan Phunsawat',
    stageName: 'Gun (กัน)',
    photo: '/images/actors/gun-atthaphan.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1993-10-04',
    agency: 'GMMTV',
    biography: 'Celebrated Thai actor with master-class acting capabilities since childhood. Known for iconic dual-role performances as Black and White in "Not Me", and classic series "Theory of Love" and "Senior Secret Love: Puppy Honey".',
    filmography: [
      {
        seriesId: 'series-not-me',
        seriesTitle: 'Not Me Series',
        seriesPoster: '/images/series/not-me.jpg',
        year: 2021,
        characterId: 'char-white-black',
        characterName: 'White / Black',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/gun_atthaphan/',
    blWorksCount: 5,
    isDemoSample: false
  },
  {
    id: 'actor-off-jumpol',
    name: 'Off Jumpol Adulkittiporn',
    stageName: 'Off (ออฟ)',
    photo: '/images/actors/off-jumpol.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1991-01-20',
    agency: 'GMMTV',
    biography: 'Thai actor, host, and fashion entrepreneur. Half of the legendary "OffGun" pair. Delivered a powerful, gritty turn as motorcycle vigilante Sean in "Not Me" and Khai in "Theory of Love".',
    filmography: [
      {
        seriesId: 'series-not-me',
        seriesTitle: 'Not Me Series',
        seriesPoster: '/images/series/not-me.jpg',
        year: 2021,
        characterId: 'char-sean',
        characterName: 'Sean',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/tumcial/',
    blWorksCount: 5,
    isDemoSample: false
  },
  {
    id: 'actor-mew-suppasit',
    name: 'Mew Suppasit Jongcheveevat',
    stageName: 'Mew (มิว)',
    photo: '/images/actors/mew-suppasit.png',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1991-02-21',
    agency: 'Mew Suppasit Studio',
    biography: 'Thai actor, singer, and producer holding an engineering master degree. Gained worldwide fame as music major Tharn Kirigun in "TharnType The Series".',
    filmography: [
      {
        seriesId: 'series-tharntype',
        seriesTitle: 'TharnType The Series',
        seriesPoster: '/images/series/tharntype.jpg',
        year: 2019,
        characterId: 'char-tharn',
        characterName: 'Tharn Kirigun',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/mewsuppasit/',
    blWorksCount: 2,
    isDemoSample: false
  },
  {
    id: 'actor-gulf-kanawut',
    name: 'Gulf Kanawut Traipipattanapong',
    stageName: 'Gulf (กลัฟ)',
    photo: '/images/actors/gulf-kanawut.jpg',
    country: 'Thailand',
    nationality: 'Thai',
    birthday: '1997-12-04',
    agency: 'Channel 3 Thailand',
    biography: 'Thai actor, model, and Gucci Ambassador. Rose to international prominence for his fiery and heartfelt portrayal of Type Thiwat in "TharnType The Series".',
    filmography: [
      {
        seriesId: 'series-tharntype',
        seriesTitle: 'TharnType The Series',
        seriesPoster: '/images/series/tharntype.jpg',
        year: 2019,
        characterId: 'char-type',
        characterName: 'Type Thiwat',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/gulfkanawut/',
    blWorksCount: 2,
    isDemoSample: false
  },
  {
    id: 'actor-kouhei-takeda',
    name: 'Kouhei Takeda (武田航平)',
    stageName: 'Kouhei Takeda',
    photo: '/images/actors/kouhei-takeda.jpg',
    country: 'Japan',
    nationality: 'Japanese',
    birthday: '1986-01-14',
    agency: 'A.L.C. Atlantis',
    biography: 'Japanese actor with a storied career spanning "Kamen Rider Kiva" and "Kamen Rider Build". Gained wide international acclaim in BL for his tender, nuanced portrayal of 39-year-old manager Nozue in "Old Fashion Cupcake".',
    filmography: [
      {
        seriesId: 'series-old-fashion-cupcake',
        seriesTitle: 'Old Fashion Cupcake',
        seriesPoster: '/images/actors/kouhei-takeda.jpg',
        year: 2022,
        characterId: 'char-nozue',
        characterName: 'Nozue',
        roleType: 'Main Lead'
      }
    ],
    upcomingWorks: [],
    officialSource: 'https://www.instagram.com/kouhei_takeda.official/',
    blWorksCount: 1,
    isDemoSample: false
  }
];
