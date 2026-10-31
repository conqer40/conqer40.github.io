import { useEffect, useState } from 'react';
import {
  FiCheck, FiDownload, FiMessageCircle, FiMic, FiEye, FiSmartphone, FiShield, FiBell, FiMonitor,
  FiUserCheck, FiRefreshCw, FiExternalLink, FiPhone, FiArrowDown,
} from 'react-icons/fi';
import './eva-page.css';

const REPO = 'conqer40/eva-android';
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;
const LATEST_PAGE = `https://github.com/${REPO}/releases/latest`;

const copy = {
  ar: {
    tag: 'مساعدتك الذكية في جيبك',
    title: 'إيفا AI',
    lead: 'مساعد ذكي بالعربية والإنجليزية على هاتفك: يجيب عن أي سؤال، يبحث في الإنترنت، يتحدث معك بالصوت، يقرأ ملفاتك وصورك، يرى بالكاميرا والشاشة، ويتحكم في تطبيقات هاتفك. يعمل بمفرده دون حاجة لكمبيوتر.',
    download: 'تحميل التطبيق (APK)',
    allReleases: 'كل الإصدارات',
    explore: 'استكشف المميزات',
    version: 'أحدث إصدار',
    size: 'الحجم',
    android: 'أندرويد 8 أو أحدث',
    howTitle: 'ابدأ في 4 خطوات',
    featuresTitle: 'كل مميزات إيفا',
    featuresSub: 'افتح أي قسم لترى التفاصيل. كل ما هو مكتوب هنا موجود في التطبيق.',
    open: 'عرض التفاصيل',
    soon: 'قريبًا',
    updatesTitle: 'آخر التحديثات',
    updatesSub: 'تُحمَّل هذه القائمة مباشرة من صفحة الإصدارات على GitHub، فتظهر هنا أي نسخة جديدة فور نشرها.',
    loading: 'جارٍ تحميل التحديثات…',
    failed: 'تعذر تحميل قائمة التحديثات الآن. يمكنك رؤيتها في صفحة الإصدارات.',
    dl: 'تحميل',
    notes: 'ما الجديد',
    installTitle: 'طريقة التثبيت',
    installText: 'بعد تحميل ملف APK افتحه على هاتفك. إن طلب أندرويد السماح بالتثبيت من هذا المصدر فوافق مرة واحدة. بعدها يخبرك التطبيق نفسه بالتحديثات الجديدة ويحمّلها لك بضغطة زر.',
    trustTitle: 'خصوصيتك وأمانك',
    trustText: 'مفاتيحك ومحادثاتك على هاتفك فقط. لا ترسل إيفا رسالة ولا تؤكد عملية دفع ولا تكتب كلمة مرور دون إذنك، وأي رسالة واتساب تُجهَّز وتضغط أنت إرسال.',
    devTitle: 'من صنع إيفا؟',
    devText: 'تصميم وتطوير محمد الحاوي. جميع الحقوق محفوظة.',
    contact: 'تواصل مع المطور',
    wa: 'واتساب',
  },
  en: {
    tag: 'Your smart assistant in your pocket',
    title: 'Eva AI',
    lead: 'A smart Arabic and English assistant on your phone: it answers anything, searches the web, talks to you by voice, reads your files and pictures, sees through the camera and the screen, and controls your phone apps. It works on its own, no computer needed.',
    download: 'Download the app (APK)',
    allReleases: 'All releases',
    explore: 'Explore features',
    version: 'Latest version',
    size: 'Size',
    android: 'Android 8 or newer',
    howTitle: 'Get started in 4 steps',
    featuresTitle: 'Every Eva feature',
    featuresSub: 'Open any section for details. Everything listed here is in the app.',
    open: 'View details',
    soon: 'Coming soon',
    updatesTitle: 'Latest updates',
    updatesSub: 'This list is loaded straight from the GitHub releases page, so a new version shows up here as soon as it is published.',
    loading: 'Loading updates…',
    failed: 'Could not load the updates list right now. You can see it on the releases page.',
    dl: 'Download',
    notes: "What's new",
    installTitle: 'How to install',
    installText: 'Open the downloaded APK on your phone. If Android asks to allow installs from this source, allow it once. After that the app tells you about new versions and downloads them with one tap.',
    trustTitle: 'Your privacy and safety',
    trustText: 'Your keys and chats stay on your phone. Eva never sends a message, confirms a payment or types a password without your approval, and any WhatsApp message is prepared for you to press send.',
    devTitle: 'Who made Eva?',
    devText: 'Designed and developed by Mohamed ElHawy. All rights reserved.',
    contact: 'Contact the developer',
    wa: 'WhatsApp',
  },
};

