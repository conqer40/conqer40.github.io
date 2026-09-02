import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiGlobe,
  FiMail,
  FiPackage,
  FiPlayCircle,
  FiTruck,
  FiArrowUpLeft,
  FiTool,
  FiVideo,
  FiMessageCircle,
} from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { safeImage, youtubeId } from "./content-utils.js";
import { featuredArticles } from "./featuredArticles.js";
const C = {
  ar: {
    greeting: "مرحبًا، أنا",
    name: "محمد الحاوي",
    role: "خبير لوجستيات وعمليات ومبتكر حلول ذكاء اصطناعي",
    heroRole: "مبرمج ومطور ذكاء اصطناعي",
    heroIntro: "أساعد المطورين والطلاب على فهم البرمجة والذكاء الاصطناعي من خلال محتوى تعليمي وأدوات ذكية.",
    explore: "استكشف الموقع",
    intro:
      "أحوّل البيانات والعمليات المعقدة إلى أنظمة ذكية، واضحة وقابلة للنمو.",
    contact: "تواصل معي",
    about: "عنّي",
    aboutText:
      "أجمع بين الخبرة العملية في سلاسل الإمداد والتشغيل وبين بناء منتجات رقمية ووكلاء ذكاء اصطناعي ينفذون العمل الحقيقي.",
    services: "ما الذي أقدمه",
    projects: "مشروعات مختارة",
    live: "اكتشف المشروع",
    labels: ["استراتيجية العمليات", "التحول الرقمي", "الذكاء الاصطناعي"],
    texts: [
      "تصميم وتشغيل عمليات أكثر كفاءة، مع مؤشرات أداء واضحة وتحسين مستمر.",
      "تحويل الإجراءات اليدوية إلى منصات ولوحات معلومات مترابطة.",
      "بناء مساعدين ووكلاء أذكياء للأتمتة والتحليل واتخاذ القرار.",
    ],
  },
  en: {
    greeting: "Hello, I'm",
    name: "Mohamed Elhawy",
    role: "Logistics, operations & AI solutions creator",
    heroRole: "Programmer & AI Developer",
    heroIntro: "I help developers and students understand programming and artificial intelligence through educational content and smart tools.",
    explore: "Explore the website",
    intro:
      "I turn complex data and operations into intelligent, clear and scalable systems.",
    contact: "Contact me",
    about: "About me",
    aboutText:
      "I combine hands-on supply-chain and operations experience with building digital products and AI agents that execute real work.",
    services: "What I do",
    projects: "Selected projects",
    live: "View project",
    labels: [
      "Operations Strategy",
      "Digital Transformation",
      "Artificial Intelligence",
    ],
    texts: [
      "Designing efficient operations with clear KPIs and continuous improvement.",
      "Turning manual processes into connected platforms and decision dashboards.",
      "Building AI assistants and agents for automation, analysis and decision support.",
    ],
  },
};
const reel = [
  "service-logistics.png",
  "service-operations.png",
  "service-ai-analytics.png",
  "featured-workspace.png",
  "astronaut-horse.png",
];
export function PersonalHome({ lang }) {
  const c = C[lang],
    Arrow = lang === "ar" ? FiArrowLeft : FiArrowRight;
  const [homeData, setHomeData] = useState({ articles: [], library: [], videos: [], loading: true });
  useEffect(() => {
    if (!supabaseReady) return setHomeData({ articles: [], library: [], videos: [], loading: false });
    Promise.all([
      supabase.from("site_articles").select("id,slug,title,summary,category,cover_url,published_at").eq("published", true).order("published_at", { ascending: false }).limit(3),
      supabase.from("library_items").select("id,slug,title,summary,file_type,cover_url,created_at").eq("published", true).order("created_at", { ascending: false }).limit(3),
      supabase.from("video_lessons").select("id,slug,title,summary,cover_url,youtube_url,created_at").eq("published", true).order("created_at", { ascending: false }).limit(3),
    ]).then(([articles, library, videos]) => setHomeData({ articles: [...featuredArticles, ...(articles.data || [])].slice(0, 3), library: library.data || [], videos: videos.data || [], loading: false }));
  }, []);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      document.querySelectorAll(".stack-card").forEach((card, i) => {
        const r = card.getBoundingClientRect(),
          vh = innerHeight;
        const enter = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.72)));
        const passed = Math.max(0, Math.min(1, (125 - r.top) / 280));
        card.style.setProperty("--enter", enter);
        card.style.setProperty("--passed", passed);
        card.style.setProperty("--i", i);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <main className="eh-home">
      <section className="eh-hero">
        <div className="eh-portrait" role="img" aria-label="Mohamed Elhawy" />
        <div className="eh-hero-copy">
          <span>{c.greeting}</span>
          <h1>{c.name}</h1>
          <h2>{c.heroRole}</h2>
          <p>{c.heroIntro}</p>
          <div className="eh-hero-actions">
            <a className="primary" href="#home-shortcuts">{c.explore}<FiGlobe /></a>
            <a href="mailto:m.elhawy2023@gmail.com">{c.contact}<FiMail /></a>
          </div>
        </div>
        <div className="eh-shortcuts" id="home-shortcuts">
          <HeroShortcut lang={lang} to="#featured-projects" icon={<FiCode />} ar="مشروعات" en="Projects" arText="مشروعات عملية تطبيقية" enText="Practical projects" />
          <HeroShortcut lang={lang} to="/articles/category/kwrsat" icon={<FiBookOpen />} ar="كورسات" en="Courses" arText="مقالات ومصادر تعليمية" enText="Learning articles and resources" />
          <HeroShortcut lang={lang} to="/ai" icon={<FiCpu />} ar="Elhawy AI" en="Elhawy AI" arText="مساعد ذكي للتعلم" enText="AI learning assistant" />
          <HeroShortcut lang={lang} to="/videos" icon={<FiPlayCircle />} ar="دروس الفيديو" en="Video lessons" arText="شروحات فيديو مبسطة" enText="Simple video lessons" />
          <HeroShortcut lang={lang} to="/free-tools" icon={<FiFileText />} ar="أدوات PDF" en="PDF tools" arText="أدوات مجانية تعمل مباشرة" enText="Free instant tools" />
          <HeroShortcut lang={lang} to="/articles" icon={<FiEdit3 />} ar="المقالات" en="Articles" arText="مقالات تعليمية مفيدة" enText="Useful learning articles" />
        </div>
      </section>
      <section className="editorial-section home-projects" id="featured-projects">
        <HomeSectionIntro kicker={lang === "ar" ? "أعمال عملية" : "REAL WORK"} title={c.projects} text={lang === "ar" ? "تطبيقات ومنصات أطورها لتحويل المعرفة والذكاء الاصطناعي إلى قيمة حقيقية." : "Products that turn knowledge and AI into real value."} to="/ai" link={lang === "ar" ? "عرض كل المشروعات" : "View projects"} />
        <div className="home-card-row projects-row">
          <HomeMediaCard image="project-elhawy-ai.png" tag="ELHAWY AI" title={lang === "ar" ? "دليل أدوات الذكاء الاصطناعي" : "AI tools directory"} text={lang === "ar" ? "منصة فعلية لاستكشاف أدوات الذكاء الاصطناعي ومقارنتها حسب الاستخدام." : "Explore and compare AI tools by real use case."} to="/ai" />
          <HomeMediaCard image="project-jarvis.png" tag={lang === "ar" ? "وكيل ذكي" : "AI AGENT"} title="Jarvis AI Agent" text={lang === "ar" ? "وكيل ينفذ المهام ويتحكم في الكمبيوتر ويتكامل مع النظارة الذكية." : "An agent that executes work and controls the computer."} to="/projects/jarvis" />
          <HomeMediaCard image="project-pdf-tools.png" tag="PDF TOOLS" title={lang === "ar" ? "أدوات PDF تعمل داخل المتصفح" : "In-browser PDF tools"} text={lang === "ar" ? "أدوات موجودة فعلًا للدمج والتقسيم والضغط والتحويل مع الحفاظ على الخصوصية." : "Real merge, split, compress and conversion tools."} to="/free-tools/pdf-tools" />
        </div>
      </section>
      <section className="editorial-section home-articles">
        <HomeSectionIntro kicker={lang === "ar" ? "مقالات تعليمية" : "INSIGHTS"} title={lang === "ar" ? "تعلّم من الخبرة" : "Learn from experience"} text={lang === "ar" ? "مقالات عملية ومبسطة في البرمجة والذكاء الاصطناعي من خبرة عملية حقيقية." : "Practical articles in programming and AI."} to="/articles" link={lang === "ar" ? "عرض كل المقالات" : "All articles"} />
        <HomeContentGrid loading={homeData.loading} empty={lang === "ar" ? "لا توجد مقالات منشورة حاليًا" : "No published articles yet"}>{homeData.articles.map(a => <HomeMediaCard key={a.id} src={safeImage(a.cover_url)} tag={a.category || (lang === "ar" ? "مقال" : "ARTICLE")} title={a.title} text={a.summary} to={`/articles/${a.slug}`} />)}</HomeContentGrid>
      </section>
      <section className="editorial-section home-lessons">
        <HomeSectionIntro kicker={lang === "ar" ? "دروس الفيديو" : "VIDEO LESSONS"} title={lang === "ar" ? "تعلّم بالخطوة العملية" : "Learn by doing"} text={lang === "ar" ? "شروحات فيديو قصيرة ومنظمة تساعدك على الفهم والتطبيق." : "Short structured videos that help you build."} to="/videos" link={lang === "ar" ? "مشاهدة كل الدروس" : "Watch lessons"} />
        <HomeContentGrid className="home-card-row lessons-row" loading={homeData.loading} empty={lang === "ar" ? "لا توجد دروس فيديو منشورة حاليًا" : "No published video lessons yet"}>{homeData.videos.map(v => <HomeMediaCard key={v.id} src={safeImage(v.cover_url) || (youtubeId(v.youtube_url) ? `https://img.youtube.com/vi/${youtubeId(v.youtube_url)}/hqdefault.jpg` : "")} tag={lang === "ar" ? "درس فيديو" : "VIDEO"} title={v.title} text={v.summary} to={`/videos/watch/${v.slug}`} />)}</HomeContentGrid>
      </section>
      <section className="home-product-duo"><Link to="/study-ai" className="product-panel ai-panel"><small>{lang === "ar" ? "مساعد ذكي" : "AI ASSISTANT"}</small><h2>Elhawy AI</h2><p>{lang === "ar" ? "اسأل عن المنهج واحصل على شرح مبسط وإجابة مرتبطة بالمصادر." : "Ask, learn and get source-grounded explanations."}</p><b>{lang === "ar" ? "ابدأ المحادثة الآن" : "Start now"}<Arrow/></b><FiCpu/></Link><Link to="/free-tools" className="product-panel tools-panel"><small>{lang === "ar" ? "أدوات مجانية" : "FREE TOOLS"}</small><h2>{lang === "ar" ? "أدوات PDF" : "PDF Tools"}</h2><p>{lang === "ar" ? "أدوات فورية وآمنة تعمل داخل متصفحك دون رفع ملفاتك." : "Fast private utilities that run in your browser."}</p><b>{lang === "ar" ? "استعرض الأدوات" : "Explore tools"}<Arrow/></b><FiFileText/></Link></section>
      <section className="eh-cta">
        <span><FiMessageCircle /></span><div><small>{lang === "ar" ? "هل لديك فكرة أو مشروع؟" : "Have an idea or project?"}</small><p>{lang === "ar" ? "لنبنِ شيئًا مؤثرًا معًا." : "Let's build something meaningful."}</p></div><Link to="/contact">{lang === "ar" ? "ابدأ التواصل" : "Get in touch"}<FiExternalLink /></Link>
      </section>
    </main>
  );
}
function HeroShortcut({ lang, to, icon, ar, en, arText, enText }) {
  const content = <>{icon}<b>{lang === "ar" ? ar : en}</b><small>{lang === "ar" ? arText : enText}</small></>;
  return to.startsWith("#") ? <a href={to}>{content}</a> : <Link to={to}>{content}</Link>;
}
function HomeSectionIntro({kicker,title,text,to,link}){return <header className="editorial-intro"><div><small>{kicker}</small><h2>{title}</h2><p>{text}</p>{to&&<Link to={to}>{link}<FiArrowLeft/></Link>}</div></header>}
function HomeMediaCard({image,src,tag,title,text,to}){const picture=src||(image?`/assets/${image}`:"");return <Link className="home-media-card" to={to}><div>{picture?<img src={picture} alt=""/>:<FiFileText/>}<span>{tag}</span></div><section><h3>{title}</h3>{text&&<p>{text}</p>}<b><FiArrowUpLeft/></b></section></Link>}
function Resource({item}){return <Link to={`/library/item/${item.slug || item.id}`} className="resource-card"><span>{item.cover_url?<img src={safeImage(item.cover_url)} alt=""/>:<FiBookOpen/>}</span><div><small>{item.file_type || "ملف"}</small><h3>{item.title}</h3><p>{item.summary || "مورد من مكتبة الحاوي"}</p></div><FiArrowUpLeft/></Link>}
function HomeContentGrid({children,loading,empty,className="home-card-row"}){if(loading)return <div className="home-data-state">جارٍ تحميل المحتوى الفعلي...</div>;return children.length?<div className={className}>{children}</div>:<div className="home-data-state">{empty}</div>}
function Project({ cls, n, title, text, to, c, Arrow, children }) {
  return (
    <article className={`stack-card ${cls}`}>
      <div className="project-copy">
        <small>{n}</small>
        <h3>{title}</h3>
        <p>{text}</p>
        <Link to={to}>
          {c.live}
          <Arrow />
        </Link>
      </div>
      <div className="project-art">{children}</div>
    </article>
  );
}
