import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiLoader } from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { ShareButtons } from "./ShareButtons.jsx";
import { usePageMeta } from "./usePageMeta.js";

function ArticleBlock({ value, index }) {
  const image = value.trim().match(/^\[\[image:(https?:\/\/[^\]|]+)(?:\|([^\]]*))?\]\]$/i)
    || value.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
  if (image) {
    const markdown = value.trim().startsWith("![");
    const url = markdown ? image[2] : image[1];
    const caption = markdown ? image[1] : image[2];
    return <figure className="managed-inline-image"><img src={url} alt={caption || `صورة داخل المقال ${index + 1}`} loading="lazy" />{caption && <figcaption>{caption}</figcaption>}</figure>;
  }
  return <section><span>{String(index + 1).padStart(2, "0")}</span><p>{value}</p></section>;
}

function useArticles() {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) {
      setData([]);
      setLoading(false);
      return;
    }
    supabase
      .from("site_articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data, error }) => setData(!error && data ? data : []))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
export function ManagedArticles() {
  const { data, loading } = useArticles();
  return (
    <main className="page managed-articles">
      <section className="editorial-hero">
        <span>INSIGHTS · AI · OPERATIONS</span>
        <h1>
          أفكار عملية
          <br />
          <em>تصنع فرقًا</em>
        </h1>
        <p>
          مقالات محمد الحاوي عن الذكاء الاصطناعي، التشغيل، التحول الرقمي وسلاسل
          الإمداد.
        </p>
      </section>
      {loading ? (
        <div className="catalog-loading">
          <FiLoader /> جارٍ تحميل المقالات
        </div>
      ) : (
        <section className="editorial-grid">
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
    </main>
  );
}
export function ManagedArticle() {
  const { slug } = useParams(),
    { data, loading } = useArticles(),
    a = data.find((x) => x.slug === slug);
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
          <img className="post-article-cover" src={a.cover_url} alt="" />
        )}
        <div className="managed-body">
          {String(a.content || "")
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((p, i) => <ArticleBlock key={i} value={p} index={i} />)}
        </div>
        <ShareButtons title={a.title} />
      </article>
    </main>
  );
}