const steps = {
  ar: [
    ['حمّل التطبيق', 'نزّل ملف APK من هذه الصفحة وثبّته على هاتفك.', FiDownload],
    ['أنشئ حسابك', 'سجّل باسمك ورقم هاتفك وكلمة مرور. تناديك إيفا باسمك.', FiUserCheck],
    ['فعّل الحساب', 'اضغط «تفعيل الحساب» فتصل الإدارة رسالة واتساب جاهزة، وتُضاف مفاتيحك تلقائيًا.', FiShield],
    ['ابدأ الحديث', 'اكتب أو تحدث أو أرسل ملفًا أو افتح الكاميرا. إيفا جاهزة.', FiMessageCircle],
  ],
  en: [
    ['Download', 'Get the APK from this page and install it on your phone.', FiDownload],
    ['Create your account', 'Sign up with your name, phone and a password. Eva calls you by name.', FiUserCheck],
    ['Activate it', 'Tap "Activate account": a ready WhatsApp message reaches the admin and your keys are added for you.', FiShield],
    ['Start talking', 'Type, speak, send a file or open the camera. Eva is ready.', FiMessageCircle],
  ],
};

const groups = {
  ar: [
    ['المحادثة والبحث', 'تجيب عن أي موضوع وتبحث لك في الإنترنت.', FiMessageCircle, [
      ['محادثة ذكية لأي موضوع', 'شرح، دراسة، شغل، ترجمة، كتابة، أفكار وبرمجة، بعربية مصرية واضحة أو بأي لغة تكتب بها.'],
      ['بحث في الإنترنت', 'الأسعار والأخبار والطقس والنتائج وكل ما يحتاج معلومات حديثة، مع احتياطي تلقائي بين نموذجين.'],
      ['تناديك باسمك', 'تتذكر اسمك من حسابك وتخاطبك به بلطف.'],
      ['مواساة عند الضغط النفسي', 'إن شعرت أنك مضغوط أو حزين تتحول لنبرة حنونة هادئة تحتويك أولًا قبل أي نصيحة.'],
      ['سجل محادثات محفوظ', 'محادثاتك ومكالماتك الصوتية تُحفظ على هاتفك مع بحث وحذف، ووضع فاتح وغامق.'],
    ]],
    ['المكالمات الصوتية', 'تحدّث مع إيفا بصوتها مباشرة وتابع الحوار مكتوبًا.', FiMic, [
      ['صوت إيفا المباشر', 'محادثة صوتية طبيعية بصوت هادئ ودافئ، وتقدر تقاطعها.'],
      ['شعار يتحرك مع الصوت', 'شعار إيفا يتنفس ويكبر مع صوتك وصوتها، ويدور عندما تفكر.'],
      ['الحوار مكتوب أثناء المكالمة', 'كلامك وردودها يظهران نصًا، وتقدر تكتب لها وتتحدث في الوقت نفسه.'],
      ['أيقونة عائمة', 'افتح أي تطبيق آخر وتبقى إيفا معك في مكالمة عبر أيقونة قابلة للسحب تتحرك مع الصوت.'],
      ['ميكروفون إيفا الخاص', 'إملاء الرسائل بصوتك بشريط تسجيل بموجة صوت، بدل خدمة التعرف على الصوت من جوجل.'],
    ]],
    ['الرؤية والملفات والصور', 'تقرأ وترى وتنشئ.', FiEye, [
      ['تحليل الملفات والصور', 'أرسل صورة أو PDF أو Word أو ملفًا نصيًا في الشات أو أثناء المكالمة وتحدثا عنه.'],
      ['إنشاء ملفات Word', 'اطلب مستندًا فتنشئه وتعرضه لك بزر فتح ومشاركة، حتى وأنتما في مكالمة.'],
      ['تصميم الصور', 'صمم صورة جديدة من وصف بالذكاء الاصطناعي مجانًا.'],
      ['صور حقيقية', 'تبحث لك عن صورة حقيقية لأي شيء وتعرضها في المحادثة.'],
      ['الكاميرا في المكالمة', 'افتح الكاميرا فتصف لك إيفا المشهد وتعلّق عندما يتغير، مع زر لتبديل الكاميرا الأمامية والخلفية.'],
      ['مشاركة الشاشة', 'تشوف شاشة هاتفك وتحلل ما عليها أو تترجمه، حتى وأنت داخل تطبيق آخر.'],
    ]],
    ['التحكم في الهاتف', 'تنفّذ لك الأوامر بدل أن تشرحها.', FiSmartphone, [
      ['فتح أي تطبيق', 'قل «افتحي واتساب» أو أي تطبيق على هاتفك.'],
      ['تشغيل أغنية أو فيديو', 'أنغامي ويوتيوب وسبوتيفاي، مع إكمال الخطوات داخل التطبيق (بحث وكتابة واختيار النتيجة) بعد تفعيل إمكانية الوصول.'],
      ['واتساب', 'تفتح محادثة جهة اتصال بالرسالة جاهزة، وأنت تضغط إرسال.'],
      ['الاتصال برقم', 'تفتح لوحة الاتصال بالرقم، وأنت تضغط اتصال.'],
    ]],
    ['الحساب والإشعارات والتحديثات', 'منظومة كاملة خلف التطبيق.', FiBell, [
      ['حساب وتفعيل من الإدارة', 'تسجيل بالاسم والهاتف وكلمة المرور، وزر تفعيل الحساب يجهز رسالة واتساب للإدارة، وتصلك المفاتيح تلقائيًا بعد التفعيل.'],
      ['إشعارات الإدارة وإيفا', 'رسائل من الإدارة، وإشعار من إيفا عندما يكتمل ردها أو ملفها أو صورتها وأنت في تطبيق آخر، في صندوق إشعارات داخل التطبيق.'],
      ['تحديثات تلقائية', 'يخبرك التطبيق بكل إصدار جديد وتحمّله بزر واحد، مع زر لفحص التحديثات يدويًا.'],
      ['مشاركة التطبيق', 'شارك رابط التحميل أو أرسل ملف التطبيق نفسه كـ APK.'],
      ['عن المطور', 'قسم فيه روابط التواصل مع محمد الحاوي على كل المنصات.'],
      ['يعمل بمفرده', 'لا يحتاج كمبيوترًا ولا اتصالًا به.'],
    ]],
    ['إيفا للكمبيوتر (Windows)', 'النسخة المكتبية، تُنشر قريبًا.', FiMonitor, [
      ['صوت مباشر واستيقاظ', 'تستيقظ بقول «اصحي يا إيفا» أو بالتصفيق مرتين، وتنام بزر Sleep.'],
      ['افتتاحية وجولة ترحيب', 'تقرأ لك الطقس وسعر الدولار والبريد والإشعارات والتذكيرات وأحداث اليوم.'],
      ['واجهة مستقبلية', 'كرة جسيمات ثلاثية الأبعاد بخلفية شفافة تتحكم أنت في شفافيتها.'],
      ['اسأل في أي مكان', 'اختصار عام لسؤال سريع، وقص جزء من الشاشة وسؤالها عنه.'],
      ['الإشارة بالماوس', 'حدد نصًا أو أشر على ملف فتشرحه وتترجمه وتحوّله بين Word وPDF وصور.'],
      ['خصوصية وأمان', 'وضع التخفي، وتأكيد قبل الحذف والإرسال، وشخصيات صوت قابلة للاختيار.'],
      ['ربط Alexa وAndroid', 'مهارة لجهاز Echo Dot وتطبيق الأندرويد.'],
    ]],
  ],
  en: [
    ['Chat & search', 'Answers anything and searches the web for you.', FiMessageCircle, [
      ['Smart chat on any topic', 'Explanations, study, work, translation, writing, ideas and code, in clear Egyptian Arabic or any language you write.'],
      ['Web search', 'Prices, news, weather, scores and anything that needs fresh facts, with an automatic backup between two models.'],
      ['Calls you by name', 'Remembers your name from your account and addresses you warmly.'],
      ['Comfort when you are stressed', 'If you sound stressed or sad she softens her voice and comforts you before any advice.'],
      ['Saved chat history', 'Chats and voice calls are stored on your phone with search and delete, plus light and dark modes.'],
    ]],
    ['Voice calls', 'Talk to Eva live and follow the conversation in writing.', FiMic, [
      ['Eva live voice', 'A natural voice conversation in a calm, warm voice, and you can interrupt.'],
      ['Logo that moves with the voice', 'The Eva logo breathes and swells with your voice and hers, and orbits while thinking.'],
      ['Written conversation in the call', 'Your words and her replies appear as text, and you can type while talking.'],
      ['Floating icon', 'Open any other app and Eva stays with you in the call through a draggable icon that moves with the voice.'],
      ['Eva own microphone', 'Dictate messages with a recording bar and live waveform, instead of the Google speech service.'],
    ]],
    ['Vision, files & images', 'She reads, sees and creates.', FiEye, [
      ['File and image analysis', 'Send a picture, PDF, Word or text file in chat or during a call and talk about it.'],
      ['Word documents', 'Ask for a document and she creates it with Open and Share buttons, even during a call.'],
      ['Image design', 'Design a new picture from a description with AI, free.'],
      ['Real photos', 'Finds a real photo of anything and shows it in the chat.'],
      ['Camera in calls', 'Open the camera and Eva describes the scene and comments when it changes, with a front/back switch.'],
      ['Screen sharing', 'She sees your phone screen and analyses or translates it, even while you are in another app.'],
    ]],
    ['Phone control', 'She does it instead of explaining it.', FiSmartphone, [
      ['Open any app', 'Say "open WhatsApp" or any app on your phone.'],
      ['Play a song or video', 'Anghami, YouTube and Spotify, finishing the steps inside the app (search, type, pick the result) once Accessibility is enabled.'],
      ['WhatsApp', 'Opens a contact chat with the message typed; you press send.'],
      ['Dial a number', 'Opens the dialer with the number; you press call.'],
    ]],
    ['Account, notifications & updates', 'A full system behind the app.', FiBell, [
      ['Account and admin activation', 'Sign up with name, phone and password; Activate account prepares a WhatsApp message to the admin and your keys arrive automatically.'],
      ['Admin and Eva notifications', 'Messages from the admin, and notices from Eva when her reply, file or picture finishes while you are elsewhere, in an in-app inbox.'],
      ['Automatic updates', 'The app tells you about every new version and downloads it with one tap, plus a manual update check button.'],
      ['Share the app', 'Share the download link or send the app itself as an APK file.'],
      ['About the developer', 'A section with Mohamed ElHawy contact links on every platform.'],
      ['Works on its own', 'No computer needed and no link to one.'],
    ]],
    ['Eva for computer (Windows)', 'The desktop edition, coming soon.', FiMonitor, [
      ['Live voice and wake-up', 'Wakes with "wake up Eva" or a double clap, sleeps with a Sleep button.'],
      ['Intro and welcome tour', 'Reads out the weather, dollar rate, mail, notifications, reminders and today\'s events.'],
      ['Futuristic interface', 'A 3D particle orb with a transparent background whose opacity you control.'],
      ['Ask anywhere', 'A global shortcut for a quick question, and crop part of the screen to ask about it.'],
      ['Point with the mouse', 'Select text or point at a file: she explains, translates and converts between Word, PDF and images.'],
      ['Privacy and safety', 'Incognito mode, confirmation before deleting or sending, and selectable voice personalities.'],
      ['Alexa and Android link', 'An Echo Dot skill and the Android app.'],
    ]],
  ],
};

