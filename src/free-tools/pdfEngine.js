import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export const downloadBlob = (bytes, name, type = "application/pdf") => {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export const parseRanges = (value, pageCount) => {
  if (!value || !value.trim()) return Array.from({ length: pageCount }, (_, i) => i);
  const pages = [];
  for (const token of value.split(",").map((x) => x.trim()).filter(Boolean)) {
    const match = token.match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`النطاق غير صحيح: ${token}`);
    const start = Number(match[1]), end = Number(match[2] || match[1]);
    if (start < 1 || end > pageCount || start > end) throw new Error(`النطاق خارج عدد الصفحات: ${token}`);
    for (let i = start; i <= end; i++) if (!pages.includes(i - 1)) pages.push(i - 1);
  }
  return pages;
};

const load = async (file) => PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

const saveSelected = async (source, indices) => {
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, indices);
  copied.forEach((p) => out.addPage(p));
  return out.save();
};

export async function merge(files) {
  const out = await PDFDocument.create();
  for (const file of files) {
    const doc = await load(file);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => out.addPage(page));
  }
  return out.save();
}

export async function transformPdf(file, tool, options = {}) {
  const source = await load(file);
  const count = source.getPageCount();
  const selected = parseRanges(options.ranges || "", count);

  if (tool === "extract") return saveSelected(source, selected);
  if (tool === "remove") {
    const keep = source.getPageIndices().filter((i) => !selected.includes(i));
    if (!keep.length) throw new Error("لا يمكن حذف كل الصفحات.");
    return saveSelected(source, keep);
  }
  if (tool === "duplicate") return saveSelected(source, [...source.getPageIndices(), ...selected]);
  if (tool === "reorder") return saveSelected(source, options.order || source.getPageIndices());
  if (tool === "organize") {
    const out = await PDFDocument.create();
    const copied = await out.copyPages(source, options.order || source.getPageIndices());
    if (!copied.length) throw new Error("يجب الاحتفاظ بصفحة واحدة على الأقل.");
    copied.forEach((page, position) => {
      const extra = Number(options.rotations?.[position] || 0);
      if (extra) page.setRotation(degrees((page.getRotation().angle + extra) % 360));
      out.addPage(page);
    });
    return out.save();
  }
  if (tool === "rotate") {
    selected.forEach((i) => {
      const p = source.getPage(i);
      p.setRotation(degrees((p.getRotation().angle + Number(options.angle || 90)) % 360));
    });
  }
  if (tool === "crop") {
    const margin = Math.max(0, Number(options.margin || 0));
    selected.forEach((i) => {
      const p = source.getPage(i);
      const { width, height } = p.getSize();
      if (margin * 2 >= Math.min(width, height)) throw new Error("قيمة القص أكبر من أبعاد الصفحة.");
      p.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
    });
  }
  if (tool === "watermark") {
    const font = await source.embedFont(StandardFonts.Helvetica);
    const text = options.text || "Elhawy AI";
    const size = Number(options.fontSize || 42);
    const opacity = Number(options.opacity || 0.3);
    const angle = Number(options.angle || -30);
    source.getPages().forEach((p) => {
      const { width, height } = p.getSize();
      p.drawText(text, {
        x: width / 2 - font.widthOfTextAtSize(text, size) / 2,
        y: height / 2,
        size,
        font,
        color: rgb(0.08, 0.55, 0.62),
        opacity,
        rotate: degrees(angle),
      });
    });
  }
  if (tool === "page-numbers") {
    const font = await source.embedFont(StandardFonts.Helvetica);
    const start = Number(options.start || 1);
    const size = Number(options.fontSize || 12);
    source.getPages().forEach((p, i) => {
      const text = String(start + i);
      const { width } = p.getSize();
      const x = options.position === "left"
        ? 28
        : options.position === "right"
        ? width - 28 - font.widthOfTextAtSize(text, size)
        : width / 2 - font.widthOfTextAtSize(text, size) / 2;
      p.drawText(text, { x, y: 22, size, font, color: rgb(0.08, 0.14, 0.28) });
    });
  }
  return source.save();
}

