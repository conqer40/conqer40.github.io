import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiCheck, FiDollarSign, FiDownload, FiFile, FiGlobe, FiGrid,
  FiImage, FiSearch, FiShield, FiTrash2, FiUploadCloud, FiX, FiPrinter,
  FiFeather, FiMoon, FiSliders, FiInfo, FiEdit3, FiCheckCircle, FiMinimize2
} from "react-icons/fi";
import { pdfTools, pdfCategories, toolBySlug } from "./pdfTools.jsx";
import {
  downloadBlob, getPageThumbnails, imagesToPdf, merge, pdfToDocx, pdfToJpg,
  splitToZip, transformPdf, compressPdf, fakeScanPdf, invertColorsPdf,
  adjustContrastPdf, pdfToText, pdfToCsv, pdfToHtml, changeMetadata,
  flattenPdf, removeBlankPages, addStampToPdf, signPdf, scalePageSize,
  multiPageLayout, sanitizePdf, repairPdf, overlayPdfs, getPdfInfo
} from "./pdfEngine.js";
import "./free-tools.css";

const bytes = (n) => n > 1048576 ? `${(n/1048576).toFixed(1)} MB` : `${Math.ceil(n/1024)} KB`;

const TOOL_CATEGORIES = [
  { id: "all", label: "جميع الأدوات" },
  { id: "business", label: "💼 المالية وإكسيل" },
  { id: "translation", label: "🌐 الترجمة والذكاء الاصطناعي" },
  { id: "pdf", label: "📄 حزمة PDF والـ OCR" },
  { id: "media", label: "🎨 الصور ورموز QR" },
];

