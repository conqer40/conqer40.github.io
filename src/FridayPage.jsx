import { useState } from 'react';
import {
  FiPhoneCall,
  FiMic,
  FiDatabase,
  FiTrendingUp,
  FiCompass,
  FiShare2,
  FiEye,
  FiShield,
  FiCheck,
  FiTerminal,
  FiArrowDown,
  FiSliders,
  FiActivity,
  FiLock,
  FiServer
} from 'react-icons/fi';

const shared = {
  ar: {
    tag: 'نظام تشغيل ذكاء اصطناعي سيادي متكامل',
    subTag: 'Autonomous Sovereign AI Operating System',
    title: 'F.R.I.D.A.Y AI',
    fullName: 'Female Replacement Intelligent Digital Assistant Youth',
    lead: 'ليس مجرد شات بوت أو واجهة سحابية تقليدية، بل نظام تشغيل ذكاء اصطناعي سيادي متكامل صُمم ليكون العقل المدبر والمساعد الشخصي الشامل لإدارة الأعمال، الاتصالات الهاتفية الحية، الأبحاث، وأتمتة المهام اليومية بسرعة استثنائية وخصوصية تامة 100%.',
    exploreBtn: 'استكشف القدرات والركائز',
    slidesBtn: 'استعراض شرائح العرض (Slides)',
    archTitle: 'الركائز الهندسية للنظام',
    archSub: 'معمارية هجينة تجمع بين الخصوصية المحلية الكاملة والقوة السحابية الفائقة.',
    pillarsTitle: 'المميزات التنافسية الكبرى لنظام F.R.I.D.A.Y',
    pillarsSub: '7 منظومات متكاملة تنقل الذكاء الاصطناعي من مجرد دردشة إلى شريك تنفيذي على أرض الواقع.',
    slidesTitle: 'هيكل العرض التقديمي (Presentation Deck)',
    slidesSub: 'خطة الشرائح التقديمية الجاهزة للعرض على المستثمرين ومجتمع التقنية (PowerPoint / Canva).'
  },
  en: {
    tag: 'Autonomous Sovereign AI Operating System',
    subTag: 'Next-Gen Enterprise & Autonomous Agent',
    title: 'F.R.I.D.A.Y AI',
    fullName: 'Female Replacement Intelligent Digital Assistant Youth',
    lead: 'Not just another chatbot or wrapper. F.R.I.D.A.Y is an autonomous sovereign AI operating system engineered as an executive digital mastermind for business CRM, live telephony, deep research, and desktop automation with zero privacy compromise.',
    exploreBtn: 'Explore Capabilities',
    slidesBtn: 'Presentation Slides',
    archTitle: 'Engineering Pillars & Architecture',
    archSub: 'Hybrid offline-first architecture combined with massive cloud scaling.',
    pillarsTitle: 'F.R.I.D.A.Y Competitive Capabilities',
    pillarsSub: '7 integrated systems transforming AI into a tangible executive business partner.',
    slidesTitle: 'Presentation Deck Structure',
    slidesSub: 'Slide-by-slide structure ready for investor pitch decks and technical presentations.'
  }
};