export async function imagesToPdf(files, options = {}) {
  const doc = await PDFDocument.create();
  const margin = Number(options.margin || 20);
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const img = file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    let width = options.size === "a4" ? 595 : img.width + margin * 2;
    let height = options.size === "a4" ? 842 : img.height + margin * 2;
    if (options.orientation === "landscape") [width, height] = [height, width];
    const scale = Math.min((width - margin * 2) / img.width, (height - margin * 2) / img.height, 1);
    const page = doc.addPage([width, height]);
    page.drawImage(img, {
      x: (width - img.width * scale) / 2,
      y: (height - img.height * scale) / 2,
      width: img.width * scale,
      height: img.height * scale,
    });
  }
  return doc.save();
}

export async function pdfToJpg(file, onProgress) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const zip = new JSZip();
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    zip.file(`page-${String(i).padStart(3, "0")}.jpg`, blob);
    onProgress?.(Math.round((i / pdf.numPages) * 90));
  }
  return zip.generateAsync({ type: "uint8array" }, (m) => onProgress?.(90 + Math.round(m.percent / 10)));
}

export async function splitToZip(file, ranges, eachPage, onProgress) {
  const source = await load(file);
  const zip = new JSZip();
  const groups = eachPage
    ? source.getPageIndices().map((i) => [i])
    : ranges.split(";").map((g) => parseRanges(g, source.getPageCount()));
  for (let i = 0; i < groups.length; i++) {
    zip.file(`part-${i + 1}.pdf`, await saveSelected(source, groups[i]));
    onProgress?.(Math.round(((i + 1) / groups.length) * 80));
  }
  return zip.generateAsync({ type: "uint8array" }, (m) => onProgress?.(80 + Math.round(m.percent / 5)));
}

export async function getPageThumbnails(file) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const v = page.getViewport({ scale: 0.28 });
    const c = document.createElement("canvas");
    c.width = v.width;
    c.height = v.height;
    await page.render({ canvasContext: c.getContext("2d"), viewport: v }).promise;
    pages.push({ index: i - 1, url: c.toDataURL("image/jpeg", 0.72) });
  }
  return pages;
}

/* =========================================================================
   STIRLING-PDF ADVANCED CLIENT-SIDE SUITE ADDITIONS
   ========================================================================= */

/**
 * 1. COMPRESS PDF
 * Re-samples page renders through canvas at user-chosen DPI/Quality for client-side compression.
 */
export async function compressPdf(file, options = {}, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const out = await PDFDocument.create();
  const scale = Number(options.scale || 1.2);
  const quality = Number(options.quality || 0.65);

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 88), `ضغط الصفحة ${i} من ${pdf.numPages}...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

    const imgBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    const imgBytes = await imgBlob.arrayBuffer();
    const embeddedImg = await out.embedJpg(imgBytes);

    const pdfPage = out.addPage([page.view[2], page.view[3]]);
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: page.view[2],
      height: page.view[3],
    });
  }

  onProgress(95, "تجهيز وحفظ الملف المضغوط...");
  return out.save();
}

/**
 * 2. FAKE SCAN / VINTAGE SCANNER EFFECT (Stirling-PDF Flagship Feature)
 * Gives clean digital PDFs a realistic, slightly skewed, vintage photocopier / scanner appearance!
 */
export async function fakeScanPdf(file, options = {}, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const out = await PDFDocument.create();
  const isGray = options.grayscale !== false;
  const addNoise = options.noise !== false;

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 85), `تطبيق تأثير السكانر على الصفحة ${i}...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.6 });

    // Main render canvas
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    // Random subtle tilt (-0.75deg to +0.75deg)
    const angleRad = (Math.random() * 1.5 - 0.75) * (Math.PI / 180);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angleRad);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Render original page
    await page.render({ canvasContext: ctx, viewport }).promise;
    ctx.restore();

    // Post-processing for scanner look
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    for (let p = 0; p < d.length; p += 4) {
      let r = d[p], g = d[p + 1], b = d[p + 2];

      if (isGray) {
        // High contrast grayscale photocopier
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = gray < 190 ? gray * 0.88 : Math.min(255, gray * 1.05); // boost text contrast
        r = g = b = gray;
      }

      if (addNoise && Math.random() < 0.08) {
        const noise = (Math.random() - 0.5) * 22;
        r = Math.min(255, Math.max(0, r + noise));
        g = Math.min(255, Math.max(0, g + noise));
        b = Math.min(255, Math.max(0, b + noise));
      }

      d[p] = r;
      d[p + 1] = g;
      d[p + 2] = b;
    }
    ctx.putImageData(imgData, 0, 0);

    const imgBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    const embeddedImg = await out.embedJpg(await imgBlob.arrayBuffer());

    const pdfPage = out.addPage([page.view[2], page.view[3]]);
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: page.view[2],
      height: page.view[3],
    });
  }

  onProgress(95, "تجهيز ملف الـ Scan النهائي...");
  return out.save();
}