const ALL_TOOLS = [
  {
    id: "tafqeet",
    category: "business",
    featured: true,
    title: "محرك التفقيط المالي الذكي",
    enTitle: "Tafqeet Financial Engine",
    desc: "تحويل المبالغ المالية والأرقام إلى كلمات معتمدة للشيكات والفواتير باللغة العربية والإنجليزية، مع خيارات الإعراب (الرفع والنصب والجر)، دعم كافة العملات، تفقيط ملفات Excel كاملة، وتوفير كود ماكرو VBA جاهز للنسخ داخل الإكسيل.",
    to: "/free-tools/tafqeet",
    icon: FiDollarSign,
    iconBg: "linear-gradient(135deg, #107c41, #22c55e)",
    badge: "معتمد للشيكات والفواتير",
    badgeColor: "#15803d",
    badgeBg: "#f0fdf4",
    tags: ["عربي + إنجليزي", "تفقيط ملفات Excel", "كود VBA Macro", "دعم جميع العملات"],
    stats: "دقة لغوية 100%"
  },
  {
    id: "excel-tools",
    category: "business",
    featured: true,
    title: "مساعد إكسيل الذكي (Excel AI Studio)",
    enTitle: "Gemini-Powered Excel Studio",
    desc: "اكتب ما ترغب بحسابه باللغة العربية البسيطة، وسيقوم الذكاء الاصطناعي (Gemini AI) بتوليد صيغ ودوال الإكسيل المعقدة (XLOOKUP, SUMIFS, INDEX/MATCH) مع الشرح والخطوات، تشخيص وتصحيح أخطاء الدوال، وعارض جداول البيانات داخل المتصفح.",
    to: "/free-tools/excel-tools",
    icon: FiGrid,
    iconBg: "linear-gradient(135deg, #0e6251, #14b8a6)",
    badge: "مدعوم بـ Gemini AI",
    badgeColor: "#0f766e",
    badgeBg: "#f0fdfa",
    tags: ["توليد صيغ ذكي", "تصحيح أخطاء الدوال", "عارض جداول Excel & CSV", "شرح الصيغ خطوة بخطوة"],
    stats: "Gemini 1.5 Pro"
  },
  {
    id: "pdf-to-word",
    category: "pdf",
    featured: true,
    title: "تحويل PDF إلى Word مع التعرف الضوئي (OCR)",
    enTitle: "PDF to Word with Arabic OCR",
    desc: "تحويل مستندات وكتب PDF إلى مستندات Word (.docx) قابلة للتعديل بالكامل، مع دعم فائق للتعرف الضوئي على الحروف (OCR) للغة العربية والإنجليزية مباشرة داخل جهازك للكتب والمستندات المصورة دون رفع ملفاتك.",
    to: "/free-tools/pdf-tools/pdf-to-word",
    icon: FiFile,
    iconBg: "linear-gradient(135deg, #b91c1c, #f43f5e)",
    badge: "دعم OCR عربي أصلي",
    badgeColor: "#be123c",
    badgeBg: "#fff1f2",
    tags: ["OCR عربي + إنجليزي", "تصدير Word DOCX", "خصوصية 100%", "تحويل الكتب المصورة"],
    stats: "WebAssembly + Tesseract"
  },
  {
    id: "translation-tools",
    category: "translation",
    featured: true,
    title: "مركز الترجمة والذكاء الاصطناعي للمستندات",
    enTitle: "AI Translation & Document Suite",
    desc: "منظومة ترجمة متكاملة تشمل مترجماً فورياً متعدد اللغات مع نطق صوتي وتصدير مباشر لـ Word و Text، مترجم ملفات وكتب PDF كاملة مع الحفاظ على التنسيق وعرض مقارنة ثنائية، ومعجم مصطلحات الذكاء الاصطناعي والبرمجة.",
    to: "/free-tools/translation-tools",
    icon: FiGlobe,
    iconBg: "linear-gradient(135deg, #0369a1, #38bdf8)",
    badge: "3 أدوات ترجمة مدمجة",
    badgeColor: "#0284c7",
    badgeBg: "#f0f9ff",
    tags: ["ترجمة PDF صفحة بصفحة", "مترجم نصوص فوري", "معجم مصطلحات AI", "نطق صوتي وتصدير"],
    stats: "10+ لغات عالمية"
  },
  {
    id: "pdf-tools",
    category: "pdf",
    featured: false,
    title: "منظومة أدوات PDF المتطورة (Stirling Suite - 33 أداة)",
    enTitle: "Stirling-PDF Client-Side Suite (33 Tools)",
    desc: "حزمة شاملة متكاملة مستوحاة من Stirling-PDF تعمل بالكامل داخل جهازك: دمج، تقسيم، تحويل، توقيع إلكتروني، تأثير السكانر العتيق، ضغط فائق، استخراج الجداول والنصوص، OCR، وإصلاح الملفات دون رفع أي بيانات.",
    to: "/free-tools/pdf-tools",
    icon: FiFile,
    iconBg: "linear-gradient(135deg, #c2410c, #f97316)",
    badge: "33 أداة كاملة ومجانية",
    badgeColor: "#c2410c",
    badgeBg: "#fff7ed",
    tags: ["دمج PDF", "تقسيم واستخراج", "ضغط وتقليل الحجم", "علامة مائية وترقيم"],
    stats: "معالجة محلية 100%"
  },
  {
    id: "qr-tools",
    category: "media",
    featured: false,
    title: "استوديو رموز الـ QR Code الذكية",
    enTitle: "Smart QR Code Studio",
    desc: "توليد رموز QR مخصصة للروابط ومواقع الويب، محادثات الواتساب المباشرة، وشبكات الواي فاي (Wi-Fi)، بالإضافة إلى قارئ ومستخرج ذكي لأكواد الـ QR من الصور والمستندات.",
    to: "/free-tools/qr-tools",
    icon: FiGrid,
    iconBg: "linear-gradient(135deg, #4338ca, #6366f1)",
    badge: "إنشاء وقراءة فورية",
    badgeColor: "#4338ca",
    badgeBg: "#eef2ff",
    tags: ["QR للروابط", "واتساب تلقائي", "Wi-Fi فوري", "قراءة من الصور"],
    stats: "تنزيل PNG فائق الدقة"
  },
  {
    id: "image-tools",
    category: "media",
    featured: false,
    title: "استوديو الصور ومعالجة الوسائط",
    enTitle: "Image Studio & Optimizer",
    desc: "أدوات سريعة لمعالجة الصور: ضغط الحجم مع الحفاظ على الجودة، تغيير المقاسات والأبعاد بالبيكسل، تحويل الصيغ بين PNG و JPG و WEBP، قص الصور ووضع علامة مائية لحماية أعمالك.",
    to: "/free-tools/image-tools",
    icon: FiImage,
    iconBg: "linear-gradient(135deg, #6d28d9, #a855f7)",
    badge: "6 أدوات معالجة",
    badgeColor: "#7e22ce",
    badgeBg: "#faf5ff",
    tags: ["ضغط الصور", "تغيير المقاسات", "تحويل PNG/JPG/WEBP", "علامة مائية"],
    stats: "داخل متصفحك مباشرة"
  }
];

