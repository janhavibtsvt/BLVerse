const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function download(url, destPath) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      return resolve(true);
    }
    const cleanUrl = url.split('?')[0].replace('&amp;', '&');
    const fullUrl = cleanUrl.startsWith('//') ? 'https:' + cleanUrl : cleanUrl;
    const client = fullUrl.startsWith('https') ? https : http;
    
    const req = client.get(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
            resolve(true);
          } else {
            try { fs.unlinkSync(destPath); } catch (e) {}
            resolve(false);
          }
        });
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(15000, () => { req.abort(); resolve(false); });
  });
}

const seriesDownloads = [
  { file: 'public/images/series/kinnporsche.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/402/1006163.jpg' },
  { file: 'public/images/series/the-untamed.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/236/592104.jpg' },
  { file: 'public/images/series/semantic-error.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/390/976737.jpg' },
  { file: 'public/images/series/gap.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/268/670383.jpg' },
  { file: 'public/images/series/23point5.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/561/1404658.jpg' },
  { file: 'public/images/series/only-friends.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/471/1177522.jpg' },
  { file: 'public/images/series/the-secret-of-us.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/526/1315549.jpg' },
  { file: 'public/images/series/word-of-honor.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/298/745349.jpg' },
  { file: 'public/images/series/blank.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/508/1271954.jpg' },
  { file: 'public/images/series/the-loyal-pin.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/532/1330525.jpg' },
  { file: 'public/images/series/pit-babe.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/560/1401758.jpg' },
  { file: 'public/images/series/to-my-star.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/410/1027141.jpg' },
  { file: 'public/images/series/blueming.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/402/1005798.jpg' },
  { file: 'public/images/series/stay-with-me.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/466/1165002.jpg' },
  { file: 'public/images/series/we-best-love.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/296/742284.jpg' },
  { file: 'public/images/series/bad-buddy.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/612/1531857.jpg' },
  { file: 'public/images/series/2gether.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/120/301803.jpg' },
  { file: 'public/images/series/tharntype.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/279/698151.jpg' },
  { file: 'public/images/series/not-me.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/379/948172.jpg' },
  { file: 'public/images/series/cutie-pie.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/394/985104.jpg' },
  { file: 'public/images/series/love-in-the-air.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/418/1047059.jpg' },
  { file: 'public/images/series/my-school-president.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/431/1078963.jpg' },
  { file: 'public/images/series/cherry-magic.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/489/1222972.jpg' },
  { file: 'public/images/series/my-beautiful-man.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/376/941038.jpg' },
  { file: 'public/images/series/old-fashion-cupcake.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/409/1024779.jpg' },
  { file: 'public/images/series/my-love-mix-up.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/361/903597.jpg' },
  { file: 'public/images/series/heartstopper.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/632/1580747.jpg' },
  { file: 'public/images/series/young-royals.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/523/1307898.jpg' },
  { file: 'public/images/series/last-twilight.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/484/1211106.jpg' },
  { file: 'public/images/series/the-sign.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/481/1204842.jpg' },
  { file: 'public/images/series/affair.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/533/1334145.jpg' },
  { file: 'public/images/series/our-dating-sim.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/450/1125775.jpg' },
  { file: 'public/images/series/the-eighth-sense.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/456/1141344.jpg' },
  { file: 'public/images/series/kiseki-dear-to-me.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/477/1193475.jpg' },
  { file: 'public/images/series/history-trapped.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/309/773952.jpg' },
  { file: 'public/images/series/fragrance-of-the-first-flower.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/549/1374120.jpg' },
  { file: 'public/images/series/chaser-game-w.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/495/1238392.jpg' },
  { file: 'public/images/series/she-makes-my-heart-flutter.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/428/1070733.jpg' },
  { file: 'public/images/series/a-tale-of-thousand-stars.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/563/1409543.jpg' },
  { file: 'public/images/series/couple-of-mirrors.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/348/872036.jpg' },
  { file: 'public/images/series/i-told-sunset-about-you.jpg', url: 'https://static.tvmaze.com/uploads/images/original_untouched/282/707436.jpg' }
];