/**
 * 3. INVERT COLORS / NIGHT MODE
 */
export async function invertColorsPdf(file, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const out = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 88), `عكس ألوان الصفحة ${i}...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.6 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    for (let p = 0; p < d.length; p += 4) {
      d[p] = 255 - d[p];
      d[p + 1] = 255 - d[p + 1];
      d[p + 2] = 255 - d[p + 2];
    }
    ctx.putImageData(imgData, 0, 0);

    const imgBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.9));
    const embeddedImg = await out.embedJpg(await imgBlob.arrayBuffer());

    const pdfPage = out.addPage([page.view[2], page.view[3]]);
    pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: page.view[2], height: page.view[3] });
  }

  return out.save();
}

/**
 * 4. ADJUST CONTRAST & BRIGHTNESS
 */
export async function adjustContrastPdf(file, options = {}, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const out = await PDFDocument.create();
  const contrast = Number(options.contrast || 135);
  const brightness = Number(options.brightness || 105);

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 88), `ضبط تباين الصفحة ${i}...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.6 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)`;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.9));
    const embeddedImg = await out.embedJpg(await imgBlob.arrayBuffer());

    const pdfPage = out.addPage([page.view[2], page.view[3]]);
    pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: page.view[2], height: page.view[3] });
  }

  return out.save();
}

/**
 * 5. PDF TO TEXT (TXT / RTF)
 */
export async function pdfToText(file, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 90), `استخراج نصوص الصفحة ${i}...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str).filter(Boolean);
    fullText += `\n=== صفحة ${i} ===\n` + strings.join(" ") + "\n";
  }

  return new TextEncoder().encode(fullText);
}

/**
 * 6. PDF TO CSV
 */
export async function pdfToCsv(file, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let csvRows = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 90), `استخراج جداول الصفحة ${i}...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lineMap = new Map();

    content.items.forEach((item) => {
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push(item.str);
    });

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
    sortedYs.forEach((y) => {
      const row = lineMap.get(y).map((c) => `"${c.replace(/"/g, '""')}"`).join(",");
      csvRows.push(row);
    });
  }

  return new TextEncoder().encode("\uFEFF" + csvRows.join("\n"));
}

/**
 * 7. PDF TO HTML
 */
