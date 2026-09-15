import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDollarSign,
  FiDownload,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiRefreshCw,
  FiVolume2,
  FiCode,
  FiLayers,
} from "react-icons/fi";
import {
  CURRENCIES,
  tafqeetArabic,
  tafqeetEnglish,
  generateExcelVbaCode,
} from "./tafqeetEngine.js";
import { addTafqeetColumnToExcel, parseSpreadsheet } from "./excelEngine.js";
import { downloadBlob } from "./pdfEngine.js";
import "./free-tools.css";

export function TafqeetPage() {
  const [activeTab, setActiveTab] = useState("single"); // 'single' | 'excel' | 'vba'
  const [amount, setAmount] = useState("15450.75");
  const [currency, setCurrency] = useState("EGP");
  const [grammaticalCase, setGrammaticalCase] = useState("nominative"); // 'nominative' | 'accusative'
  const [addPrefix, setAddPrefix] = useState(true);
  const [addSuffix, setAddSuffix] = useState(true);
  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedVba, setCopiedVba] = useState(false);

  // Excel batch state
  const [excelFile, setExcelFile] = useState(null);
  const [parsedExcel, setParsedExcel] = useState(null);
  const [selectedCol, setSelectedCol] = useState("");
  const [excelLang, setExcelLang] = useState("ar");
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [excelSuccess, setExcelSuccess] = useState(false);

  // Real-time Tafqeet Calculations
  const arabicResult = useMemo(() => {
    return tafqeetArabic(amount, {
      currency,
      grammaticalCase,
      addPrefix,
      addSuffix,
    });
  }, [amount, currency, grammaticalCase, addPrefix, addSuffix]);

  const englishResult = useMemo(() => {
    return tafqeetEnglish(amount, {
      currency,
      addSuffix,
    });
  }, [amount, currency, addSuffix]);

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "ar") {
      setCopiedAr(true);
      setTimeout(() => setCopiedAr(false), 2000);
    } else if (type === "en") {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    } else if (type === "vba") {
      setCopiedVba(true);
      setTimeout(() => setCopiedVba(false), 2000);
    }
  };

  const handleSpeak = (text, lang = "ar-SA") => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  // Excel File Upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setExcelSuccess(false);
      try {
        const parsed = await parseSpreadsheet(file);
        setParsedExcel(parsed);
        if (parsed.headers.length > 0) {
          setSelectedCol(parsed.headers[0]);
        }
      } catch (err) {
        alert("تعذر قراءة ملف الإكسيل، تأكد من صحة الملف.");
      }
    }
  };

  const handleProcessExcel = async () => {
    if (!excelFile || !selectedCol) return;
    setIsProcessingExcel(true);
    setExcelSuccess(false);

    try {
      const buffer = await excelFile.arrayBuffer();
      const newBlob = addTafqeetColumnToExcel(
        buffer,
        parsedExcel?.sheetNames?.[0],
        selectedCol,
        currency,
        excelLang
      );
      downloadBlob(
        newBlob,
        `${excelFile.name.replace(/\.[^/.]+$/, "")}_tafqeet.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      setExcelSuccess(true);
    } catch (err) {
      alert("حدث خطأ أثناء معالجة ملف الإكسيل: " + err.message);
    } finally {
      setIsProcessingExcel(false);
    }
  };

  const currentCurr = CURRENCIES[currency] || CURRENCIES.EGP;

  return (
    <main className="ft-page tafqeet-page">
      <Link className="ft-back" to="/free-tools">
        <FiArrowLeft /> العودة للأدوات المجانية
      </Link>

      <section className="ft-hero tafqeet-hero">
        <div className="hero-pill-tag">
          <FiDollarSign /> محرك التفقيط المالي المعتمد
        </div>
        <h1>محرك التفقيط المالي (بالعربية والإنجليزية)</h1>
        <p>
          تحويل المبالغ والأرقام إلى كلمات وحروف معتمدة للشيكات والفواتير
          والمعاملات البنكية مع خيارات الإعراب واختيار العملات وتطبيق التفقيط
          داخل ملفات الإكسيل.
        </p>
      </section>

      {/* Tabs */}
      <div className="translation-tabs-bar" style={{ marginTop: "24px" }}>
        <button
          className={`trans-tab ${activeTab === "single" ? "active" : ""}`}
          onClick={() => setActiveTab("single")}
        >
          <FiDollarSign /> تفقيط فوري ومباشر
        </button>
        <button
          className={`trans-tab ${activeTab === "excel" ? "active" : ""}`}
          onClick={() => setActiveTab("excel")}
        >
          <FiGrid /> تفقيط ملف Excel كامل
        </button>
        <button
          className={`trans-tab ${activeTab === "vba" ? "active" : ""}`}
          onClick={() => setActiveTab("vba")}
        >
          <FiCode /> كود دالة إكسيل (VBA Macro)
        </button>
        <Link to="/free-tools/excel-tools" className="trans-tab pdf-word-cta">
          <FiLayers /> مساعد إكسيل بالذكاء الاصطناعي
        </Link>
      </div>

      {/* =========================================================
          TAB 1: SINGLE TAFQEET
          ========================================================= */}
      {activeTab === "single" && (
        <section className="tafqeet-workspace">
          {/* Controls Bar */}
          <div className="tafqeet-controls-card">
            <div className="input-group-row">
              <div className="amount-input-box">
                <label>أدخل المبلغ أو الرقم</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="مثال: 15450.75"
                    className="amount-field"
                  />
                  <span className="curr-badge">{currentCurr.flag}</span>
                </div>
              </div>

              <div className="currency-select-box">
                <label>اختيار العملة</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="currency-dropdown"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="quick-amounts-bar">
              <span>أمثلة سريعة:</span>
              {[100, 1500, 25000, 100000, 250000.5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className="quick-num-btn"
                >
                  {v.toLocaleString("ar-EG")}
                </button>
              ))}
            </div>

            {/* Grammar & Format Options */}
            <div className="tafqeet-options-row">
              <div className="option-item">
                <label>حالة الإعراب (العربية):</label>
                <div className="segmented-btns">
                  <button
                    type="button"
                    className={grammaticalCase === "nominative" ? "active" : ""}
                    onClick={() => setGrammaticalCase("nominative")}
                  >
                    حالة الرفع (ألفان وخمسون)
                  </button>
                  <button
                    type="button"
                    className={grammaticalCase === "accusative" ? "active" : ""}
                    onClick={() => setGrammaticalCase("accusative")}
                  >
                    حالة النصب والجر (ألفين وخمسين)
                  </button>
                </div>
              </div>

              <div className="option-checks">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={addPrefix}
                    onChange={(e) => setAddPrefix(e.target.checked)}
                  />
                  إضافة كلمة "فقط" في البداية
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={addSuffix}
                    onChange={(e) => setAddSuffix(e.target.checked)}
                  />
                  إضافة كلمة "لا غير / Only" في النهاية
                </label>
              </div>
            </div>
          </div>

          {/* Result Cards */}
          <div className="tafqeet-results-grid">
            {/* Arabic Result Card */}
            <div className="tafqeet-card arabic">
              <div className="tafqeet-card-header">
                <div className="header-meta">
                  <span className="lang-pill">العربية 🇸🇦</span>
                  <h3>التفقيط المالي باللغة العربية</h3>
                </div>
                <div className="header-actions">
                  <button
                    type="button"
                    onClick={() => handleSpeak(arabicResult, "ar-SA")}
                    title="استماع صوتي"
                    className="action-btn"
                  >
                    <FiVolume2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(arabicResult, "ar")}
                    className={`action-btn copy ${copiedAr ? "copied" : ""}`}
                    title="نسخ التفقيط"
                  >
                    {copiedAr ? <FiCheck /> : <FiCopy />} {copiedAr ? "تم النسخ" : "نسخ"}
                  </button>
                </div>
              </div>
              <div className="tafqeet-text-display arabic-text" dir="rtl">
                {arabicResult}
              </div>
              <div className="tafqeet-card-footer">
                <small>معتمد للشيكات، أذونات الصرف، الفواتير، وسندات القبض</small>
              </div>
            </div>

            {/* English Result Card */}
            <div className="tafqeet-card english">
              <div className="tafqeet-card-header">
                <div className="header-meta">
                  <span className="lang-pill">English 🇺🇸</span>
                  <h3>Number to Words (English)</h3>
                </div>
                <div className="header-actions">
                  <button
                    type="button"
                    onClick={() => handleSpeak(englishResult, "en-US")}
                    title="Listen"
                    className="action-btn"
                  >
                    <FiVolume2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(englishResult, "en")}
                    className={`action-btn copy ${copiedEn ? "copied" : ""}`}
                    title="Copy"
                  >
                    {copiedEn ? <FiCheck /> : <FiCopy />} {copiedEn ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="tafqeet-text-display english-text" dir="ltr">
                {englishResult}
              </div>
              <div className="tafqeet-card-footer">
                <small>Official banking and commercial invoice format</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          TAB 2: EXCEL BATCH TAFQEET
          ========================================================= */}
      {activeTab === "excel" && (
        <section className="excel-batch-container">
          <div className="pdf-trans-intro">
            <h2>تفقيط عمود مبالغ كامل داخل ملف Excel بضغطة زر</h2>
            <p>
              ارفع ملف إكسيل (.xlsx أو .xls أو .csv) وسيقوم النظام بقراءة الأرقام في
              العمود المالي الذي تحدده وتوليد عمود جديد يحتوي على التفقيط بالكامل
              وتحميل الملف المحدث فوراً.
            </p>
          </div>

          <div className="ft-drop" role="button" tabIndex="0">
            <FiFileText style={{ fontSize: "48px", color: "#107c41" }} />
            <h2>{excelFile ? excelFile.name : "اختر أو اسحب ملف Excel هنا"}</h2>
            <p>
              {excelFile
                ? `${(excelFile.size / 1024).toFixed(1)} KB · جاهز للمعالجة`
                : "يدعم ملفات .xlsx و .xls و .csv"}
            </p>
            <label className="trans-upload-btn" style={{ background: "#107c41" }}>
              اختيار ملف Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleExcelUpload}
              />
            </label>
          </div>

          {parsedExcel && (
            <div className="excel-config-card">
              <h3>إعدادات التفقيط على الجدول:</h3>
              <div className="excel-config-grid">
                <div>
                  <label>اختر عمود المبالغ المالية:</label>
                  <select
                    value={selectedCol}
                    onChange={(e) => setSelectedCol(e.target.value)}
                  >
                    {parsedExcel.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>لغة التفقيط في الإكسيل:</label>
                  <select
                    value={excelLang}
                    onChange={(e) => setExcelLang(e.target.value)}
                  >
                    <option value="ar">اللغة العربية (فقط ... لا غير)</option>
                    <option value="en">اللغة الإنجليزية (In Words Only)</option>
                  </select>
                </div>

                <div>
                  <label>العملة المستخدمة:</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="ft-run"
                onClick={handleProcessExcel}
                disabled={isProcessingExcel}
                style={{ background: "#107c41" }}
              >
                {isProcessingExcel ? (
                  <>
                    <FiRefreshCw className="spin" /> جارٍ معالجة وتفقيط الملف...
                  </>
                ) : (
                  <>
                    <FiDownload /> معالجة وتحميل ملف Excel المحدث (.xlsx)
                  </>
                )}
              </button>

              {excelSuccess && (
                <div className="ft-result" style={{ marginTop: "20px", padding: "20px" }}>
                  <span style={{ width: "48px", height: "48px", fontSize: "24px" }}>
                    <FiCheck />
                  </span>
                  <h4 style={{ margin: "10px 0 4px", color: "#159447" }}>
                    تم إنشاء وتنزيل ملف الإكسيل مع عمود التفقيط بنجاح!
                  </h4>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 3: EXCEL VBA MACRO CODE
          ========================================================= */}
      {activeTab === "vba" && (
        <section className="vba-macro-container">
          <div className="pdf-trans-intro">
            <h2>كود دالة التفقيط لبرنامج مايكروسوفت إكسيل (VBA Function)</h2>
            <p>
              انسخ هذا الكود والصقه داخل محرر الماكرو (VBA) في ملف الإكسيل الخاص بك
              للحصول على دالة <code>=Tafqeet(A1)</code> مدمجة تعمل دون اتصال بالإنترنت
              وداخل جميع إصدارات Microsoft Excel.
            </p>
          </div>

          <div className="vba-code-box">
            <div className="vba-code-header">
              <span>كود VBA Macro جاهز للنسخ</span>
              <button
                type="button"
                className={`action-btn copy ${copiedVba ? "copied" : ""}`}
                onClick={() => handleCopy(generateExcelVbaCode(), "vba")}
              >
                {copiedVba ? <FiCheck /> : <FiCopy />}{" "}
                {copiedVba ? "تم النسخ بنجاح!" : "نسخ الكود بالكامل"}
              </button>
            </div>
            <pre className="code-display" dir="ltr">
              <code>{generateExcelVbaCode()}</code>
            </pre>
          </div>

          <div className="vba-instructions">
            <h3>خطوات تفعيل الدالة داخل الإكسيل:</h3>
            <ol>
              <li>افتح ملف الإكسيل واضغط من لوحة المفاتيح على <b>Alt + F11</b> لفتح محرر VBA.</li>
              <li>من القائمة العلوية اختر <b>Insert</b> ثم <b>Module</b>.</li>
              <li>الصق الكود المنسوخ أعلاه داخل النافذة واضغط حفظ.</li>
              <li>ارجع لورقة العمل واكتب في أي خلية: <code>=Tafqeet(A1, "EGP")</code> وسيتم تفقيط المبلغ فوراً!</li>
            </ol>
          </div>
        </section>
      )}
    </main>
  );
}
