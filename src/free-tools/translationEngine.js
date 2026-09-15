import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export const SUPPORTED_LANGUAGES = [
  { code: "ar", name: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "en", name: "English (الإنجليزية)", dir: "ltr", flag: "🇺🇸" },
  { code: "fr", name: "Français (الفرنسية)", dir: "ltr", flag: "🇫🇷" },
  { code: "de", name: "Deutsch (الألمانية)", dir: "ltr", flag: "🇩🇪" },
  { code: "es", name: "Español (الإسبانية)", dir: "ltr", flag: "🇪🇸" },
  { code: "it", name: "Italiano (الإيطالية)", dir: "ltr", flag: "🇮🇹" },
  { code: "tr", name: "Türkçe (التركية)", dir: "ltr", flag: "🇹🇷" },
  { code: "ru", name: "Русский (الروسية)", dir: "ltr", flag: "🇷🇺" },
  { code: "zh-CN", name: "中文 (الصينية)", dir: "ltr", flag: "🇨🇳" },
  { code: "ja", name: "日本語 (اليابانية)", dir: "ltr", flag: "🇯🇵" },
];

export const isArabicText = (text) => /[\u0600-\u06FF]/.test(text);

/**
 * Single chunk translation using Google GTX endpoint with MyMemory fallback
 */
async function translateChunk(chunk, from = "auto", to = "ar") {
  if (!chunk.trim()) return "";
  
  // 1. Try Google Translate Client Endpoint
  try {
    const sl = from === "auto" ? "auto" : from;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${to}&dt=t&q=${encodeURIComponent(chunk)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0].map((item) => item[0]).join("");
      }
    }
  } catch (err) {
    console.warn("Primary translation endpoint failed, trying fallback...", err);
  }

  // 2. Fallback: MyMemory Translation API
  try {
    const sl = from === "auto" ? "en" : from;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk.slice(0, 500))}&langpair=${sl}|${to}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (fallbackErr) {
    console.warn("Fallback translation endpoint failed", fallbackErr);
  }

  throw new Error("تعذر إتمام الترجمة حالياً، يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.");
}

/**
 * Translates arbitrarily long text by splitting into safe chunks
 */
export async function translateText(text, from = "auto", to = "ar", onProgress = () => {}) {
  if (!text || !text.trim()) return "";

  // Split into manageable paragraphs / chunks (~800 characters)
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if ((currentChunk + "\n\n" + para).length > 800) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  const translatedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    onProgress(Math.round(((i + 1) / chunks.length) * 100));
    const res = await translateChunk(chunks[i], from, to);
    translatedChunks.push(res);
  }

  return translatedChunks.join("\n\n");
}

/**
 * Extract text page-by-page from a PDF file
 */
export async function extractPdfPages(file, onProgress = () => {}) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 100));
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => it.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ pageNumber: i, text: text || "[لا يوجد نص رقمي في هذه الصفحة]" });
  }

  return pages;
}

/**
 * Translate an entire PDF document and export as Word (.docx) or Text
 */
export async function translatePdfDocument(file, from = "auto", to = "ar", onProgress = () => {}) {
  onProgress(5, "جارٍ استخراج نصوص المستند...");
  const pages = await extractPdfPages(file, (p) => onProgress(Math.round(5 + p * 0.25), "استخراج النصوص من الصفحات..."));

  const translatedPages = [];
  for (let i = 0; i < pages.length; i++) {
    const pct = Math.round(30 + ((i + 1) / pages.length) * 60);
    onProgress(pct, `ترجمة الصفحة ${i + 1} من ${pages.length}...`);
    
    let trans = "";
    if (pages[i].text && !pages[i].text.includes("[لا يوجد نص")) {
      trans = await translateText(pages[i].text, from, to);
    } else {
      trans = "[صفحة فارغة أو ممسوحة ضوئياً - استخدم أداة PDF إلى Word مع OCR]";
    }
    translatedPages.push({
      pageNumber: pages[i].pageNumber,
      original: pages[i].text,
      translated: trans,
    });
  }

  onProgress(95, "جارٍ تجهيز الملفات النهائية...");
  return translatedPages;
}

/**
 * Export translated pages to a formatted Microsoft Word (.docx) blob
 */
export async function exportToDocx(pages, title = "مستند مترجم - Elhawy AI", isTranslated = true) {
  const paragraphs = [];

  // Title
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 300 },
    })
  );

  pages.forEach((p) => {
    paragraphs.push(
      new Paragraph({
        text: `الصفحة ${p.pageNumber}`,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 240, after: 120 },
      })
    );

    const content = isTranslated ? p.translated : p.original;
    const lines = (content || "").split("\n").map((l) => l.trim()).filter(Boolean);

    lines.forEach((line) => {
      const arabic = isArabicText(line);
      paragraphs.push(
        new Paragraph({
          alignment: arabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
          bidirectional: arabic,
          children: [
            new TextRun({
              text: line,
              font: arabic ? "Traditional Arabic" : "Calibri",
              size: 24, // 12pt
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
