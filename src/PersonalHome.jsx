import { useEffect } from "react";
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
} from "react-icons/fi";
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
    <main className="creator-home">
      <section className="creator-hero">
        <div className="creator-portrait">
          <img
            src="/assets/mohamed-elhawy-hero-composite.png"
            alt="Mohamed Elhawy"
          />
        </div>
        <div className="creator-hero-copy">
          <span>{c.greeting}</span>
          <h1>{c.name}</h1>
          <h2>{c.heroRole}</h2>
          <p>{c.heroIntro}</p>
          <div className="creator-hero-actions">
            <a className="primary" href="#home-shortcuts">{c.explore}<FiGlobe /></a>
            <a href="mailto:m.elhawy2023@gmail.com">{c.contact}<FiMail /></a>
          </div>
        </div>
        <div className="creator-shortcuts" id="home-shortcuts">
          <HeroShortcut lang={lang} to="#featured-projects" icon={<FiCode />} ar="مشروعات" en="Projects" arText="مشروعات عملية تطبيقية" enText="Practical projects" />
          <HeroShortcut lang={lang} to="/library" icon={<FiBookOpen />} ar="المكتبة" en="Library" arText="ملفات وموارد مفيدة" enText="Files and resources" />
          <HeroShortcut lang={lang} to="/ai" icon={<FiCpu />} ar="Elhawy AI" en="Elhawy AI" arText="مساعد ذكي للتعلم" enText="AI learning assistant" />
          <HeroShortcut lang={lang} to="/videos" icon={<FiPlayCircle />} ar="دروس الفيديو" en="Video lessons" arText="شروحات فيديو مبسطة" enText="Simple video lessons" />
          <HeroShortcut lang={lang} to="/free-tools" icon={<FiFileText />} ar="أدوات PDF" en="PDF tools" arText="أدوات مجانية تعمل مباشرة" enText="Free instant tools" />
          <HeroShortcut lang={lang} to="/articles" icon={<FiEdit3 />} ar="المقالات" en="Articles" arText="مقالات تعليمية مفيدة" enText="Useful learning articles" />
        </div>
      </section>
      <section className="work-reel">
        <div>
          {[...reel, ...reel].map((x, i) => (
            <img key={i} src={`/assets/${x}`} alt="" />
          ))}
        </div>
      </section>
      <section className="creator-about">
        <span>01</span>
        <h2>{c.about}</h2>
        <p>{c.aboutText}</p>
        <Link to="/about">
          {c.about}
          <Arrow />
        </Link>
      </section>
      <section className="creator-services">
        <header>
          <span>02</span>
          <h2>{c.services}</h2>
        </header>
        <div>
          {c.labels.map((x, i) => (
            <article key={x}>
              <strong>0{i + 1}</strong>
              <div>
                {i === 0 ? <FiTruck /> : i === 1 ? <FiPackage /> : <FiCpu />}
                <h3>{x}</h3>
                <p>{c.texts[i]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="creator-projects" id="featured-projects">
        <header>
          <span>03</span>
          <h2>{c.projects}</h2>
        </header>
        <Project
          cls="project-ai"
          n="01 · AI PLATFORM"
          title={
            <>
              Elhawy <i>AI</i>
            </>
          }
          text={
            lang === "ar"
              ? "منصة عربية لاكتشاف آلاف أدوات الذكاء الاصطناعي، بمحتوى منظم وبحث فعلي."
              : "An Arabic platform for discovering thousands of AI tools with structured content and real search."
          }
          to="/ai"
          c={c}
          Arrow={Arrow}
        >
          <span>5,700+</span>
          <b>AI TOOLS</b>
        </Project>
        <Project
          cls="project-jarvis"
          n="02 · PERSONAL AI AGENT"
          title="JARVIS"
          text={
            lang === "ar"
              ? "وكيل ذكاء اصطناعي يتحكم في الكمبيوتر وينفذ المهام ويتكامل مع النظارة الذكية."
              : "A personal AI agent that controls the computer, executes tasks and connects to smart glasses."
          }
          to="/projects/jarvis"
          c={c}
          Arrow={Arrow}
        >
          <FiCpu />
          <b>AGENT ONLINE</b>
        </Project>
        <Project
          cls="project-library"
          n="03 · KNOWLEDGE HUB"
          title={lang === "ar" ? "المكتبة" : "THE LIBRARY"}
          text={
            lang === "ar"
              ? "مكتبة متجددة للملفات والأدلة والقوالب المفيدة في أقسام واضحة."
              : "A growing library of useful files, guides and templates."
          }
          to="/library"
          c={c}
          Arrow={Arrow}
        >
          <FiPackage />
          <b>DOWNLOAD HUB</b>
        </Project>
      </section>
      <section className="creator-cta">
        <p>
          {lang === "ar"
            ? "لنبنِ شيئًا مؤثرًا معًا."
            : "Let's build something meaningful."}
        </p>
        <a href="mailto:m.elhawy2023@gmail.com">
          m.elhawy2023@gmail.com <FiExternalLink />
        </a>
      </section>
    </main>
  );
}
function HeroShortcut({ lang, to, icon, ar, en, arText, enText }) {
  const content = <>{icon}<b>{lang === "ar" ? ar : en}</b><small>{lang === "ar" ? arText : enText}</small></>;
  return to.startsWith("#") ? <a href={to}>{content}</a> : <Link to={to}>{content}</Link>;
}
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
