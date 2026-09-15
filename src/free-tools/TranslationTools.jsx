import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDownload,
  FiFileText,
  FiGlobe,
  FiMic,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUploadCloud,
  FiVolume2,
  FiBookOpen,
  FiLayers,
} from "react-icons/fi";
import {
  SUPPORTED_LANGUAGES,
  isArabicText,
  translateText,
  translatePdfDocument,
  exportToDocx,
} from "./translationEngine.js";
import { downloadBlob } from "./pdfEngine.js";
import "./free-tools.css";

// Curated Glossary of AI & Technology Terms for Elhawy AI
const AI_GLOSSARY = [
  {
    en: "Artificial Intelligence (AI)",
    ar: "الذكاء الاصطناعي",
    cat: "ذكاء اصطناعي",
    def: "محاكاة الذكاء البشري في الآلات وبرمجتها للتفكير والتعلم وحل المشكلات.",
  },
  {
    en: "Machine Learning (ML)",
    ar: "تعلم الآلة",
    cat: "تعلم الآلة",
    def: "فرع من الذكاء الاصطناعي يمكّن الأنظمة من التعلم وتحسين أدائها تلقائياً من البيانات دون برمجة صريحة.",
  },
  {
    en: "Deep Learning (DL)",
    ar: "التعلم العميق",
    cat: "تعلم الآلة",
    def: "مجال فرعي من تعلم الآلة يعتمد على شبكات عصبية اصطناعية متعددة الطبقات لمعالجة الأنماط المعقدة.",
  },
  {
    en: "Large Language Models (LLM)",
    ar: "النماذج اللغوية الكبيرة",
    cat: "نماذج لغوية",
    def: "نماذج ذكاء اصطناعي مدرّبة على كميات ضخمة من النصوص لفهم وتوليد اللغة البشرية بدقة عالية.",
  },
  {
    en: "Prompt Engineering",
    ar: "هندسة الأوامر والتوجيه",
    cat: "ذكاء اصطناعي",
    def: "فن وعلم صياغة الأوامر والمدخلات بدقة لتوجيه نماذج الذكاء الاصطناعي للحصول على أفضل وأدق النتائج.",
  },
  {
    en: "Generative AI",
    ar: "الذكاء الاصطناعي التوليدي",
    cat: "ذكاء اصطناعي",
    def: "أنظمة AI قادرة على إنشاء محتوى جديد كالنصوص والصور والأكواد البرمجية والموسيقى.",
  },
  {
    en: "Neural Networks",
    ar: "الشبكات العصبية الاصطناعية",
    cat: "تعلم الآلة",
    def: "بنى برمجية مستوحاة من الشبكات العصبية الحيوية في الدماغ البشري، تتكون من عقد وطبقات مترابطة.",
  },
  {
    en: "Natural Language Processing (NLP)",
    ar: "معالجة اللغات الطبيعية",
    cat: "لغويات حاسوبية",
    def: "مجال يجمع بين علوم الحاسوب واللغويات والـ AI لتمكين الحواسيب من فهم النصوص والكلام البشري.",
  },
  {
    en: "Computer Vision",
    ar: "الرؤية الحاسوبية",
    cat: "ذكاء اصطناعي",
    def: "مجال يمكن الحواسيب من تحليل واستخراج معلومات ذات معنى من الصور والفيديوهات الرقمية.",
  },
  {
    en: "Reinforcement Learning (RL)",
    ar: "التعلم المعزز",
    cat: "تعلم الآلة",
    def: "طريقة تعلم تدرب الآلة عبر التجربة والخطأ والمكافأة والعقاب لتحقيق أقصى نتيجة ممكنة.",
  },
  {
    en: "Transformer Architecture",
    ar: "معمارية المحوّلات (ترانسفورمر)",
    cat: "نماذج لغوية",
    def: "معمارية التعلم العميق الرائدة المعتمدة على آلية الانتباه الذاتي، وهي أساس نماذج GPT وغيرها.",
  },
  {
    en: "RAG (Retrieval-Augmented Generation)",
    ar: "التوليد المعزز بالاسترجاع",
    cat: "ذكاء اصطناعي",
    def: "تقنية تعزز مخرجات نموذج اللغة عبر استرجاع حقائق موثوقة من قاعدة معرفية خارجية قبل الإجابة.",
  },
  {
    en: "Fine-Tuning",
    ar: "الضبط الدقيق والتخصيص",
    cat: "تعلم الآلة",
    def: "تدريب نموذج لغوي عام ومدرّب مسبقاً على مجموعة بيانات متخصصة لتحسين أدائه في مهمة محددة.",
  },
  {
    en: "Token / Tokenization",
    ar: "التوكن / التقطيع المعجمي",
    cat: "نماذج لغوية",
    def: "تقطيع النصوص إلى وحدات لغوية أصغر (كلمات، مقاطع، أحرف) لمعالجتها في النماذج اللغوية.",
  },
  {
    en: "Zero-Shot Learning",
    ar: "التعلم دون أمثلة مسبقة",
    cat: "تعلم الآلة",
    def: "قدرة النموذج على إنجاز مهمة جديدة دون تدريب مباشر على أمثلة سابقة لها.",
  },
  {
    en: "Few-Shot Learning",
    ar: "التعلم بأمثلة قليلة",
    cat: "تعلم الآلة",
    def: "تزويد النموذج ببضعة أمثلة توضيحية داخل موجه الأوامر لفهم النمط المطلوب وتطبيقه.",
  },
  {
    en: "Overfitting",
    ar: "فرط التخصيص / الملاءمة الزائدة",
    cat: "تعلم الآلة",
    def: "حالة يحفظ فيها النموذج بيانات التدريب بدقة شديدة مما يضعف قدرته على التعميم لبيانات جديدة.",
  },
  {
    en: "API (Application Programming Interface)",
    ar: "واجهة برمجة التطبيقات",
    cat: "برمجة",
    def: "جسر برمجي يتيح لتطبيقين أو خدمتين التواصل وتبادل البيانات والوظائف بسلاسة.",
  },
  {
    en: "Embedding / Vector Embedding",
    ar: "التضمين الشعاعي / المتجهي",
    cat: "نماذج لغوية",
    def: "تحويل النصوص والكلمات إلى متجهات وأرقام رياضية في فضاء متعدد الأبعاد لتمثيل المعنى الدلالي.",
  },
  {
    en: "Inference",
    ar: "الاستدلال / التشغيل الفعلي",
    cat: "ذكاء اصطناعي",
    def: "مرحلة تطبيق النموذج المدرّب بالفعل على مدخلات جديدة لاستخراج التنبؤات والنتائج.",
  },
  {
    en: "Hallucination",
    ar: "هلوسة الذكاء الاصطناعي",
    cat: "نماذج لغوية",
    def: "توليد النموذج لمعلومات أو حقائق خاطئة أو غير دقيقة بثقة تامة وكأنها صحيحة.",
  },
  {
    en: "Optical Character Recognition (OCR)",
    ar: "التعرف الضوئي على الحروف",
    cat: "رؤية حاسوبية",
    def: "تقنية تحويل المستندات الممسوحة ضوئياً والصور إلى نصوص رقمية قابلة للبحث والتحرير.",
  },
];

