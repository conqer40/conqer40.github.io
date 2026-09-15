import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiBookOpen,
  FiCheckCircle,
  FiFolderPlus,
  FiLink,
  FiLoader,
  FiLock,
  FiLogOut,
  FiPlusCircle,
  FiPlayCircle,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";
import { FaYoutube, FaSync } from "react-icons/fa";
import { adminEmailFromUsername, supabase, supabaseReady } from "./supabase.js";
import { slugify } from "./content-utils.js";
import { ImageUpload } from "./ImageUpload.jsx";
const blankItem = {
  category_id: "",
  title: "",
  summary: "",
  description: "",
  download_url: "",
  cover_url: "",
  file_type: "",
  file_size: "",
  published: true,
};
const blankArticle = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  cover_url: "",
  category: "كورسات",
  published: true,
};
const blankVideoCategory = { name: "", description: "", cover_url: "" };
const blankKnowledge = { title: "", category: "المنهج", content: "", published: true };
const blankVideo = {
  category_id: "",
  title: "",
  summary: "",
  description: "",
  youtube_url: "",
  cover_url: "",
  attachment_item_id: "",
  published: true,
};
export function LibraryAdmin() {
  const [session, setSession] = useState(null),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [tab, setTab] = useState("overview"),
    [categories, setCategories] = useState([]),
    [items, setItems] = useState([]),
    [articles, setArticles] = useState([]),
    [videoCategories, setVideoCategories] = useState([]),
    [videos, setVideos] = useState([]),
    [knowledge, setKnowledge] = useState([]),
    [users, setUsers] = useState([]),
    [login, setLogin] = useState({ username: "", password: "" }),
    [cat, setCat] = useState({ name: "", description: "", cover_url: "" }),
    [item, setItem] = useState(blankItem),
    [article, setArticle] = useState(blankArticle),
    [inlineArticleImage, setInlineArticleImage] = useState(""),
    [articleAttachmentId, setArticleAttachmentId] = useState(""),
    [videoCat, setVideoCat] = useState(blankVideoCategory),
    [video, setVideo] = useState(blankVideo);
  const [knowledgeItem, setKnowledgeItem] = useState(blankKnowledge);
  const [syncing, setSyncing] = useState(false);
  const [ghToken, setGhToken] = useState(() => localStorage.getItem("gh_pat") || "");

  const triggerYouTubeSync = async () => {
    let token = ghToken.trim() || localStorage.getItem("gh_pat") || "";
    if (!token) {
      const input = window.prompt(
        "لتشغيل التحديث مباشرة بنقرة واحدة، يمكنك لصق رمز GitHub Token هنا (اختياري)، أو اضغط Cancel لفتح صفحة GitHub Actions والضغط على Run workflow:"
      );
      if (input && input.trim()) {
        token = input.trim();
        localStorage.setItem("gh_pat", token);
        setGhToken(token);
      }
    }

    if (token) {
      setSyncing(true);
      setMessage("جارٍ إرسال أمر التحديث إلى سيرفرات GitHub Actions...");
      try {
        const res = await fetch(
          "https://api.github.com/repos/conqer40/conqer40.github.io/actions/workflows/deploy-pages.yml/dispatches",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
            body: JSON.stringify({ ref: "main" }),
          }
        );

        if (res.status === 204 || res.ok) {
          setMessage(
            "🚀 تم إطلاق التحديث بنجاح! يقوم GitHub الآن بمزامنة يوتيوب وبناء الموقع ونشره خلال دقيقة واحدة."
          );
        } else {
          setMessage(
            "تعذر استخدام الرمز تلقائياً؛ تم فتح صفحة GitHub Actions لتشغيل التحديث."
          );
          window.open(
            "https://github.com/conqer40/conqer40.github.io/actions/workflows/deploy-pages.yml",
            "_blank"
          );
        }
      } catch (err) {
        console.error("Deploy trigger failed", err);
        setMessage("جاري فتح صفحة GitHub Actions مباشرة لتشغيل التحديث.");
        window.open(
          "https://github.com/conqer40/conqer40.github.io/actions/workflows/deploy-pages.yml",
          "_blank"
        );
      } finally {
        setSyncing(false);
      }
    } else {
      setMessage("جاري فتح صفحة GitHub Actions؛ اضغط على Run workflow لبدء المزامنة فوراً.");
      window.open(
        "https://github.com/conqer40/conqer40.github.io/actions/workflows/deploy-pages.yml",
        "_blank"
      );
    }
  };
  const load = async () => {
    const [c, i, a, vc, v, u, k] = await Promise.all([
      supabase.from("library_categories").select("*").order("sort_order"),
      supabase
        .from("library_items")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("site_articles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("video_categories").select("*").order("sort_order"),
      supabase
        .from("video_lessons")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("ai_knowledge").select("*").order("created_at", { ascending: false }),
    ]);
    setCategories(c.data || []);
    setItems(i.data || []);
    setArticles(a.data || []);
    setVideoCategories(vc.data || []);
    setVideos(v.data || []);
    setUsers(u.data || []);
    setKnowledge(k.data || []);
  };
  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) load();
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (s) load();
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmailFromUsername(login.username),
      password: login.password,
    });
    setMessage(error ? "بيانات الدخول غير صحيحة" : "");
    if (!error) await load();
    setLoading(false);
  };
  const addCategory = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("library_categories")
      .insert({ ...cat, slug: slugify(cat.name) });
    setMessage(error ? "تعذر إضافة القسم" : "تمت إضافة القسم");
    if (!error) {
      setCat({ name: "", description: "", cover_url: "" });
      load();
    }
  };
  const addItem = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("library_items")
      .insert({ ...item, slug: slugify(item.title) });
    setMessage(error ? "تعذر إضافة الملف" : "تم نشر الملف");
    if (!error) {
      setItem(blankItem);
      load();
    }
  };
  const addVideoCategory = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("video_categories")
      .insert({ ...videoCat, slug: slugify(videoCat.name) });
    setMessage(error ? "تعذر إضافة قسم الفيديو" : "تمت إضافة قسم الفيديو");
    if (!error) {
      setVideoCat(blankVideoCategory);
      load();
    }
  };
  const addVideo = async (e) => {
    e.preventDefault();
    const payload = {
      ...video,
      slug: slugify(video.title),
      attachment_item_id: video.attachment_item_id || null,
    };
    const { error } = await supabase.from("video_lessons").insert(payload);
    setMessage(error ? "تعذر نشر الفيديو" : "تم نشر درس الفيديو");
    if (!error) {
      setVideo(blankVideo);
      load();
    }
  };
  const addArticle = async (e) => {
    e.preventDefault();
    const payload = {
      ...article,
      slug: article.slug || slugify(article.title),
    };
    const { error } = await supabase.from("site_articles").insert(payload);
    setMessage(
      error
        ? "تعذر نشر المقال؛ راجع البيانات أو فعّل جدول المقالات"
        : "تم نشر المقال بنجاح",
    );
    if (!error) {
      setArticle(blankArticle);
      load();
    }
  };
  const addKnowledge = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("ai_knowledge").insert(knowledgeItem);
    setMessage(error ? "تعذر إضافة مادة المنهج؛ طبّق تحديث قاعدة البيانات أولًا" : "تمت إضافة المادة إلى معرفة المساعد");
    if (!error) { setKnowledgeItem(blankKnowledge); load(); }
  };
  const remove = async (table, id) => {
    if (!confirm("هل تريد الحذف نهائيًا؟")) return;
    await supabase.from(table).delete().eq("id", id);
    load();
  };
  const updateUser = async (id, changes) => {
    const { error } = await supabase
      .from("profiles")
      .update(changes)
      .eq("id", id);
    setMessage(error ? "تعذر تعديل المستخدم" : "تم تحديث صلاحيات المستخدم");
    if (!error) load();
  };
  if (!supabaseReady)
    return (
      <main className="control-page">
        <div className="control-login">
          <FiLock />
          <h1>لوحة التحكم غير متصلة</h1>
        </div>
      </main>
    );
  if (loading)
    return (
      <main className="control-page">
        <div className="catalog-loading">
          <FiLoader /> جارٍ التحميل
        </div>
      </main>
    );
  if (!session)
    return <Navigate to="/login" replace state={{ from: "/admin/library" }} />;
  const adminPhone = String(session.user.user_metadata?.phone || "").replace(/\D/g, "");
  const isAdmin = session.user.email === "01022104948@admin.elhawy.local" || adminPhone === "01022104948";
  if (!isAdmin)
    return <Navigate to="/profile" replace />;
  return (
    <main className="control-page">
      <aside className="control-sidebar">
        <div>
          <small>ELHAWY</small>
          <b>CONTROL</b>
        </div>
        <nav>
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            نظرة عامة
          </button>
          <button
            className={tab === "library" ? "active" : ""}
            onClick={() => setTab("library")}
          >
            ملفات ومرفقات المقالات
          </button>
          <button
            className={tab === "articles" ? "active" : ""}
            onClick={() => setTab("articles")}
          >
            إدارة المقالات
          </button>
          <button
            className={tab === "videos" ? "active" : ""}
            onClick={() => setTab("videos")}
          >
            دروس الفيديو
          </button>
          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            المستخدمون
          </button>
          <button className={tab === "knowledge" ? "active" : ""} onClick={() => setTab("knowledge")}>معرفة المساعد AI</button>
        </nav>
        <button onClick={() => supabase.auth.signOut()}>
          <FiLogOut /> خروج
        </button>
      </aside>
      <section className="control-content">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span>لوحة التحكم</span>
            <h1>
              {tab === "overview"
                ? "مرحبًا محمد"
                : tab === "library"
                  ? "ملفات ومرفقات المقالات"
                  : tab === "articles"
                    ? "إدارة المقالات"
                    : tab === "videos"
                      ? "إدارة دروس الفيديو"
                      : tab === "knowledge" ? "معرفة المساعد التعليمي" : "إدارة المستخدمين"}
            </h1>
          </div>
          <button
            type="button"
            onClick={triggerYouTubeSync}
            disabled={syncing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ff0000, #c40000)",
              color: "#fff",
              border: "0",
              fontWeight: "800",
              fontSize: "14px",
              cursor: syncing ? "wait" : "pointer",
              boxShadow: "0 6px 20px rgba(255,0,0,0.3)"
            }}
          >
            <FaYoutube size={18} />
            {syncing ? "جارٍ إرسال أمر التحديث..." : "تحديث ومزامنة فيديوهات YouTube"}
          </button>
        </header>
        {message && (
          <div className="control-message">
            <FiCheckCircle />
            {message}
          </div>
        )}
        {tab === "overview" && (
          <div className="control-stats">
            <article>
              <FiFolderPlus />
              <b>{categories.length}</b>
              <span>قسم بالمكتبة</span>
            </article>
            <article>
              <FiLink />
              <b>{items.length}</b>
              <span>ملف ومصدر</span>
            </article>
            <article>
              <FiBookOpen />
              <b>{articles.length}</b>
              <span>مقال منشور</span>
            </article>
            <article>
              <FiPlayCircle />
              <b>{videos.length}</b>
              <span>درس فيديو</span>
            </article>
            <article>
              <FiLock />
              <b>{users.length}</b>
              <span>مستخدم مسجل</span>
            </article>
          </div>
        )}
        {tab === "library" && (
          <>
            <div className="control-grid">
              <Form
                title="إضافة تصنيف للمرفقات"
                icon={<FiFolderPlus />}
                submit={addCategory}
              >
                <Field
                  label="اسم القسم"
                  value={cat.name}
                  set={(v) => setCat({ ...cat, name: v })}
                />
                <Area
                  label="وصف القسم"
                  value={cat.description}
                  set={(v) => setCat({ ...cat, description: v })}
                />
                <ImageUpload
                  value={cat.cover_url}
                  onChange={(v) => setCat({ ...cat, cover_url: v })}
                  folder="library-categories"
                />
              </Form>
              <Form
                title="إضافة ملف أو مرفق للمقالات"
                icon={<FiLink />}
                submit={addItem}
              >
                <label>
                  القسم
                  <select
                    required
                    value={item.category_id}
                    onChange={(e) =>
                      setItem({ ...item, category_id: e.target.value })
                    }
                  >
                    <option value="">اختر القسم</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="العنوان"
                  value={item.title}
                  set={(v) => setItem({ ...item, title: v })}
                />
                <Field
                  label="وصف مختصر"
                  value={item.summary}
                  set={(v) => setItem({ ...item, summary: v })}
                />
                <Area
                  label="التفاصيل"
                  value={item.description}
                  set={(v) => setItem({ ...item, description: v })}
                />
                <Field
                  label="رابط التحميل"
                  value={item.download_url}
                  set={(v) => setItem({ ...item, download_url: v })}
                  type="url"
                />
                <ImageUpload
                  value={item.cover_url}
                  onChange={(v) => setItem({ ...item, cover_url: v })}
                  folder="library-items"
                />
              </Form>
            </div>
            <List
              title="أقسام المكتبة"
              rows={categories}
              remove={(id) => remove("library_categories", id)}
            />
          </>
        )}
        {tab === "articles" && (
          <>
            <Form title="إنشاء تصنيف مقالات" icon={<FiFolderPlus />} submit={addCategory}>
              <Field label="اسم التصنيف" value={cat.name} set={(v) => setCat({ ...cat, name: v })} />
              <Area label="وصف التصنيف" value={cat.description} set={(v) => setCat({ ...cat, description: v })} />
            </Form>
            <Form
              title="كتابة مقال جديد"
              icon={<FiBookOpen />}
              submit={addArticle}
              wide
            >
              <div className="control-two">
                <Field
                  label="عنوان المقال"
                  value={article.title}
                  set={(v) => setArticle({ ...article, title: v })}
                />
                <label>تصنيف المقال<select required value={article.category} onChange={(e) => setArticle({ ...article, category: e.target.value })}><option value="">اختر التصنيف</option><option value="كورسات">كورسات</option>{categories.filter((group) => group.name !== "كورسات").map((group) => <option key={group.id} value={group.name}>{group.name}</option>)}</select></label>
              </div>
              <Field
                label="الرابط المختصر — يترك فارغًا للتوليد تلقائيًا"
                value={article.slug}
                set={(v) => setArticle({ ...article, slug: v })}
                optional
              />
              <Area
                label="المقدمة المختصرة"
                value={article.summary}
                set={(v) => setArticle({ ...article, summary: v })}
              />
              <Area
                label="محتوى المقال — افصل الفقرات بسطر فارغ"
                value={article.content}
                set={(v) => setArticle({ ...article, content: v })}
                large
              />
              <div className="inline-image-admin">
                <label>صورة داخل المقال</label>
                <p>ارفع الصورة ثم اضغط «إضافة داخل النص». ستُضاف في نهاية المحتوى ويمكنك نقل السطر إلى أي مكان بين الفقرات.</p>
                <ImageUpload
                  value={inlineArticleImage}
                  onChange={setInlineArticleImage}
                  folder="articles/content"
                />
                <button
                  type="button"
                  disabled={!inlineArticleImage}
                  onClick={() => {
                    setArticle({
                      ...article,
                      content: `${article.content}${article.content ? "\n\n" : ""}[[image:${inlineArticleImage}|صورة توضيحية]]`,
                    });
                    setInlineArticleImage("");
                  }}
                >
                  <FiPlusCircle /> إضافة الصورة داخل النص
                </button>
              </div>
              <div className="inline-image-admin">
                <label>مرفق داخل المقال — اختياري</label>
                <p>اختر ملفًا من مرفقات المقالات ليظهر للزائر داخل المقال مع زر العرض والتحميل.</p>
                <select value={articleAttachmentId} onChange={(e) => setArticleAttachmentId(e.target.value)}>
                  <option value="">اختر ملفًا أو مرفقًا</option>
                  {items.map((resource) => <option key={resource.id} value={resource.id}>{resource.title}</option>)}
                </select>
                <button type="button" disabled={!articleAttachmentId} onClick={() => {
                  const resource = items.find((entry) => entry.id === articleAttachmentId);
                  if (!resource) return;
                  setArticle({ ...article, content: `${article.content}${article.content ? "\n\n" : ""}[[attachment:${resource.id}|${resource.title}]]` });
                  setArticleAttachmentId("");
                }}><FiPlusCircle /> إضافة المرفق داخل المقال</button>
              </div>
              <ImageUpload
                value={article.cover_url}
                onChange={(v) => setArticle({ ...article, cover_url: v })}
                folder="articles"
              />
            </Form>
            <List
              title="المقالات الحالية"
              rows={articles}
              remove={(id) => remove("site_articles", id)}
            />
          </>
        )}
        {tab === "videos" && (
          <>
            <div
              className="control-form wide"
              style={{
                marginBottom: "24px",
                border: "1px solid #12cec4",
                background: "linear-gradient(135deg, #07192d, #0b2848)",
                color: "#fff",
              }}
            >
              <header style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <FaYoutube style={{ color: "#ff0000", fontSize: "32px" }} />
                <div>
                  <h2 style={{ margin: 0, color: "#fff" }}>مزامنة وتحديث فيديوهات YouTube</h2>
                  <small style={{ color: "#77e6ef" }}>قناة @ElhawyAI الرسمية</small>
                </div>
              </header>
              <p style={{ color: "#c0ced8", lineHeight: "1.8", margin: "0 0 18px", fontSize: "14px" }}>
                الموقع متصل بقناتك ومضبوط للمزامنة الآلية، ويمكنك في أي وقت الضغط على الزر أدناه لسحب أي فيديو أو قائمة تشغيل جديدة فوراً وبناء وتحديث الموقع الحي.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={triggerYouTubeSync}
                  disabled={syncing}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    background: "#ff0000",
                    color: "#fff",
                    border: "0",
                    fontWeight: "800",
                    fontSize: "14px",
                    cursor: syncing ? "wait" : "pointer",
                    boxShadow: "0 6px 18px rgba(255,0,0,0.35)",
                  }}
                >
                  <FaYoutube size={20} />
                  {syncing ? "جارٍ إرسال أمر التحديث..." : "تحديث ومزامنة فيديوهات القناة الآن"}
                </button>
                <a
                  href="https://github.com/conqer40/conqer40.github.io/actions/workflows/deploy-pages.yml"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  سير البناء والنشر على GitHub Actions <FiExternalLink />
                </a>
              </div>
            </div>

            <div className="control-grid">
              <Form
                title="إضافة قسم فيديو"
                icon={<FiFolderPlus />}
                submit={addVideoCategory}
              >
                <Field
                  label="اسم القسم"
                  value={videoCat.name}
                  set={(v) => setVideoCat({ ...videoCat, name: v })}
                />
                <Area
                  label="وصف القسم"
                  value={videoCat.description}
                  set={(v) => setVideoCat({ ...videoCat, description: v })}
                />
                <ImageUpload
                  value={videoCat.cover_url}
                  onChange={(v) => setVideoCat({ ...videoCat, cover_url: v })}
                  folder="video-categories"
                />
              </Form>
              <Form
                title="إضافة درس فيديو"
                icon={<FiPlayCircle />}
                submit={addVideo}
              >
                <label>
                  القسم
                  <select
                    required
                    value={video.category_id}
                    onChange={(e) =>
                      setVideo({ ...video, category_id: e.target.value })
                    }
                  >
                    <option value="">اختر القسم</option>
                    {videoCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="عنوان الدرس"
                  value={video.title}
                  set={(v) => setVideo({ ...video, title: v })}
                />
                <Field
                  label="وصف مختصر"
                  value={video.summary}
                  set={(v) => setVideo({ ...video, summary: v })}
                />
                <Area
                  label="شرح الفيديو"
                  value={video.description}
                  set={(v) => setVideo({ ...video, description: v })}
                />
                <Field
                  label="رابط الفيديو على YouTube"
                  value={video.youtube_url}
                  set={(v) => setVideo({ ...video, youtube_url: v })}
                  type="url"
                />
                <ImageUpload
                  value={video.cover_url}
                  onChange={(v) => setVideo({ ...video, cover_url: v })}
                  folder="video-lessons"
                />
                <label>
                  مرفق مرتبط من المكتبة — اختياري
                  <select
                    value={video.attachment_item_id}
                    onChange={(e) =>
                      setVideo({
                        ...video,
                        attachment_item_id: e.target.value,
                      })
                    }
                  >
                    <option value="">بدون مرفق</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                </label>
              </Form>
            </div>
            <List
              title="أقسام الفيديو"
              rows={videoCategories}
              remove={(id) => remove("video_categories", id)}
            />
            <List
              title="دروس الفيديو الحالية"
              rows={videos}
              remove={(id) => remove("video_lessons", id)}
            />
          </>
        )}
        {tab === "knowledge" && (
          <>
            <Form title="إضافة درس أو مادة للمساعد" icon={<FiBookOpen />} submit={addKnowledge} wide>
              <div className="control-two">
                <Field label="عنوان الدرس أو الموضوع" value={knowledgeItem.title} set={(v) => setKnowledgeItem({ ...knowledgeItem, title: v })} />
                <Field label="القسم أو المادة" value={knowledgeItem.category} set={(v) => setKnowledgeItem({ ...knowledgeItem, category: v })} />
              </div>
              <Area label="محتوى المنهج بالتفصيل" value={knowledgeItem.content} set={(v) => setKnowledgeItem({ ...knowledgeItem, content: v })} large />
            </Form>
            <List title="مواد قاعدة المعرفة" rows={knowledge} remove={(id) => remove("ai_knowledge", id)} />
          </>
        )}
        {tab === "users" && (
          <section className="users-admin">
            <header>
              <div>
                <span>{users.length}</span>
                <h2>الحسابات المسجلة</h2>
              </div>
              <p>غيّر نوع الحساب أو أوقفه فورًا من استخدام الموقع.</p>
            </header>
            <div className="users-table">
              {users.map((user) => (
                <article key={user.id}>
                  <div className="user-avatar">
                    {(user.full_name || "م").charAt(0)}
                  </div>
                  <div className="user-identity">
                    <b>{user.full_name || "بدون اسم"}</b>
                    <span>{user.phone}</span>
                  </div>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateUser(user.id, { role: e.target.value })
                    }
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مدير</option>
                  </select>
                  <button
                    className={user.active ? "deactivate" : "activate"}
                    onClick={() =>
                      updateUser(user.id, { active: !user.active })
                    }
                  >
                    {user.active ? "إيقاف الحساب" : "تفعيل الحساب"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
function Form({ title, icon, submit, children, wide }) {
  return (
    <form className={`control-form ${wide ? "wide" : ""}`} onSubmit={submit}>
      <header>
        {icon}
        <h2>{title}</h2>
      </header>
      {children}
      <button>
        <FiPlusCircle /> حفظ ونشر
      </button>
    </form>
  );
}
function Field({ label, value, set, type = "text", optional }) {
  return (
    <label>
      {label}
      <input
        required={!optional}
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
function Area({ label, value, set, large }) {
  return (
    <label>
      {label}
      <textarea
        required
        className={large ? "large" : ""}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
function List({ title, rows, remove }) {
  return (
    <section className="control-list">
      <h2>{title}</h2>
      {rows.map((x) => (
        <article key={x.id}>
          <div>
            <b>{x.title || x.name}</b>
            <span>{x.category || x.description}</span>
          </div>
          <button onClick={() => remove(x.id)}>
            <FiTrash2 />
          </button>
        </article>
      ))}
    </section>
  );
}
