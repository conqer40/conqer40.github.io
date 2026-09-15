import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCode,
  FiCopy,
  FiDollarSign,
  FiDownload,
  FiFileText,
  FiGrid,
  FiKey,
  FiLayers,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiSliders,
  FiUploadCloud,
  FiZap,
} from "react-icons/fi";
import {
  askGeminiExcel,
  parseSpreadsheet,
  exportJsonToExcel,
} from "./excelEngine.js";
import { downloadBlob } from "./pdfEngine.js";
import "./free-tools.css";

const PRESET_PROMPTS = [
  {
    title: "جمع المبيعات بشرطين",
    prompt: "عايز أجمع عمود المبيعات (C) فقط إذا كان عمود الفرع (A) يساوي 'القاهرة' وعمود الحالة (B) يساوي 'مكتمل'.",
  },
  {
    title: "البحث عن السعر بكود المنتج",
    prompt: "ابحث عن كود المنتج المكتوب في الخلية A2 داخل جدول المنتجات وأرجع سعر الوحدة من عمود الأسعار.",
  },
  {
    title: "حساب نسبة الخصم والضريبة",
    prompt: "احسب السعر النهائي بعد تطبيق خصم 15% وإضافة ضريبة القيمة المضافة 14% على السعر الأساسي في الخلية B2.",
  },
  {
    title: "تحديد حالة الطالب (ناجح / راسب)",
    prompt: "إذا كان مجموع درجات الطالب في الخلية B2 أكبر من أو يساوي 50 اكتب 'ناجح' وإلا اكتب 'راسب'.",
  },
  {
    title: "استخراج القيم الفريدة بدون تكرار",
    prompt: "عايز استخرج قائمة بأسماء العملاء الفريدة بدون تكرار من العمود A وترتيبها أبجدياً.",
  },
];