export function TranslationToolsPage() {
  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'pdf' | 'glossary'

  // Text Translator State
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ar");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [tone, setTone] = useState("general");

  // PDF Translator State
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfStatus, setPdfStatus] = useState("");
  const [isTranslatingPdf, setIsTranslatingPdf] = useState(false);
  const [translatedDoc, setTranslatedDoc] = useState(null);
  const [pdfError, setPdfError] = useState("");

  // Glossary Search
  const [glossaryQuery, setGlossaryQuery] = useState("");

  const filteredGlossary = useMemo(() => {
    const q = glossaryQuery.toLowerCase().trim();
    if (!q) return AI_GLOSSARY;
    return AI_GLOSSARY.filter(
      (item) =>
        item.en.toLowerCase().includes(q) ||
        item.ar.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q) ||
        item.def.toLowerCase().includes(q)
    );
  }, [glossaryQuery]);

  // Swap Languages
  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Perform Text Translation
  const handleTranslate = async (textToTranslate = sourceText) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);
    setError("");

    try {
      let finalInput = textToTranslate;
      if (tone === "academic") {
        // Can adjust context if needed
      }
      const result = await translateText(finalInput, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الترجمة.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Speech Synthesis
  const handleSpeak = (text, lang) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  // Download translated text as .txt
  const handleDownloadTxt = (text, filename = "translation.txt") => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, filename, "text/plain");
  };

  // Download translated text as .docx
  const handleDownloadDocx = async (text, filename = "translation.docx") => {
    const pages = [{ pageNumber: 1, original: sourceText, translated: text }];
    const blob = await exportToDocx(pages, "ترجمة - Elhawy AI", true);
    downloadBlob(blob, filename, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  };

  // PDF Translation Handlers
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      setPdfFile(file);
      setTranslatedDoc(null);
      setPdfError("");
    }
  };

  const handleTranslatePdf = async () => {
    if (!pdfFile) return;
    setIsTranslatingPdf(true);
    setPdfError("");
    setPdfProgress(5);
    setPdfStatus("جارٍ قراءة وفحص صفحات المستند...");

    try {
      const results = await translatePdfDocument(
        pdfFile,
        sourceLang,
        targetLang,
        (pct, msg) => {
          setPdfProgress(pct);
          if (msg) setPdfStatus(msg);
        }
      );
      setTranslatedDoc(results);
      setPdfStatus("اكتملت الترجمة بنجاح!");
    } catch (err) {
      setPdfError(err.message || "تعذر ترجمة المستند، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsTranslatingPdf(false);
    }
  };

  const handleDownloadTranslatedDocx = async () => {
    if (!translatedDoc) return;
    const blob = await exportToDocx(
      translatedDoc,
      `ترجمة مستند: ${pdfFile.name.replace(/\.[^/.]+$/, "")}`,
      true
    );
    downloadBlob(
      blob,
      `${pdfFile.name.replace(/\.[^/.]+$/, "")}-translated.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const handleUseGlossaryTerm = (item) => {
    setSourceLang("en");
    setTargetLang("ar");
    setSourceText(item.en);
    setTranslatedText(item.ar);
    setActiveTab("text");
  };

  return (
    <main className="ft-page translation-page">
      <Link className="ft-back" to="/free-tools">
        <FiArrowLeft /> العودة لكل الأدوات المجانية
      </Link>

      <section className="ft-hero translation-hero">
        <div className="hero-pill-tag">
          <FiGlobe /> أدوات الذكاء الاصطناعي والترجمة
        </div>
        <h1>مركز الترجمة والمستندات الذكي</h1>
        <p>
          ترجمة فورية متطورة للنصوص، ترجمة وقراءة ملفات PDF، وتحويل المستندات إلى
          Word مع معجم مصطلحات البرمجة والـ AI.
        </p>
      </section>

      {/* Tabs Navigation */}
      <div className="translation-tabs-bar">
        <button
          className={`trans-tab ${activeTab === "text" ? "active" : ""}`}
          onClick={() => setActiveTab("text")}
        >
          <FiGlobe /> مترجم النصوص الفوري
        </button>
        <button
          className={`trans-tab ${activeTab === "pdf" ? "active" : ""}`}
          onClick={() => setActiveTab("pdf")}
        >
          <FiFileText /> ترجمة ملفات PDF والمستندات
        </button>
        <button
          className={`trans-tab ${activeTab === "glossary" ? "active" : ""}`}
          onClick={() => setActiveTab("glossary")}
        >
          <FiBookOpen /> معجم مصطلحات AI والتقنية
        </button>
        <Link
          to="/free-tools/pdf-tools/pdf-to-word"
          className="trans-tab pdf-word-cta"
        >
          <FiLayers /> PDF إلى Word مع OCR عربي
        </Link>
      </div>

      {/* =========================================================
          TAB 1: INSTANT TEXT TRANSLATOR
          ========================================================= */}
      {activeTab === "text" && (
        <section className="translator-container">
          {/* Controls Bar */}
          <div className="translator-controls">
            <div className="lang-selectors">
              <div className="lang-select-box">
                <label>من</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                >
                  <option value="auto">اكتشاف تلقائي للغة</option>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="swap-lang-btn"
                onClick={handleSwap}
                title="تبديل اللغات"
              >
                ⇄
              </button>

              <div className="lang-select-box">
                <label>إلى</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="tone-selector">
              <span>الأسلوب:</span>
              <button
                type="button"
                className={`tone-pill ${tone === "general" ? "active" : ""}`}
                onClick={() => setTone("general")}
              >
                طبيعي
              </button>
              <button
                type="button"
                className={`tone-pill ${tone === "academic" ? "active" : ""}`}
                onClick={() => setTone("academic")}
              >
                أكاديمي ورسمي
              </button>
              <button
                type="button"
                className={`tone-pill ${tone === "tech" ? "active" : ""}`}
                onClick={() => setTone("tech")}
              >
                برمجي وتقني
              </button>
            </div>
          </div>

          {/* Translation Work Area */}
          <div className="translator-grid">
            {/* Source Box */}
            <div className="trans-box source-box">
              <div className="trans-box-header">
                <span>النص الأصلي</span>
                <div className="trans-box-tools">
                  {sourceText && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSpeak(sourceText, sourceLang)}
                        title="استماع"
                      >
                        <FiVolume2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceText("")}
                        title="مسح"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      const t = await navigator.clipboard.readText();
                      setSourceText(t);
                    }}
                    title="لصق من الحافظة"
                  >
                    لصق
                  </button>
                </div>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="اكتب أو الصق النص هنا للترجمة..."
                dir={isArabicText(sourceText) ? "rtl" : "ltr"}
                rows={9}
              />

              <div className="trans-box-footer">
                <small>{sourceText.length} حرف · {sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0} كلمة</small>
                <button
                  type="button"
                  className="trans-action-btn"
                  onClick={() => handleTranslate()}
                  disabled={isTranslating || !sourceText.trim()}
                >
                  {isTranslating ? (
                    <>
                      <FiRefreshCw className="spin" /> جارٍ الترجمة...
                    </>
                  ) : (
                    <>
                      <FiGlobe /> ترجم الآن
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Target Box */}
            <div className="trans-box target-box">
              <div className="trans-box-header">
                <span>الترجمة</span>
                <div className="trans-box-tools">
                  {translatedText && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSpeak(translatedText, targetLang)}
                        title="استماع"
                      >
                        <FiVolume2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(translatedText)}
                        title="نسخ الترجمة"
                        className={copied ? "copied" : ""}
                      >
                        {copied ? <FiCheck /> : <FiCopy />} {copied ? "تم النسخ" : "نسخ"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div
                className={`trans-output ${!translatedText ? "empty" : ""}`}
                dir={isArabicText(translatedText) ? "rtl" : "ltr"}
              >
                {translatedText || (
                  <span className="placeholder">ستظهر الترجمة هنا فوراً...</span>
                )}
              </div>

              <div className="trans-box-footer">
                <small>{translatedText.length} حرف</small>
                {translatedText && (
                  <div className="export-buttons">
                    <button
                      type="button"
                      onClick={() => handleDownloadDocx(translatedText)}
                      title="تحميل مستند Word (.docx)"
                    >
                      <FiDownload /> Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadTxt(translatedText)}
                      title="تحميل ملف نصي (.txt)"
                    >
                      <FiDownload /> نص (.txt)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <div className="ft-error">{error}</div>}
        </section>
      )}

      {/* =========================================================
          TAB 2: PDF & DOCUMENT TRANSLATOR
          ========================================================= */}
      {activeTab === "pdf" && (
        <section className="pdf-translator-container">
          <div className="pdf-trans-intro">
            <h2>ترجمة مستندات وملفات PDF الكاملة</h2>
            <p>
              ارفع ملف PDF بالإنجليزية أو بأي لغة وسيقوم المحرك باستخراج نصوصه
              وترجمتها صفحة بصفحة مع إمكانية تصدير المستند كاملاً كملف Microsoft
              Word (.docx) منسق ويدعم الاتجاه العربي بالكامل.
            </p>
          </div>

          {/* Upload Drop Area */}
          <div className="ft-drop" role="button" tabIndex="0">
            <FiUploadCloud />
            <h2>{pdfFile ? pdfFile.name : "اختر أو اسحب ملف PDF هنا"}</h2>
            <p>
              {pdfFile
                ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB · جاهز للترجمة`
                : "يدعم المستندات والكتب والأبحاث العلمية"}
            </p>
            <label className="trans-upload-btn">
              اختيار ملف PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handlePdfUpload}
              />
            </label>
          </div>

          {pdfFile && (
            <div className="pdf-trans-actions">
              <div className="lang-selectors">
                <div className="lang-select-box">
                  <label>لغة الملف</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                  >
                    <option value="auto">اكتشاف تلقائي</option>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="swap-lang-btn"
                  onClick={handleSwap}
                >
                  ⇄
                </button>

                <div className="lang-select-box">
                  <label>ترجمة إلى</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="ft-run"
                onClick={handleTranslatePdf}
                disabled={isTranslatingPdf}
              >
                {isTranslatingPdf ? (
                  <>
                    <FiRefreshCw className="spin" /> جارٍ المعالجة...
                  </>
                ) : (
                  <>
                    <FiGlobe /> ابدأ ترجمة المستند كاملاً
                  </>
                )}
              </button>
            </div>
          )}

          {isTranslatingPdf && (
            <div className="ft-progress">
              <div style={{ width: `${pdfProgress}%` }} />
              <span>{pdfStatus} ({pdfProgress}%)</span>
            </div>
          )}

          {pdfError && <div className="ft-error">{pdfError}</div>}

          {/* Translated Results View */}
          {translatedDoc && (
            <div className="pdf-translated-results">
              <div className="results-header">
                <div>
                  <h3>تمت ترجمة المستند بنجاح!</h3>
                  <p>عدد الصفحات: {translatedDoc.length} صفحة</p>
                </div>
                <div className="download-cta-group">
                  <button
                    type="button"
                    className="ft-download-btn primary"
                    onClick={handleDownloadTranslatedDocx}
                  >
                    <FiDownload /> تحميل المستند كـ Word (.docx)
                  </button>
                  <button
                    type="button"
                    className="ft-download-btn secondary"
                    onClick={() =>
                      handleDownloadTxt(
                        translatedDoc
                          .map((p) => `--- صفحة ${p.pageNumber} ---\n${p.translated}`)
                          .join("\n\n"),
                        `${pdfFile.name.replace(/\.[^/.]+$/, "")}-arabic.txt`
                      )
                    }
                  >
                    <FiDownload /> تحميل كـ نص (.txt)
                  </button>
                </div>
              </div>

              {/* Pages Preview */}
              <div className="pages-preview-list">
                {translatedDoc.map((p) => (
                  <div key={p.pageNumber} className="page-compare-card">
                    <div className="page-badge">الصفحة {p.pageNumber}</div>
                    <div className="page-compare-grid">
                      <div className="compare-col original">
                        <small>النص الأصلي</small>
                        <p>{p.original}</p>
                      </div>
                      <div className="compare-col translated">
                        <small>الترجمة العربية</small>
                        <p>{p.translated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 3: AI & TECH GLOSSARY
          ========================================================= */}
      {activeTab === "glossary" && (
        <section className="glossary-container">
          <div className="glossary-header">
            <h2>معجم مصطلحات الذكاء الاصطناعي والبرمجة</h2>
            <p>
              مرجع شامل لأهم مصطلحات الذكاء الاصطناعي وتكنولوجيا المعلومات
              وتعلم الآلة باللغتين العربية والإنجليزية مع شروحات دقيقة.
            </p>
            <div className="glossary-search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="ابحث عن مصطلح بالإنجليزية أو العربية (مثلاً: Prompt, LLM, Neural)..."
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="glossary-grid">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="glossary-card">
                <div className="glossary-card-top">
                  <span className="glossary-cat-tag">{item.cat}</span>
                  <button
                    type="button"
                    className="use-in-trans-btn"
                    onClick={() => handleUseGlossaryTerm(item)}
                    title="ترجم في المترجم"
                  >
                    ترجم <FiArrowLeft />
                  </button>
                </div>
                <h3>{item.en}</h3>
                <h4>{item.ar}</h4>
                <p>{item.def}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
