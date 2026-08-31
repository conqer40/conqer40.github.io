import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export const downloadBlob = (bytes, name, type = "application/pdf") => {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export const parseRanges = (value, pageCount) => {
  if (!value.trim()) return Array.from({ length: pageCount }, (_, i) => i);
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

const load = async (file) => PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
const saveSelected = async (source, indices) => {
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, indices);
  copied.forEach((p) => out.addPage(p));
  return out.save();
};

export async function merge(files) {
  const out = await PDFDocument.create();
  for (const file of files) {
    const doc = await load(file); const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => out.addPage(page));
  }
  return out.save();
}

export async function transformPdf(file, tool, options = {}) {
  const source = await load(file); const count = source.getPageCount();
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
    selected.forEach((i) => { const p = source.getPage(i); p.setRotation(degrees((p.getRotation().angle + Number(options.angle || 90)) % 360)); });
  }
  if (tool === "crop") {
    const margin = Math.max(0, Number(options.margin || 0));
    selected.forEach((i) => { const p = source.getPage(i), { width, height } = p.getSize(); if (margin * 2 >= Math.min(width, height)) throw new Error("قيمة القص أكبر من أبعاد الصفحة."); p.setCropBox(margin, margin, width - margin * 2, height - margin * 2); });
  }
  if (tool === "watermark") {
    const font = await source.embedFont(StandardFonts.Helvetica); const text = options.text || "Elhawy AI";
    source.getPages().forEach((p) => { const { width, height } = p.getSize(); const size = Number(options.fontSize || 42); p.drawText(text, { x: width / 2 - font.widthOfTextAtSize(text, size) / 2, y: height / 2, size, font, color: rgb(.08,.55,.62), opacity: Number(options.opacity || .3), rotate: degrees(Number(options.angle || -30)) }); });
  }
  if (tool === "page-numbers") {
    const font = await source.embedFont(StandardFonts.Helvetica); const start = Number(options.start || 1), size = Number(options.fontSize || 12);
    source.getPages().forEach((p, i) => { const text = String(start + i), { width } = p.getSize(); const x = options.position === "left" ? 28 : options.position === "right" ? width - 28 - font.widthOfTextAtSize(text,size) : width / 2 - font.widthOfTextAtSize(text,size)/2; p.drawText(text,{x,y:22,size,font,color:rgb(.08,.14,.28)}); });
  }
  return source.save();
}

export async function imagesToPdf(files, options = {}) {
  const doc = await PDFDocument.create(); const margin = Number(options.margin || 20);
  for (const file of files) {
    const bytes = await file.arrayBuffer(); const img = file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    let width = options.size === "a4" ? 595 : img.width + margin * 2; let height = options.size === "a4" ? 842 : img.height + margin * 2;
    if (options.orientation === "landscape") [width, height] = [height, width];
    const scale = Math.min((width-margin*2)/img.width,(height-margin*2)/img.height,1); const page = doc.addPage([width,height]);
    page.drawImage(img,{x:(width-img.width*scale)/2,y:(height-img.height*scale)/2,width:img.width*scale,height:img.height*scale});
  }
  return doc.save();
}

export async function pdfToJpg(file, onProgress) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; const zip = new JSZip();
  for (let i=1;i<=pdf.numPages;i++) { const page=await pdf.getPage(i), viewport=page.getViewport({scale:1.8}), canvas=document.createElement("canvas"); canvas.width=viewport.width; canvas.height=viewport.height; await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise; const blob=await new Promise((resolve)=>canvas.toBlob(resolve,"image/jpeg",.9)); zip.file(`page-${String(i).padStart(3,"0")}.jpg`,blob); onProgress?.(Math.round(i/pdf.numPages*90)); }
  return zip.generateAsync({type:"uint8array"},(m)=>onProgress?.(90+Math.round(m.percent/10)));
}

export async function splitToZip(file, ranges, eachPage, onProgress) {
  const source=await load(file), zip=new JSZip(), groups=eachPage?source.getPageIndices().map((i)=>[i]):ranges.split(";").map((g)=>parseRanges(g,source.getPageCount()));
  for(let i=0;i<groups.length;i++){ zip.file(`part-${i+1}.pdf`,await saveSelected(source,groups[i])); onProgress?.(Math.round((i+1)/groups.length*80)); }
  return zip.generateAsync({type:"uint8array"},(m)=>onProgress?.(80+Math.round(m.percent/5)));
}

export async function getPageThumbnails(file) {
  const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise, pages=[];
  for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),v=page.getViewport({scale:.28}),c=document.createElement("canvas");c.width=v.width;c.height=v.height;await page.render({canvasContext:c.getContext("2d"),viewport:v}).promise;pages.push({index:i-1,url:c.toDataURL("image/jpeg",.72)});} return pages;
}