const architecturePoints = {
  ar: [
    {
      badge: 'OFFLINE & PRIVATE (100% محلي)',
      title: 'معمارية محلية سيادية لحماية الأسرار التجارية',
      desc: 'يعمل بمحركات ونماذج ذكاء اصطناعي مفتوحة المصدر وبلا رقابة أو قيود (مثل Qwen 2.5 Abliterated و Ollama) مباشرة على كارت الشاشة المحلي (GPU). بيانات أعمالك، عقودك، وفواتيرك لا تغادر جهازك أبداً لضمان الخصوصية التامة.',
      icon: FiLock,
      highlight: 'صفر تسريبات سحابية'
    },
    {
      badge: 'CLOUD POWER (قوة سحابية فورية)',
      title: 'اتصال فوري بأقوى النماذج العالمية عند الحاجة',
      desc: 'عند مواجهة تحليلات ضخمة أو أبحاث معقدة، يرتبط النظام سحابياً بنماذج Gemini 1.5 Pro و Claude 3.5 Sonnet و GPT-4o لمعالجة الملفات العملاقة ومقارنة آلاف المستندات في ثوانٍ معدودة.',
      icon: FiServer,
      highlight: 'توسع سحابي ذكي'
    },
    {
      badge: '3D STARK HUD (واجهة سيبرانية تفاعلية)',
      title: 'شبكة عصبية بصرية تتكون من 24,000 جزيء ضوئي',
      desc: 'واجهة مستقبلية مستوحاة من أنظمة توني ستارك (3D WebGL Neural Nebula)، تتفاعل نبضاتها وجزيئاتها في الوقت الفعلي مع نبرة الصوت وحالات المعالجة والتفكير وتفرع القرارات.',
      icon: FiActivity,
      highlight: '24,000 جزيء تفاعلي'
    }
  ],
  en: [
    {
      badge: 'OFFLINE & PRIVATE (100% Local)',
      title: 'Sovereign Local Architecture for Trade Secrets',
      desc: 'Runs open-weights, uncensored local models (Qwen 2.5 Abliterated, Ollama) on local GPU hardware. Your business data, financial sheets, and contacts never leak to third-party clouds.',
      icon: FiLock,
      highlight: 'Zero Cloud Leaks'
    },
    {
      badge: 'CLOUD POWER (Instant Scaling)',
      title: 'Real-Time Connection to Global Flagship Models',
      desc: 'On-demand orchestration connects instantly to Gemini 1.5 Pro, Claude 3.5 Sonnet, and GPT-4o for deep research, massive cross-document synthesis, and extreme analysis workloads.',
      icon: FiServer,
      highlight: 'Intelligent Cloud Burst'
    },
    {
      badge: '3D STARK HUD (Cybernetic Interface)',
      title: 'Interactive 3D WebGL Nebula of 24,000 Particles',
      desc: 'A futuristic Stark-inspired visual cockpit with a 24,000-particle neural nebula reacting live to speech inflection, cognitive load, and decision branches.',
      icon: FiActivity,
      highlight: '24,000 Dynamic Particles'
    }
  ]
};