function bytes(n) {
  if (!n) return '';
  return `${(n / 1048576).toFixed(0)} MB`;
}

function fmtDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export function EvaPage({ lang }) {
  const c = copy[lang] || copy.ar;
  const [releases, setReleases] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    document.title = lang === 'ar' ? 'إيفا AI | Elhawy' : 'Eva AI | Elhawy';
    const ctl = new AbortController();
    fetch(`https://api.github.com/repos/${REPO}/releases`, { signal: ctl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('http'))))
      .then((list) => setReleases(list.filter((r) => !r.draft).slice(0, 8)))
      .catch((e) => { if (e.name !== 'AbortError') setFailed(true); });
    return () => ctl.abort();
  }, [lang]);

  const latest = releases && releases[0];
  const apk = latest && (latest.assets || []).find((a) => /\.apk$/i.test(a.name));
  const downloadUrl = apk ? apk.browser_download_url : LATEST_PAGE;

  return (
    <main className="jarvis-page eva-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className="jarvis-hero">
        <div className="jarvis-copy">
          <span>{c.tag}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
          <div className="eva-actions">
            <a className="eva-btn primary" href={downloadUrl}><FiDownload /> {c.download}</a>
            <a className="eva-btn" href="#features">{c.explore} <FiArrowDown /></a>
          </div>
          <small className="eva-meta">
            {latest ? `${c.version}: ${String(latest.tag_name).replace(/^v/i, '')}` : ''}
            {apk ? ` • ${c.size}: ${bytes(apk.size)}` : ''} • {c.android}
          </small>
        </div>
        <div className="eva-hero-art">
          <img src="/eva/eva-logo.png" alt="Eva AI" />
        </div>
      </section>

      <section className="jarvis-flow">
        <header><span>01</span><h2>{c.howTitle}</h2></header>
        <div>
          {steps[lang].map(([title, text, Icon], i) => (
            <article key={title}><i>{String(i + 1).padStart(2, '0')}</i><Icon /><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="jarvis-capabilities" id="features">
        <header><span>02</span><h2>{c.featuresTitle}</h2><p>{c.featuresSub}</p></header>
        <div className="capability-grid">
          {groups[lang].map(([title, text, Icon, items], index) => (
            <details key={title} open={index === 0}>
              <summary>
                <span className="capability-icon"><Icon /></span>
                <span><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></span>
                <b>{index === groups[lang].length - 1 ? c.soon : c.open}</b>
              </summary>
              <div className="capability-details">
                {items.map(([name, description]) => (
                  <article key={name}><FiCheck /><div><h4>{name}</h4><p>{description}</p></div></article>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="eva-poster-band">
        <img src="/eva/eva-poster.jpg" alt="Eva AI" loading="lazy" />
        <div className="eva-install">
          <h2>{c.installTitle}</h2>
          <p>{c.installText}</p>
          <a className="eva-btn primary" href={downloadUrl}><FiDownload /> {c.download}</a>
          <a className="eva-btn" href={RELEASES_PAGE} target="_blank" rel="noreferrer">{c.allReleases} <FiExternalLink /></a>
        </div>
      </section>

      <section className="jarvis-flow eva-updates" id="updates">
        <header><span>03</span><h2>{c.updatesTitle}</h2><p>{c.updatesSub}</p></header>
        <div className="eva-release-list">
          {!releases && !failed && <p className="eva-note">{c.loading}</p>}
          {failed && <p className="eva-note">{c.failed} <a href={RELEASES_PAGE}>{c.allReleases}</a></p>}
          {releases && releases.map((r) => {
            const a = (r.assets || []).find((x) => /\.apk$/i.test(x.name));
            return (
              <article key={r.id} className="eva-release">
                <div className="eva-release-head">
                  <b><FiRefreshCw /> {r.name || r.tag_name}</b>
                  <small>{fmtDate(r.published_at, lang)}</small>
                  {a && <a className="eva-btn small" href={a.browser_download_url}><FiDownload /> {c.dl}</a>}
                </div>
                {r.body && <p className="eva-release-notes"><strong>{c.notes}:</strong> {r.body}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="jarvis-trust">
        <article><FiShield /><div><small>PRIVACY</small><h2>{c.trustTitle}</h2><p>{c.trustText}</p></div></article>
        <article><FiPhone /><div><small>DEVELOPER</small><h2>{c.devTitle}</h2><p>{c.devText}</p>
          <p className="eva-links">
            <a href="https://wa.me/201022104948" target="_blank" rel="noreferrer">{c.wa}</a>
            <a href="https://www.facebook.com/ElhawyAi" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.youtube.com/@ElhawyAI" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://x.com/elhawym" target="_blank" rel="noreferrer">X</a>
            <a href="/about">{c.contact}</a>
          </p>
        </div></article>
      </section>
    </main>
  );
}