async function searchAniList(searchTerm, type = 'MANGA') {
  const query = JSON.stringify({
    query: 'query($search: String, $type: MediaType) { Media(search: $search, type: $type) { id title { english romaji } coverImage { extraLarge large } bannerImage } }',
    variables: { search: searchTerm, type }
  });
  return new Promise((resolve) => {
    const req = https.request('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(query),
        'User-Agent': 'BLVerse-Catalog/1.0'
      }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const m = j.data?.Media;
          resolve(m?.coverImage?.extraLarge || m?.coverImage?.large || null);
        } catch(e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.abort(); resolve(null); });
    req.write(query);
    req.end();
  });
}

const comicSearches = [
  // Manhwa (BL & GL)
  { file: 'public/images/manhwa/bj-alex.jpg', search: 'BJ Alex', type: 'MANGA' },
  { file: 'public/images/manhwa/jinx.jpg', search: 'Jinx', type: 'MANGA' },
  { file: 'public/images/manhwa/painter-of-the-night.jpg', search: 'Painter of the Night', type: 'MANGA' },
  { file: 'public/images/manhwa/dangerous-convenience-store.jpg', search: 'Dangerous Convenience Store', type: 'MANGA' },
  { file: 'public/images/manhwa/pearl-boy.jpg', search: 'Pearl Boy', type: 'MANGA' },
  { file: 'public/images/manhwa/under-the-green-light.jpg', search: 'Under the Green Light', type: 'MANGA' },
  { file: 'public/images/manhwa/low-tide-in-twilight.jpg', search: 'Night by the Sea', type: 'MANGA' },
  { file: 'public/images/manhwa/payback.jpg', search: 'PAYBACK', type: 'MANGA' },
  { file: 'public/images/manhwa/cherry-blossoms-after-winter.jpg', search: 'Cherry Blossoms After Winter', type: 'MANGA' },
  { file: 'public/images/manhwa/love-or-hate.jpg', search: 'Love or Hate', type: 'MANGA' },
  { file: 'public/images/manhwa/semantic-error.jpg', search: 'Semantic Error', type: 'MANGA' },
  { file: 'public/images/manhwa/killing-stalking.jpg', search: 'Killing Stalking', type: 'MANGA' },
  { file: 'public/images/manhwa/shutline.jpg', search: 'Shutline', type: 'MANGA' },
  { file: 'public/images/manhwa/lost-in-the-cloud.jpg', search: 'Lost in the Cloud', type: 'MANGA' },
  { file: 'public/images/manhwa/bad-thinking-diary.jpg', search: 'Bad Thinking Diary', type: 'MANGA' },
  { file: 'public/images/manhwa/what-does-the-fox-say.jpg', search: 'What Does the Fox Say?', type: 'MANGA' },
  { file: 'public/images/manhwa/her-shim-cheong.jpg', search: 'Her Tale of Shim Chong', type: 'MANGA' },
  { file: 'public/images/manhwa/ring-my-bell.jpg', search: 'Ring My Bell!', type: 'MANGA' },
  { file: 'public/images/manhwa/jazz-for-two.jpg', search: 'Jazz for Two', type: 'MANGA' },

  // Manga (BL & GL)
  { file: 'public/images/manga/given.jpg', search: 'Given', type: 'MANGA' },
  { file: 'public/images/manga/sasaki-to-miyano.jpg', search: 'Sasaki and Miyano', type: 'MANGA' },
  { file: 'public/images/manga/doukyuusei.jpg', search: 'Doukyuusei', type: 'MANGA' },
  { file: 'public/images/manga/ten-count.jpg', search: 'Ten Count', type: 'MANGA' },
  { file: 'public/images/manga/twittering-birds.jpg', search: 'Saezuru Tori wa Habatakannai', type: 'MANGA' },
  { file: 'public/images/manga/umibe-no-etranger.jpg', search: 'Umibe no Étranger', type: 'MANGA' },
  { file: 'public/images/manga/cherry-magic.jpg', search: '30-sai made Doutei da to Mahou Tsukai ni Nareru Rashii', type: 'MANGA' },
  { file: 'public/images/manga/old-fashion-cupcake.jpg', search: 'Old Fashion Cupcake', type: 'MANGA' },
  { file: 'public/images/manga/my-love-mixup.jpg', search: 'Kieta Hatsukoi', type: 'MANGA' },
  { file: 'public/images/manga/my-beautiful-man.jpg', search: 'Utsukushii Kare', type: 'MANGA' },
  { file: 'public/images/manga/twilight-out-of-focus.jpg', search: 'Twilight Out of Focus', type: 'MANGA' },
  { file: 'public/images/manga/banana-fish.jpg', search: 'Banana Fish', type: 'MANGA' },
  { file: 'public/images/manga/minato-coin-laundry.jpg', search: 'Minato Shouji Coin Laundry', type: 'MANGA' },
  { file: 'public/images/manga/sekaiichi-hatsukoi.jpg', search: 'Sekaiichi Hatsukoi', type: 'MANGA' },
  { file: 'public/images/manga/hirano-to-kagiura.jpg', search: 'Hirano and Kagiura', type: 'MANGA' },
  { file: 'public/images/manga/citrus.jpg', search: 'Citrus', type: 'MANGA' },
  { file: 'public/images/manga/bloom-into-you.jpg', search: 'Bloom Into You', type: 'MANGA' },
  { file: 'public/images/manga/the-summer-you-were-there.jpg', search: 'The Summer You Were There', type: 'MANGA' },
  { file: 'public/images/manga/whisper-me-a-love-song.jpg', search: 'Whisper Me a Love Song', type: 'MANGA' },
  { file: 'public/images/manga/villainess.jpg', search: "I'm in Love with the Villainess", type: 'MANGA' },
  { file: 'public/images/manga/the-guy-she-was-interested-in.jpg', search: "The Guy She Was Interested in Wasn't a Guy at All", type: 'MANGA' },
  { file: 'public/images/manga/girl-friends.jpg', search: 'Girl Friends', type: 'MANGA' },

  // Manhua (Danmei & GL)
  { file: 'public/images/manhua/mdzs.jpg', search: 'Grandmaster of Demonic Cultivation', type: 'MANGA' },
  { file: 'public/images/manhua/tgcf.jpg', search: "Heaven Official's Blessing", type: 'MANGA' },
  { file: 'public/images/manhua/svsss.jpg', search: "The Scum Villain's Self-Saving System", type: 'MANGA' },
  { file: 'public/images/manhua/erha.jpg', search: 'The Husky and His White Cat Shizun', type: 'MANGA' },
  { file: 'public/images/manhua/19-days.jpg', search: '19 Days', type: 'MANGA' },
  { file: 'public/images/manhua/here-u-are.jpg', search: 'Here U Are', type: 'MANGA' },
  { file: 'public/images/manhua/tamen-de-gushi.jpg', search: 'SQ: Begin with Your Name', type: 'MANGA' },
  { file: 'public/images/manhua/please-bully-me.jpg', search: 'Please Bully Me, Miss Villainess!', type: 'MANGA' },
  { file: 'public/images/manhua/my-dearest-nemesis.jpg', search: 'My Dearest Nemesis', type: 'MANGA' },
  { file: 'public/images/manhua/saye.jpg', search: 'Saye', type: 'MANGA' },
  { file: 'public/images/manhua/qiang-jin-jiu.jpg', search: 'Qiang Jin Jiu', type: 'MANGA' },

  // Anime & Donghua
  { file: 'public/images/anime/mdzs.jpg', search: 'Mo Dao Zu Shi', type: 'ANIME' },
  { file: 'public/images/anime/tgcf.jpg', search: 'Tian Guan Ci Fu', type: 'ANIME' },
  { file: 'public/images/anime/scumbag-system.jpg', search: 'Chuan Shu Zijiu Zhinan', type: 'ANIME' },
  { file: 'public/images/anime/given.jpg', search: 'Given', type: 'ANIME' },
  { file: 'public/images/anime/sasaki-to-miyano.jpg', search: 'Sasaki and Miyano', type: 'ANIME' },
  { file: 'public/images/anime/yuri-on-ice.jpg', search: 'Yuri!!! on ICE', type: 'ANIME' },
  { file: 'public/images/anime/doukyuusei.jpg', search: 'Doukyuusei', type: 'ANIME' },
  { file: 'public/images/anime/twilight-out-of-focus.jpg', search: 'Twilight Out of Focus', type: 'ANIME' },
  { file: 'public/images/anime/cherry-magic.jpg', search: '30-sai made Doutei da to Mahou Tsukai ni Nareru Rashii', type: 'ANIME' },
  { file: 'public/images/anime/bloom-into-you.jpg', search: 'Bloom Into You', type: 'ANIME' },
  { file: 'public/images/anime/citrus.jpg', search: 'Citrus', type: 'ANIME' },
  { file: 'public/images/anime/banana-fish.jpg', search: 'Banana Fish', type: 'ANIME' },
  { file: 'public/images/anime/villainess.jpg', search: "I'm in Love with the Villainess", type: 'ANIME' },
  { file: 'public/images/anime/magical-revolution.jpg', search: 'The Magical Revolution of the Reincarnated Princess', type: 'ANIME' },
  { file: 'public/images/anime/whisper-me-a-love-song.jpg', search: 'Whisper Me a Love Song', type: 'ANIME' },

  // Novels
  { file: 'public/images/novels/mdzs.jpg', search: 'Mo Dao Zu Shi', type: 'MANGA' },
  { file: 'public/images/novels/tgcf.jpg', search: 'Tian Guan Ci Fu', type: 'MANGA' },
  { file: 'public/images/novels/svsss.jpg', search: 'Chuan Shu Zijiu Zhinan', type: 'MANGA' },
  { file: 'public/images/novels/erha.jpg', search: 'Erha He Ta De Bai Mao Shizun', type: 'MANGA' }
];

