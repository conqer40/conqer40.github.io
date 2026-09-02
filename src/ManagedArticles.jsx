import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiDownload, FiFileText, FiLoader } from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { ShareButtons } from "./ShareButtons.jsx";
import { usePageMeta } from "./usePageMeta.js";
import { featuredArticles } from "./featuredArticles.js";
import { slugify } from "./content-utils.js";

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
  if (lines.length > 1 && !lines[0].startsWith("•") && lines.slice(1).every((line) => line.startsWith("•"))) return <div className="managed-topic"><h2>{lines[0]}</h2><ul className="managed-list">{lines.slice(1).map((line, i) => <li key={i}>{line.replace(/^•\s*/, "")}</li>)}</ul></div>;
  if (lines.length === 1 && /^[\p{Extended_Pictographic}]/u.test(lines[0])) return <h2 className="managed-subheading">{lines[0]}</h2>;
  return <section><p>{value}</p></section>;
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
  const [data, setData] = useState([]), [categories, setCategories] = useState([]), [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) { setLoading(false); return; }
    Promise.all([
      supabase.from("library_items").select("*").eq("published", true).order("created_at", { ascending: false }),
      supabase.from("library_categories").select("*").order("sort_order")
    ]).then(([items, groups]) => { setData(!items.error && items.data ? items.data : []); setCategories(!groups.error && groups.data ? groups.data : []); })
      .finally(() => setLoading(false));
  }, []);
  return { data, categories, loading };
}
export function ManagedArticles() {
  const { categorySlug } = useParams();
  const { data, loading } = useArticles();
  const { data: resources, categories: resourceCategories, loading: resourcesLoading } = useResources();
  const resourceArticles = resources.map((item) => ({ ...item, kind: "resource", category: resourceCategories.find((group) => group.id === item.category_id)?.name || "كورسات" }));
  const combined = [...data.map((item) => ({ ...item, kind: "article" })), ...resourceArticles];
  const categoryNames = [...new Set(combined.map((item) => item.category || "عام"))];
  const activeCategory = categoryNames.find((name) => slugify(name) === categorySlug);
  const shown = activeCategory ? combined.filter((item) => (item.category || "عام") === activeCategory) : combined;
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
        <nav className="article-category-nav" aria-label="تصنيفات المقالات">
          <Link className={!categorySlug ? "active" : ""} to="/articles">كل المقالات</Link>
          {categoryNames.map((name) => <Link className={activeCategory === name ? "active" : ""} key={name} to={`/articles/category/${slugify(name)}`}>{name}</Link>)}
        </nav>
      </section>
      {loading || resourcesLoading ? (
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل المقالات
        </div>
      ) : (
        <section className="editorial-grid" id="articles">
          {shown.length ? (
            shown.map((a) => (
              <Link to={a.kind === "resource" ? `/library/item/${a.slug || a.id}` : `/articles/${a.slug}`} key={`${a.kind}-${a.id || a.slug}`}>
                {a.cover_url ? (
                  <img src={a.cover_url} alt="" />
                ) : (
                  <div className="editorial-cover">
                    <FiBookOpen />
                  </div>
                )}
                <small>{a.category || "عام"}</small>
                <h2>{a.title}</h2>
                <p>{a.summary}</p>
                <b>
                  {a.kind === "resource" ? "عرض المقال والمرفق" : "قراءة المقال"} <FiArrowLeft />
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
        {a.summary && <aside className="article-share-excerpt"><small>مختصر المقال للمشاركة</small><p>{a.summary}</p><span>للمزيد زور الرابط: {typeof location !== "undefined" ? location.href : `/articles/${a.slug}`}</span></aside>}
        {a.external_link && <a className="article-resource-button" href={a.external_link} target="_blank" rel="noopener noreferrer"><FiDownload /> فتح مكتبة Google Drive في تبويب جديد</a>}
        <ShareButtons title={a.title} summary={a.summary} />
      </article>
    </main>
  );
}
