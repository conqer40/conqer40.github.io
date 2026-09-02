import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiCpu,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiGlobe,
  FiImage,
  FiLayers,
  FiLoader,
  FiMail,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiPhone,
  FiSearch,
  FiSun,
  FiTool,
  FiPlus,
  FiTruck,
  FiVideo,
  FiVolume2,
  FiZap,
  FiX,
  FiGrid,
  FiUser,
  FiLogIn,
} from "react-icons/fi";
import { PersonalHome } from "./PersonalHome.jsx";
import { ResumePage } from "./ResumePage.jsx";
import { JarvisPage } from "./JarvisPage.jsx";
import { LibraryCategory, LibraryItem, LibraryPage } from "./LibraryV2.jsx";
import { VideoCategory, VideoLesson, VideoLessons } from "./VideoLessons.jsx";
import { LibraryAdmin } from "./LibraryAdmin.jsx";
import { ManagedArticle, ManagedArticles } from "./ManagedArticles.jsx";
import { ShareButtons } from "./ShareButtons.jsx";
import { FreeToolsPage, PdfToolPage, PdfToolsPage } from "./free-tools/FreeTools.jsx";
import { StudyAssistant } from "./StudyAssistant.jsx";
import {
  AccountNav,
  AuthProvider,
  ContactPage,
  LoginPage,
  ProfilePage,
} from "./UserAccount.jsx";

const C = createContext({ tools: [], loading: true });
const topics = [
  ["الكل", FiLayers],
  ["كتابة", FiFileText],
  ["تصميم", FiImage],
  ["فيديو", FiVideo],
  ["برمجة", FiCode],
  ["بحث", FiSearch],
  ["أتمتة", FiZap],
  ["تعليم", FiBookOpen],
  ["صوت", FiVolume2],
  ["صور", FiImage],
];
const aliases = {
  كتابة: ["كتابة", "نص", "محتوى"],
  تصميم: ["تصميم", "صور", "فن"],
  فيديو: ["فيديو"],
  برمجة: ["برمجة", "أكواد", "تطوير"],
  بحث: ["بحث"],
  أتمتة: ["أتمتة", "أعمال"],
  تعليم: ["تعليم", "دراسة"],
  صوت: ["صوت", "كلام"],
  صور: ["صور", "صورة"],
};
const slides = [
  {
    image: "/assets/astronaut-horse.png",
    title: "Leonardo AI",
    label: "توليد الصور",
    prompt: "رائد فضاء يمتطي حصانًا على سطح القمر",
  },
  {
    image: "/tool-images/d5ee177ae80d59a1.webp",
    title: "RoomGPT",
    label: "تصميم المساحات",
    prompt: "أعد تصميم غرفتك خلال ثوانٍ",
  },
  {
    image: "/assets/featured-workspace.png",
    title: "Notion AI",
    label: "الإنتاجية",
    prompt: "رتّب أفكارك ومشاريعك في مساحة ذكية",
  },
];
const articles = {
  "choose-ai-tool": [
    "كيف تختار أداة الذكاء الاصطناعي المناسبة؟",
    "دليل عملي يساعدك على المقارنة بعيدًا عن الضجيج.",
    [
      "ابدأ بالمشكلة التي تريد حلها، وليس باسم الأداة الأكثر شهرة. حدّد المهمة والنتيجة التي تتوقعها.",
      "جرّب النسخة المجانية وقارن جودة النتيجة وسهولة الاستخدام والتكلفة.",
      "راجع سياسة الخصوصية وإمكانية تصدير بياناتك قبل الاعتماد على أي أداة.",
    ],
  ],
  "best-writing-tools": [
    "أفضل طريقة لمقارنة أدوات الكتابة",
    "اختبار موحّد يكشف الفروق الحقيقية بين الأدوات.",
    [
      "استخدم نفس الطلب والنص المرجعي مع كل أداة، ثم قيّم الدقة والأسلوب والالتزام بالتعليمات.",
      "اختبر التلخيص وإعادة الصياغة والبحث والتحرير كلٌ على حدة.",
    ],
  ],
  "ai-workflow": [
    "ابنِ سير عمل ذكيًا دون تعقيد",
    "من مهمة واحدة إلى نظام يوفر ساعات أسبوعيًا.",
    [
      "ابدأ بخطوة واحدة قابلة للقياس، ثم أضف الأتمتة تدريجيًا.",
      "احتفظ بنقطة مراجعة بشرية للقرارات المهمة والبيانات الحساسة.",
    ],
  ],
};

