import {
  FiCopy, FiCrop, FiDroplet, FiFile, FiGrid, FiHash, FiImage,
  FiLayers, FiRefreshCw, FiScissors, FiShuffle, FiTrash2,
} from "react-icons/fi";

export const pdfTools = [
  { id: "merge", slug: "merge-pdf", name: "دمج PDF", en: "Merge PDF", description: "ادمج عدة ملفات PDF بالترتيب الذي تختاره.", icon: FiLayers, mode: "multi" },
  { id: "split", slug: "split-pdf", name: "تقسيم PDF", en: "Split PDF", description: "استخرج نطاقات أو كل صفحة في ملف مستقل.", icon: FiScissors },
  { id: "organize", slug: "organize-pdf", name: "تنظيم PDF", en: "Organize PDF", description: "رتّب واحذف ودوّر الصفحات من لوحة مرئية.", icon: FiGrid },
  { id: "remove", slug: "remove-pdf-pages", name: "حذف صفحات PDF", en: "Remove PDF Pages", description: "احذف صفحات محددة وصدّر نسخة جديدة.", icon: FiTrash2 },
  { id: "reorder", slug: "reorder-pdf-pages", name: "إعادة ترتيب الصفحات", en: "Reorder PDF Pages", description: "غيّر ترتيب صفحات المستند بالسحب والإفلات.", icon: FiShuffle },
  { id: "rotate", slug: "rotate-pdf", name: "تدوير PDF", en: "Rotate PDF", description: "دوّر صفحات محددة 90 أو 180 أو 270 درجة.", icon: FiRefreshCw },
  { id: "crop", slug: "crop-pdf", name: "قص PDF", en: "Crop PDF", description: "قص هوامش الصفحات بقيم دقيقة.", icon: FiCrop },
  { id: "pdf-to-jpg", slug: "pdf-to-jpg", name: "PDF إلى JPG", en: "PDF to JPG", description: "حوّل الصفحات إلى صور عالية الجودة في ZIP.", icon: FiImage },
  { id: "images-to-pdf", slug: "images-to-pdf", name: "الصور إلى PDF", en: "Images to PDF", description: "حوّل JPG وPNG إلى ملف PDF مرتب.", icon: FiFile, mode: "images" },
  { id: "watermark", slug: "watermark-pdf", name: "علامة مائية", en: "Watermark PDF", description: "أضف نصًا شفافًا لكل الصفحات.", icon: FiDroplet },
  { id: "page-numbers", slug: "add-page-numbers", name: "ترقيم الصفحات", en: "Add Page Numbers", description: "أضف أرقامًا مع موضع وبداية مخصصين.", icon: FiHash },
  { id: "extract", slug: "extract-pdf-pages", name: "استخراج صفحات", en: "Extract Pages", description: "أنشئ PDF جديدًا من الصفحات المختارة.", icon: FiCopy },
  { id: "duplicate", slug: "duplicate-pdf-pages", name: "نسخ صفحات", en: "Duplicate Pages", description: "كرّر صفحات محددة داخل المستند.", icon: FiCopy },
];

export const toolBySlug = (slug) => pdfTools.find((tool) => tool.slug === slug);
