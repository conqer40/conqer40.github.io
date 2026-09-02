import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiDownload, FiFileText, FiLoader } from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { ShareButtons } from "./ShareButtons.jsx";
import { usePageMeta } from "./usePageMeta.js";
import { featuredArticles } from "./featuredArticles.js";

function ArticleBlock({ value, index, resources = [] }) {
  const trimmed = value.trim();
  const attachment = trimmed.match(/^\[\[attachment:([^|\]]+)(?:\|([^\]]+))?\]\]$/i);
  if (attachment) {
    const resource = resources.find((item) => String(item.id) === attachment[1]);
    if (!resource) return null;
    return <aside className="article-inline-resource">{resource.cover_url && <img src={resource.cover_url} alt={resource.title} />}<div><small>مرفق المقال</small><h3>{attachment[2] || resource.title}</h3><p>{resource.summary}</p><Link to={`/library/item/${resource.slug || resource.id}`}><FiDownload /> عرض وتحميل المرفق</Link></div></aside>;
  }
  const image = value.trim().match(/^\[\[image:(https?:\/\/[^\]|]+)(?:\|([^\]]*))?\]\]$/i)
    || value.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
  if (image) {
    const markdown = value.trim().startsWith("![");
    const url = markdown ? image[2] : image[1];
    const caption = markdown ? image[1] : image[2];
    return <figure className="managed-inline-image"><img src={url} alt={caption || `صورة داخل المقال ${index + 1}`} loading="lazy" />{caption && <figcaption>{caption}</figcaption>}</figure>;
  }
  if (/^https?:\/\//i.test(trimmed)) return <p className="managed-external-link"><a href={trimmed} target="_blank" rel="noopener noreferrer"><FiDownload /> فتح الرابط الخارجي</a></p>;
  const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length && lines.every((line) => line.startsWith("•"))) return <ul className="managed-list">{lines.map((line, i) => <li key={i}>{line.replace(/^•\s*/, "")}</li>)}</ul>;
  if (lines.length === 1 && /^[\p{Extended_Pictographic}]/u.test(lines[0])) return <h2 className="managed-subheading">{lines[0]}</h2>;
  return <section><span>{String(index + 1).padStart(2, "0")}</span><p>{value}</p></section>;
}

function useArticles() {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) {
      setData(featuredArticles);
      setLoading(false);
      return;
    }
    supabase
      .from("site_articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        const remote = !error && data ? data : [];
        const featuredSlugs = new Set(featuredArticles.map((item) => item.slug));
        setData([...featuredArticles, ...remote.filter((item) => !featuredSlugs.has(item.slug))]);
      })
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

function useResources() {
  const [data, setData] = useState([]), [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) { setLoading(false); return; }
    supabase.from("library_items").select("*").eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => setData(!error && data ? data : []))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
export function ManagedArticles() {
  const { data, loading } = useArticles();
  const { data: resources, loading: resourcesLoading } = useResources();
  return (
    <main className="page managed-articles">
      <section className="editorial-hero">
        <span>ARTICLES · FILES · RESOURCES</span>
        <h1>
          أفكار عملية
          <br />
          <em>تصنع فرقًا</em>
        </h1>
        <p>
          مقالات وشروحات وملفات عملية في مكان واحد، مرتبة حسب موضوعها وسهلة القراءة والتحميل.
        </p>
        <nav className="content-switch" aria-label="أقسام صفحة المقالات">
          <a href="#articles">المقالات</a><a href="#resources">الملفات والمرفقات</a>
        </nav>
      </section>
      {loading ? (
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل المقالات
        </div>
      ) : (
        <section className="editorial-grid" id="articles">
          {data.length ? (
            data.map((a, i) => (
              <Link to={`/articles/${a.slug}`} key={a.id || a.slug}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {a.cover_url ? (
                  <img src={a.cover_url} alt="" />
                ) : (
                  <div className="editorial-cover">
                    <FiBookOpen />
                  </div>
                )}
                <small>{a.category || "مقال محمد الحاوي"}</small>
                <h2>{a.title}</h2>
                <p>{a.summary}</p>
                <b>
                  قراءة المقال <FiArrowLeft />
                </b>
              </Link>
            ))
          ) : (
            <div className="articles-empty">
              <FiBookOpen />
              <h2>لا توجد مقالات منشورة حاليًا</h2>
              <p>ستظهر المقالات الجديدة هنا بعد نشرها من لوحة التحكم.</p>
            </div>
          )}
        </section>
      )}
      <section className="resources-section" id="resources">
        <header><span>مرفقات ومصادر</span><h2>ملفات تدعم محتوى المقالات</h2><p>قوالب وكتب وملفات قابلة للتحميل، مع وصف واضح وصورة وتصنيف لكل عنصر.</p></header>
        {resourcesLoading ? <div className="catalog-loading"><FiLoader /> جارٍ تحميل الملفات</div> : (
          <div className="resources-grid">
            {resources.map((item) => (
              <Link className="resource-item-card" to={`/library/item/${item.slug || item.id}`} key={item.id}>
                <div className="resource-item-cover">{item.cover_url ? <img src={item.cover_url} alt={item.title} /> : <FiFileText />}</div>
                <div className="resource-item-copy"><small>{item.file_type || "ملف ومرفق"}</small><h3>{item.title}</h3><p>{item.summary || item.description}</p><b>{item.download_url ? <><FiDownload /> عرض وتحميل الملف</> : <><FiBookOpen /> عرض التفاصيل</>}</b></div>
              </Link>
            ))}
            {!resources.length && <div className="articles-empty"><FiFileText /><h2>لا توجد ملفات منشورة حاليًا</h2></div>}
          </div>
        )}
      </section>
    </main>
  );
}
export function ManagedArticle() {
  const { slug } = useParams(),
    { data, loading } = useArticles(),
    a = data.find((x) => x.slug === slug);
  const { data: resources } = useResources();
  usePageMeta(a, "article");
  if (loading)
    return (
      <main className="page">
        <div className="catalog-loading">
          <FiLoader /> جارٍ التحميل
        </div>
      </main>
    );
  if (!a)
    return (
      <main className="page">
        <h1>المقال غير موجود</h1>
      </main>
    );
  return (
    <main className="page article-page managed-article">
      <Link className="article-back" to="/articles">
        <FiArrowLeft /> كل المقالات
      </Link>
      <article>
        <header className="article-header">
          <span>{a.category || "مقال محمد الحاوي"}</span>
          <h1>{a.title}</h1>
          <p>{a.summary}</p>
          <div className="article-author">
            <img
              src="/assets/mohamed-elhawy-transparent.png"
              alt="محمد الحاوي"
            />
            <div>
              <b>محمد الحاوي</b>
              <small>
                {a.published_at
                  ? new Date(a.published_at).toLocaleDateString("ar-EG")
                  : "Elhawy Insights"}
              </small>
            </div>
          </div>
        </header>
        {a.cover_url && (
          <img className="post-article-cover" src={a.cover_url} alt={a.image_alt || a.title} />
        )}
        <div className="managed-body">
          {String(a.content || "")
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((p, i) => <ArticleBlock key={i} value={p} index={i} resources={resources} />)}
        </div>
        {a.external_link && <a className="article-resource-button" href={a.external_link} target="_blank" rel="noopener noreferrer"><FiDownload /> فتح مكتبة Google Drive في تبويب جديد</a>}
        <ShareButtons title={a.title} />
      </article>
    </main>
  );
}
