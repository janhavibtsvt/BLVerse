const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      // already downloaded
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
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.statSync(destPath).size > 1000) {
            resolve(true);
          } else {
            try { fs.unlinkSync(destPath); } catch(e) {}
            resolve(false);
          }
        });
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(12000, () => {
      req.abort();
      resolve(false);
    });
  });
}

async function searchAniListCover(searchTerm, type = 'MANGA') {
  const query = JSON.stringify({
    query: 'query($search: String, $type: MediaType) { Media(search: $search, type: $type) { id title { english romaji } coverImage { extraLarge large medium } bannerImage } }',
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
          resolve(m?.coverImage?.large || m?.coverImage?.medium || m?.coverImage?.extraLarge || null);
        } catch(e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.abort(); resolve(null); });
    req.write(query);
    req.end();
  });
}

async function getWikiPoster(page) {
  return new Promise((resolve) => {
    https.get('https://en.wikipedia.org/wiki/' + page, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/srcset=\"([^\"]*upload\.wikimedia\.org[^\"]+)\"/i) || 
                  d.match(/src=\"([^\"]*upload\.wikimedia\.org[^\"]+)\"/i) ||
                  d.match(/src=\"([^\"]*thumb\.wikimedia\.org[^\"]+)\"/i);
        if (m) {
          let u = m[1].split(' ')[0];
          if (u.startsWith('//')) u = 'https:' + u;
          resolve(u);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('--- STARTING BULK ASSET DOWNLOAD ---');

  // 1. Wikipedia Live-Action Posters
  const wikiDramas = [
    ['bad-buddy.jpg', 'Bad_Buddy'],
    ['2gether.jpg', '2gether:_The_Series_(Thai_TV_series)'],
    ['tharntype.jpg', 'TharnType:_The_Series'],
    ['not-me.jpg', 'Not_Me_(TV_series)'],
    ['cutie-pie.jpg', 'Cutie_Pie_(TV_series)'],
    ['the-untamed.jpg', 'The_Untamed_(TV_series)'],
    ['word-of-honor.jpg', 'Word_of_Honor_(TV_series)'],
    ['gap.jpg', 'Gap:_The_Series'],
    ['23point5.jpg', '23.5_(TV_series)'],
    ['i-told-sunset-about-you.jpg', 'I_Told_Sunset_About_You'],
    ['cherry-magic-drama.jpg', 'Cherry_Magic!_Thirty_Years_of_Virginity_Can_Make_You_a_Wizard%3F!'],
    ['banana-fish-anime.jpg', 'Banana_Fish'],
    ['yuri-on-ice.jpg', 'Yuri_on_Ice'],
    ['bloom-into-you.jpg', 'Bloom_Into_You'],
    ['citrus.jpg', 'Citrus_(manga)'],
    ['given.jpg', 'Given_(manga)'],
    ['sasaki-to-miyano.jpg', 'Sasaki_and_Miyano'],
    ['doukyuusei.jpg', 'Doukyusei_(manga)'],
    ['villainess.jpg', 'I%27m_in_Love_with_the_Villainess'],
    ['whisper-me-a-love-song.jpg', 'Whisper_Me_a_Love_Song']
  ];

  for (const [filename, wikiPage] of wikiDramas) {
    const isSeries = !['bloom-into-you.jpg', 'citrus.jpg', 'given.jpg', 'sasaki-to-miyano.jpg', 'doukyuusei.jpg', 'villainess.jpg', 'whisper-me-a-love-song.jpg'].includes(filename);
    const destDir = isSeries ? '/public/images/series' : '/public/images/manga';
    const dest = path.join(destDir, filename);

    const posterUrl = await getWikiPoster(wikiPage);
    if (posterUrl) {
      const ok = await downloadFile(posterUrl, dest);
      console.log(`[Wiki] ${filename} -> ${ok ? 'OK' : 'FAILED'} (${posterUrl.slice(0, 70)}...)`);
    } else {
      console.log(`[Wiki] ${filename} -> No poster found on Wikipedia`);
    }
  }

  // 2. AniList Manga / Manhwa / Manhua / Yuri / Yaoi Titles
  const comicTitles = [
    // Manhwa
    { file: '/public/images/manhwa/jinx.jpg', title: 'Jinx', type: 'MANGA' },
    { file: '/public/images/manhwa/dangerous-convenience-store.jpg', title: 'Dangerous Convenience Store', type: 'MANGA' },
    { file: '/public/images/manhwa/bj-alex.jpg', title: 'BJ Alex', type: 'MANGA' },
    { file: '/public/images/manhwa/painter-of-the-night.jpg', title: 'Painter of the Night', type: 'MANGA' },
    { file: '/public/images/manhwa/pearl-boy.jpg', title: 'Pearl Boy', type: 'MANGA' },
    { file: '/public/images/manhwa/under-the-green-light.jpg', title: 'Under the Green Light', type: 'MANGA' },
    { file: '/public/images/manhwa/low-tide-in-twilight.jpg', title: 'Night by the Sea', type: 'MANGA' },
    { file: '/public/images/manhwa/payback.jpg', title: 'PAYBACK', type: 'MANGA' },
    { file: '/public/images/manhwa/cherry-blossoms-after-winter.jpg', title: 'Cherry Blossoms After Winter', type: 'MANGA' },
    { file: '/public/images/manhwa/love-or-hate.jpg', title: 'Love or Hate', type: 'MANGA' },
    { file: '/public/images/manhwa/semantic-error.jpg', title: 'Semantic Error', type: 'MANGA' },
    { file: '/public/images/manhwa/bad-thinking-diary.jpg', title: 'Bad Thinking Diary', type: 'MANGA' },
    { file: '/public/images/manhwa/what-does-the-fox-say.jpg', title: 'What Does the Fox Say?', type: 'MANGA' },
    { file: '/public/images/manhwa/her-shim-cheong.jpg', title: 'Her Tale of Shim Chong', type: 'MANGA' },
    { file: '/public/images/manhwa/jazz-for-two.jpg', title: 'Jazz for Two', type: 'MANGA' },

    // Manga
    { file: '/public/images/manga/given.jpg', title: 'Given', type: 'MANGA' },
    { file: '/public/images/manga/sasaki-to-miyano.jpg', title: 'Sasaki and Miyano', type: 'MANGA' },
    { file: '/public/images/manga/cherry-magic.jpg', title: '30-sai made Doutei da to Mahou Tsukai ni Nareru Rashii', type: 'MANGA' },
    { file: '/public/images/manga/old-fashion-cupcake.jpg', title: 'Old Fashion Cupcake', type: 'MANGA' },
    { file: '/public/images/manga/bloom-into-you.jpg', title: 'Bloom Into You', type: 'MANGA' },
    { file: '/public/images/manga/citrus.jpg', title: 'Citrus', type: 'MANGA' },
    { file: '/public/images/manga/the-summer-you-were-there.jpg', title: 'The Summer You Were There', type: 'MANGA' },
    { file: '/public/images/manga/whisper-me-a-love-song.jpg', title: 'Whisper Me a Love Song', type: 'MANGA' },
    { file: '/public/images/manga/villainess.jpg', title: "I'm in Love with the Villainess", type: 'MANGA' },
    { file: '/public/images/manga/the-guy-she-was-interested-in.jpg', title: "The Guy She Was Interested in Wasn't a Guy at All", type: 'MANGA' },
    { file: '/public/images/manga/doukyuusei.jpg', title: 'Doukyuusei', type: 'MANGA' },
    { file: '/public/images/manga/twilight-out-of-focus.jpg', title: 'Twilight Out of Focus', type: 'MANGA' },
    { file: '/public/images/manga/banana-fish.jpg', title: 'Banana Fish', type: 'MANGA' },
    { file: '/public/images/manga/my-beautiful-man.jpg', title: 'Utsukushii Kare', type: 'MANGA' },

    // Manhua
    { file: '/public/images/manhua/mdzs.jpg', title: 'Grandmaster of Demonic Cultivation', type: 'MANGA' },
    { file: '/public/images/manhua/tgcf.jpg', title: "Heaven Official's Blessing", type: 'MANGA' },
    { file: '/public/images/manhua/tamen-de-gushi.jpg', title: 'SQ: Begin with Your Name', type: 'MANGA' },
    { file: '/public/images/manhua/19-days.jpg', title: '19 Days', type: 'MANGA' },
    { file: '/public/images/manhua/here-u-are.jpg', title: 'Here U Are', type: 'MANGA' },
    { file: '/public/images/manhua/please-bully-me.jpg', title: 'Please Bully Me, Miss Villainess!', type: 'MANGA' },
    { file: '/public/images/manhua/my-dearest-nemesis.jpg', title: 'My Dearest Nemesis', type: 'MANGA' },

    // Anime & Donghua
    { file: '/public/images/anime/mdzs.jpg', title: 'Mo Dao Zu Shi', type: 'ANIME' },
    { file: '/public/images/anime/tgcf.jpg', title: 'Tian Guan Ci Fu', type: 'ANIME' },
    { file: '/public/images/anime/scumbag-system.jpg', title: 'Chuan Shu Zijiu Zhinan', type: 'ANIME' },
    { file: '/public/images/anime/given.jpg', title: 'Given', type: 'ANIME' },
    { file: '/public/images/anime/sasaki-to-miyano.jpg', title: 'Sasaki and Miyano', type: 'ANIME' },
    { file: '/public/images/anime/yuri-on-ice.jpg', title: 'Yuri!!! on ICE', type: 'ANIME' },
    { file: '/public/images/anime/doukyuusei.jpg', title: 'Doukyuusei', type: 'ANIME' },
    { file: '/public/images/anime/twilight-out-of-focus.jpg', title: 'Twilight Out of Focus', type: 'ANIME' },
    { file: '/public/images/anime/cherry-magic.jpg', title: '30-sai made Doutei da to Mahou Tsukai ni Nareru Rashii', type: 'ANIME' },
    { file: '/public/images/anime/bloom-into-you.jpg', title: 'Bloom Into You', type: 'ANIME' },
    { file: '/public/images/anime/citrus.jpg', title: 'Citrus', type: 'ANIME' },
    { file: '/public/images/anime/banana-fish.jpg', title: 'Banana Fish', type: 'ANIME' }
  ];

  for (const item of comicTitles) {
    const coverUrl = await searchAniListCover(item.title, item.type);
    if (coverUrl) {
      const ok = await downloadFile(coverUrl, item.file);
      console.log(`[AniList] ${item.title} -> ${ok ? 'OK' : 'FAILED'} saved to ${item.file}`);
    } else {
      console.log(`[AniList] ${item.title} -> Not found on AniList`);
    }
  }

  console.log('--- FINISHED BULK DOWNLOAD ---');
}

main().catch(console.error);