export function FreeToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchCat = activeCategory === "all" || tool.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchSearch =
        tool.title.toLowerCase().includes(q) ||
        tool.enTitle.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="ft-page ft-redesign-page">
      {/* HERO SECTION */}
      <section className="ft-hero-modern">
        <div className="ft-hero-badge">
          <span className="dot-pulse" />
          <span>🔒 خصوصية وأمان 100% · معالجة محلية فائقة السرعة</span>
        </div>
        <h1>منصة الأدوات الذكية والمجانية</h1>
        <p>
          أدوات عملية متطورة لرواد الأعمال، الطلاب، المحاسبين، والمطورين؛ مدعومة بأحدث تقنيات الذكاء الاصطناعي وتعمل مباشرة داخل جهازك لحماية خصوصيتك التامة.
        </p>

        <div className="ft-stats-strip">
          <div className="ft-stat-pill">
            <b>+20</b>
            <span>أداة متخصصة</span>
          </div>
          <div className="ft-stat-pill">
            <b>100%</b>
            <span>خصوصية محلية</span>
          </div>
          <div className="ft-stat-pill">
            <b>Gemini AI</b>
            <span>ذكاء اصطناعي مدمج</span>
          </div>
          <div className="ft-stat-pill">
            <b>مجاني</b>
            <span>بدون حدود أو تسجيل</span>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <section className="ft-filter-toolbar">
        <div className="ft-search-box">
          <FiSearch />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أداة (مثال: تفقيط، إكسيل، ترجمة، OCR، تحويل Word، QR، ضغط صور)..."
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="ft-category-tabs">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`ft-cat-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="ft-modern-grid">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link key={tool.id} to={tool.to} className={`ft-hub-card ${tool.featured ? "featured" : ""}`}>
              <div className="card-top-header">
                <div className="card-icon" style={{ background: tool.iconBg }}>
                  <tool.icon />
                </div>
                <div className="card-badge" style={{ color: tool.badgeColor, background: tool.badgeBg }}>
                  {tool.badge}
                </div>
              </div>

              <div className="card-body">
                <h3>{tool.title}</h3>
                <small className="card-en-title">{tool.enTitle}</small>
                <p>{tool.desc}</p>
              </div>

              <div className="card-tags">
                {tool.tags.map((tag, idx) => (
                  <span key={idx} className="tool-pill-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="card-footer">
                <span className="card-stat-label">
                  <FiCheck /> {tool.stats}
                </span>
                <span className="card-open-btn">
                  فتح الأداة <FiArrowLeft />
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="ft-no-results">
            <FiSearch />
            <h3>لا توجد أدوات مطابقة لبحثك</h3>
            <p>جرّب البحث بكلمات أخرى أو اختر فئة مختلفة من الشريط أعلاه.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
              عرض جميع الأدوات
            </button>
          </div>
        )}
      </section>

      {/* PRIVACY & SECURITY GUARANTEE BANNER */}
      <section className="ft-privacy-guarantee">
        <div className="guarantee-icon">
          <FiShield />
        </div>
        <div className="guarantee-content">
          <h3>لماذا صممنا أدواتنا لتعمل داخل متصفحك بنسبة 100%؟</h3>
          <p>
            في عصر الذكاء الاصطناعي، خصوصية بياناتك المالية والشخصية هي خط أحمر. لذلك تم بناء جميع أدواتنا لتعمل بالكامل عبر تقنيات الحوسبة المتقدمة داخل المتصفح (WebAssembly و SheetJS و Tesseract OCR).
            <br />
            <strong>ملفاتك وبياناتك لا تغادر جهازك أبداً ولا يتم رفعها إلى أي خادم خارجي.</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

export function PdfToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return pdfTools.filter((t) => {
      const matchCat = activeCategory === "all" || t.category === activeCategory;
      const search = q.trim().toLowerCase();
      if (!search) return matchCat;
      const matchSearch =
        t.name.toLowerCase().includes(search) ||
        t.en.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });
  }, [activeCategory, q]);

  const quickPills = [
    { title: "تأثير السكانر (Fake Scan)", slug: "fake-scan-effect", icon: "🖨️" },
    { title: "ضغط وتقليل الحجم", slug: "compress-pdf", icon: "🗜️" },
    { title: "توقيع المستند (Sign)", slug: "sign-pdf", icon: "✍️" },
    { title: "PDF إلى Word (OCR)", slug: "pdf-to-word", icon: "📝" },
    { title: "دمج عدة ملفات", slug: "merge-pdf", icon: "📑" },
    { title: "تقسيم واستخراج", slug: "split-pdf", icon: "✂️" },
  ];

  return (
    <main className="ft-page ft-pdf-stirling-hub">
      {/* HERO SECTION */}
      <section className="ft-hero-modern" style={{ background: "radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 60%, #020617 100%)" }}>
        <div className="ft-hero-badge" style={{ color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" }}>
          <span className="dot-pulse" />
          <span>منظومة Stirling-PDF الشاملة · {pdfTools.length} أداة خاصة 100%</span>
        </div>
        <h1>أدوات PDF المتطورة والخاصة</h1>
        <p>
          حزمة شاملة مستوحاة من Stirling-PDF لإدارة ومعالجة ملفات PDF بالكامل داخل جهازك: دمج، تقسيم، تحويل، توقيع، ضغط، وتأثير المسح الضوئي العتيق، دون رفع أي مستند لأي خادم خارجي.
        </p>

        {/* Quick Launch Bar */}
        <div className="stirling-quick-bar">
          <small>الأكثر طلباً واستخداماً:</small>
          <div className="stirling-pills">
            {quickPills.map((pill) => (
              <Link key={pill.slug} to={`/free-tools/pdf-tools/${pill.slug}`} className="stirling-pill-btn">
                <span>{pill.icon}</span>
                <b>{pill.title}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH TOOLBAR */}
      <section className="ft-filter-toolbar">
        <div className="ft-search-box">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بين 33 أداة PDF (مثال: دمج، تقسيم، سكانر، ضغط، توقيع، OCR، وورد، تدوير)..."
          />
          {q && <button className="clear-search" onClick={() => setQ("")}>✕</button>}
        </div>

        <div className="ft-category-tabs">
          {pdfCategories.map((cat) => (
            <button
              key={cat.id}
              className={`ft-cat-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* TOOLS GRID */}
      <div className="ft-modern-grid" style={{ marginTop: "24px" }}>
        {filtered.map((t) => (
          <Link key={t.id} to={`/free-tools/pdf-tools/${t.slug}`} className={`ft-hub-card ${t.popular ? "featured" : ""}`}>
            <div className="card-top-header">
              <div className="card-icon" style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)" }}>
                <t.icon />
              </div>
              {t.badge && (
                <div className="card-badge" style={{ color: "#0284c7", background: "#f0f9ff" }}>
                  {t.badge}
                </div>
              )}
            </div>
            <div className="card-body">
              <h3>{t.name}</h3>
              <small className="card-en-title">{t.en}</small>
              <p>{t.description}</p>
            </div>
            <div className="card-footer">
              <span className="card-stat-label">
                <FiCheck /> معالجة خاصة وسريعة
              </span>
              <span className="card-open-btn">
                فتح الأداة <FiArrowLeft />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length && (
        <div className="ft-no-results">
          <FiSearch />
          <h3>لا توجد أداة مطابقة لبحثك</h3>
          <p>جرّب البحث بكلمات أخرى أو اختر فئة مختلفة من الأقسام أعلاه.</p>
          <button onClick={() => { setQ(""); setActiveCategory("all"); }}>عرض جميع الأدوات</button>
        </div>
      )}
    </main>
  );
}

