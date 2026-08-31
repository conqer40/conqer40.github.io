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
} from "react-icons/fi";
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
  category: "ذكاء اصطناعي",
  published: true,
};
const blankVideoCategory = { name: "", description: "", cover_url: "" };
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
    [users, setUsers] = useState([]),
    [login, setLogin] = useState({ username: "", password: "" }),
    [cat, setCat] = useState({ name: "", description: "", cover_url: "" }),
    [item, setItem] = useState(blankItem),
    [article, setArticle] = useState(blankArticle),
    [videoCat, setVideoCat] = useState(blankVideoCategory),
    [video, setVideo] = useState(blankVideo);
  const load = async () => {
    const [c, i, a, vc, v, u] = await Promise.all([
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
    ]);
    setCategories(c.data || []);
    setItems(i.data || []);
    setArticles(a.data || []);
    setVideoCategories(vc.data || []);
    setVideos(v.data || []);
    setUsers(u.data || []);
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
    const { sub } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
      .data.subscription;
    return () => sub.unsubscribe();
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
  if (session.user.email !== "01022104948@admin.elhawy.local")
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
            إدارة المكتبة
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
        </nav>
        <button onClick={() => supabase.auth.signOut()}>
          <FiLogOut /> خروج
        </button>
      </aside>
      <section className="control-content">
        <header>
          <div>
            <span>لوحة التحكم</span>
            <h1>
              {tab === "overview"
                ? "مرحبًا محمد"
                : tab === "library"
                  ? "إدارة المكتبة"
                  : tab === "articles"
                    ? "إدارة المقالات"
                    : tab === "videos"
                      ? "إدارة دروس الفيديو"
                      : "إدارة المستخدمين"}
            </h1>
          </div>
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
                title="إضافة قسم"
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
                title="إضافة ملف أو مصدر"
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
                <Field
                  label="التصنيف"
                  value={article.category}
                  set={(v) => setArticle({ ...article, category: v })}
                />
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