const pillars = {
  ar: [
    {
      id: 'telephony',
      num: '01',
      title: 'بوابة الاتصالات الهاتفية الذكية',
      enTitle: 'Tel-Agent Telephony Gateway',
      icon: FiPhoneCall,
      color: '#0891b2',
      summary: 'إجراء واستقبال مكالمات هاتفية حية كأنها موظف اتصالات حقيقي مع خاصية المقاطعة الفورية.',
      features: [
        'مكالمات صوتية حية (Inbound & Outbound) مع عملاء وتجار وموردين.',
        'تقنية المقاطعة التلقائية (Barge-in Support): إذا تحدث المستخدم أثناء رد فرايدي، تصمت فوراً وتستمع إليه دون ارتباك أو تأخير.',
        'تكامل مودم الشرائح (4G SIM Modem Integration): قراءة الشريحة، فحص قوة الإشارة، استقبال وقراءة الـ SMS، وإرسال الرسائل وأكواد الـ USSD.'
      ]
    },
    {
      id: 'voice',
      num: '02',
      title: 'محرك صوتي عصبي بشري واستنساخ الأصوات',
      enTitle: 'Ultra-Realistic Neural TTS & Cloning',
      icon: FiMic,
      color: '#7c3aed',
      summary: 'استجابة فائقة السرعة بالعامية المصرية والفصحى والإنجليزية مع استنساخ أصوات مخصصة وتبديل شخصيات.',
      features: [
        'استجابة صوتية فورية فائقة الواقعية بنبرات تفاعلية حية.',
        'استنساخ أصوات متعددة بدقة متناهية (صوت فرايدي الأنثوي الذكي، باسم يوسف، ماجد الكدواني، د. الصالحي، وصوت محمد الحاوي).',
        'التحويل المزدوج السريع: من صوت فرايدي الودود إلى وضع ألترون القتالي (Ultron Combat Mode) بضغطة زر وبصوت سينمائي جهوري عميق.'
      ]
    },
    {
      id: 'brain',
      num: '03',
      title: 'العقل الثاني والذاكرة المتجهة الدائمة',
      enTitle: 'Second Brain & Vector RAG',
      icon: FiDatabase,
      color: '#0284c7',
      summary: 'نظام ذاكرة دائمة لا ينسى مبني على قواعد بيانات متجهة (ChromaDB + SQLite) مع خريطة أفكار بصرية.',
      features: [
        'تخزين واسترجاع فوري لكل محادثة، مستند، تحليل مالي، وقرار عمل سابق بدقة تامة.',
        'الخريطة العصبية الحية (Neural Operations Map): شاشة بصرية تعرض مسارات الأفكار والقرارات التي تتخذها فرايدي خطوة بخطوة أثناء حل المشكلات.',
        'ربط دلالي ذكي بين الملفات والمشاريع المختلفة لاستنتاج رؤى سريعة.'
      ]
    },
    {
      id: 'crm',
      num: '04',
      title: 'ذكاء المبيعات والتجارة وإدارة الشركات',
      enTitle: 'GCC Feed Sales & Commodities CRM',
      icon: FiTrendingUp,
      color: '#059669',
      summary: 'محطة عمل مخصصة لقطاع تجارة واستيراد خامات الأعلاف والحبوب وربط منظومة الجمارك والموانئ.',
      features: [
        'إدارة تخصصية لتجارة خامات الأعلاف (الصويا، الذرة الصفراء، الـ DDGS، الجلوتين).',
        'تتبع شحنات الجمارك ونظام نافذة والموانئ والمطابقات المعملية وشهادات الإفراج.',
        'إدارة عروض أسعار الموردين والعملاء، وتحليل تكاليف النقل وتذبذب العملة ومؤشرات البورصة العالمية لحظياً.'
      ]
    },
    {
      id: 'browser',
      num: '05',
      title: 'المتصفح الذاتي المستقل',
      enTitle: 'Autonomous Browser Agent',
      icon: FiCompass,
      color: '#d97706',
      summary: 'تصفح ذاتي كامل للويب، قراءة المقالات المعقدة، تجاوز الحجب، واستخراج البيانات وتنزيل الملفات دون تدخل يدوي.',
      features: [
        'فتح المتصفح بمفردها، إدخال الكلمات المفتاحية، وفحص الروابط والشهادات.',
        'تجاوز الحجب واستخراج الجداول والبيانات الصعبة تلقائياً.',
        'تحميل وتصنيف المستندات والتقارير وحفظها مباشرة في قاعدة البيانات المتجهة.'
      ]
    },
    {
      id: 'social',
      num: '06',
      title: 'استوديو السوشيال المؤتمت',
      enTitle: 'Autonomous Social Studio',
      icon: FiShare2,
      color: '#e11d48',
      summary: 'صياغة المنشورات وتنسيق الحملات التسويقية والردود الذكية التلقائية لصفحات فيسبوك ومنصات التواصل.',
      features: [
        'توليد محتوى احترافي متلائم مع خوارزميات فيسبوك وLinkedIn.',
        'جدولة تلقائية ومتابعة التفاعل وتحليل اهتمامات الجمهور.',
        'نظام ردود ذكي يفهم استفسارات العملاء في التعليقات والرسائل الخاصة ويرد بدقة.'
      ]
    },
    {
      id: 'vision',
      num: '07',
      title: 'التحكم في الحاسوب والإيماءات البصرية',
      enTitle: 'Computer Vision & Vision Gestures',
      icon: FiEye,
      color: '#0284c7',
      summary: 'تحكم كامل بنظام ويندوز مع التعرف على إيماءات اليد عبر الكاميرا للتحكم دون لمس الماوس أو الكيبورد.',
      features: [
        'تحكم كامل بنظام Windows (فتح البرامج، قراءة الشاشة، كتابة النصوص، ونقل الملفات).',
        'التعرف على إيماءات اليد (Hand Gestures) عبر الكاميرا لتوجيه النوافذ والأوامر بالإشارة.',
        'بوابات أمان وموافقة صارمة لحماية الملفات الحساسة والنظام من أي إجراء غير مقصود.'
      ]
    }
  ],
  en: [
    {
      id: 'telephony',
      num: '01',
      title: 'Smart Telephony Gateway',
      enTitle: 'Tel-Agent Telephony Gateway',
      icon: FiPhoneCall,
      color: '#0891b2',
      summary: 'Executes and receives live phone calls with zero-latency speech and natural barge-in interruptions.',
      features: [
        'Live Inbound and Outbound calling with suppliers and clients.',
        'Real-time Barge-in: System immediately yields and listens when interrupted by user speech.',
        '4G SIM Modem Integration: Hardware reading, signal monitoring, SMS send/receive, and USSD automation.'
      ]
    },
    {
      id: 'voice',
      num: '02',
      title: 'Ultra-Realistic Neural TTS & Cloning',
      enTitle: 'Ultra-Realistic Neural TTS & Cloning',
      icon: FiMic,
      color: '#7c3aed',
      summary: 'Ultra-low latency Arabic (Egyptian & MSA) and English neural voices with instant character switching.',
      features: [
        'Ultra-natural conversational inflections and immediate response latency.',
        'Precise voice cloning profiles (F.R.I.D.A.Y, Bassem Youssef, Maged El Kedwany, Dr. El-Salehy, Mohamed Elhawy).',
        'Dual Persona Switching: From friendly F.R.I.D.A.Y assistant to cinematic Ultron Combat Mode in one tap.'
      ]
    },
    {
      id: 'brain',
      num: '03',
      title: 'Second Brain & Persistent Vector RAG',
      enTitle: 'Second Brain & Vector RAG',
      icon: FiDatabase,
      color: '#0284c7',
      summary: 'Persistent vector memory built on ChromaDB & SQLite, coupled with a dynamic visual cognitive graph.',
      features: [
        'Persistent recall of every conversation, invoice, decision, and market trend.',
        'Neural Operations Map: Interactive visual HUD graphing real-time thought branches and decision logic.',
        'Deep cross-project semantic linking for rapid corporate intelligence.'
      ]
    },
    {
      id: 'crm',
      num: '04',
      title: 'GCC Feed Commodities CRM',
      enTitle: 'GCC Feed Sales & Commodities CRM',
      icon: FiTrendingUp,
      color: '#059669',
      summary: 'Specialized enterprise station for grain/feed trading, port customs tracking, and price arbitrage.',
      features: [
        'Tailored workflows for soybean, corn, DDGS, and gluten trading.',
        'Customs tracking, Nafeza portal sync, port logistics, and lab compliance test certificates.',
        'Supplier quote management, freight calculations, currency fluctuation analysis, and global exchange tracking.'
      ]
    },
    {
      id: 'browser',
      num: '05',
      title: 'Autonomous Browser Agent',
      enTitle: 'Autonomous Browser Agent',
      icon: FiCompass,
      color: '#d97706',
      summary: 'Full web navigation agent that navigates complex pages, extracts structured datasets, and bypasses blocks.',
      features: [
        'Launches browser autonomously, executes searches, and verifies sources.',
        'Extracts difficult tabular data and downloads documentation automatically.',
        'Indexes research directly into the persistent vector memory.'
      ]
    },
    {
      id: 'social',
      num: '06',
      title: 'Autonomous Social Studio',
      enTitle: 'Autonomous Social Studio',
      icon: FiShare2,
      color: '#e11d48',
      summary: 'Drafts high-engagement posts, runs marketing campaigns, and automates community interactions.',
      features: [
        'Optimized copywriting tuned for Facebook and LinkedIn distribution algorithms.',
        'Scheduled publishing, engagement telemetry, and audience sentiment analysis.',
        'Context-aware comment and inbox auto-responder answering inquiries accurately.'
      ]
    },
    {
      id: 'vision',
      num: '07',
      title: 'Computer Vision & Vision Gestures',
      enTitle: 'Computer Vision & Vision Gestures',
      icon: FiEye,
      color: '#0284c7',
      summary: 'Full Windows OS automation coupled with touchless webcam hand gesture controls.',
      features: [
        'Complete Windows OS control (app execution, window management, screen reading, typing, and file routing).',
        'Camera hand-gesture recognition for hands-free navigation and system commands.',
        'Multi-layer safety gates and strict human verification on critical operations.'
      ]
    }
  ]
};