export async function pdfToHtml(file, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"/><title>${file.name}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:850px;margin:30px auto;padding:20px;line-height:1.8;color:#1e293b}.page{border:1px solid #e2e8f0;border-radius:12px;padding:30px;margin-bottom:30px;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.04)}.p-head{font-weight:bold;color:#0284c7;border-bottom:1px solid #f1f5f9;padding-bottom:8px;margin-bottom:14px}</style></head><body>`;

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 90), `تحويل الصفحة ${i} إلى HTML...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str).filter(Boolean);
    html += `<div class="page"><div class="p-head">صفحة ${i}</div><p>${strings.join(" ")}</p></div>`;
  }

  html += `</body></html>`;
  return new TextEncoder().encode(html);
}

/**
 * 8. CHANGE METADATA
 */
export async function changeMetadata(file, options = {}) {
  const doc = await load(file);
  if (options.title) doc.setTitle(options.title);
  if (options.author) doc.setAuthor(options.author);
  if (options.subject) doc.setSubject(options.subject);
  if (options.keywords) doc.setKeywords(options.keywords.split(",").map((k) => k.trim()));
  doc.setProducer("Elhawy AI - Stirling PDF Suite");
  doc.setCreator("Elhawy AI");
  return doc.save();
}

/**
 * 9. GET PDF INFO & INSPECTOR
 */
export async function getPdfInfo(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const meta = await pdf.getMetadata().catch(() => ({}));
  const firstPage = await pdf.getPage(1);

  return {
    numPages: pdf.numPages,
    fileSize: `${(file.size / 1024).toFixed(1)} KB`,
    width: Math.round(firstPage.view[2]),
    height: Math.round(firstPage.view[3]),
    title: meta?.info?.Title || "غير محدد",
    author: meta?.info?.Author || "غير محدد",
    subject: meta?.info?.Subject || "غير محدد",
    creator: meta?.info?.Creator || "غير محدد",
    producer: meta?.info?.Producer || "غير محدد",
    creationDate: meta?.info?.CreationDate || "غير محدد",
    version: meta?.info?.PDFFormatVersion || "1.7",
  };
}

/**
 * 10. FLATTEN PDF FORMS & ANNOTATIONS
 */
export async function flattenPdf(file) {
  const doc = await load(file);
  try {
    const form = doc.getForm();
    form.flatten();
  } catch (_) {}
  return doc.save();
}

/**
 * 11. REMOVE BLANK PAGES AUTOMATICALLY
 */
export async function removeBlankPages(file, options = {}, onProgress = () => {}) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const nonBlankIndices = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(Math.round((i / pdf.numPages) * 75), `فحص الصفحة ${i} للكشف عن المحتوى...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    let darkPixels = 0;
    const totalPixels = d.length / 4;

    for (let p = 0; p < d.length; p += 4) {
      const lum = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
      if (lum < 235) darkPixels++; // non-white pixel
    }

    const darkRatio = darkPixels / totalPixels;
    if (darkRatio > 0.003) {
      nonBlankIndices.push(i - 1);
    }
  }

  if (!nonBlankIndices.length) {
    throw new Error("جميع صفحات المستند بيضاء وفارغة!");
  }

  const source = await load(file);
  return saveSelected(source, nonBlankIndices);
}

/**
 * 12. ADD OFFICIAL STAMP (معتمد / APPROVED / سري / CONFIDENTIAL)
 */
export async function addStampToPdf(file, options = {}) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const text = options.stampText || "APPROVED";
  const stampType = options.stampType || "approved";

  let stampColor = rgb(0.08, 0.65, 0.28); // Green
  if (stampType === "confidential" || stampType === "rejected") {
    stampColor = rgb(0.85, 0.12, 0.15); // Red
  } else if (stampType === "draft") {
    stampColor = rgb(0.2, 0.45, 0.85); // Blue
  }

  const pages = doc.getPages();
  const targetPages = options.allPages !== false ? pages : [pages[pages.length - 1]];

  targetPages.forEach((p) => {
    const { width, height } = p.getSize();
    const fontSize = 20;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const boxWidth = textWidth + 30;
    const boxHeight = 44;

    // Draw at top-left or top-right
    const x = width - boxWidth - 35;
    const y = height - boxHeight - 35;

    // Outer stamp rectangle
    p.drawRectangle({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      borderColor: stampColor,
      borderWidth: 2.5,
      rotate: degrees(options.angle || -8),
    });

    p.drawText(text, {
      x: x + 15,
      y: y + 13,
      size: fontSize,
      font,
      color: stampColor,
      rotate: degrees(options.angle || -8),
    });
  });

  return doc.save();
}

/**
 * 13. SIGN PDF (Signature stamp via canvas/image)
 */