export function ExcelToolsPage() {
  const [activeTab, setActiveTab] = useState("generator"); // 'generator' | 'debugger' | 'viewer'
  const [apiKey, setApiKey] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("elhawy_gemini_key") || ""
      : "";
  });
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Generator State
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Debugger State
  const [debugInput, setDebugInput] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState(null);

  // Spreadsheet Viewer State
  const [excelFile, setExcelFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Save API Key
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (typeof window !== "undefined") {
      localStorage.setItem("elhawy_gemini_key", newKey);
    }
    setShowKeyModal(false);
  };

  // Generate Formula
  const handleGenerate = async (query = userPrompt) => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setResult(null);

    try {
      const res = await askGeminiExcel(query, apiKey);
      setResult(res);
    } catch (err) {
      setResult({
        error: "حدث خطأ أثناء معالجة الطلب: " + err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Debug Formula
  const handleDebug = async () => {
    if (!debugInput.trim()) return;
    setIsDebugging(true);
    setDebugResult(null);

    try {
      const prompt = `افحص هذه الصيغة أو المشكلة في إكسيل واشرح سبب الخطأ وقدم الصيغة الصحيحة البديلة:\n${debugInput}`;
      const res = await askGeminiExcel(prompt, apiKey);
      setDebugResult(res);
    } catch (err) {
      setDebugResult({
        error: "حدث خطأ أثناء فحص الصيغة: " + err.message,
      });
    } finally {
      setIsDebugging(false);
    }
  };

  // Copy Formula
  const handleCopyFormula = (f) => {
    if (!f) return;
    navigator.clipboard.writeText(f);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  // Upload Spreadsheet
  const handleUploadSpreadsheet = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setIsLoadingFile(true);
      try {
        const parsed = await parseSpreadsheet(file);
        setParsedData(parsed);
      } catch (err) {
        alert("تعذر فتح ملف الإكسيل، تأكد من سلامة الملف.");
      } finally {
        setIsLoadingFile(false);
      }
    }
  };

  const filteredRows = parsedData?.rows?.filter((r) => {
    if (!searchQuery) return true;
    return Object.values(r).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <main className="ft-page excel-tools-page">
      <Link className="ft-back" to="/free-tools">
        <FiArrowLeft /> العودة لكل الأدوات المجانية
      </Link>

      <section className="ft-hero excel-hero">
        <div className="hero-pill-tag">
          <FiGrid /> استوديو إكسيل المدمج بالذكاء الاصطناعي
        </div>
        <h1>مساعد إكسيل الذكي (Excel AI Studio)</h1>
        <p>
          توليد صيغ ومعادلات Microsoft Excel و Google Sheets المعقدة، شرح وتصحيح
          الأخطاء، وتصفح وتحليل جداول البيانات مع إمكانية ربط Gemini API مجاناً.
        </p>
      </section>

      {/* Gemini API Key Bar */}
      <div className="api-key-bar">
        <div className="api-key-status">
          <FiKey className={apiKey ? "key-active" : "key-inactive"} />
          <span>
            {apiKey ? (
              <b>Gemini API متصل ومفعل ⚡ (أداء ذكي فائق)</b>
            ) : (
              <span>المساعد المدمج يعمل محلياً (يمكنك إضافة مفتاح Gemini API لميزات ذكاء غير محدودة)</span>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className="api-key-btn"
        >
          {apiKey ? "تعديل مفتاح Gemini" : "إضافة مفتاح Gemini API (مجاني)"}
        </button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="key-modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="key-modal" onClick={(e) => e.stopPropagation()}>
            <h3>إعداد مفتاح Google Gemini API</h3>
            <p>
              احصل على مفتاح مجاني من <b>Google AI Studio</b> لتمكين أذكى نماذج
              Gemini 1.5 في صياغة معادلاتك المعقدة وماكرو الإكسيل.
            </p>
            <input
              type="password"
              placeholder="ألصق مفتاحك هنا (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="key-input"
            />
            <div className="modal-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveApiKey(apiKey)}
              >
                حفظ المفتاح
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowKeyModal(false)}
              >
                إلغاء
              </button>
            </div>
            <small>المفتاح يُحفظ في متصفحك فقط ولا يتم إرساله لأي خادم وسيط.</small>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="translation-tabs-bar" style={{ marginTop: "24px" }}>
        <button
          className={`trans-tab ${activeTab === "generator" ? "active" : ""}`}
          onClick={() => setActiveTab("generator")}
        >
          <FiZap /> مولد المعادلات بالذكاء الاصطناعي
        </button>
        <button
          className={`trans-tab ${activeTab === "debugger" ? "active" : ""}`}
          onClick={() => setActiveTab("debugger")}
        >
          <FiSliders /> شرح وتصحيح أخطاء الدوال
        </button>
        <button
          className={`trans-tab ${activeTab === "viewer" ? "active" : ""}`}
          onClick={() => setActiveTab("viewer")}
        >
          <FiGrid /> عارض ومحلل ملفات Excel
        </button>
        <Link to="/free-tools/tafqeet" className="trans-tab pdf-word-cta">
          <FiDollarSign /> محرك التفقيط المالي
        </Link>
      </div>

      {/* =========================================================
          TAB 1: FORMULA GENERATOR
          ========================================================= */}
      {activeTab === "generator" && (
        <section className="excel-generator-workspace">
          <div className="generator-input-card">
            <label>اكتب ما تريد حسابه باللغة العربية البسيطة:</label>
            <textarea
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="مثال: عايز اجمع المبيعات في العمود C إذا كان التاريخ في سنة 2026 واسم المندوب محمد في العمود A..."
            />

            {/* Presets */}
            <div className="preset-prompts-row">
              <span>أمثلة شائعة:</span>
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserPrompt(p.prompt);
                    handleGenerate(p.prompt);
                  }}
                  className="preset-btn"
                >
                  {p.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ft-run"
              onClick={() => handleGenerate()}
              disabled={isGenerating || !userPrompt.trim()}
              style={{ background: "#107c41", margin: "20px 0 0" }}
            >
              {isGenerating ? (
                <>
                  <FiRefreshCw className="spin" /> جارٍ صياغة المعادلة بالذكاء الاصطناعي...
                </>
              ) : (
                <>
                  <FiZap /> توليد صيغة الإكسيل الدقيقة
                </>
              )}
            </button>
          </div>

          {/* Generator Results */}
          {result && (
            <div className="excel-result-card">
              <div className="result-header">
                <h3>{result.title || "صيغة الإكسيل المقترحة"}</h3>
                <span className="source-tag">
                  {result.source === "gemini" ? "Gemini AI ⚡" : "مساعد إكسيل الذكي"}
                </span>
              </div>

              {result.formula && (
                <div className="formula-box">
                  <code>{result.formula}</code>
                  <button
                    type="button"
                    onClick={() => handleCopyFormula(result.formula)}
                    className={`copy-formula-btn ${copiedFormula ? "copied" : ""}`}
                  >
                    {copiedFormula ? <FiCheck /> : <FiCopy />} {copiedFormula ? "تم النسخ" : "نسخ المعادلة"}
                  </button>
                </div>
              )}

              {result.explanation && (
                <div className="explanation-section">
                  <h4>شرح عمل المعادلة:</h4>
                  <p>{result.explanation}</p>
                </div>
              )}

              {result.steps && (
                <div className="steps-section">
                  <h4>تفصيل المدخلات والمعاملات:</h4>
                  <ul>
                    {result.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.rawText && !result.formula && (
                <div className="raw-text-section" dir="rtl">
                  <p style={{ whiteSpace: "pre-wrap" }}>{result.rawText}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 2: FORMULA DEBUGGER & EXPLAINER
          ========================================================= */}
      {activeTab === "debugger" && (
        <section className="excel-debugger-workspace">
          <div className="generator-input-card">
            <label>الصق المعادلة التي بها مشكلة أو رمز الخطأ:</label>
            <textarea
              rows={3}
              value={debugInput}
              onChange={(e) => setDebugInput(e.target.value)}
              placeholder="مثال: =VLOOKUP(A2, D:E, 3, FALSE) أو خطأ #N/A أو #VALUE!..."
            />

            <button
              type="button"
              className="ft-run"
              onClick={handleDebug}
              disabled={isDebugging || !debugInput.trim()}
              style={{ background: "#0b5ed7", margin: "20px 0 0" }}
            >
              {isDebugging ? (
                <>
                  <FiRefreshCw className="spin" /> جارٍ الفحص والتشخيص...
                </>
              ) : (
                <>
                  <FiSliders /> فحص وتصحيح المعادلة
                </>
              )}
            </button>
          </div>

          {debugResult && (
            <div className="excel-result-card" style={{ marginTop: "20px" }}>
              <div className="result-header">
                <h3>تشخيص وتحليل الخطأ</h3>
                <span className="source-tag">تحليل الذكاء الاصطناعي</span>
              </div>

              {debugResult.rawText ? (
                <div className="raw-text-section" dir="rtl">
                  <p style={{ whiteSpace: "pre-wrap" }}>{debugResult.rawText}</p>
                </div>
              ) : (
                <div>
                  <p>{debugResult.explanation || "تم فحص الصيغة بنجاح."}</p>
                  {debugResult.formula && (
                    <div className="formula-box">
                      <code>{debugResult.formula}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyFormula(debugResult.formula)}
                        className="copy-formula-btn"
                      >
                        <FiCopy /> نسخ الصيغة المصححة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 3: SPREADSHEET VIEWER & ANALYZER
          ========================================================= */}
      {activeTab === "viewer" && (
        <section className="excel-viewer-workspace">
          <div className="ft-drop" role="button" tabIndex="0">
            <FiFileText style={{ fontSize: "46px", color: "#107c41" }} />
            <h2>{excelFile ? excelFile.name : "اختر أو اسحب ملف Excel / CSV لعرضه"}</h2>
            <p>معاينة سريعة، بحث في الصفوف، واستخراج وتصدير مباشر داخل المتصفح</p>
            <label className="trans-upload-btn" style={{ background: "#107c41" }}>
              اختيار ملف (.xlsx / .csv)
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleUploadSpreadsheet}
              />
            </label>
          </div>

          {isLoadingFile && (
            <div className="ft-loading" style={{ marginTop: "20px" }}>
              جارٍ فحص وتحليل جداول البيانات...
            </div>
          )}

          {parsedData && (
            <div className="spreadsheet-preview-card">
              <div className="preview-top-bar">
                <div className="table-stats">
                  <span>الأعمدة: {parsedData.headers.length}</span>
                  <span>الصفوف: {parsedData.totalRows} صف</span>
                </div>
                <div className="table-search-input">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="بحث سريع في الجدول..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="export-table-btn"
                  onClick={() => {
                    const blob = exportJsonToExcel(parsedData.rows);
                    downloadBlob(blob, `Export_${excelFile.name}`);
                  }}
                >
                  <FiDownload /> تصدير نسخة Excel
                </button>
              </div>

              <div className="spreadsheet-table-wrapper">
                <table className="excel-data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {parsedData.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows?.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="row-num">{rIdx + 1}</td>
                        {parsedData.headers.map((h, cIdx) => (
                          <td key={cIdx}>{row[h] !== undefined ? String(row[h]) : ""}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
