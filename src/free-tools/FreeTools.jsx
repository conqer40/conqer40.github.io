import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiDollarSign, FiDownload, FiFile, FiGlobe, FiGrid, FiImage, FiSearch, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import { pdfTools, toolBySlug } from "./pdfTools.jsx";
import { downloadBlob, getPageThumbnails, imagesToPdf, merge, pdfToDocx, pdfToJpg, splitToZip, transformPdf } from "./pdfEngine.js";
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
    title: "حزمة أدوات PDF المتكاملة (12 أداة)",
    enTitle: "Complete PDF Utilities Suite",
    desc: "دمج عدة ملفات PDF في ملف واحد، تقسيم واستخراج الصفحات، ضغط وتقليل الحجم، إضافة علامة مائية لحماية الملكية، ترقيم الصفحات، تحويل صور JPG/PNG إلى PDF، وتدوير الصفحات بسرعة وأمان تام.",
    to: "/free-tools/pdf-tools",
    icon: FiFile,
    iconBg: "linear-gradient(135deg, #c2410c, #f97316)",
    badge: "12 أداة مجانية",
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
  const [q,setQ]=useState(""); const filtered=useMemo(()=>pdfTools.filter(t=>`${t.name} ${t.en} ${t.description}`.toLowerCase().includes(q.toLowerCase())),[q]);
  return <main className="ft-page"><section className="ft-hero pdf"><span>Free Tools / PDF</span><h1>أدوات PDF المجانية</h1><p>معالجة آمنة وسريعة داخل المتصفح؛ ملفاتك لا تغادر جهازك.</p><label className="ft-search"><FiSearch/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن أداة..."/></label></section><div className="ft-grid">{filtered.map(t=><Link key={t.id} to={`/free-tools/pdf-tools/${t.slug}`} className="ft-card"><span><t.icon/></span><div><h2>{t.name}</h2><small>{t.en}</small><p>{t.description}</p></div><FiArrowLeft/></Link>)}</div>{!filtered.length&&<div className="ft-empty">لا توجد أداة مطابقة لبحثك.</div>}</main>;
}

function Dropzone({ files, setFiles, images, multiple }) {
  const input=useRef(); const accept=images?"image/jpeg,image/png":"application/pdf";
  const add=(list)=>{const incoming=[...list].filter(f=>images?/image\/(jpeg|png)/.test(f.type):f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf"));setFiles(multiple?[...files,...incoming]:incoming.slice(0,1));};
  return <><div className="ft-drop" role="button" tabIndex="0" onKeyDown={e=>{if(e.key==="Enter")input.current.click()}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();add(e.dataTransfer.files)}} onClick={()=>input.current.click()}><FiUploadCloud/><h2>اسحب الملفات هنا</h2><p>أو اضغط لاختيار {images?"صور JPG / PNG":"ملفات PDF"} من جهازك</p><button type="button">اختيار الملفات</button><input ref={input} hidden type="file" accept={accept} multiple={multiple} onChange={e=>add(e.target.files)}/></div>{files.length>0&&<div className="ft-files">{files.map((f,i)=><div key={`${f.name}-${i}`} draggable={multiple} onDragStart={e=>e.dataTransfer.setData("index",i)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData("index"));if(from===i)return;const next=[...files],item=next.splice(from,1)[0];next.splice(i,0,item);setFiles(next)}}><FiFile/><span><b>{f.name}</b><small>{bytes(f.size)}</small></span><button aria-label="إزالة الملف" onClick={()=>setFiles(files.filter((_,x)=>x!==i))}><FiX/></button></div>)}</div>}</>;
}