function Dropzone({ files, setFiles, images, multiple }) {
  const input = useRef();
  const accept = images ? "image/jpeg,image/png,image/webp" : "application/pdf";
  const add = (list) => {
    const incoming = [...list].filter((f) =>
      images
        ? /image\/(jpeg|png|webp)/.test(f.type)
        : f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  };
  return (
    <>
      <div
        className="ft-drop"
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter") input.current.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        onClick={() => input.current.click()}
      >
        <FiUploadCloud />
        <h2>اسحب الملفات هنا</h2>
        <p>أو اضغط لاختيار {images ? "صور JPG / PNG / WebP" : "ملفات PDF"} من جهازك</p>
        <button type="button">اختيار الملفات</button>
        <input
          ref={input}
          hidden
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="ft-files">
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              draggable={multiple}
              onDragStart={(e) => e.dataTransfer.setData("index", i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("index"));
                if (from === i) return;
                const next = [...files],
                  item = next.splice(from, 1)[0];
                next.splice(i, 0, item);
                setFiles(next);
              }}
            >
              <FiFile />
              <span>
                <b>{f.name}</b>
                <small>{bytes(f.size)}</small>
              </span>
              <button aria-label="إزالة الملف" onClick={() => setFiles(files.filter((_, x) => x !== i))}>
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#082f49";
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="ft-sig-wrapper" style={{ marginTop: "14px", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <label style={{ fontWeight: 800 }}>ارسم توقيعك بيدك على المساحة أدناه:</label>
        <button type="button" onClick={clear} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: "12px" }}>
          مسح التوقيع ✕
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ width: "100%", height: "150px", border: "2px dashed #93c5fd", borderRadius: "12px", background: "#fff", cursor: "crosshair", touchAction: "none" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}

function Options({ tool, options, setOptions }) {
  const set = (key, value) => setOptions({ ...options, [key]: value });

  if (tool.id === "pdf-to-word" || tool.id === "ocr-cleanup") {
    return (
      <div className="ft-options">
        <label>
          نمط التحويل
          <select value={options.mode || "auto"} onChange={(e) => set("mode", e.target.value)}>
            <option value="auto">ذكي تلقائي (نصوص مباشرة + OCR للصفحات المصورة)</option>
            <option value="text">نص رقمي مباشر (فائق السرعة)</option>
            <option value="ocr">التعرف الضوئي OCR (للكتب والملفات الممسوحة)</option>
          </select>
        </label>
        {(options.mode === "ocr" || !options.mode || options.mode === "auto") && (
          <label>
            لغة التعرف OCR
            <select value={options.ocrLang || "ara+eng"} onChange={(e) => set("ocrLang", e.target.value)}>
              <option value="ara+eng">العربية + الإنجليزية (شامل وموصى به)</option>
              <option value="ara">العربية فقط</option>
              <option value="eng">الإنجليزية فقط</option>
            </select>
          </label>
        )}
      </div>
    );
  }

  if (tool.id === "compress-pdf") {
    return (
      <div className="ft-options">
        <label>
          مستوى الضغط
          <select value={options.quality || "0.65"} onChange={(e) => set("quality", e.target.value)}>
            <option value="0.75">ضغط متوازن (موصى به - حجم أقل وجودة ممتازة)</option>
            <option value="0.55">ضغط قوي (حجم مضغوط جداً للإيميل والأرشفة)</option>
            <option value="0.85">ضغط خفيف (أعلى جودة ممكنة)</option>
          </select>
        </label>
        <label>
          دقة الأبعاد (DPI Scale)
          <select value={options.scale || "1.2"} onChange={(e) => set("scale", e.target.value)}>
            <option value="1.2">1.2x (متوازن قياسي)</option>
            <option value="1.0">1.0x (حجم أصغر)</option>
            <option value="1.5">1.5x (عالي الدقة)</option>
          </select>
        </label>
      </div>
    );
  }

  if (tool.id === "fake-scan") {
    return (
      <div className="ft-options">
        <label className="check">
          <input
            type="checkbox"
            checked={options.grayscale !== false}
            onChange={(e) => set("grayscale", e.target.checked)}
          />
          تحويل لأبيض وأسود عالي التباين (مثل ماكينات التصوير)
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={options.noise !== false}
            onChange={(e) => set("noise", e.target.checked)}
          />
          إضافة حبيبات وتشويش الورق الممسوح ضوئياً
        </label>
      </div>
    );
  }

  if (tool.id === "adjust-contrast") {
    return (
      <div className="ft-options">
        <label>
          مستوى التباين ({options.contrast || 135}%)
          <input
            type="range"
            min="100"
            max="200"
            value={options.contrast || 135}
            onChange={(e) => set("contrast", e.target.value)}
          />
        </label>
        <label>
          مستوى السطوع ({options.brightness || 105}%)
          <input
            type="range"
            min="80"
            max="130"
            value={options.brightness || 105}
            onChange={(e) => set("brightness", e.target.value)}
          />
        </label>
      </div>
    );
  }

  if (tool.id === "change-metadata") {
    return (
      <div className="ft-options">
        <label>
          عنوان المستند (Title)
          <input value={options.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="مثال: التقرير السنوي" />
        </label>
        <label>
          المؤلف (Author)
          <input value={options.author || ""} onChange={(e) => set("author", e.target.value)} placeholder="مثال: محمد الحاوي" />
        </label>
        <label>
          الموضوع (Subject)
          <input value={options.subject || ""} onChange={(e) => set("subject", e.target.value)} placeholder="موضوع المستند" />
        </label>
        <label>
          الكلمات المفتاحية (Keywords - افصل بفاصلة)
          <input value={options.keywords || ""} onChange={(e) => set("keywords", e.target.value)} placeholder="ذكاء اصطناعي, تعليم, تقرير" />
        </label>
      </div>
    );
  }

  if (tool.id === "add-stamp") {
    return (
      <div className="ft-options">
        <label>
          نوع الختم
          <select value={options.stampType || "approved"} onChange={(e) => {
            const val = e.target.value;
            set("stampType", val);
            if (val === "approved") set("stampText", "APPROVED");
            if (val === "confidential") set("stampText", "CONFIDENTIAL");
            if (val === "draft") set("stampText", "DRAFT");
            if (val === "rejected") set("stampText", "REJECTED");
          }}>
            <option value="approved">معتمد (APPROVED - أخضر)</option>
            <option value="confidential">سري للغاية (CONFIDENTIAL - أحمر)</option>
            <option value="draft">مسودة (DRAFT - أزرق)</option>
            <option value="rejected">مرفوض (REJECTED - أحمر)</option>
          </select>
        </label>
        <label>
          نص الختم المخصص
          <input value={options.stampText || "APPROVED"} onChange={(e) => set("stampText", e.target.value)} />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={options.allPages !== false}
            onChange={(e) => set("allPages", e.target.checked)}
          />
          ختم جميع الصفحات (وإلا الأخيرة فقط)
        </label>
      </div>
    );
  }

  if (tool.id === "sign-pdf") {
    return (
      <div className="ft-options" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <label>
          موضع الصفحة المراد توقيعها
          <input
            type="number"
            min="1"
            value={options.page || 1}
            onChange={(e) => set("page", e.target.value)}
            placeholder="رقم الصفحة (مثال: 1)"
          />
        </label>
        <label>
          حجم التوقيع
          <select value={options.scale || "0.4"} onChange={(e) => set("scale", e.target.value)}>
            <option value="0.3">صغير (30%)</option>
            <option value="0.4">متوسط (40% - قياسي)</option>
            <option value="0.6">كبير (60%)</option>
          </select>
        </label>
        <SignaturePad value={options.signature || ""} onChange={(sig) => set("signature", sig)} />
      </div>
    );
  }

  if (tool.id === "scale-page") {
    return (
      <div className="ft-options">
        <label>
          المقاس القياسي المستهدف
          <select value={options.size || "a4"} onChange={(e) => set("size", e.target.value)}>
            <option value="a4">A4 (210 × 297 mm - الأكثر شيوعاً)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
            <option value="a3">A3 (297 × 420 mm - بوسترات ومخططات)</option>
            <option value="legal">Legal (8.5 × 14 in)</option>
          </select>
        </label>
      </div>
    );
  }

  if (tool.id === "multi-page") {
    return (
      <div className="ft-options">
        <label>
          نمط دمج الصفحات (N-Up Layout)
          <select value={options.layout || "2-up"} onChange={(e) => set("layout", e.target.value)}>
            <option value="2-up">صفحتان في ورقة واحدة (2-Up جنباً إلى جنب)</option>
            <option value="4-up">4 صفحات في ورقة واحدة (4-Up شبكة 2×2)</option>
          </select>
        </label>
      </div>
    );
  }

  if (["extract", "remove", "duplicate", "rotate", "crop"].includes(tool.id)) {
    return (
      <div className="ft-options">
        <label>
          الصفحات المستهدفة
          <input value={options.ranges || ""} onChange={(e) => set("ranges", e.target.value)} placeholder="مثال: 1-3, 5, 8-10" />
        </label>
        {tool.id === "rotate" && (
          <label>
            زاوية التدوير
            <select value={options.angle || 90} onChange={(e) => set("angle", e.target.value)}>
              <option>90</option>
              <option>180</option>
              <option>270</option>
            </select>
          </label>
        )}
        {tool.id === "crop" && (
          <label>
            الهامش بالنقاط (Points)
            <input type="number" min="0" value={options.margin || 20} onChange={(e) => set("margin", e.target.value)} />
          </label>
        )}
      </div>
    );
  }

  if (tool.id === "split") {
    return (
      <div className="ft-options">
        <label className="check">
          <input type="checkbox" checked={!!options.eachPage} onChange={(e) => set("eachPage", e.target.checked)} />
          كل صفحة في ملف مستقل
        </label>
        {!options.eachPage && (
          <label>
            المجموعات (افصل بينها بـ ;)
            <input value={options.ranges || "1-3;4-6"} onChange={(e) => set("ranges", e.target.value)} placeholder="1-3;4-6;7" />
          </label>
        )}
      </div>
    );
  }

  if (tool.id === "watermark") {
    return (
      <div className="ft-options">
        <label>
          نص العلامة المائية
          <input value={options.text || "Elhawy AI"} onChange={(e) => set("text", e.target.value)} />
        </label>
        <label>
          حجم الخط
          <input type="number" value={options.fontSize || 42} onChange={(e) => set("fontSize", e.target.value)} />
        </label>
        <label>
          الشفافية
          <input type="range" min=".1" max=".9" step=".1" value={options.opacity || 0.3} onChange={(e) => set("opacity", e.target.value)} />
        </label>
      </div>
    );
  }

  if (tool.id === "page-numbers") {
    return (
      <div className="ft-options">
        <label>
          رقم البداية
          <input type="number" value={options.start || 1} onChange={(e) => set("start", e.target.value)} />
        </label>
        <label>
          الموضع
          <select value={options.position || "center"} onChange={(e) => set("position", e.target.value)}>
            <option value="center">المنتصف (أسفل)</option>
            <option value="right">يمين (أسفل)</option>
            <option value="left">يسار (أسفل)</option>
          </select>
        </label>
        <label>
          حجم الخط
          <input type="number" value={options.fontSize || 12} onChange={(e) => set("fontSize", e.target.value)} />
        </label>
      </div>
    );
  }

  if (tool.id === "images-to-pdf") {
    return (
      <div className="ft-options">
        <label>
          حجم الصفحة
          <select value={options.size || "a4"} onChange={(e) => set("size", e.target.value)}>
            <option value="a4">A4 قياسي</option>
            <option value="fit">حسب أبعاد الصورة الأصلية</option>
          </select>
        </label>
        <label>
          الاتجاه
          <select value={options.orientation || "portrait"} onChange={(e) => set("orientation", e.target.value)}>
            <option value="portrait">رأسي (Portrait)</option>
            <option value="landscape">أفقي (Landscape)</option>
          </select>
        </label>
        <label>
          الهامش
          <input type="number" min="0" value={options.margin || 20} onChange={(e) => set("margin", e.target.value)} />
        </label>
      </div>
    );
  }

  return null;
}

function Organizer({ file, order, setOrder, rotations = {}, setRotations = () => {}, canRotate = false }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    getPageThumbnails(file)
      .then((x) => {
        if (live) {
          setPages(x);
          setOrder(x.map((p) => p.index));
        }
      })
      .finally(() => setLoading(false));
    return () => {
      live = false;
    };
  }, [file]);

  if (loading) return <div className="ft-loading">جارٍ تجهيز صور الصفحات...</div>;

  return (
    <div className="ft-pages">
      {order.map((idx, pos) => {
        const p = pages.find((x) => x.index === idx);
        return (
          <div
            key={`${idx}-${pos}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("pos", pos)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData("pos")),
                next = [...order],
                item = next.splice(from, 1)[0];
              next.splice(pos, 0, item);
              setOrder(next);
            }}
          >
            <img style={{ transform: `rotate(${rotations[pos] || 0}deg)` }} src={p?.url} alt={`صفحة ${idx + 1}`} />
            <b>صفحة {idx + 1}</b>
            <button aria-label="حذف الصفحة" onClick={() => setOrder(order.filter((_, i) => i !== pos))}>
              <FiTrash2 />
            </button>
            {canRotate && (
              <button
                style={{ left: "auto", right: 14, background: "#e7fbfa", color: "#078f99" }}
                aria-label="تدوير الصفحة"
                onClick={() => setRotations({ ...rotations, [pos]: ((rotations[pos] || 0) + 90) % 360 })}
              >
                ↻
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PdfToolPage() {
  const { slug } = useParams();
  const tool = toolBySlug(slug);
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({});
  const [order, setOrder] = useState([]);
  const [rotations, setRotations] = useState({});
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [docInfo, setDocInfo] = useState(null);

  useEffect(() => {
    if (tool) document.title = `${tool.en} - Stirling PDF Suite | Elhawy AI`;
    return () => {
      document.title = "Elhawy AI";
    };
  }, [tool]);

  if (!tool)
    return (
      <main className="ft-page">
        <div className="ft-empty">الأداة غير موجودة.</div>
      </main>
    );

  const many = tool.mode === "multi" || tool.mode === "images" || tool.id === "overlay-pdf";
  const organize = ["organize", "reorder"].includes(tool.id);

  const run = async () => {
    if (!files.length) return setError("اختر ملفًا أولًا.");
    setState("processing");
    setError("");
    setProgress(8);
    setStatusMsg("");

    try {
      let data,
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-processed.pdf`,
        type = "application/pdf";

      if (tool.id === "pdf-to-word" || tool.id === "ocr-cleanup") {
        const res = await pdfToDocx(files[0], options, (pct, msg) => {
          setProgress(pct);
          if (msg) setStatusMsg(msg);
        });
        data = res.blob;
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}.docx`;
        type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (tool.id === "compress-pdf") {
        data = await compressPdf(files[0], options, (pct, msg) => {
          setProgress(pct);
          if (msg) setStatusMsg(msg);
        });
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-compressed.pdf`;
      } else if (tool.id === "fake-scan") {
        data = await fakeScanPdf(files[0], options, (pct, msg) => {
          setProgress(pct);
          if (msg) setStatusMsg(msg);
        });
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-scanned.pdf`;
      } else if (tool.id === "invert-colors") {
        data = await invertColorsPdf(files[0], (pct, msg) => {
          setProgress(pct);
          if (msg) setStatusMsg(msg);
        });
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-inverted.pdf`;
      } else if (tool.id === "adjust-contrast") {
        data = await adjustContrastPdf(files[0], options, (pct, msg) => {
          setProgress(pct);
          if (msg) setStatusMsg(msg);
        });
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-contrast.pdf`;
      } else if (tool.id === "pdf-to-text") {
        data = await pdfToText(files[0], setProgress);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}.txt`;
        type = "text/plain;charset=utf-8";
      } else if (tool.id === "pdf-to-csv") {
        data = await pdfToCsv(files[0], setProgress);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}.csv`;
        type = "text/csv;charset=utf-8";
      } else if (tool.id === "pdf-to-html") {
        data = await pdfToHtml(files[0], setProgress);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}.html`;
        type = "text/html;charset=utf-8";
      } else if (tool.id === "change-metadata") {
        data = await changeMetadata(files[0], options);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-metadata.pdf`;
      } else if (tool.id === "flatten-pdf") {
        data = await flattenPdf(files[0]);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-flattened.pdf`;
      } else if (tool.id === "remove-blank-pages") {
        data = await removeBlankPages(files[0], options, setProgress);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-cleaned.pdf`;
      } else if (tool.id === "scale-page") {
        data = await scalePageSize(files[0], options);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-${options.size || "a4"}.pdf`;
      } else if (tool.id === "multi-page") {
        data = await multiPageLayout(files[0], options);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-nup.pdf`;
      } else if (tool.id === "add-stamp") {
        data = await addStampToPdf(files[0], options);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-stamped.pdf`;
      } else if (tool.id === "sign-pdf") {
        if (!options.signature) throw new Error("يرجى رسم التوقيع بيدك على المربع أدناه أولاً.");
        data = await signPdf(files[0], options.signature, options);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-signed.pdf`;
      } else if (tool.id === "sanitize-pdf") {
        data = await sanitizePdf(files[0]);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-sanitized.pdf`;
      } else if (tool.id === "repair-pdf") {
        data = await repairPdf(files[0]);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-repaired.pdf`;
      } else if (tool.id === "overlay-pdf") {
        data = await overlayPdfs(files);
        name = `${files[0].name.replace(/\.[^/.]+$/, "")}-overlay.pdf`;
      } else if (tool.id === "merge") {
        data = await merge(files);
      } else if (tool.id === "images-to-pdf") {
        data = await imagesToPdf(files, options);
      } else if (tool.id === "pdf-to-jpg" || tool.id === "extract-images") {
        data = await pdfToJpg(files[0], setProgress);
        name = "pdf-images.zip";
        type = "application/zip";
      } else if (tool.id === "split") {
        data = await splitToZip(files[0], options.ranges || "", options.eachPage, setProgress);
        name = "split-pdf.zip";
        type = "application/zip";
      } else if (tool.id === "pdf-info") {
        const info = await getPdfInfo(files[0]);
        setDocInfo(info);
        setProgress(100);
        setState("info");
        return;
      } else {
        data = await transformPdf(files[0], tool.id, { ...options, order, rotations });
      }

      setProgress(100);
      setResult({ data, name, type });
      setState("done");
    } catch (e) {
      setError(e.message || "تعذر معالجة الملف.");
      setState("idle");
    }
  };

  const reset = () => {
    setFiles([]);
    setOptions({});
    setOrder([]);
    setRotations({});
    setResult(null);
    setDocInfo(null);
    setState("idle");
    setProgress(0);
    setStatusMsg("");
    setError("");
  };

  return (
    <main className="ft-page ft-tool">
      <Link className="ft-back" to="/free-tools/pdf-tools">
        <FiArrowLeft /> كل أدوات PDF (Stirling Suite)
      </Link>
      <header>
        <span>
          <tool.icon />
        </span>
        <div>
          <small>{tool.en}</small>
          <h1>{tool.name}</h1>
          <p>{tool.description} تتم المعالجة محلياً داخل جهازك دون رفع أي بيانات.</p>
        </div>
      </header>

      {state === "info" && docInfo ? (
        <section className="ft-result" style={{ textAlign: "right" }}>
          <h2 style={{ marginBottom: "16px", color: "#0284c7" }}>📊 معلومات وتحليل المستند الشامل</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "24px" }}>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>عدد الصفحات:</small>
              <b style={{ display: "block", fontSize: "18px", color: "#0f172a" }}>{docInfo.numPages} صفحة</b>
            </div>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>حجم الملف:</small>
              <b style={{ display: "block", fontSize: "18px", color: "#0f172a" }}>{docInfo.fileSize}</b>
            </div>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>أبعاد الصفحة (Page Size):</small>
              <b style={{ display: "block", fontSize: "18px", color: "#0f172a" }}>{docInfo.width} × {docInfo.height} pt</b>
            </div>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>عنوان المستند (Title):</small>
              <b style={{ display: "block", fontSize: "15px", color: "#0f172a" }}>{docInfo.title}</b>
            </div>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>المؤلف (Author):</small>
              <b style={{ display: "block", fontSize: "15px", color: "#0f172a" }}>{docInfo.author}</b>
            </div>
            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <small style={{ color: "#64748b" }}>إصدار PDF:</small>
              <b style={{ display: "block", fontSize: "15px", color: "#0f172a" }}>PDF v{docInfo.version}</b>
            </div>
          </div>
          <button className="secondary" onClick={reset}>فحص ملف آخر</button>
        </section>
      ) : state === "done" ? (
        <section className="ft-result">
          <span>
            <FiCheck />
          </span>
          <h2>اكتملت العملية بنجاح</h2>
          <p>تمت المعالجة على جهازك ولم يتم إرسال ملفك لأي خادم خارجي.</p>
          <button onClick={() => downloadBlob(result.data, result.name, result.type)}>
            <FiDownload /> تحميل الملف ({result.name})
          </button>
          <button className="secondary" onClick={reset}>
            بدء عملية جديدة
          </button>
        </section>
      ) : (
        <section className="ft-workspace">
          <Dropzone files={files} setFiles={setFiles} images={tool.mode === "images"} multiple={many} />
          {files[0] && organize && <Organizer file={files[0]} order={order} setOrder={setOrder} />}
          <Options tool={tool} options={options} setOptions={setOptions} />
          {error && (
            <div className="ft-error" role="alert">
              {error}
            </div>
          )}
          {state === "processing" ? (
            <div className="ft-progress">
              <div style={{ width: `${progress}%` }} />
              <span>{statusMsg || `جارٍ المعالجة... ${progress}%`}</span>
            </div>
          ) : (
            <button
              className="ft-run"
              disabled={!files.length || (organize && !order.length)}
              onClick={run}
            >
              تنفيذ {tool.name}
            </button>
          )}
        </section>
      )}
      <aside className="ft-privacy">
        <b>خصوصية وأمان 100%</b>
        <p>تتم كافة معالجات الـ PDF داخل متصفحك مباشرة عبر محرك WebAssembly؛ لا نرفع ملفاتك ولا نخزنها.</p>
      </aside>
    </main>
  );
}
