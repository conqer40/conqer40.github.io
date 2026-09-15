import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiPlay,
  FiVideo,
  FiExternalLink,
  FiShare2,
  FiCheckCircle,
} from "react-icons/fi";
import { FaYoutube, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { supabase, supabaseReady } from "./supabase.js";
import { youtubeId, safeImage } from "./content-utils.js";
import { ShareButtons } from "./ShareButtons.jsx";
import youtubeData from "./data/youtube-videos.json";

export function useVideos() {
  const [categories, setCategories] = useState(youtubeData.playlists || []);
  const [videos, setVideos] = useState(youtubeData.videos || []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const remoteCategories = c.data || [];
        const remoteVideos = v.data || [];

        // Merge playlists
        const mergedCategories = [...(youtubeData.playlists || [])];
        remoteCategories.forEach((rc) => {
          if (!mergedCategories.some((mc) => mc.slug === rc.slug || mc.id === rc.id)) {
            mergedCategories.push(rc);
          }
        });

        // Merge videos
        const mergedVideos = [...(youtubeData.videos || [])];
        remoteVideos.forEach((rv) => {
          const rId = youtubeId(rv.youtube_url) || rv.slug;
          const exists = mergedVideos.some(
            (mv) => mv.videoId === rId || mv.slug === rv.slug || mv.id === rv.id
          );
          if (!exists) {
            mergedVideos.push({
              ...rv,
              videoId: youtubeId(rv.youtube_url),
              thumbnail:
                rv.cover_url ||
                `https://img.youtube.com/vi/${youtubeId(rv.youtube_url)}/maxresdefault.jpg`,
            });
          }
        });

        setCategories(mergedCategories);
        setVideos(mergedVideos);
        setItems(i.data || []);
      })
      .catch((err) => {
        console.warn("Could not fetch remote videos, using local data", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, videos, items, loading, channel: youtubeData.channel };
}

export function VideoLessons() {
  const { categories, videos, channel } = useVideos();

  return (
    <main className="page video-page">
      <section className="video-hero">
        <span>ELHAWY AI ACADEMY</span>
        <h1>دروس وفيديوهات Elhawy AI</h1>
        <p>
          مسارات تعليمية منظمة وشروحات للبرمجة والذكاء الاصطناعي وتكنولوجيا
          المستقبل، مع شروحات عملية مرتبطة بالمكتبة والأدوات.
        </p>

        {/* شريط القنوات الرسمية */}
        <div className="video-channel-banner">
          <div className="channel-meta">
            <div className="channel-icon">
              <FaYoutube />
            </div>
            <div>
              <h3>قناة Elhawy AI الرسمية</h3>
              <p>شروحات البرمجة والذكاء الاصطناعي ببساطة 🚀</p>
            </div>
          </div>
          <div className="channel-buttons">
            <a
              className="channel-btn youtube"
              href={channel?.subscribeUrl || "https://www.youtube.com/@ElhawyAI?sub_confirmation=1"}
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube /> اشترك في القناة
            </a>
            <a
              className="channel-btn whatsapp"
              href={channel?.whatsappUrl || "https://www.whatsapp.com/channel/0029VbDJ5sYKrWQt6ehcOp3G"}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> قناة الواتساب
            </a>
            <a
              className="channel-btn facebook"
              href={channel?.facebookUrl || "https://www.facebook.com/ElhawyAi"}
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook /> صفحة الفيسبوك
            </a>
          </div>
        </div>
      </section>

      {/* أقسام قوائم التشغيل */}
      <div className="video-playlists-container">
        {categories.map((c) => {
          const playlistVideos = videos.filter(
            (v) =>
              v.category_id === c.id ||
              v.category_id === c.slug ||
              (c.videoIds && c.videoIds.includes(v.videoId || v.id))
          );

          return (
            <section key={c.id || c.slug} className="playlist-section">
              <div className="playlist-header">
                <div className="playlist-header-left">
                  <span>قائمة تشغيل</span>
                  <h2>{c.name}</h2>
                  <p>{c.description}</p>
                </div>
                <div className="playlist-count">
                  {playlistVideos.length} {playlistVideos.length === 1 ? "فيديو" : "فيديوهات"}
                </div>
              </div>

              {playlistVideos.length > 0 ? (
                <div className="video-grid">
                  {playlistVideos.map((v) => {
                    const vid = v.videoId || youtubeId(v.youtube_url) || v.id;
                    const thumb =
                      v.thumbnail ||
                      v.cover_url ||
                      (vid
                        ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
                        : "");

                    return (
                      <Link
                        key={v.id || v.slug}
                        to={`/videos/watch/${v.slug || v.id || vid}`}
                        className="video-card"
                      >
                        <div className="video-card-thumb">
                          {thumb ? (
                            <img src={safeImage(thumb)} alt={v.title} loading="lazy" />
                          ) : (
                            <FiVideo />
                          )}
                          <div className="play-badge">
                            <FiPlay />
                          </div>
                          <span className="yt-tag">
                            <FaYoutube /> YouTube
                          </span>
                        </div>
                        <div className="video-card-body">
                          <h3>{v.title}</h3>
                          <p>{v.summary}</p>
                          <div className="video-card-footer">
                            <small>{c.name}</small>
                            <span>
                              مشاهدة الشرح <FiArrowLeft />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="video-empty-card">
                  <p>
                    ⏳ <b>قريباً:</b> يتم تجهيز ورفع دروس هذا المسار على قناة Elhawy AI.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

export function VideoCategory() {
  const { slug } = useParams();
  const { categories, videos } = useVideos();
  const c = categories.find((x) => x.slug === slug || x.id === slug);
  const list = videos.filter(
    (x) =>
      x.category_id === c?.id ||
      x.category_id === c?.slug ||
      (c?.videoIds && c.videoIds.includes(x.videoId || x.id))
  );

  return (
    <main className="page video-page">
      <Link className="article-back" to="/videos">
        <FiArrowLeft /> كل قوائم التشغيل
      </Link>
      <section className="video-category-title">
        <span>قائمة تشغيل</span>
        <h1>{c?.name || "المسار التعليمي"}</h1>
        <p>{c?.description}</p>
      </section>

      {list.length > 0 ? (
        <div className="video-grid">
          {list.map((v) => {
            const vid = v.videoId || youtubeId(v.youtube_url) || v.id;
            const thumb =
              v.thumbnail ||
              v.cover_url ||
              (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "");

            return (
              <Link
                key={v.id || v.slug}
                to={`/videos/watch/${v.slug || v.id || vid}`}
                className="video-card"
              >
                <div className="video-card-thumb">
                  {thumb ? (
                    <img src={safeImage(thumb)} alt={v.title} loading="lazy" />
                  ) : (
                    <FiVideo />
                  )}
                  <div className="play-badge">
                    <FiPlay />
                  </div>
                  <span className="yt-tag">
                    <FaYoutube /> YouTube
                  </span>
                </div>
                <div className="video-card-body">
                  <h3>{v.title}</h3>
                  <p>{v.summary}</p>
                  <div className="video-card-footer">
                    <small>{c?.name || "درس فيديو"}</small>
                    <span>
                      مشاهدة الشرح <FiArrowLeft />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="video-empty-card">
          <p>لا توجد فيديوهات منشورة حالياً في هذه القائمة.</p>
        </div>
      )}
    </main>
  );
}

export function VideoLesson() {
  const { slug } = useParams();
  const { videos, items, channel } = useVideos();

  const v = videos.find(
    (x) =>
      x.slug === slug ||
      x.id === slug ||
      x.videoId === slug ||
      encodeURIComponent(x.slug) === slug
  );

  const attachment = items.find((x) => x.id === v?.attachment_item_id);
  const id = v?.videoId || youtubeId(v?.youtube_url) || v?.id;

  if (!v) {
    return (
      <main className="page">
        <Link className="article-back" to="/videos">
          <FiArrowLeft /> العودة لدروس الفيديو
        </Link>
        <div className="not-found">
          <h1>الفيديو غير موجود</h1>
          <p>ربما تم نقل الفيديو أو تحديث رابطه.</p>
          <Link to="/videos">تصفح كل الفيديوهات</Link>
        </div>
      </main>
    );
  }

  const paragraphs = (v.description || v.summary || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="page video-page">
      <Link className="article-back" to="/videos">
        <FiArrowLeft /> العودة لكل الدروس والقوائم
      </Link>

      <article className="video-detail">
        {/* مشغل الفيديو */}
        <div className="video-player">
          {id ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <a href={v.youtube_url} target="_blank" rel="noreferrer">
              فتح الفيديو على YouTube
            </a>
          )}
        </div>

        {/* تفاصيل وشرح الفيديو */}
        <div className="video-copy">
          <div className="video-detail-bar">
            <div className="video-detail-channel-info">
              <img
                src="/assets/mohamed-elhawy-transparent.png"
                alt="Elhawy AI"
              />
              <div>
                <b>Elhawy AI – محمد الحاوي</b>
                <small>قناة البرمجة والذكاء الاصطناعي</small>
              </div>
            </div>
            <div className="channel-buttons">
              <a
                className="channel-btn youtube"
                href={
                  v.youtube_url ||
                  channel?.url ||
                  "https://www.youtube.com/@ElhawyAI"
                }
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube /> فتح على YouTube
              </a>
              <a
                className="channel-btn whatsapp"
                href={
                  channel?.whatsappUrl ||
                  "https://www.whatsapp.com/channel/0029VbDJ5sYKrWQt6ehcOp3G"
                }
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp /> قناة الواتساب
              </a>
            </div>
          </div>

          <span>شرح فيديو رسمي</span>
          <h1>{v.title}</h1>
          {v.summary && <p className="lead">{v.summary}</p>}

          <hr style={{ margin: "24px 0", border: "0", borderTop: "1px solid var(--v2-line)" }} />

          <h3>شرح وتفاصيل الفيديو:</h3>
          <div className="video-description">
            {paragraphs.map((p, i) => (
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

          <div style={{ marginTop: "35px" }}>
            <ShareButtons
              title={v.title}
              summary={v.summary || v.description}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
