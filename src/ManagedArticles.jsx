import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiLoader } from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";
import { ShareButtons } from "./ShareButtons.jsx";

const fallbacks = [
  {
    slug: "choose-ai-tool",
    title: "كيف تختار أداة الذكاء الاصطناعي المناسبة؟",
    summary: "دليل عملي يساعدك على المقارنة بعيدًا عن الضجيج.",
    content:
      "ابدأ بالمشكلة التي تريد حلها، وليس باسم الأداة الأكثر شهرة. حدّد المهمة والنتيجة التي تتوقعها.\n\nجرّب النسخة المجانية وقارن جودة النتيجة وسهولة الاستخدام والتكلفة.\n\nراجع سياسة الخصوصية وإمكانية تصدير بياناتك قبل الاعتماد على أي أداة.",
  },
  {
    slug: "best-writing-tools",
    title: "أفضل طريقة لمقارنة أدوات الكتابة",
    summary: "اختبار موحّد يكشف الفروق الحقيقية بين الأدوات.",
    content:
      "استخدم نفس الطلب والنص المرجعي مع كل أداة، ثم قيّم الدقة والأسلوب والالتزام بالتعليمات.\n\nاختبر التلخيص وإعادة الصياغة والبحث والتحرير كلٌ على حدة.",
  },
  {
    slug: "ai-workflow",
    title: "ابنِ سير عمل ذكيًا دون تعقيد",
    summary: "من مهمة واحدة إلى نظام يوفر ساعات أسبوعيًا.",
    content:
      "ابدأ بخطوة واحدة قابلة للقياس، ثم أضف الأتمتة تدريجيًا.\n\nاحتفظ بنقطة مراجعة بشرية للقرارات المهمة والبيانات الحساسة.",
  },
];
function useArticles() {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabaseReady) {
      setData(fallbacks);
      setLoading(false);
      return;
    }
    supabase
      .from("site_articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data, error }) =>
        setData(!error && data?.length ? data : fallbacks),
      )
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
          {data.map((a, i) => (
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
          ))}
        </section>
      )}
    </main>
  );
}
export function ManagedArticle() {
  const { slug } = useParams(),
    { data, loading } = useArticles(),
    a = data.find((x) => x.slug === slug);
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
            .map((p, i) => (
              <section key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{p}</p>
              </section>
            ))}
        </div>
        <ShareButtons title={a.title} />
      </article>
    </main>
  );
}