const presentationSlides = [
  {
    num: 1,
    titleAr: 'الغلاف (Title Slide)',
    titleEn: 'Title Slide',
    contentAr: 'F.R.I.D.A.Y AI — الجيل القادم من أنظمة الذكاء الاصطناعي السيادية وإدارة الأعمال الذاتية.\nتقديم: محمد الحاوي (Mohamed Elhawy)'
  },
  {
    num: 2,
    titleAr: 'المشكلة الحالية (The Problem)',
    titleEn: 'The Problem',
    contentAr: '• الشات بوت التقليدي منفصل تماماً عن جهازك ومكالماتك الهاتفية.\n• مخاوف أمنية متزايدة بشأن الخصوصية وتسريب أسرار الشركات في السحابة.\n• غياب الأتمتة الحقيقية والتكامل العملي مع أدوات البيزنس الواقعية.'
  },
  {
    num: 3,
    titleAr: 'الحل: F.R.I.D.A.Y (The Solution)',
    titleEn: 'The Solution',
    contentAr: '• نظام تشغيل ذكاء اصطناعي سيادي هجين يعمل محلياً وسحابياً في آن واحد.\n• يتحكم في الجهاز بدقة، يجري ويستقبل المكالمات، ويدير عمليات المبيعات والجمارك.\n• واجهة سيبرانية حية ثلاثية الأبعاد تنبض بالذكاء والتفاعل اللحظي.'
  },
  {
    num: 4,
    titleAr: 'الهندسة والخصوصية (Architecture)',
    titleEn: 'Architecture & Privacy',
    contentAr: '• 100% Offline Capability: نماذج محلية (Qwen 2.5 Abliterated) بلا قيود على كارت الشاشة لحماية أسرار العمل.\n• Cloud Scaling: ربط فوري بنماذج Gemini 1.5 Pro و Claude 3.5 عند الحاجة للأبحاث العملاقة.\n• تشفير محلي للبيانات مع قاعدة بيانات متجهة (Vector Database) لا تنسى.'
  },
  {
    num: 5,
    titleAr: 'الاتصالات والصوت (Telephony & Voice)',
    titleEn: 'Telephony & Voice Engine',
    contentAr: '• إجراء واستقبال مكالمات هاتفية حية متصلة بمودم شريحة 4G SIM.\n• دعم تقنية المقاطعة التلقائية الحية (Barge-in Support) بدون تأخير.\n• محرك استنساخ أصوات متعدد الشخصيات بلكنة مصرية وعربية واقعية للغاية مع وضع ألترون القتالي.'
  },
  {
    num: 6,
    titleAr: 'محركات البيزنس والأتمتة (Business CRM)',
    titleEn: 'Enterprise Automation',
    contentAr: '• GCC Feed Intelligence: محطة عمل لتجارة خامات الأعلاف والحبوب ومتابعة نظام نافذة والجمارك والموانئ.\n• Autonomous Web Browser: باحث مستقل يتصفح الويب وينجز المهام المعقدة ذاتياً.\n• Social Studio: أتمتة صناعة المحتوى والتفاعل التسويقي.'
  },
  {
    num: 7,
    titleAr: 'العقل الثاني والذاكرة (Second Brain)',
    titleEn: 'Second Brain & RAG',
    contentAr: '• ذاكرة طويلة الأمد لا تنسى ترسم مسارات العلاقات بين الملفات والأفكار والقرارات.\n• خريطة عصبية بصرية تفاعلية (Neural Operations Map) توضح كيفية اتخاذ القرارات خطوة بخطوة.'
  },
  {
    num: 8,
    titleAr: 'الخاتمة والرؤية المستقبلية (Future Vision)',
    titleEn: 'Conclusion & Vision',
    contentAr: '• الذكاء الاصطناعي لم يعد مجرد إجابة أسئلة أو كتابة نصوص، بل أصبح شريك عمل تنفيذي مستقل وقادر على الفعل.\n• The Future of Sovereign Enterprise AI.'
  }
];