export async function signPdf(file, signatureDataUrl, options = {}) {
  const doc = await load(file);
  const pages = doc.getPages();
  const pageIndex = Math.min(Math.max(0, Number(options.page || pages.length) - 1), pages.length - 1);
  const targetPage = pages[pageIndex];

  const imgBytes = await (await fetch(signatureDataUrl)).arrayBuffer();
  const sigImg = await doc.embedPng(imgBytes);

  const scale = Number(options.scale || 0.4);
  const sigWidth = sigImg.width * scale;
  const sigHeight = sigImg.height * scale;

  const { width } = targetPage.getSize();
  const x = Number(options.x || width - sigWidth - 45);
  const y = Number(options.y || 45);

  targetPage.drawImage(sigImg, {
    x,
    y,
    width: sigWidth,
    height: sigHeight,
  });

  return doc.save();
}

/**
 * 14. ADJUST PAGE SIZE / SCALE (A4, Letter, A3)
 */
export async function scalePageSize(file, options = {}) {
  const source = await load(file);
  const out = await PDFDocument.create();

  const standardSizes = {
    a4: [595.28, 841.89],
    letter: [612, 792],
    a3: [841.89, 1190.55],
    legal: [612, 1008],
  };

  const targetSize = standardSizes[options.size || "a4"] || standardSizes.a4;
  const count = source.getPageCount();

  for (let i = 0; i < count; i++) {
    const [embeddedPage] = await out.embedPdf(source, [i]);
    const page = out.addPage(targetSize);
    const scale = Math.min(targetSize[0] / embeddedPage.width, targetSize[1] / embeddedPage.height);
    page.drawPage(embeddedPage, {
      x: (targetSize[0] - embeddedPage.width * scale) / 2,
      y: (targetSize[1] - embeddedPage.height * scale) / 2,
      xScale: scale,
      yScale: scale,
    });
  }

  return out.save();
}

/**
 * 15. MULTI-PAGE LAYOUT (N-UP: 2-in-1, 4-in-1)
 */
export async function multiPageLayout(file, options = {}) {
  const source = await load(file);
  const out = await PDFDocument.create();
  const count = source.getPageCount();
  const layout = options.layout || "2-up"; // 2-up or 4-up

  if (layout === "2-up") {
    // 2 pages side-by-side on A4 Landscape (842 x 595)
    for (let i = 0; i < count; i += 2) {
      const sheet = out.addPage([841.89, 595.28]);
      const halfWidth = 841.89 / 2;

      const [p1] = await out.embedPdf(source, [i]);
      const s1 = Math.min((halfWidth - 30) / p1.width, (595.28 - 40) / p1.height);
      sheet.drawPage(p1, {
        x: (halfWidth - p1.width * s1) / 2 + 10,
        y: (595.28 - p1.height * s1) / 2,
        xScale: s1,
        yScale: s1,
      });

      if (i + 1 < count) {
        const [p2] = await out.embedPdf(source, [i + 1]);
        const s2 = Math.min((halfWidth - 30) / p2.width, (595.28 - 40) / p2.height);
        sheet.drawPage(p2, {
          x: halfWidth + (halfWidth - p2.width * s2) / 2 - 10,
          y: (595.28 - p2.height * s2) / 2,
          xScale: s2,
          yScale: s2,
        });
      }
    }
  } else {
    // 4 pages (2x2 grid) on A4 Portrait (595 x 842)
    for (let i = 0; i < count; i += 4) {
      const sheet = out.addPage([595.28, 841.89]);
      const halfW = 595.28 / 2;
      const halfH = 841.89 / 2;

      for (let slot = 0; slot < 4; slot++) {
        if (i + slot < count) {
          const [p] = await out.embedPdf(source, [i + slot]);
          const s = Math.min((halfW - 20) / p.width, (halfH - 20) / p.height);
          const col = slot % 2;
          const row = slot < 2 ? 1 : 0; // top or bottom
          sheet.drawPage(p, {
            x: col * halfW + (halfW - p.width * s) / 2,
            y: row * halfH + (halfH - p.height * s) / 2,
            xScale: s,
            yScale: s,
          });
        }
      }
    }
  }

  return out.save();
}

/**
 * 16. SANITIZE PDF (Strip sensitive metadata & attachments)
 */
