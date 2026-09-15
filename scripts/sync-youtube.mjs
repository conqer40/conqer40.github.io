import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANNEL_ID = 'UCnJhK71kcD-hdxrqJEwfEnA';
const CHANNEL_HANDLE = '@ElhawyAI';
const CHANNEL_NAME = 'Elhawy AI – محمد الحاوي';
const CHANNEL_URL = `https://www.youtube.com/${CHANNEL_HANDLE}`;
const WHATSAPP_CHANNEL_URL = 'https://www.whatsapp.com/channel/0029VbDJ5sYKrWQt6ehcOp3G';
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/ElhawyAi';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseXmlField(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : '';
}

function parseXmlAttributes(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`));
  return match ? match[1].trim() : '';
}

function cleanArabicText(text) {
  if (!text) return '';
  return text
    .replace(/\uFFFD/g, 'م')
    .replace(/#حمد/g, '#محمد')
    .replace(/الذاء/g, 'الذكاء')
    .replace(/الترانزستوات/g, 'الترانزستورات')
    .replace(/تطورت/g, 'اتطورت');
}

function slugify(text) {
  return cleanArabicText(text)
    .toLowerCase()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function sync() {
  console.log(`Syncing YouTube data for ${CHANNEL_HANDLE} (${CHANNEL_ID})...`);

  // Default structured output
  const output = {
    channel: {
      id: CHANNEL_ID,
      handle: CHANNEL_HANDLE,
      name: CHANNEL_NAME,
      url: CHANNEL_URL,
      subscribeUrl: `${CHANNEL_URL}?sub_confirmation=1`,
      whatsappUrl: WHATSAPP_CHANNEL_URL,
      facebookUrl: FACEBOOK_PAGE_URL,
      syncedAt: new Date().toISOString()
    },
    playlists: [
      {
        id: 'PLRAX9PFd3-Ew',
        slug: 'secondary-ai-programming',
        name: 'برمجة وذكاء اصطناعي ببساطة | الصف الثاني الثانوي – بكالوريا',
        description: 'مسار تعليمي لشرح منهج ومفاهيم البرمجة والذكاء الاصطناعي وتكنولوجيا المعلومات لطلاب الثانوية العامة والبكالوريا بطريقة مبسطة وعملية.',
        cover_url: 'https://img.youtube.com/vi/vSMvo7yM40A/maxresdefault.jpg',
        videoIds: ['vSMvo7yM40A']
      },
      {
        id: 'pl-intro',
        slug: 'channel-intro',
        name: 'مقدمة ودليل Elhawy AI',
        description: 'الفيديوهات التعريفية بالقناة وخارطة طريق التعلم في البرمجة والذكاء الاصطناعي والتكنولوجيا.',
        cover_url: 'https://img.youtube.com/vi/VgFUjydXx1o/maxresdefault.jpg',
        videoIds: ['VgFUjydXx1o']
      },
      {
        id: 'pl-ai-tools',
        slug: 'ai-and-tools',
        name: 'شروحات الذكاء الاصطناعي والأدوات',
        description: 'دروس عملية لتطبيق أدوات وتقنيات الـ AI في العمل والدراسة والإنتاجية.',
        cover_url: 'https://img.youtube.com/vi/VgFUjydXx1o/hqdefault.jpg',
        videoIds: []
      },
      {
        id: 'pl-coding',
        slug: 'programming',
        name: 'البرمجة وتطوير البرمجيات',
        description: 'مسارات تعليمية في البرمجة وتطوير التطبيقات والويب بطرق مبسطة وعملية.',
        cover_url: 'https://img.youtube.com/vi/VgFUjydXx1o/hqdefault.jpg',
        videoIds: []
      }
    ],
    videos: []
  };

  // 1. Scrape Playlists page if possible
  try {
    const plHtml = await fetchUrl(`https://www.youtube.com/${CHANNEL_HANDLE}/playlists`);
    
    // Look for playlists lockup items
    const plMatches = [...plHtml.matchAll(/\/playlist\?list=([a-zA-Z0-9_-]+)/g)];
    const uniqueLists = [...new Set(plMatches.map(m => m[1]))];
    
    // Find title from lockupMetadataViewModel
    const titleMatches = [...plHtml.matchAll(/\"lockupMetadataViewModel\":\{\"title\":\{\"content\":\"([^\"]+)\"\}/g)];
    
    if (uniqueLists.length > 0 && titleMatches.length > 0) {
      uniqueLists.forEach((listId, idx) => {
        const foundTitle = titleMatches[idx] ? titleMatches[idx][1] : null;
        if (foundTitle && !output.playlists.some(p => p.id === listId)) {
          output.playlists.unshift({
            id: listId,
            slug: slugify(foundTitle),
            name: foundTitle,
            description: `قائمة تشغيل: ${foundTitle}`,
            cover_url: 'https://img.youtube.com/vi/vSMvo7yM40A/maxresdefault.jpg',
            videoIds: []
          });
        }
      });
    }
  } catch (err) {
    console.warn('Could not scrape playlists page, relying on structured lists', err.message);
  }

  // 2. Fetch RSS Feed for latest videos
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const rss = await fetchUrl(rssUrl);

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    const fetchedVideos = [];

    while ((match = entryRegex.exec(rss)) !== null) {
      const entryXml = match[1];
      const videoId = parseXmlField(entryXml, 'yt:videoId');
      const rawTitle = parseXmlField(entryXml, 'title');
      const published = parseXmlField(entryXml, 'published');
      const rawDescription = parseXmlField(entryXml, 'media:description');
      const thumbnail = parseXmlAttributes(entryXml, 'media:thumbnail', 'url') || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Filter out shorts or irrelevant test videos
      if (rawTitle.startsWith('April 5,') && !rawDescription) {
        continue;
      }

      const title = cleanArabicText(rawTitle);
      const cleanDescription = cleanArabicText(rawDescription);

      const lines = cleanDescription
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('📚') && !l.startsWith('💻'));

      const summary = lines.slice(0, 2).join(' ') || title;
      const slug = slugify(title) || `video-${videoId}`;

      // Determine category
      let categoryId = 'pl-intro';
      let categoryName = 'مقدمة ودليل Elhawy AI';

      if (videoId === 'VgFUjydXx1o') {
        categoryId = 'pl-intro';
        categoryName = 'مقدمة ودليل Elhawy AI';
      } else if (title.includes('ثانوي') || title.includes('الحصة') || title.includes('بكالوريا') || cleanDescription.includes('ثانوي')) {
        categoryId = 'PLRAX9PFd3-Ew';
        categoryName = 'برمجة وذكاء اصطناعي ببساطة | الصف الثاني الثانوي – بكالوريا';
      }

      fetchedVideos.push({
        id: videoId,
        slug,
        videoId,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        title,
        summary,
        description: cleanDescription || summary,
        thumbnail: thumbnail.replace('hqdefault.jpg', 'maxresdefault.jpg'),
        publishedAt: published,
        category_id: categoryId,
        category_name: categoryName
      });
    }

    if (fetchedVideos.length > 0) {
      output.videos = fetchedVideos;

      // Update playlists videoIds
      output.playlists.forEach(pl => {
        pl.videoIds = output.videos
          .filter(v => v.category_id === pl.id || v.category_id === pl.slug)
          .map(v => v.videoId);

        // Update cover if playlist has videos
        if (pl.videoIds.length > 0) {
          const firstVid = output.videos.find(v => v.videoId === pl.videoIds[0]);
          if (firstVid) {
            pl.cover_url = firstVid.thumbnail;
          }
        }
      });
    }
  } catch (err) {
    console.warn('Warning: Could not fetch live RSS feed, fallback data preserved.', err.message);
  }

  const outDir = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const dest = path.join(outDir, 'youtube-videos.json');
  fs.writeFileSync(dest, JSON.stringify(output, null, 2), 'utf8');
  console.log(`YouTube data synced and saved successfully to ${dest}!`);
}

sync();
