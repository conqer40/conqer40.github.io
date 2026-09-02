import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiPlay, FiVideo } from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { youtubeId, safeImage } from "./content-utils.js";
import { ShareButtons } from "./ShareButtons.jsx";
function useVideos() {
  const [categories, setCategories] = useState([]),
    [videos, setVideos] = useState([]),
    [items, setItems] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from("video_categories").select("*").order("sort_order"),
      supabase
        .from("video_lessons")
        .select("*")
        .eq("published", true)
        .order("created_at"),
      supabase.from("library_items").select("id,title,slug"),
    ])
      .then(([c, v, i]) => {
        setCategories(c.data || []);
        setVideos(v.data || []);
        setItems(i.data || []);
      })
      .finally(() => setLoading(false));
  }, []);
  return { categories, videos, items, loading };
}
export function VideoLessons() {
  const { categories, videos } = useVideos();
  return (
    <main className="page video-page">
      <section className="video-hero">
        <span>ELHAWY ACADEMY</span>
        <h1>دروس فيديو</h1>
        <p>مسارات تعليمية منظمة، شرح بالفيديو ومرفقات جاهزة من المكتبة.</p>
      </section>
      <div className="video-categories">
        {categories.map((c) => (
          <Link key={c.id} to={`/videos/${c.slug}`}>
            <div>
              {c.cover_url ? (
                <img src={safeImage(c.cover_url)} alt="" />
              ) : (
                <FiVideo />
              )}
              <FiPlay />
            </div>
            <small>
              {videos.filter((v) => v.category_id === c.id).length} فيديو
            </small>
            <h2>{c.name}</h2>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
export function VideoCategory() {
  const { slug } = useParams(),
    { categories, videos } = useVideos(),
    c = categories.find((x) => x.slug === slug),
    list = videos.filter((x) => x.category_id === c?.id);
  return (
    <main className="page video-page">
      <Link className="article-back" to="/videos">
        <FiArrowLeft /> دروس الفيديو
      </Link>
      <section className="video-category-title">
        <span>مسار تعليمي</span>
        <h1>{c?.name || "القسم"}</h1>
        <p>{c?.description}</p>
      </section>
      <div className="video-grid">
        {list.map((v) => (
          <Link key={v.id} to={`/videos/watch/${v.slug}`}>
            <div className="video-thumb">
              {v.cover_url ? (
                <img src={safeImage(v.cover_url)} alt="" />
              ) : youtubeId(v.youtube_url) ? (
                <img
                  src={`https://img.youtube.com/vi/${youtubeId(v.youtube_url)}/hqdefault.jpg`}
                  alt=""
                />
              ) : (
                <FiVideo />
              )}
              <i>
                <FiPlay />
              </i>
            </div>
            <small>درس فيديو</small>
            <h2>{v.title}</h2>
            <p>{v.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
export function VideoLesson() {
  const { slug } = useParams(),
    { videos, items } = useVideos(),
    v = videos.find((x) => x.slug === slug),
    attachment = items.find((x) => x.id === v?.attachment_item_id),
    id = youtubeId(v?.youtube_url);
  if (!v)
    return (
      <main className="page">
        <h1>الفيديو غير موجود</h1>
      </main>
    );
  return (
    <main className="page video-page">
      <Link className="article-back" to="/videos">
        <FiArrowLeft /> كل الدروس
      </Link>
      <article className="video-detail">
        <div className="video-player">
          {id ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title={v.title}
              allowFullScreen
            />
          ) : (
            <a href={v.youtube_url}>فتح الفيديو على YouTube</a>
          )}
        </div>
        <div className="video-copy">
          <span>درس فيديو</span>
          <h1>{v.title}</h1>
          <p className="lead">{v.summary}</p>
          <div className="video-description">
            {v.description?.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {attachment && (
            <Link
              className="video-attachment"
              to={`/library/item/${attachment.slug || attachment.id}`}
            >
              <FiBookOpen /> مرفقات الدرس: {attachment.title}
            </Link>
          )}
          <ShareButtons title={v.title} summary={v.summary || v.description} />
        </div>
      </article>
    </main>
  );
}