function Options({tool,options,setOptions}){
 const set=(key,value)=>setOptions({...options,[key]:value});
 if(tool.id==="pdf-to-word") return <div className="ft-options"><label>نمط التحويل <select value={options.mode||"auto"} onChange={e=>set("mode",e.target.value)}><option value="auto">ذكي تلقائي (نصوص مباشرة + OCR للصفحات المصورة)</option><option value="text">نص رقمي مباشر (فائق السرعة)</option><option value="ocr">التعرف الضوئي OCR (للكتب والملفات الممسوحة)</option></select></label>{(options.mode==="ocr"||!options.mode||options.mode==="auto")&&<label>لغة التعرف OCR <select value={options.ocrLang||"ara+eng"} onChange={e=>set("ocrLang",e.target.value)}><option value="ara+eng">العربية + الإنجليزية (شامل وموصى به)</option><option value="ara">العربية فقط</option><option value="eng">الإنجليزية فقط</option></select></label>}</div>;
 if(["extract","remove","duplicate","rotate","crop"].includes(tool.id)) return <div className="ft-options"><label>الصفحات <input value={options.ranges||""} onChange={e=>set("ranges",e.target.value)} placeholder="مثال: 1-3, 5, 8-10"/></label>{tool.id==="rotate"&&<label>زاوية التدوير <select value={options.angle||90} onChange={e=>set("angle",e.target.value)}><option>90</option><option>180</option><option>270</option></select></label>}{tool.id==="crop"&&<label>الهامش بالنقاط <input type="number" min="0" value={options.margin||20} onChange={e=>set("margin",e.target.value)}/></label>}</div>;
 if(tool.id==="split") return <div className="ft-options"><label className="check"><input type="checkbox" checked={!!options.eachPage} onChange={e=>set("eachPage",e.target.checked)}/> كل صفحة في ملف مستقل</label>{!options.eachPage&&<label>المجموعات (افصل بينها بـ ;) <input value={options.ranges||"1-3;4-6"} onChange={e=>set("ranges",e.target.value)} placeholder="1-3;4-6;7"/></label>}</div>;
 if(tool.id==="watermark") return <div className="ft-options"><label>نص العلامة <input value={options.text||"Elhawy AI"} onChange={e=>set("text",e.target.value)}/></label><label>حجم الخط <input type="number" value={options.fontSize||42} onChange={e=>set("fontSize",e.target.value)}/></label><label>الشفافية <input type="range" min=".1" max=".9" step=".1" value={options.opacity||.3} onChange={e=>set("opacity",e.target.value)}/></label></div>;
 if(tool.id==="page-numbers") return <div className="ft-options"><label>رقم البداية <input type="number" value={options.start||1} onChange={e=>set("start",e.target.value)}/></label><label>الموضع <select value={options.position||"center"} onChange={e=>set("position",e.target.value)}><option value="center">المنتصف</option><option value="right">يمين</option><option value="left">يسار</option></select></label><label>حجم الخط <input type="number" value={options.fontSize||12} onChange={e=>set("fontSize",e.target.value)}/></label></div>;
 if(tool.id==="images-to-pdf") return <div className="ft-options"><label>حجم الصفحة <select value={options.size||"a4"} onChange={e=>set("size",e.target.value)}><option value="a4">A4</option><option value="fit">حسب الصورة</option></select></label><label>الاتجاه <select value={options.orientation||"portrait"} onChange={e=>set("orientation",e.target.value)}><option value="portrait">رأسي</option><option value="landscape">أفقي</option></select></label><label>الهامش <input type="number" min="0" value={options.margin||20} onChange={e=>set("margin",e.target.value)}/></label></div>;
 return null;
}

function Organizer({file,order,setOrder,rotations={},setRotations=()=>{},canRotate=false}){
 const [pages,setPages]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;setLoading(true);getPageThumbnails(file).then(x=>{if(live){setPages(x);setOrder(x.map(p=>p.index));}}).finally(()=>setLoading(false));return()=>{live=false}},[file]);
 if(loading)return <div className="ft-loading">جارٍ تجهيز صور الصفحات...</div>;
 return <div className="ft-pages">{order.map((idx,pos)=>{const p=pages.find(x=>x.index===idx);return <div key={`${idx}-${pos}`} draggable onDragStart={e=>e.dataTransfer.setData("pos",pos)} onDragOver={e=>e.preventDefault()} onDrop={e=>{const from=Number(e.dataTransfer.getData("pos")),next=[...order],item=next.splice(from,1)[0];next.splice(pos,0,item);setOrder(next)}}><img style={{transform:`rotate(${rotations[pos]||0}deg)`}} src={p?.url} alt={`صفحة ${idx+1}`}/><b>صفحة {idx+1}</b><button aria-label="حذف الصفحة" onClick={()=>setOrder(order.filter((_,i)=>i!==pos))}><FiTrash2/></button>{canRotate&&<button style={{left:"auto",right:14,background:"#e7fbfa",color:"#078f99"}} aria-label="تدوير الصفحة" onClick={()=>setRotations({...rotations,[pos]:((rotations[pos]||0)+90)%360})}>↻</button>}</div>})}</div>;
}

