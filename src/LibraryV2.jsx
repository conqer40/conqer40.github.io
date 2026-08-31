import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiDownload,
  FiFile,
  FiFolder,
  FiSearch,
} from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { safeImage } from "./content-utils.js";
import { ShareButtons } from "./ShareButtons.jsx";
import { usePageMeta } from "./usePageMeta.js";
function useLib() {
  const [categories, setCategories] = useState([]),
    [items, setItems] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from("library_categories").select("*").order("sort_order"),
      supabase
        .from("library_items")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false }),
    ])
      .then(([c, i]) => {
        setCategories(c.data || []);
        setItems(i.data || []);
      })
      .finally(() => setLoading(false));
  }, []);
  return { categories, items, loading };
}
export function LibraryPage() {
  const { categories, items } = useLib(),
    [q, setQ] = useState("");
  return (
    <main className="page library-page">
      <section className="library-hero">
        <div>
          <span>ELHAWY RESOURCES</span>
          <h1>المكتبة</h1>
          <p>ملفات ومذكرات وقوالب ومصادر منظمة في أقسام واضحة.</p>
          <label className="library-search">
            <FiSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في المكتبة"
            />
          </label>
        </div>
        <div className="library-hero-card">
          <FiBookOpen />
          <b>{items.length}</b>
          <span>مورد متاح</span>
        </div>
      </section>
      <div className="library-categories">
        {categories
          .filter((c) => `${c.name} ${c.description}`.includes(q))
          .map((c) => (
            <Link key={c.id} to={`/library/category/${c.slug}`}>
              <div className="library-category-icon">
                {c.cover_url ? (
                  <img src={safeImage(c.cover_url)} alt="" />
                ) : (
                  <FiFolder />
                )}
              </div>
              <div>
                <small>
                  {items.filter((i) => i.category_id === c.id).length} عنصر
                </small>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span>
                  فتح القسم <FiArrowLeft />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}
export function LibraryCategory() {
  const { slug } = useParams(),
    { categories, items } = useLib(),
    c = categories.find((x) => x.slug === slug),
    list = items.filter((x) => x.category_id === c?.id);
  return (
    <main className="page library-page">
      <Link className="article-back" to="/library">
        <FiArrowLeft /> المكتبة
      </Link>
      <section className="library-category-head">
        <small>قسم المكتبة</small>
        <h1>{c?.name}</h1>
        <p>{c?.description}</p>
      </section>
      <div className="library-items">
        {list.map((i) => (
          <article key={i.id}>
            {i.cover_url ? (
              <img
                src={safeImage(i.cover_url)}
                onError={(e) => e.currentTarget.remove()}
                alt={i.title}
              />
            ) : (
              <div className="library-file-placeholder">
                <FiFile />
              </div>
            )}
            <div>
              <small>{i.file_type || "مورد"}</small>
              <h2>{i.title}</h2>
              <p>{i.summary}</p>
              <Link to={`/library/item/${i.slug || i.id}`}>
                عرض التفاصيل <FiArrowLeft />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
export function LibraryItem() {
  const { id } = useParams(),
    { categories, items, loading } = useLib(),
    i = items.find((x) => x.id === id || x.slug === id),
    c = categories.find((x) => x.id === i?.category_id);
  usePageMeta(i, "article");
  if (loading) return <main className="page">جارٍ التحميل</main>;
  if (!i)
    return (
      <main className="page">
        <h1>العنصر غير موجود</h1>
      </main>
    );
  return (
    <main className="page library-page">
      <Link
        className="article-back"
        to={c ? `/library/category/${c.slug}` : "/library"}
      >
        <FiArrowLeft /> {c?.name || "المكتبة"}
      </Link>
      <article className="library-detail">
        <div className="library-detail-media">
          <div className="library-detail-cover">
            {i.cover_url ? (
              <img
                src={safeImage(i.cover_url)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                alt={i.title}
              />
            ) : (
              <FiFile />
            )}
          </div>
          <a
            className="library-download"
            href={i.download_url}
            target="_blank"
            rel="noreferrer"
          >
            <FiDownload /> تحميل أو فتح الملف
          </a>
        </div>
        <div className="library-detail-copy">
          <span>
            {c?.name} · {i.file_type}
          </span>
          <h1>{i.title}</h1>
          <p className="lead">{i.summary}</p>
          <div className="library-description">
            {i.description?.split("\n").map((p, n) => (
              <p key={n}>{p}</p>
            ))}
          </div>
          <ShareButtons title={i.title} />
        </div>
      </article>
    </main>
  );
}
