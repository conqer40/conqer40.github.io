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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function sync() {
  console.log(`Syncing YouTube data for ${CHANNEL_HANDLE} (${CHANNEL_ID})...`);

  // Default initial structured dataset
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
      },
      {
        id: 'pl-secondary-education',
        slug: 'secondary-education',
        name: 'محتوى وتكنولوجيا الثانوية العامة',
        description: 'شروحات مخصصة لطلاب الثانوية لمساعدتهم على فهم وتوظيف التكنولوجيا بذكاء.',
        cover_url: 'https://img.youtube.com/vi/VgFUjydXx1o/hqdefault.jpg',
        videoIds: []
      }
    ],
    videos: [
      {
        id: 'VgFUjydXx1o',
        slug: 'elhawy-ai-intro-launch',
        videoId: 'VgFUjydXx1o',
        youtube_url: 'https://www.youtube.com/watch?v=VgFUjydXx1o',
        title: 'Elhawy AI – محمد الحاوي | برمجة وذكاء اصطناعي ببساطة 🚀',
        summary: 'أهلاً بيكم في قناة Elhawy AI – محمد الحاوي. هنا هنتعلم البرمجة والذكاء الاصطناعي والتكنولوجيا بطريقة بسيطة وعملية، مع شروحات للثانوية ومحتوى يساعدك تفهم التكنولوجيا وتستخدمها صح.',
        description: `أهلاً بيكم في قناة Elhawy AI – محمد الحاوي 🤖💻\n\nهنا هنتعلم البرمجة والذكاء الاصطناعي والتكنولوجيا بطريقة بسيطة وعملية، مع شروحات للثانوية ومحتوى يساعدك تفهم التكنولوجيا وتستخدمها صح.\n\n📚 شروحات تعليمية\n💻 برمجة\n🤖 ذكاء اصطناعي\n🧠 أدوات وتقنيات AI\n🎓 محتوى للثانوية\n🚀 تكنولوجيا ومهارات المستقبل\n\nاشترك في القناة وفعّل الجرس علشان يوصلك كل جديد.\n\nElhawy AI – محمد الحاوي\nنفهمها... ونستخدمها صح.\n\n#ElhawyAI #محمد_الحاوي #الذكاء_الاصطناعي #البرمجة #الثانوية_العامة #تكنولوجيا`,
        thumbnail: 'https://img.youtube.com/vi/VgFUjydXx1o/maxresdefault.jpg',
        publishedAt: '2026-09-15T10:30:31+00:00',
        category_id: 'pl-intro',
        category_name: 'مقدمة ودليل Elhawy AI'
      }
    ]
  };

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const rss = await fetchUrl(rssUrl);

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    const fetchedVideos = [];

    while ((match = entryRegex.exec(rss)) !== null) {
      const entryXml = match[1];
      const videoId = parseXmlField(entryXml, 'yt:videoId');
      const title = parseXmlField(entryXml, 'title');
      const published = parseXmlField(entryXml, 'published');
      const description = parseXmlField(entryXml, 'media:description');
      const thumbnail = parseXmlAttributes(entryXml, 'media:thumbnail', 'url') || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Filter out shorts or irrelevant test videos if title is default date like 'April 5, 2023'
      if (title.startsWith('April 5,') && !description) {
        continue;
      }

      const cleanDescription = (description || '')
        .replace(/\uFFFD/g, 'م')
        .replace(/#حمد/g, '#محمد');

      const lines = cleanDescription
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('📚') && !l.startsWith('💻'));

      const summary = lines.slice(0, 2).join(' ') || title;

      const slug = slugify(title) || `video-${videoId}`;

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
        category_id: 'pl-intro',
        category_name: 'مقدمة ودليل Elhawy AI'
      });
    }

    if (fetchedVideos.length > 0) {
      // Merge with existing
      fetchedVideos.forEach(fv => {
        const idx = output.videos.findIndex(v => v.videoId === fv.videoId);
        if (idx >= 0) {
          output.videos[idx] = { ...output.videos[idx], ...fv };
        } else {
          output.videos.push(fv);
          output.playlists[0].videoIds.push(fv.videoId);
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
  console.log(`YouTube data saved successfully to ${dest}!`);
}

sync();