export function PdfToolPage(){
 const {slug}=useParams(),tool=toolBySlug(slug),[files,setFiles]=useState([]),[options,setOptions]=useState({}),[order,setOrder]=useState([]),[rotations,setRotations]=useState({}),[state,setState]=useState("idle"),[error,setError]=useState(""),[progress,setProgress]=useState(0),[statusMsg,setStatusMsg]=useState(""),[result,setResult]=useState(null);
 useEffect(()=>{if(tool)document.title=`${tool.en} - Free PDF Tool | Elhawy AI`;return()=>{document.title="Elhawy AI"}},[tool]);
 if(!tool)return <main className="ft-page"><div className="ft-empty">الأداة غير موجودة.</div></main>;
 const many=tool.mode==="multi"||tool.mode==="images"; const organize=["organize","reorder"].includes(tool.id);
 const run=async()=>{if(!files.length)return setError("اختر ملفًا أولًا.");setState("processing");setError("");setProgress(8);setStatusMsg("");try{let data,name="result.pdf",type="application/pdf";if(tool.id==="pdf-to-word"){const res=await pdfToDocx(files[0],options,(pct,msg)=>{setProgress(pct);if(msg)setStatusMsg(msg);});data=res.blob;name=`${files[0].name.replace(/\.[^/.]+$/,"")}.docx`;type="application/vnd.openxmlformats-officedocument.wordprocessingml.document";}else if(tool.id==="merge")data=await merge(files);else if(tool.id==="images-to-pdf")data=await imagesToPdf(files,options);else if(tool.id==="pdf-to-jpg"){data=await pdfToJpg(files[0],setProgress);name="pdf-images.zip";type="application/zip";}else if(tool.id==="split"){data=await splitToZip(files[0],options.ranges||"",options.eachPage,setProgress);name="split-pdf.zip";type="application/zip";}else data=await transformPdf(files[0],tool.id,{...options,order,rotations});setProgress(100);setResult({data,name,type});setState("done");}catch(e){setError(e.message||"تعذر معالجة الملف.");setState("idle");}};
 const reset=()=>{setFiles([]);setOptions({});setOrder([]);setRotations({});setResult(null);setState("idle");setProgress(0);setStatusMsg("");setError("");};
 return <main className="ft-page ft-tool"><Link className="ft-back" to="/free-tools/pdf-tools"><FiArrowLeft/> كل أدوات PDF</Link><header><span><tool.icon/></span><div><small>{tool.en}</small><h1>{tool.name}</h1><p>{tool.description} تتم المعالجة على جهازك ولا يتم رفع الملف.</p></div></header>{state==="done"?<section className="ft-result"><span><FiCheck/></span><h2>الملف جاهز للتحميل</h2><p>اكتملت العملية بنجاح ولم يتم إرسال ملفك لأي خادم.</p><button onClick={()=>downloadBlob(result.data,result.name,result.type)}><FiDownload/> تحميل النتيجة</button><button className="secondary" onClick={reset}>بدء عملية جديدة</button></section>:<section className="ft-workspace"><Dropzone files={files} setFiles={setFiles} images={tool.mode==="images"} multiple={many}/>{files[0]&&organize&&<Organizer file={files[0]} order={order} setOrder={setOrder}/>}<Options tool={tool} options={options} setOptions={setOptions}/>{error&&<div className="ft-error" role="alert">{error}</div>}{state==="processing"?<div className="ft-progress"><div style={{width:`${progress}%`}}/><span>{statusMsg||`جارٍ المعالجة... ${progress}%`}</span></div>:<button className="ft-run" disabled={!files.length||(organize&&!order.length)} onClick={run}>تنفيذ {tool.name}</button>}</section>}<aside className="ft-privacy"><b>خصوصية كاملة</b><p>كل العمليات تتم داخل متصفحك. لا نرفع ملفاتك ولا نخزنها.</p></aside></main>;
}