export function FridayPage({ lang }) {
  const c = shared[lang] || shared.ar;
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <main className="jarvis-page friday-page">
      {/* HERO SECTION */}
      <section className="jarvis-hero friday-hero" style={{
        background: 'linear-gradient(135deg, #051329 0%, #082845 50%, #031422 100%)',
        border: '1px solid rgba(34, 211, 238, 0.25)',
        boxShadow: '0 25px 70px rgba(6, 182, 212, 0.12)'
      }}>
        <div className="jarvis-copy">
          <span style={{ color: '#22d3ee', letterSpacing: '2px', fontWeight: 800 }}>
            {c.tag}
          </span>
          <h1 style={{
            fontSize: 'clamp(44px, 6vw, 76px)',
            background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 70%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '12px 0 6px'
          }}>
            {c.title}
          </h1>
          <small style={{ display: 'block', color: '#f59e0b', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
            {c.fullName}
          </small>
          <p style={{ color: '#cbd5e1', fontSize: '17px', lineHeight: 1.85, maxWidth: '720px' }}>
            {c.lead}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '28px' }}>
            <a href="#capabilities" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              boxShadow: '0 6px 20px rgba(6, 182, 212, 0.35)'
            }}>
              {c.exploreBtn} <FiArrowDown />
            </a>
            <a href="#slides-deck" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: 700
            }}>
              <FiSliders /> {c.slidesBtn}
            </a>
          </div>
        </div>

        {/* 3D STARK CORE VISUAL */}
        <div className="friday-core-preview" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '340px'
        }}>
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(34, 211, 238, 0.4)',
            boxShadow: '0 0 50px rgba(6, 182, 212, 0.35), inset 0 0 30px rgba(245, 158, 11, 0.2)'
          }}>
            <img
              src="/assets/project-friday.png"
              alt="F.R.I.D.A.Y AI Core HUD"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 16px',
            borderRadius: '99px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#38bdf8'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            STARK HUD // 24,000 NEURAL PARTICLES // ONLINE
          </div>
        </div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <section className="jarvis-flow" style={{ paddingTop: '50px' }}>
        <header>
          <span style={{ color: '#06b6d4' }}>01 / ARCHITECTURE</span>
          <h2>{c.archTitle}</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '6px 0 0' }}>{c.archSub}</p>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
          {(architecturePoints[lang] || architecturePoints.ar).map((item, i) => (
            <article key={i} style={{
              background: '#fff',
              border: '1px solid #dce8ef',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(7, 26, 60, 0.04)',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#ecfeff',
                color: '#0891b2',
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '14px'
              }}>
                <item.icon /> {item.badge}
              </div>
              <h3 style={{ fontSize: '19px', margin: '0 0 10px', color: '#0f172a' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#475569', margin: 0 }}>{item.desc}</p>
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px dashed #e2e8f0',
                color: '#0284c7',
                fontSize: '12px',
                fontWeight: 800
              }}>
                ✓ {item.highlight}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section className="jarvis-capabilities" id="capabilities" style={{ paddingTop: '60px' }}>
        <header>
          <span style={{ color: '#06b6d4' }}>02 / CORE CAPABILITIES</span>
          <h2>{c.pillarsTitle}</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '6px 0 0' }}>{c.pillarsSub}</p>
        </header>

        <div className="capability-grid" style={{ gap: '16px' }}>
          {(pillars[lang] || pillars.ar).map((p, index) => (
            <details key={p.id} open={index < 2} style={{
              border: '1px solid #dce8ef',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 6px 24px rgba(7, 26, 60, 0.03)'
            }}>
              <summary style={{
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: '18px',
                padding: '22px 26px',
                background: '#fafcff'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: `${p.color}15`,
                  color: p.color,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '24px'
                }}>
                  <p.icon />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <small style={{ color: p.color, fontWeight: 800, fontSize: '12px' }}>{p.num}</small>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>· {p.enTitle}</span>
                  </div>
                  <h3 style={{ margin: '3px 0', fontSize: '19px', color: '#0f172a' }}>{p.title}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{p.summary}</p>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>تفاصيل المنظومة ▼</span>
              </summary>

              <div style={{ padding: '20px 28px 26px', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                  {p.features.map((feat, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: '#334155'
                    }}>
                      <span style={{
                        marginTop: '4px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ecfeff',
                        color: '#0891b2',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        <FiCheck />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* PRESENTATION SLIDES SECTION */}
      <section id="slides-deck" style={{
        marginTop: '60px',
        padding: '40px',
        borderRadius: '26px',
        background: '#071629',
        color: '#fff',
        border: '1px solid #1e3a5f',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '13px' }}>03 / PRESENTATION DECK</span>
          <h2 style={{ fontSize: '32px', margin: '8px 0', color: '#fff' }}>{c.slidesTitle}</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>{c.slidesSub}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: '24px' }}>
          {/* Slides Nav List */}
          <div style={{ display: 'grid', gap: '8px' }}>
            {presentationSlides.map((slide, idx) => (
              <button
                key={slide.num}
                onClick={() => setActiveSlide(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: activeSlide === idx ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                  background: activeSlide === idx ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeSlide === idx ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  textAlign: 'right',
                  font: 'inherit',
                  transition: '0.2s'
                }}
              >
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: activeSlide === idx ? '#38bdf8' : '#1e293b',
                  color: activeSlide === idx ? '#071629' : '#94a3b8',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  {slide.num}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>
                  {lang === 'ar' ? slide.titleAr : slide.titleEn}
                </span>
              </button>
            ))}
          </div>

          {/* Active Slide Display */}
          <div style={{
            background: 'linear-gradient(145deg, #0d223f, #071526)',
            border: '1px solid #234873',
            borderRadius: '18px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '99px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  SLIDE {presentationSlides[activeSlide].num} OF 8
                </span>
                <small style={{ color: '#64748b' }}>F.R.I.D.A.Y AI Pitch Deck</small>
              </div>
              <h3 style={{ fontSize: '24px', color: '#f1f5f9', margin: '0 0 16px' }}>
                {lang === 'ar' ? presentationSlides[activeSlide].titleAr : presentationSlides[activeSlide].titleEn}
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.9,
                color: '#cbd5e1',
                whiteSpace: 'pre-line',
                margin: 0
              }}>
                {presentationSlides[activeSlide].contentAr}
              </p>
            </div>

            <div style={{
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: activeSlide === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeSlide === 0 ? 0.3 : 1
                }}
              >
                ← الشريحة السابقة
              </button>
              <button
                disabled={activeSlide === presentationSlides.length - 1}
                onClick={() => setActiveSlide(s => Math.min(presentationSlides.length - 1, s + 1))}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '0',
                  background: '#0ea5e9',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: activeSlide === presentationSlides.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: activeSlide === presentationSlides.length - 1 ? 0.3 : 1
                }}
              >
                الشريحة التالية →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & VISION BANNER */}
      <section className="jarvis-trust" style={{ marginTop: '50px' }}>
        <article>
          <FiShield />
          <div>
            <small>SOVEREIGN SECURITY</small>
            <h2>خصوصية سيادية 100%</h2>
            <p>كافة محركات الذكاء الاصطناعي الأساسية والذاكرة المتجهة تعمل على كارت الشاشة محلياً لحماية الأسرار التجارية.</p>
          </div>
        </article>
        <article>
          <FiTerminal />
          <div>
            <small>EXECUTIVE ENTERPRISE</small>
            <h2>شريك عمل تنفيذي</h2>
            <p>التحكم بالنظام، إجراء المكالمات، وإدارة الجمارك وسلاسل الإمداد تنقل الذكاء الاصطناعي إلى واقع البيزنس الفعلي.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