async function run() {
  console.log('Downloading series posters from TVMaze...');
  for (const s of seriesDownloads) {
    const ok = await download(s.url, s.file);
    console.log(`[Series] ${s.file} -> ${ok ? 'OK' : 'FAILED'}`);
  }

  console.log('Downloading comic / anime / novel covers from AniList...');
  for (const c of comicSearches) {
    if (fs.existsSync(c.file) && fs.statSync(c.file).size > 5000) {
      console.log(`[Skip] ${c.file} already exists`);
      continue;
    }
    const coverUrl = await searchAniList(c.search, c.type);
    if (coverUrl) {
      const ok = await download(coverUrl, c.file);
      console.log(`[AniList] ${c.search} -> ${ok ? 'OK' : 'FAILED'} (${c.file})`);
    } else {
      console.log(`[AniList] ${c.search} -> Not found on AniList`);
    }
  }

  // Also duplicate key image files for compatibility
  // e.g., series/cherry-magic-drama.jpg and series/cherry-magic.jpg
  if (fs.existsSync('public/images/series/cherry-magic.jpg')) {
    fs.copyFileSync('public/images/series/cherry-magic.jpg', 'public/images/series/cherry-magic-drama.jpg');
  }
  if (fs.existsSync('public/images/series/i-told-sunset-about-you.jpg')) {
    fs.copyFileSync('public/images/series/i-told-sunset-about-you.jpg', 'public/images/series/i-told-sunset.jpg');
  }
  if (fs.existsSync('public/images/manhwa/cherry-blossoms-after-winter.jpg')) {
    fs.copyFileSync('public/images/manhwa/cherry-blossoms-after-winter.jpg', 'public/images/manhwa/cherry-blossoms.jpg');
  }
  if (fs.existsSync('public/images/manhwa/jazz-for-two.jpg')) {
    fs.copyFileSync('public/images/manhwa/jazz-for-two.jpg', 'public/images/series/jazz-for-two.jpg');
  }

  console.log('--- ALL DOWNLOADS FINISHED ---');
}

run().catch(console.error);
