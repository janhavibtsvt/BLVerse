import { Character } from '../types';

export const sampleCharacters: Character[] = [
  {
    id: 'char-sangwoo',
    name: 'Chu Sang-woo (추상우)',
    alternativeNames: ['Sang-woo', 'Junior Chu'],
    image: '/images/actors/park-jaechan.png',
    description: 'A third-year computer science student at Hankuk University who lives strictly by timetables, algorithmic logic, and routines. Detests disruptions and unearned credit.',
    personality: 'Pragmatic, methodical, introverted, fiercely honest, secretly deeply caring.',
    role: 'Protagonist',
    seriesId: 'series-semantic-error',
    seriesTitle: 'Semantic Error',
    sourceMaterialId: 'novel-semantic-error',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Semantic Error Novel',
    actorId: 'actor-park-jaechan',
    actorName: 'Park Jae-chan',
    relationships: [
      {
        targetCharacterId: 'char-jaeyoung',
        targetCharacterName: 'Jang Jae-young',
        type: 'Love interest',
        description: 'From an intolerable system bug into his most cherished human variable.'
      }
    ],
    appearances: [
      { id: 'novel-semantic-error', type: 'novel', title: 'Semantic Error (Novel)' },
      { id: 'manhwa-semantic-error', type: 'manhwa', title: 'Semantic Error (Webtoon)' },
      { id: 'series-semantic-error', type: 'series', title: 'Semantic Error (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-jaeyoung',
    name: 'Jang Jae-young (장재영)',
    alternativeNames: ['Jae-young', 'Senior Jang'],
    image: '/images/actors/park-seoham.jpg',
    description: 'Senior visual design student, campus celebrity, skateboarder, and gifted visual artist. Free-spirited and confident, he thrives in creative chaos.',
    personality: 'Extroverted, teasing, fiercely protective, loyal, creative genius.',
    role: 'Deuteragonist',
    seriesId: 'series-semantic-error',
    seriesTitle: 'Semantic Error',
    sourceMaterialId: 'novel-semantic-error',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Semantic Error Novel',
    actorId: 'actor-park-seoham',
    actorName: 'Park Seo-ham',
    relationships: [
      {
        targetCharacterId: 'char-sangwoo',
        targetCharacterName: 'Chu Sang-woo',
        type: 'Love interest',
        description: 'Vowed to drive Sang-woo crazy with red outfits, but fell irreversibly in love.'
      }
    ],
    appearances: [
      { id: 'novel-semantic-error', type: 'novel', title: 'Semantic Error (Novel)' },
      { id: 'manhwa-semantic-error', type: 'manhwa', title: 'Semantic Error (Webtoon)' },
      { id: 'series-semantic-error', type: 'series', title: 'Semantic Error (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-kinn',
    name: 'Kinn Anakinn Theerapanyakul',
    alternativeNames: ['Khun Kinn', 'Kinn'],
    image: '/images/actors/mile-phakphum.jpg',
    description: 'The second son and designated leader of the Theerapanyakul Main Mafia Family. Bearing the mantle of dynasty security while surrounded by lethal betrayals.',
    personality: 'Authoritative, sharp-minded, stoic on the outside, deeply passionate and vulnerable in private.',
    role: 'Protagonist',
    seriesId: 'series-kinnporsche',
    seriesTitle: 'KinnPorsche The Series',
    sourceMaterialId: 'novel-kinnporsche',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'KinnPorsche Story Novel',
    actorId: 'actor-mile-phakphum',
    actorName: 'Mile Phakphum Romsaithong',
    relationships: [
      {
        targetCharacterId: 'char-porsche',
        targetCharacterName: 'Porsche Pitchaya',
        type: 'Partner',
        description: 'Personal bodyguard turned romantic soulmate and equal partner.'
      },
      {
        targetCharacterId: 'char-vegas',
        targetCharacterName: 'Vegas Theerapanyakul',
        type: 'Rival',
        description: 'Cousin and rival heir of the Minor Family; high-stakes family tension.'
      }
    ],
    appearances: [
      { id: 'novel-kinnporsche', type: 'novel', title: 'KinnPorsche Story (Novel)' },
      { id: 'series-kinnporsche', type: 'series', title: 'KinnPorsche The Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-porsche',
    name: 'Porsche Pachara Kittisawat',
    alternativeNames: ['Porsche'],
    image: '/images/actors/apo-nattawin.jpg',
    description: 'Former underground martial arts fighter and bartender fighting to protect his younger brother Porchay and keep their family home.',
    personality: 'Brave, intuitive, fiercely protective sibling, humorous, wild-hearted.',
    role: 'Protagonist',
    seriesId: 'series-kinnporsche',
    seriesTitle: 'KinnPorsche The Series',
    sourceMaterialId: 'novel-kinnporsche',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'KinnPorsche Story Novel',
    actorId: 'actor-apo-nattawin',
    actorName: 'Apo Nattawin Wattanagitiphat',
    relationships: [
      {
        targetCharacterId: 'char-kinn',
        targetCharacterName: 'Kinn Anakinn',
        type: 'Partner',
        description: 'His boss whom he guards with his life, eventually sharing unbreakable devotion.'
      },
      {
        targetCharacterId: 'char-pete',
        targetCharacterName: 'Pete Phongsakorn',
        type: 'Friend',
        description: 'Close confidant and fellow bodyguard who mentors him inside the compound.'
      }
    ],
    appearances: [
      { id: 'novel-kinnporsche', type: 'novel', title: 'KinnPorsche Story (Novel)' },
      { id: 'series-kinnporsche', type: 'series', title: 'KinnPorsche The Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-vegas',
    name: 'Vegas Kornwit Theerapanyakul',
    alternativeNames: ['Khun Vegas', 'Vegas'],
    image: '/images/actors/bible-wichapas.png',
    description: 'The sharp, traumatized eldest son of the Minor Mafia Family, constantly abused by his father Kan and burdened with proving his worth.',
    personality: 'Calculating, volatile, fiercely loving towards his pets and brother, deeply wounded.',
    role: 'Deuteragonist',
    seriesId: 'series-kinnporsche',
    seriesTitle: 'KinnPorsche The Series',
    sourceMaterialId: 'novel-kinnporsche',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'KinnPorsche Story Novel',
    actorId: 'actor-bible-wichapas',
    actorName: 'Bible Wichapas Sumettikul',
    relationships: [
      {
        targetCharacterId: 'char-pete',
        targetCharacterName: 'Pete Phongsakorn',
        type: 'Love interest',
        description: 'Found emotional redemption and unconditional warmth through Pete.'
      },
      {
        targetCharacterId: 'char-kinn',
        targetCharacterName: 'Kinn Anakinn',
        type: 'Family',
        description: 'Cousin with whom he maintained a lethal, cold war rivalry.'
      }
    ],
    appearances: [
      { id: 'novel-kinnporsche', type: 'novel', title: 'KinnPorsche Story (Novel)' },
      { id: 'series-kinnporsche', type: 'series', title: 'KinnPorsche The Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-pete',
    name: 'Pete Phongsakorn Saengtham',
    alternativeNames: ['Head Bodyguard Pete', 'Pete'],
    image: '/images/actors/build-jakapan.png',
    description: 'The cheerful and highly capable head bodyguard of Tankhun (the eldest main family brother). Beneath his warm smile lies elite combat and interrogation training.',
    personality: 'Sunny, empathetic, resilient, perceptive, iron-willed.',
    role: 'Deuteragonist',
    seriesId: 'series-kinnporsche',
    seriesTitle: 'KinnPorsche The Series',
    sourceMaterialId: 'novel-kinnporsche',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'KinnPorsche Story Novel',
    actorId: 'actor-build-jakapan',
    actorName: 'Build Jakapan Puttha',
    relationships: [
      {
        targetCharacterId: 'char-vegas',
        targetCharacterName: 'Vegas Kornwit',
        type: 'Love interest',
        description: 'Saw through Vegas’s monster mask and chose to stand by his side.'
      },
      {
        targetCharacterId: 'char-porsche',
        targetCharacterName: 'Porsche Pitchaya',
        type: 'Friend',
        description: 'Loyal comrade inside the bodyguard dormitory.'
      }
    ],
    appearances: [
      { id: 'novel-kinnporsche', type: 'novel', title: 'KinnPorsche Story (Novel)' },
      { id: 'series-kinnporsche', type: 'series', title: 'KinnPorsche The Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-adachi',
    name: 'Kiyoshi Adachi (安達清)',
    alternativeNames: ['Adachi'],
    image: '/images/actors/eiji-akaso.jpg',
    description: 'A modest stationery company employee who turned thirty with virginity, gaining the power to read the thoughts of anyone he physically touches.',
    personality: 'Timid, gentle, humble, considerate, discovers his inner courage.',
    role: 'Protagonist',
    seriesId: 'series-cherry-magic-jp',
    seriesTitle: 'Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!',
    sourceMaterialId: 'manga-cherry-magic',
    sourceMaterialType: 'manga',
    sourceMaterialTitle: 'Cherry Magic Manga',
    actorId: 'actor-akasow-eiji',
    actorName: 'Eiji Akaso',
    relationships: [
      {
        targetCharacterId: 'char-kurosawa',
        targetCharacterName: 'Yuichi Kurosawa',
        type: 'Love interest',
        description: 'Colleague whose hidden thoughts revealed an earnest, heartwarming love.'
      }
    ],
    appearances: [
      { id: 'manga-cherry-magic', type: 'manga', title: 'Cherry Magic! (Manga)' },
      { id: 'series-cherry-magic-jp', type: 'series', title: 'Cherry Magic! (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-kurosawa',
    name: 'Yuichi Kurosawa (黒沢優一)',
    alternativeNames: ['Kurosawa'],
    image: '/images/actors/keita-machida.jpg',
    description: 'The top salesman at Toyokawa stationery company. Handsome, stylish, and admired by everyone, he has secretly harbored pure, self-sacrificing love for Adachi for seven years.',
    personality: 'Gentlemanly, considerate, poetic, deeply patient, romantic idealist.',
    role: 'Deuteragonist',
    seriesId: 'series-cherry-magic-jp',
    seriesTitle: 'Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!',
    sourceMaterialId: 'manga-cherry-magic',
    sourceMaterialType: 'manga',
    sourceMaterialTitle: 'Cherry Magic Manga',
    actorId: 'actor-keita-machida',
    actorName: 'Keita Machida',
    relationships: [
      {
        targetCharacterId: 'char-adachi',
        targetCharacterName: 'Kiyoshi Adachi',
        type: 'Love interest',
        description: 'Cherishes Adachi beyond words, prioritizing Adachi\'s happiness over his own desires.'
      }
    ],
    appearances: [
      { id: 'manga-cherry-magic', type: 'manga', title: 'Cherry Magic! (Manga)' },
      { id: 'series-cherry-magic-jp', type: 'series', title: 'Cherry Magic! (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-hira',
    name: 'Hira Kazunari (平良一成)',
    alternativeNames: ['Hira', 'Camera Boy'],
    image: '/images/actors/riku-hagiwara.jpg',
    description: 'A reserved loner who stammers when anxious, seeking refuge behind his SLR camera. Considers Kiyoi Sou his personal god, king, and artistic muse.',
    personality: 'Self-deprecating, deeply devoted, obsessive, passionate photographer.',
    role: 'Protagonist',
    seriesId: 'series-utsukushii-kare',
    seriesTitle: 'My Beautiful Man (Utsukushii Kare)',
    sourceMaterialId: 'novel-utsukushii-kare',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Utsukushii Kare Novel',
    actorId: 'actor-riku-hagiwara',
    actorName: 'Riku Hagiwara',
    relationships: [
      {
        targetCharacterId: 'char-kiyoi',
        targetCharacterName: 'Kiyoi Sou',
        type: 'Love interest',
        description: 'Reveres Kiyoi like a monarch, slowly learning to love him as an equal human being.'
      }
    ],
    appearances: [
      { id: 'novel-utsukushii-kare', type: 'novel', title: 'Utsukushii Kare (Novel)' },
      { id: 'manga-utsukushii-kare', type: 'manga', title: 'Utsukushii Kare (Manga)' },
      { id: 'series-utsukushii-kare', type: 'series', title: 'My Beautiful Man (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-kiyoi',
    name: 'Kiyoi Sou (清居奏)',
    alternativeNames: ['Kiyoi', 'King'],
    image: '/images/actors/yusei-yagi.jpg',
    description: 'The striking, aloof center of the classroom whose dream is to become a celebrated stage and screen actor. Craves to be loved not as an untouchable deity, but as a person.',
    personality: 'Proud, tsundere, hard-working, sensitive, fiercely loyal.',
    role: 'Deuteragonist',
    seriesId: 'series-utsukushii-kare',
    seriesTitle: 'My Beautiful Man (Utsukushii Kare)',
    sourceMaterialId: 'novel-utsukushii-kare',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Utsukushii Kare Novel',
    actorId: 'actor-yusei-yagi',
    actorName: 'Yusei Yagi',
    relationships: [
      {
        targetCharacterId: 'char-hira',
        targetCharacterName: 'Hira Kazunari',
        type: 'Love interest',
        description: 'Irritated yet completely captivated by Hira’s unyielding gaze and total devotion.'
      }
    ],
    appearances: [
      { id: 'novel-utsukushii-kare', type: 'novel', title: 'Utsukushii Kare (Novel)' },
      { id: 'manga-utsukushii-kare', type: 'manga', title: 'Utsukushii Kare (Manga)' },
      { id: 'series-utsukushii-kare', type: 'series', title: 'My Beautiful Man (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-pran',
    name: 'Pran Parakul',
    alternativeNames: ['Pran'],
    image: '/images/actors/nanon-korapat.png',
    description: 'The neat, organized, and musically gifted Class President of the Architecture faculty at the university.',
    personality: 'Responsible, soft-spoken, observant, secretly hopelessly in love with Pat since high school.',
    role: 'Protagonist',
    seriesId: 'series-bad-buddy',
    seriesTitle: 'Bad Buddy Series',
    sourceMaterialId: 'novel-behind-the-scenes',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Behind The Scenes Novel',
    actorId: 'actor-nanon-korapat',
    actorName: 'Nanon Korapat Kirdpan',
    relationships: [
      {
        targetCharacterId: 'char-pat',
        targetCharacterName: 'Pat Napat',
        type: 'Partner',
        description: 'Childhood neighbor and lifelong rival who became his greatest sanctuary.'
      }
    ],
    appearances: [
      { id: 'novel-behind-the-scenes', type: 'novel', title: 'Behind the Scenes (Novel)' },
      { id: 'series-bad-buddy', type: 'series', title: 'Bad Buddy Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-pat',
    name: 'Pat Napat',
    alternativeNames: ['Pat'],
    image: '/images/actors/ohm-pawat.jpg',
    description: 'The energetic, boisterous head of the Engineering faculty squad, rugby player, and Pran\'s lifelong neighbor.',
    personality: 'Charismatic, bold, fiercely protective, emotionally earnest once he realizes his feelings.',
    role: 'Protagonist',
    seriesId: 'series-bad-buddy',
    seriesTitle: 'Bad Buddy Series',
    sourceMaterialId: 'novel-behind-the-scenes',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Behind The Scenes Novel',
    actorId: 'actor-ohm-pawat',
    actorName: 'Ohm Pawat Chittsawangdee',
    relationships: [
      {
        targetCharacterId: 'char-pran',
        targetCharacterName: 'Pran Parakul',
        type: 'Partner',
        description: 'Discovered that his obsession with competing with Pran was always love in disguise.'
      }
    ],
    appearances: [
      { id: 'novel-behind-the-scenes', type: 'novel', title: 'Behind the Scenes (Novel)' },
      { id: 'series-bad-buddy', type: 'series', title: 'Bad Buddy Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-weiwuxian',
    name: 'Wei Wuxian (魏无羡)',
    alternativeNames: ['Wei Ying', 'Yiling Patriarch (夷陵老祖)', 'Mo Xuanyu'],
    image: '/images/actors/xiao-zhan.jpg',
    description: 'The ingenious founder of Demonic Cultivation (Ghost Cultivation), former senior disciple of the Yunmeng Jiang Clan. Wields the flute Chenqing and sword Suibian.',
    personality: 'Mischievous, righteous, self-sacrificing, brilliant inventor, free spirit.',
    role: 'Protagonist',
    seriesId: 'series-the-untamed',
    seriesTitle: 'The Untamed (Chen Qing Ling)',
    sourceMaterialId: 'novel-mdzs',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Mo Dao Zu Shi Novel',
    actorId: 'actor-xiao-zhan',
    actorName: 'Xiao Zhan',
    relationships: [
      {
        targetCharacterId: 'char-lanwangji',
        targetCharacterName: 'Lan Wangji',
        type: 'Partner',
        description: 'His eternal soulmate (Zhiji) who stood by him through death, slander, and rebirth.'
      }
    ],
    appearances: [
      { id: 'novel-mdzs', type: 'novel', title: 'Mo Dao Zu Shi (Novel)' },
      { id: 'manhua-mdzs', type: 'manhua', title: 'Mo Dao Zu Shi (Manhua)' },
      { id: 'series-the-untamed', type: 'series', title: 'The Untamed (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-lanwangji',
    name: 'Lan Wangji (蓝忘机)',
    alternativeNames: ['Lan Zhan', 'Hanguang-Jun (含光君)', 'Second Young Master Lan'],
    image: '/images/actors/wang-yibo.jpg',
    description: 'The revered Second Young Master of the Gusu Lan Clan. Upholder of justice who goes wherever chaos is. Wields the sword Bichen and guqin Wangji.',
    personality: 'Disciplined, quiet, unshakeable integrity, devoted without bounds.',
    role: 'Deuteragonist',
    seriesId: 'series-the-untamed',
    seriesTitle: 'The Untamed (Chen Qing Ling)',
    sourceMaterialId: 'novel-mdzs',
    sourceMaterialType: 'novel',
    sourceMaterialTitle: 'Mo Dao Zu Shi Novel',
    actorId: 'actor-wang-yibo',
    actorName: 'Wang Yibo',
    relationships: [
      {
        targetCharacterId: 'char-weiwuxian',
        targetCharacterName: 'Wei Wuxian',
        type: 'Partner',
        description: 'Waited thirteen long years playing Inquiry on his guqin until Wei Wuxian returned.'
      }
    ],
    appearances: [
      { id: 'novel-mdzs', type: 'novel', title: 'Mo Dao Zu Shi (Novel)' },
      { id: 'manhua-mdzs', type: 'manhua', title: 'Mo Dao Zu Shi (Manhua)' },
      { id: 'series-the-untamed', type: 'series', title: 'The Untamed (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-aoki',
    name: 'Sota Aoki (青木想太)',
    alternativeNames: ['Aoki'],
    image: '/images/actors/shunsuke-michieda.jpg',
    description: 'A pure-hearted, expressive high schooler prone to dramatic internal panic who gets tangled in an eraser misunderstanding.',
    personality: 'Empathetic, selfless, funny, genuine.',
    role: 'Protagonist',
    seriesId: 'series-kieta-hatsukoi-jp',
    seriesTitle: 'My Love Mix-Up! (Kieta Hatsukoi)',
    sourceMaterialId: 'manga-kieta-hatsukoi',
    sourceMaterialType: 'manga',
    sourceMaterialTitle: 'Kieta Hatsukoi Manga',
    actorId: 'actor-shunsuke-michieda',
    actorName: 'Shunsuke Michieda',
    relationships: [
      {
        targetCharacterId: 'char-ida',
        targetCharacterName: 'Kousuke Ida',
        type: 'Love interest',
        description: 'Started with an eraser misunderstanding, grew into pure mutual affection.'
      }
    ],
    appearances: [
      { id: 'manga-kieta-hatsukoi', type: 'manga', title: 'Kieta Hatsukoi (Manga)' },
      { id: 'series-kieta-hatsukoi-jp', type: 'series', title: 'Kieta Hatsukoi (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-ida',
    name: 'Kousuke Ida (井田浩介)',
    alternativeNames: ['Ida'],
    image: '/images/actors/ren-meguro.jpg',
    description: 'A tall, stoic member of the school volleyball team. Never dated anyone, but approaches romance with complete sincerity and honesty.',
    personality: 'Calm, straightforward, principled, thoughtful.',
    role: 'Deuteragonist',
    seriesId: 'series-kieta-hatsukoi-jp',
    seriesTitle: 'My Love Mix-Up! (Kieta Hatsukoi)',
    sourceMaterialId: 'manga-kieta-hatsukoi',
    sourceMaterialType: 'manga',
    sourceMaterialTitle: 'Kieta Hatsukoi Manga',
    actorId: 'actor-ren-meguro',
    actorName: 'Ren Meguro',
    relationships: [
      {
        targetCharacterId: 'char-aoki',
        targetCharacterName: 'Sota Aoki',
        type: 'Love interest',
        description: 'Admired Aoki\'s sincere soul and learned what true feelings mean.'
      }
    ],
    appearances: [
      { id: 'manga-kieta-hatsukoi', type: 'manga', title: 'Kieta Hatsukoi (Manga)' },
      { id: 'series-kieta-hatsukoi-jp', type: 'series', title: 'Kieta Hatsukoi (Live Action)' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-white-black',
    name: 'White / Black',
    alternativeNames: ['The Twins'],
    image: '/images/actors/gun-atthaphan.png',
    description: 'Identical twins connected by a supernatural empathetic pain bond. White impersonates his comatose brother Black in a vigilante motorcycle crew.',
    personality: 'White is gentle yet steel-willed; Black is ruthless and fiercely ideological.',
    role: 'Protagonist',
    seriesId: 'series-not-me',
    seriesTitle: 'Not Me Series',
    actorId: 'actor-gun-atthaphan',
    actorName: 'Gun Atthaphan Phunsawat',
    relationships: [
      {
        targetCharacterId: 'char-sean',
        targetCharacterName: 'Sean',
        type: 'Love interest',
        description: 'Sean realizes White is not the cold Black he knew, but falls deeply for White\'s sincerity.'
      }
    ],
    appearances: [
      { id: 'series-not-me', type: 'series', title: 'Not Me Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-sean',
    name: 'Sean',
    alternativeNames: ['Sean'],
    image: '/images/actors/off-jumpol.png',
    description: 'A passionate, guarded motorcycle activist fighting against the corruption of oligarch Todd. Intrigued and softened by White.',
    personality: 'Intense, committed, courageous, deeply loyal to his convictions.',
    role: 'Protagonist',
    seriesId: 'series-not-me',
    seriesTitle: 'Not Me Series',
    actorId: 'actor-off-jumpol',
    actorName: 'Off Jumpol Adulkittiporn',
    relationships: [
      {
        targetCharacterId: 'char-white-black',
        targetCharacterName: 'White',
        type: 'Love interest',
        description: 'Fell in love on a rooftop beneath the Pride flag in one of Thai drama\'s most iconic moments.'
      }
    ],
    appearances: [
      { id: 'series-not-me', type: 'series', title: 'Not Me Series' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-teh',
    name: 'Teh Kritpratheep',
    alternativeNames: ['Teh'],
    image: '/images/actors/billkin.png',
    description: 'An ambitious Phuket student striving to enter the university drama program who wrestles with cultural expectations, rivalry, and intense love for Oh-aew.',
    personality: 'Passionate, conflicted, dramatic, deeply sentimental.',
    role: 'Protagonist',
    seriesId: 'series-i-told-sunset-about-you',
    seriesTitle: 'I Told Sunset About You',
    actorId: 'actor-billkin',
    actorName: 'Billkin Putthipong',
    relationships: [
      {
        targetCharacterId: 'char-oh-aew',
        targetCharacterName: 'Oh-aew',
        type: 'Love interest',
        description: 'Childhood friend and soulmate through coconut scent and Chinese flashcards.'
      }
    ],
    appearances: [
      { id: 'series-i-told-sunset-about-you', type: 'series', title: 'I Told Sunset About You' }
    ],
    isDemoSample: false
  },
  {
    id: 'char-oh-aew',
    name: 'Oh-aew',
    alternativeNames: ['Oh'],
    image: '/images/actors/pp-krit.jpg',
    description: 'A sensitive, stylish Phuket youth who embraces his feelings and dreams of becoming an actor alongside Teh.',
    personality: 'Gentle, emotionally intuitive, courageous in acknowledging love.',
    role: 'Protagonist',
    seriesId: 'series-i-told-sunset-about-you',
    seriesTitle: 'I Told Sunset About You',
    actorId: 'actor-pp-krit',
    actorName: 'PP Krit Amnuaydechkorn',
    relationships: [
      {
        targetCharacterId: 'char-teh',
        targetCharacterName: 'Teh Kritpratheep',
        type: 'Love interest',
        description: 'Patiently weathered heartbreak to rediscover Teh\'s unwavering devotion.'
      }
    ],
    appearances: [
      { id: 'series-i-told-sunset-about-you', type: 'series', title: 'I Told Sunset About You' }
    ],
    isDemoSample: false
  }
];
