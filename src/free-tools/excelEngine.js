import * as XLSX from "xlsx";
import { tafqeetArabic, tafqeetEnglish } from "./tafqeetEngine.js";

/**
 * Read and parse Excel (.xlsx, .xls) or CSV file
 */
export async function parseSpreadsheet(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetNames = workbook.SheetNames;
  const firstSheet = workbook.Sheets[sheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

  // Extract headers and rows
  const headers = (rawData[0] || []).map((h, i) => (h ? String(h) : `عمود ${i + 1}`));
  const rows = rawData.slice(1).map((r) => {
    const rowObj = {};
    headers.forEach((h, i) => {
      rowObj[h] = r[i] !== undefined ? r[i] : "";
    });
    return rowObj;
  });

  return {
    sheetNames,
    headers,
    rows: rows.slice(0, 500), // Preview up to 500 rows
    totalRows: rows.length,
    workbook,
  };
}

/**
 * Apply Tafqeet (Number to Words) on a specific numeric column in an Excel Sheet
 * and export an updated .xlsx file
 */
export function addTafqeetColumnToExcel(fileBuffer, sheetName, colName, currency = "EGP", lang = "ar") {
  const workbook = XLSX.read(fileBuffer, { type: "array" });
  const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const tafqeetColTitle = lang === "ar" ? `تفقيط (${colName})` : `In Words (${colName})`;

  const updatedData = jsonData.map((row) => {
    const val = parseFloat(row[colName]);
    let words = "";
    if (!isNaN(val)) {
      words = lang === "ar"
        ? tafqeetArabic(val, { currency })
        : tafqeetEnglish(val, { currency });
    }
    return {
      ...row,
      [tafqeetColTitle]: words,
    };
  });

  const newSheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets[sheetName || workbook.SheetNames[0]] = newSheet;

  const outBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([outBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

/**
 * Export JSON array of objects to Excel (.xlsx)
 */
export function exportJsonToExcel(data, filename = "Elhawy_AI_Export.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const outBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([outBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

/**
 * Built-in Rule-Based Excel Formula Generator (Fast offline assistant)
 */
function localFormulaAssistant(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("جمع") || p.includes("مجموع") || p.includes("sum")) {
    if (p.includes("شرط") || p.includes("إذا") || p.includes("if")) {
      return {
        formula: `=SUMIFS(C:C, A:A, "الشرط", B:B, ">0")`,
        title: "دالة الجمع متعدد الشروط (SUMIFS)",
        explanation: "تستخدم دالة SUMIFS لجمع نطاق معين (مثل العمود C) فقط عند تحقق شرط أو أكثر في أعمدة أخرى (مثل العمود A و B).",
        steps: [
          "النطاق الأول: نطاق الخلايا التي تريد جمع قيمها (مثال C:C)",
          "النطاق الثاني: نطاق معيار الفحص الأول (مثال A:A)",
          "القيمة الثالثة: الشرط المراد مطابقته (مثال 'ناجح' أو 'القاهرة')",
        ],
      };
    }
    return {
      formula: `=SUM(A1:A100)`,
      title: "دالة الجمع البسيط (SUM)",
      explanation: "تجمع جميع الأرقام والقيم الموجودة داخل النطاق المحدد.",
    };
  }

  if (p.includes("بحث") || p.includes("ابحث") || p.includes("vlookup") || p.includes("xlookup") || p.includes("سعر")) {
    return {
      formula: `=XLOOKUP(A2, D:D, E:E, "غير موجود", 0)`,
      title: "دالة البحث الحديثة والذكية (XLOOKUP)",
      explanation: "دالة XLOOKUP هي البديل الأقوى والأحدث لدالتي VLOOKUP و HLOOKUP، وتبحث في أي اتجاه (يميناً أو يساراً) ولا تتأثر بإعادة ترتيب الأعمدة.",
      steps: [
        "A2: القيمة التي تبحث عنها (مثل كود المنتج أو الرقم القومي)",
        "D:D: عمود البحث الذي يحتوي على الأكواد",
        "E:E: عمود النتيجة المراد إرجاع قيمته (مثل السعر أو الاسم)",
        "'غير موجود': القيمة البديلة في حالة عدم العثور على نتيجة",
      ],
    };
  }

  if (p.includes("متوسط") || p.includes("average") || p.includes("معدل")) {
    return {
      formula: `=AVERAGE(B2:B50)`,
      title: "دالة حساب المتوسط الحسابي (AVERAGE)",
      explanation: "تحسب متوسط القيم الرقمية في النطاق المحدد متجاهلة الخلايا الفارغة.",
    };
  }

  if (p.includes("عد") || p.includes("عدد") || p.includes("count")) {
    return {
      formula: `=COUNTIF(A:A, "مكتمل")`,
      title: "دالة العد بشرط (COUNTIF)",
      explanation: "تعد عدد الخلايا التي تطابق معياراً محدداً.",
    };
  }

  return {
    formula: `=IF(A2>=50, "ناجح", "راسب")`,
    title: "دالة الشرط المنطقي (IF)",
    explanation: "تتحقق من تحقق شرط معين، فإذا كان صحيحاً تُرجع قيمة (ناجح) وإذا كان خاطئاً تُرجع قيمة أخرى (راسب).",
  };
}

/**
 * Gemini AI Integration for Excel Queries
 */
export async function askGeminiExcel(prompt, userApiKey = "") {
  const apiKey = userApiKey.trim();

  // If no Gemini API key provided, use the built-in intelligent assistant
  if (!apiKey) {
    return {
      source: "local",
      ...localFormulaAssistant(prompt),
    };
  }

  const systemPrompt = `أنت خبير محترف ومستشار معتمد في مايكروسوفت إكسيل (Microsoft Excel) وجداول بيانات Google Sheets ومحرر أكواد VBA.
مهمتك: مساعدة المستخدمين في:
1. توليد صيغ ومعادلات إكسيل الدقيقة للغاية مع شرح كيفية استخدامها.
2. تصحيح أخطاء الدوال (مثل #N/A, #VALUE!, #REF!).
3. كتابة أكواد ماكرو VBA عند الطلب.
أجب دائماً بلغة عربية تقنية واضحة ومنسقة بنقاط وعناوين وكود جاهز للنسخ.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `سؤال المستخدم عن الإكسيل:\n${prompt}` },
        ],
      },
    ],
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || "خطأ في الاتصال بـ Gemini API");
    }

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract first formula if enclosed in markdown code block
    const formulaMatch = replyText.match(/`(=[^`]+)`/) || replyText.match(/```(?:excel)?\n(=[^\n]+)\n```/);
    const formula = formulaMatch ? formulaMatch[1] : "";

    return {
      source: "gemini",
      formula,
      rawText: replyText,
    };
  } catch (err) {
    console.warn("Gemini API call failed, falling back to built-in rules:", err);
    return {
      source: "local_fallback",
      error: `تعذر الاتصال بـ Gemini API (${err.message})، تم توليد الصيغة عبر المساعد المدمج:`,
      ...localFormulaAssistant(prompt),
    };
  }
}