export async function sanitizePdf(file) {
  const source = await load(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(source, source.getPageIndices());
  pages.forEach((p) => out.addPage(p));
  out.setTitle("");
  out.setAuthor("");
  out.setSubject("");
  out.setKeywords([]);
  out.setProducer("Sanitized PDF");
  out.setCreator("");
  return out.save();
}

/**
 * 17. REPAIR PDF (Clean rebuild of xref table & structure)
 */
export async function repairPdf(file) {
  const source = await load(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(source, source.getPageIndices());
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

/**
 * 18. OVERLAY / WATERMARK BACKGROUND PDF
 */
export async function overlayPdfs(files) {
  if (files.length < 2) throw new Error("يجب اختيار ملفين لتطبيق التركيب (Overlay).");
  const mainDoc = await load(files[0]);
  const overlayDoc = await load(files[1]);

  const [overlayPage] = await mainDoc.embedPdf(overlayDoc, [0]);
  mainDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawPage(overlayPage, {
      x: 0,
      y: 0,
      width,
      height,
      opacity: 0.6,
    });
  });

  return mainDoc.save();
}

/**
 * 19. EXTRACT IMAGES TO ZIP
 */
export async function extractImagesToZip(file, onProgress = () => {}) {
  return pdfToJpg(file, onProgress);
}

/**
 * 20. PDF TO WORD (with Arabic OCR support)
 */
export async function pdfToDocx(file, options = {}, onProgress = () => {}) {
  const ocrLang = options.ocrLang || "ara+eng";
  const mode = options.mode || "auto";
  const docData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: docData }).promise;
  const numPages = pdf.numPages;

  let worker = null;
  const getOcrWorker = async () => {
    if (!worker) {
      onProgress(10, "جارٍ تجهيز محرك التعرف الضوئي OCR (العربية والإنجليزية)...");
      worker = await createWorker(ocrLang);
    }
    return worker;
  };

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const allExtractedPages = [];

  for (let i = 1; i <= numPages; i++) {
    const baseProgress = Math.round(((i - 1) / numPages) * 85);
    onProgress(baseProgress + 5, `معالجة الصفحة ${i} من ${numPages}...`);
    const page = await pdf.getPage(i);

    let pageText = "";

    if (mode !== "ocr") {
      const textContent = await page.getTextContent();
      const strings = textContent.items.map((it) => it.str).filter(Boolean);
      pageText = strings.join(" ").replace(/\s+/g, " ").trim();
    }

    if (!pageText || pageText.length < 15 || mode === "ocr") {
      onProgress(baseProgress + 10, `تشغيل التعرف الضوئي OCR على صفحة ${i}...`);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

      try {
        const ocrWorker = await getOcrWorker();
        const ret = await ocrWorker.recognize(canvas);
        pageText = ret?.data?.text || "";
      } catch (ocrErr) {
        console.warn("OCR recognition error on page " + i, ocrErr);
      }
    }

    allExtractedPages.push({ pageNumber: i, text: pageText || "[لم يتم العثور على نص]" });
  }

  if (worker) {
    try {
      await worker.terminate();
    } catch (_) {}
  }

  onProgress(92, "جارٍ إنشاء مستند Microsoft Word (.docx)...");

  const paragraphs = [];
  paragraphs.push(
    new Paragraph({
      text: `مستند مستخرج: ${file.name.replace(/\.[^/.]+$/, "")}`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.RIGHT,
      bidirectional: true,
      spacing: { after: 200 },
    })
  );

  allExtractedPages.forEach((p) => {
    paragraphs.push(
      new Paragraph({
        text: `الصفحة ${p.pageNumber}`,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 240, after: 120 },
      })
    );

    const lines = p.text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) {
      paragraphs.push(
        new Paragraph({
          text: "[صفحة بدون نصوص]",
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
        })
      );
    } else {
      lines.forEach((line) => {
        const arabic = isArabic(line);
        paragraphs.push(
          new Paragraph({
            alignment: arabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
            bidirectional: arabic,
            children: [
              new TextRun({
                text: line,
                font: arabic ? "Traditional Arabic" : "Calibri",
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  onProgress(100, "اكتمل التحويل بنجاح!");
  return {
    blob,
    text: allExtractedPages.map((p) => `--- صفحة ${p.pageNumber} ---\n${p.text}`).join("\n\n"),
  };
}