function Provider({ children }) {
  const [tools, setTools] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/data/tools.json")
      .then((r) => r.json())
      .then(setTools)
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);
  return <C.Provider value={{ tools, loading }}>{children}</C.Provider>;
}
const useTools = () => useContext(C);
function Header({ dark, setDark, lang, setLang }) {
  const ar = lang === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className={`site-header personal-nav nav-v3 portal-nav${menuOpen ? " menu-open" : ""}`}>
      <Link className="brand" to="/">
        <img className="brand-logo" src="/assets/mohamed-elhawy-logo.png" alt={ar ? "محمد الحاوي" : "Mohamed Elhawy"} />
      </Link>
      <nav id="primary-navigation" onClick={closeMenu}>
        <div className="nav-primary">
          <NavLink to="/" end>{ar ? "الرئيسية" : "Home"}</NavLink>
          <NavLink to="/about">{ar ? "من أنا" : "About"}</NavLink>
          <NavLink to="/ai">Elhawy AI</NavLink>
          <NavLink to="/articles">{ar ? "المقالات" : "Articles"}</NavLink>
          <NavLink to="/videos">{ar ? "دروس الفيديو" : "Videos"}</NavLink>
          <NavLink to="/free-tools">{ar ? "أدوات مجانية" : "Free tools"}</NavLink>
          <NavLink to="/contact">{ar ? "تواصل" : "Contact"}</NavLink>
        </div>
      </nav>
      <div className="header-actions">
        <AccountNav />
        <div className="lang-switch" role="group" aria-label="Language">
          <button className={ar ? "active" : ""} onClick={() => setLang("ar")}>
            AR
          </button>
          <button className={!ar ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
        <button
          className="theme-button"
          onClick={() => setDark((v) => !v)}
          aria-label={ar ? "تبديل المظهر" : "Toggle theme"}
        >
          {dark ? <FiSun /> : <FiMoon />}
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={ar ? "فتح القائمة الرئيسية" : "Open main menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {menuOpen && <button className="nav-backdrop" onClick={closeMenu} aria-label={ar ? "إغلاق القائمة" : "Close menu"} />}
    </header>
  );
}

function Footer({ lang }) {
  const ar = lang === "ar";
  return <footer className="site-footer">
    <div className="footer-lead">
      <span className="brand-mark" aria-hidden="true">ME</span>
      <div><h2>{ar ? "نتعلم، نبني، ونحوّل الأفكار إلى أدوات مفيدة." : "Learn, build, and turn ideas into useful tools."}</h2><p>{ar ? "منصة محمد الحاوي للمحتوى التقني والذكاء الاصطناعي والموارد العملية." : "Mohamed Elhawy's platform for AI, technical content and practical resources."}</p></div>
    </div>
    <div className="footer-links">
      <div><b>{ar ? "المحتوى" : "Content"}</b><Link to="/articles">{ar ? "المقالات والملفات" : "Articles & resources"}</Link><Link to="/videos">{ar ? "دروس الفيديو" : "Videos"}</Link></div>
      <div><b>{ar ? "الأدوات" : "Tools"}</b><Link to="/ai">Elhawy AI</Link><Link to="/study-ai">{ar ? "المساعد التعليمي" : "Study AI"}</Link><Link to="/free-tools">{ar ? "أدوات مجانية" : "Free tools"}</Link></div>
      <div><b>{ar ? "محمد الحاوي" : "Mohamed"}</b><Link to="/about">{ar ? "من أنا" : "About"}</Link><Link to="/contact">{ar ? "تواصل معي" : "Contact"}</Link><Link to="/login">{ar ? "دخول الحساب" : "Sign in"}</Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Mohamed Elhawy</span><a href="mailto:m.elhawy2023@gmail.com">m.elhawy2023@gmail.com</a></div>
  </footer>;
}

function Grid({ items, loading }) {
  const [visible, setVisible] = useState(24);
  useEffect(() => setVisible(24), [items]);
  if (loading)
    return (
      <div className="catalog-loading">
        <FiLoader /> جارٍ التحميل
      </div>
    );
  if (!items.length)
    return <div className="empty-state">لا توجد أدوات مطابقة.</div>;
  return (
    <>
      <div className="catalog-grid">
        {items.slice(0, visible).map((t) => (
          <Link className="catalog-card" to={`/tool/${t.id}`} key={t.id}>
            <div className="catalog-image">
              {t.image ? (
                <img src={t.image} alt={t.name} loading="lazy" />
              ) : (
                <FiZap />
              )}
            </div>
            <div className="catalog-copy">
              <span>{t.category || "غير مصنف"}</span>
              <h3>{t.name}</h3>
              <p>{t.description || "تفاصيل الأداة متاحة في صفحتها."}</p>
              <div>
                <small>{t.price || "غير محدد"}</small>
                <FiArrowLeft />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {visible < items.length && (
        <button className="load-more" onClick={() => setVisible((v) => v + 24)}>
          عرض المزيد
        </button>
      )}
    </>
  );
}

function Home() {
  const [slide, setSlide] = useState(0),
    [q, setQ] = useState("");
  const nav = useNavigate(),
    { tools, loading } = useTools(),
    s = slides[slide],
    picks = tools.filter((t) => !t.unavailable).slice(0, 4);
  useEffect(() => {
    const x = setInterval(() => setSlide((v) => (v + 1) % 3), 6000);
    return () => clearInterval(x);
  }, []);
  return (
    <main>
      <section className="hero">
        <div className="hero-visual">
          <div className="demo-shell">
            <div className="demo-top">
              <span>{s.label}</span>
              <i>●</i>
            </div>
            <div className="demo-content">
              <aside>
                <strong>{s.title}</strong>
                <span>{s.prompt}</span>
                <span>AI · Creative</span>
                <Link to="/tools">استكشف</Link>
              </aside>
              <div className="demo-image">
                <img key={s.image} src={s.image} alt={s.prompt} />
              </div>
            </div>
          </div>
          <div className="slider-controls">
            <button onClick={() => setSlide((slide + 2) % 3)}>
              <FiChevronRight />
            </button>
            <div>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={slide === i ? "dot active" : "dot"}
                />
              ))}
            </div>
            <button onClick={() => setSlide((slide + 1) % 3)}>
              <FiChevronLeft />
            </button>
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">مكتبة مختارة. اكتشف الأفضل.</p>
          <h1>
            أفضل أدوات الذكاء<span>الاصطناعي، مختارة بعناية</span>
          </h1>
          <p className="lead">آلاف الأدوات المصنفة وصفحات مستقلة وبحث فعلي.</p>
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/tools?q=${encodeURIComponent(q)}`);
            }}
          >
            <FiSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن أداة أو مهمة..."
            />
          </form>
        </div>
      </section>
      <section className="category-bar">
        {topics.map(([n, I]) => (
          <Link
            key={n}
            to={
              n === "الكل" ? "/tools" : `/tools?topic=${encodeURIComponent(n)}`
            }
          >
            <I /> {n}
          </Link>
        ))}
      </section>
      <section className="editors">
        <div className="section-heading">
          <div>
            <h2>اختيارات المحررين</h2>
            <p>أفضل الأدوات هذا الأسبوع</p>
          </div>
          <Link to="/tools">
            عرض الجميع <FiArrowLeft />
          </Link>
        </div>
        <div className="editor-grid">
          <div className="tool-list">
            {loading ? (
              <FiLoader />
            ) : (
              picks.map((t) => (
                <Link className="tool-item" to={`/tool/${t.id}`} key={t.id}>
                  <div className="tool-logo">
                    {t.image ? <img src={t.image} alt="" /> : <FiZap />}
                  </div>
                  <div className="tool-copy">
                    <span>{t.category}</span>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                    <small>{t.price}</small>
                  </div>
                </Link>
              ))
            )}
          </div>
          <article className="featured-tool">
            <img
              className="featured-photo"
              src="/assets/featured-workspace.png"
              alt="مساحة عمل"
            />
            <span className="featured-badge">الأداة الأبرز</span>
            <div className="featured-overlay">
              <span>إنتاجية</span>
              <h3>Notion AI</h3>
              <p>مساحة عمل ذكية تجمع الكتابة والبحث وإدارة المشاريع.</p>
              <div className="featured-meta">
                <b>مجاني · $10 / شهر</b>
                <a
                  href="https://www.notion.so/product/ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  زيارة الأداة <FiExternalLink />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section className="mission">
        <span />
        <p>Elhawy AI — دليلك العربي لعالم الذكاء الاصطناعي.</p>
        <span />
      </section>
    </main>
  );
}

function Tools() {
  const { tools, loading } = useTools();
  const [p, setP] = useSearchParams(),
    q = p.get("q") || "",
    topic = p.get("topic") || "";
  const items = useMemo(
    () =>
      tools.filter((t) => {
        const h = `${t.name} ${t.description} ${t.category}`.toLowerCase();
        return (
          (!q || h.includes(q.toLowerCase())) &&
          (!topic ||
            (aliases[topic] || [topic]).some((a) => t.category?.includes(a)))
        );
      }),
    [tools, q, topic],
  );
  return (
    <main className="page">
      <Hero
        eyebrow="قاعدة البيانات الكاملة"
        title="كل الأدوات"
        text={
          loading
            ? "جارٍ التحميل..."
            : `${items.length.toLocaleString("ar-EG")} أداة مطابقة`
        }
      />
      <div className="filters">
        <label className="search-box">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => {
              const n = new URLSearchParams(p);
              e.target.value ? n.set("q", e.target.value) : n.delete("q");
              setP(n);
            }}
            placeholder="ابحث في كل الأدوات..."
          />
        </label>
        <div className="filter-chips">
          {topics.map(([n]) => (
            <Link
              className={
                topic === n || (!topic && n === "الكل") ? "active" : ""
              }
              key={n}
              to={
                n === "الكل"
                  ? "/tools"
                  : `/tools?topic=${encodeURIComponent(n)}`
              }
            >
              {n}
            </Link>
          ))}
        </div>
      </div>
      <Grid items={items} loading={loading} />
    </main>
  );
}
const Hero = ({ eyebrow, title, text }) => (
  <div className="page-hero">
    <span>{eyebrow}</span>
    <h1>{title}</h1>
    <p>{text}</p>
  </div>
);
function Categories() {
  const { tools, loading } = useTools();
  const counts = useMemo(() => {
    const m = {};
    tools.forEach((t) => {
      const c = t.category || "غير مصنف";
      m[c] = (m[c] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [tools]);
  return (
    <main className="page">
      <Hero
        eyebrow="استكشف حسب المجال"
        title="الفئات"
        text={loading ? "جارٍ التحميل..." : `${counts.length} فئة مستقلة`}
      />
      <div className="categories-grid">
        {counts.map(([n, c]) => (
          <Link to={`/category/${encodeURIComponent(n)}`} key={n}>
            <FiLayers />
            <h2>{n}</h2>
            <span>{c} أداة</span>
            <FiArrowLeft />
          </Link>
        ))}
      </div>
    </main>
  );
}
function Category() {
  const { category } = useParams(),
    { tools, loading } = useTools(),
    name = decodeURIComponent(category),
    items = tools.filter((t) => (t.category || "غير مصنف") === name);
  return (
    <main className="page">
      <Hero eyebrow="فئة مستقلة" title={name} text={`${items.length} أداة`} />
      <Grid items={items} loading={loading} />
    </main>
  );
}
function Tool() {
  const { id } = useParams(),
    { tools, loading } = useTools(),
    t = tools.find((x) => String(x.id) === id);
  const [details, setDetails] = useState(null);
  useEffect(() => {
    fetch(`/data/tool-details/${id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setDetails)
      .catch(() => setDetails({}));
  }, [id]);
  const detailLines = useMemo(() => {
    if (!details?.contentHtml) return [];
    const doc = new DOMParser().parseFromString(
      details.contentHtml
        .replaceAll("<br>", "\n")
        .replaceAll("<br/>", "\n")
        .replaceAll("<br />", "\n"),
      "text/html",
    );
    return (doc.body.textContent || "")
      .split("\n")
      .map((x) => x.replace(/\s+/g, " ").trim())
      .filter((x) => x && x !== "زيارة الموقع");
  }, [details]);
  if (loading)
    return (
      <main className="page">
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل الأداة
        </div>
      </main>
    );
  if (!t) return <Missing />;
  return (
    <main className="page tool-page">
      <Link className="tool-back" to="/tools">
        <FiArrowLeft /> العودة إلى دليل الأدوات
      </Link>
      <article>
        <div className="tool-visual">
          <div className="tool-page-image">
            {t.image ? (
              <img src={t.image} alt={`صورة أداة ${t.name}`} />
            ) : (
              <FiZap />
            )}
          </div>
          {t.image && (
            <a
              className="view-image"
              href={t.image}
              target="_blank"
              rel="noreferrer"
            >
              <FiImage /> عرض الصورة بالحجم الكامل
            </a>
          )}
        </div>
        <div className="tool-page-copy">
          <div className="tool-kicker">
            <span>{t.category || "غير مصنف"}</span>
            <i>أداة ذكاء اصطناعي</i>
          </div>
          <h1>{t.name}</h1>
          <p className="tool-summary">
            {t.description ||
              "أداة ذكاء اصطناعي تساعدك على إنجاز مهامك بصورة أسرع."}
          </p>
          <div className="tool-facts">
            <div>
              <small>التصنيف</small>
              <b>{t.category || "غير مصنف"}</b>
            </div>
            <div>
              <small>نظام السعر</small>
              <b>{t.price || "غير محدد"}</b>
            </div>
            <div>
              <small>حالة الرابط</small>
              <b>{t.unavailable ? "غير متاح حاليًا" : "متاح للزيارة"}</b>
            </div>
          </div>
          <aside className="listing-note">
            <FiFileText />
            <div>
              <b>بيانات محفوظة محليًا</b>
              <p>
                الشرح التالي يُقرأ من ملفات Elhawy AI داخل المشروع ولا يتم
                استدعاؤه مباشرة من أي موقع خارجي أثناء التصفح.
              </p>
            </div>
          </aside>
          {!t.unavailable && t.externalUrl ? (
            <a
              className="visit-tool"
              href={t.externalUrl}
              target="_blank"
              rel="noreferrer nofollow"
            >
              <span>زيارة الموقع الرسمي</span>
              <FiExternalLink />
            </a>
          ) : (
            <div className="tool-unavailable">
              رابط هذه الأداة غير متاح حاليًا
            </div>
          )}
        </div>
      </article>
      <section className="tool-details-section">
        <div className="details-heading">
          <span>دليل الاستخدام</span>
          <h2>شرح تفصيلي عن {t.name}</h2>
          <p>
            معلومات وميزات وحالات استخدام تساعدك على تقييم الأداة قبل زيارتها.
          </p>
        </div>
        {details === null ? (
          <div className="catalog-loading">
            <FiLoader /> جارٍ تحميل الشرح المحلي
          </div>
        ) : detailLines.length ? (
          <div className="detail-copy">
            {detailLines.map((line, i) =>
              /الميزات|حالات الاستخدام|لمن هذه|لمن هذا/.test(line) ? (
                <h3 key={i}>{line}</h3>
              ) : (
                <p
                  key={i}
                  className={line.startsWith("✔") ? "feature-line" : ""}
                >
                  {line}
                </p>
              ),
            )}
          </div>
        ) : (
          <div className="empty-state">
            لا يوجد شرح تفصيلي إضافي لهذه الأداة حاليًا.
          </div>
        )}
        <ShareButtons title={`${t.name} — Elhawy AI`} />
      </section>
    </main>
  );
}
function Articles() {
  return <ManagedArticles />;
}
function Posts() {
  const [posts, setPosts] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/data/facebook-posts.json")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="page posts-page">
      <section className="posts-hero">
        <div>
          <span>#AI مع محمد الحاوي</span>
          <h1>
            منشوراتي عن
            <br />
            <em>الذكاء الاصطناعي</em>
          </h1>
          <p>
            مكتبة مقالات داخل الموقع مبنية على منشوراتي وتجربتي العملية في
            الذكاء الاصطناعي، من دون تحويلك إلى أي منصة خارجية.
          </p>
          <div className="local-content-badge">
            <FiCheckCircle /> المحتوى محفوظ ويُقرأ بالكامل هنا
          </div>
        </div>
        <img src="/assets/mohamed-elhawy.png" alt="محمد الحاوي" />
      </section>
      {loading ? (
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل المقالات
        </div>
      ) : posts.length ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              {post.image && (
                <img
                  className="post-image local-cover"
                  src={post.image}
                  alt={post.title || ""}
                />
              )}
              <div className="post-meta">
                <img src="/assets/mohamed-elhawy.png" alt="" />
                <div>
                  <b>محمد الحاوي</b>
                  <time>{post.date}</time>
                </div>
              </div>
              <h2>{post.title || post.text?.slice(0, 72)}</h2>
              <p>{post.summary || post.text}</p>
              <div className="post-tags">
                {(post.tags || ["AI"]).map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <Link to={`/posts/${post.id}`}>
                اقرأ المقال كاملًا <FiArrowLeft />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <section className="posts-empty">
          <FiFileText />
          <h2>جارٍ تجهيز مقالات منشوراتك</h2>
          <p>
            لن نعرض نصوصًا منسوبة إليك من دون التحقق منها. بعد تسجيل الدخول إلى
            فيسبوك في نافذة المستعرض سأستورد منشورات <b>AI</b> الحقيقية وأحفظها
            هنا كمقالات مستقلة.
          </p>
          <div className="local-content-badge">
            <FiCheckCircle /> لن يتم تحويل الزائر إلى فيسبوك
          </div>
        </section>
      )}
    </main>
  );
}
function PostArticle() {
  const { id } = useParams(),
    [post, setPost] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/data/facebook-posts.json")
      .then((r) => r.json())
      .then((items) =>
        setPost(items.find((item) => String(item.id) === id) || false),
      )
      .catch(() => setPost(false))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return (
      <main className="page">
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل المقال
        </div>
      </main>
    );
  if (!post) return <Missing />;
  const sections = post.sections?.length ? post.sections : [post.text];
  return (
    <main className="page article-page">
      <Link className="article-back" to="/posts">
        <FiArrowLeft /> العودة إلى منشوراتي
      </Link>
      <article>
        <header className="article-header">
          <span>من منشورات محمد الحاوي · AI</span>
          <h1>{post.title || post.text?.slice(0, 72)}</h1>
          <p>{post.summary || ""}</p>
          <div className="article-author">
            <img src="/assets/mohamed-elhawy.png" alt="محمد الحاوي" />
            <div>
              <b>محمد الحاوي</b>
              <small>{post.date} · مقال محفوظ داخل الموقع</small>
            </div>
          </div>
        </header>
        {post.image && (
          <img
            className="post-article-cover"
            src={post.image}
            alt={post.title || ""}
          />
        )}
        <div className="article-body">
          {sections.map((section, i) => (
            <section key={i}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                {section.title && <h2>{section.title}</h2>}
                <p>{section.text || section}</p>
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
function Article() {
  return <ManagedArticle />;
}
function Developers() {
  return (
    <main className="page">
      <Hero
        eyebrow="بيانات محلية"
        title="للمطورين"
        text="استخدم قاعدة Elhawy AI في مشاريعك."
      />
      <div className="developer-grid">
        <section>
          <FiCode />
          <h2>قائمة الأدوات</h2>
          <code>GET /data/tools.json</code>
          <p>بيانات كل الأدوات والفئات والصور.</p>
          <a href="/data/tools.json" target="_blank">
            افتح البيانات <FiExternalLink />
          </a>
        </section>
        <section>
          <FiFileText />
          <h2>تفاصيل أداة</h2>
          <code>GET /data/tool-details/:id.json</code>
          <p>ملف تفاصيل مستقل لكل معرّف.</p>
          <Link to="/tools">
            تصفح الأدوات <FiArrowLeft />
          </Link>
        </section>
        <section>
          <FiPlus />
          <h2>إضافة أداة</h2>
          <p>أضف سجلًا وصورة وملف تفاصيل بالمعرّف نفسه.</p>
        </section>
      </div>
    </main>
  );
}
function About() {
  return (
    <main className="page about-page">
      <section className="about-hero">
        <div className="founder-photo">
          <img
            src="/assets/mohamed-elhawy.png"
            alt="محمد الحاوي، مؤسس ومطوّر Elhawy AI"
          />
        </div>
        <div className="about-intro">
          <span className="about-label">عن الموقع ومؤسسه</span>
          <h1>
            أهلاً، أنا
            <br />
            <em>محمد الحاوي</em>
          </h1>
          <p className="lead">
            مؤسس ومطوّر <b>Elhawy AI</b>، دليل عربي صُمم ليجعل اكتشاف أدوات
            الذكاء الاصطناعي أسهل وأسرع للجميع.
          </p>
          <div className="about-stats">
            <div>
              <b>+5,700</b>
              <span>أداة AI</span>
            </div>
            <div>
              <b>+115</b>
              <span>فئة متخصصة</span>
            </div>
            <div>
              <b>عربي</b>
              <span>تجربة ومحتوى</span>
            </div>
          </div>
        </div>
      </section>
      <section className="about-story">
        <div>
          <span>فكرة Elhawy AI</span>
          <h2>كل أداة تحتاجها، في مكان واحد واضح</h2>
        </div>
        <p>
          أنشأت الموقع لمساعدة المستخدم العربي على الوصول إلى الأداة المناسبة
          دون إضاعة الوقت وسط آلاف الخيارات. نرتب الأدوات في صفحات وتصنيفات
          واضحة، مع بحث فعلي ومعلومات مستقلة لكل أداة.
        </p>
      </section>
      <section className="contact-panel">
        <div>
          <span>تواصل معي</span>
          <h2>اقتراح، تعاون أو إضافة أداة جديدة؟</h2>
          <p>
            يسعدني التواصل معك مباشرة عبر الهاتف، واتساب أو حساباتي الاجتماعية.
          </p>
        </div>
        <div className="contact-groups">
          <div className="contact-group">
            <h3>
              <FiPhone /> الهاتف
            </h3>
            <a href="tel:+201022104948" dir="ltr">
              01022104948
            </a>
            <a href="tel:+201021870610" dir="ltr">
              01021870610
            </a>
          </div>
          <div className="contact-group whatsapp">
            <h3>
              <FiMessageCircle /> واتساب
            </h3>
            <a
              href="https://wa.me/201022104948"
              target="_blank"
              rel="noreferrer"
              dir="ltr"
            >
              راسل 01022104948
            </a>
            <a
              href="https://wa.me/201021870610"
              target="_blank"
              rel="noreferrer"
              dir="ltr"
            >
              راسل 01021870610
            </a>
          </div>
          <div className="contact-group">
            <h3>الشبكات الاجتماعية</h3>
            <a
              href="https://www.facebook.com/MohamedElhawy0"
              target="_blank"
              rel="noreferrer"
            >
              Facebook · MohamedElhawy0 <FiExternalLink />
            </a>
            <a
              href="https://x.com/elhawym"
              target="_blank"
              rel="noreferrer"
              dir="ltr"
            >
              X · @elhawym <FiExternalLink />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
function Missing() {
  return (
    <main className="page not-found">
      <h1>الصفحة غير موجودة</h1>
      <Link to="/">العودة للرئيسية</Link>
    </main>
  );
}
export function App() {
  const [dark, setDark] = useState(false),
    [lang, setLang] = useState("ar");
  return (
    <BrowserRouter>
      <AuthProvider>
        <Provider>
          <div
            className={dark ? "app theme-dark" : "app theme-light"}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <Header
              dark={dark}
              setDark={setDark}
              lang={lang}
              setLang={setLang}
            />
            <Routes>
              <Route path="/" element={<PersonalHome lang={lang} />} />
              <Route path="/resume" element={<Navigate to="/about" replace />} />
              <Route
                path="/projects/jarvis"
                element={<JarvisPage lang={lang} />}
              />
              <Route path="/ai" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:category" element={<Category />} />
              <Route path="/tool/:id" element={<Tool />} />
              <Route path="/library" element={<Navigate to="/articles#resources" replace />} />
              <Route path="/free-tools" element={<FreeToolsPage />} />
              <Route path="/free-tools/pdf-tools" element={<PdfToolsPage />} />
              <Route path="/free-tools/pdf-tools/:slug" element={<PdfToolPage />} />
              <Route path="/study-ai" element={<StudyAssistant />} />
              <Route
                path="/library/category/:slug"
                element={<LibraryCategory />}
              />
              <Route path="/library/item/:id" element={<LibraryItem />} />
              <Route path="/videos" element={<VideoLessons />} />
              <Route path="/videos/watch/:slug" element={<VideoLesson />} />
              <Route path="/videos/:slug" element={<VideoCategory />} />
              <Route path="/admin/library" element={<LibraryAdmin />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<Article />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/about" element={<ResumePage lang={lang} />} />
              <Route path="*" element={<Missing />} />
            </Routes>
            <Footer lang={lang} />
          </div>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}
