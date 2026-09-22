import {
  FiCopy, FiCrop, FiDroplet, FiFile, FiFileText, FiGrid, FiHash, FiImage,
  FiLayers, FiRefreshCw, FiScissors, FiShuffle, FiTrash2, FiShield, FiLock,
  FiMaximize2, FiMinimize2, FiFeather, FiSun, FiMoon, FiEyeOff, FiCheckCircle,
  FiCode, FiInfo, FiSliders, FiPrinter, FiEdit3, FiDownload, FiUploadCloud
} from "react-icons/fi";

export const pdfCategories = [
  { id: "all", label: "جميع الأدوات", en: "All Tools" },
  { id: "organize", label: "تنظيم وترتيب", en: "Organize" },
  { id: "convert-to", label: "تحويل إلى PDF", en: "Convert to PDF" },
  { id: "convert-from", label: "تحويل من PDF", en: "Convert from PDF" },
  { id: "security", label: "الأمان والتوقيع", en: "Sign & Security" },
  { id: "view-edit", label: "العرض والتحرير", en: "View & Edit" },
  { id: "advanced", label: "أدوات متقدمة", en: "Advanced" },
];

export const pdfTools = [
  // --- Organize ---
  { id: "merge", slug: "merge-pdf", category: "organize", name: "دمج PDF", en: "Merge PDF", description: "ادمج عدة ملفات PDF بالترتيب الذي تختاره في ملف واحد متناسق.", icon: FiLayers, mode: "multi", popular: true },
  { id: "split", slug: "split-pdf", category: "organize", name: "تقسيم PDF", en: "Split PDF", description: "استخرج نطاقات محددة أو كل صفحة في ملف PDF مستقل.", icon: FiScissors, popular: true },
  { id: "organize", slug: "organize-pdf", category: "organize", name: "تنظيم وترتيب الصفحات", en: "Organize PDF", description: "لوحة مرئية بالسحب والإفلات لترتيب، تدوير، وحذف صفحات المستند.", icon: FiGrid },
  { id: "extract", slug: "extract-pdf-pages", category: "organize", name: "استخراج صفحات", en: "Extract Pages", description: "أنشئ مستند PDF جديد يحتوي فقط على الصفحات التي تختارها.", icon: FiCopy },
  { id: "remove", slug: "remove-pdf-pages", category: "organize", name: "حذف صفحات محددة", en: "Remove Pages", description: "احذف صفحات غير مرغوبة وصدّر نسخة نظيفة ومحدثة.", icon: FiTrash2 },
  { id: "rotate", slug: "rotate-pdf", category: "organize", name: "تدوير PDF", en: "Rotate PDF", description: "دوّر صفحات معينة أو كل الصفحات 90 أو 180 أو 270 درجة.", icon: FiRefreshCw },
  { id: "crop", slug: "crop-pdf", category: "organize", name: "قص الهوامش", en: "Crop PDF", description: "قص هوامش الصفحات بدقة وإزالة الأطراف الزائدة.", icon: FiCrop },
  { id: "scale-page", slug: "scale-page-size", category: "organize", name: "تغيير مقاس الصفحات", en: "Adjust Page Size/Scale", description: "عدّل مقاس الصفحات إلى معايير A4 أو Letter أو A3 مع ضبط أبعاد المحتوى.", icon: FiMaximize2 },
  { id: "multi-page", slug: "multi-page-layout", category: "organize", name: "تنسيق صفحات متعددة (N-Up)", en: "Multi-Page Layout", description: "ادمج صفحتين أو 4 صفحات في ورقة واحدة للطباعة وتوفير الورق.", icon: FiGrid },
  { id: "duplicate", slug: "duplicate-pdf-pages", category: "organize", name: "نسخ وتكرار صفحات", en: "Duplicate Pages", description: "كرّر صفحات معينة داخل المستند لإنشاء نماذج متعددة.", icon: FiCopy },

  // --- Convert to PDF ---
  { id: "images-to-pdf", slug: "images-to-pdf", category: "convert-to", name: "الصور إلى PDF", en: "Images to PDF", description: "حوّل مجموعة صور JPG و PNG إلى مستند PDF واحد أنيق ومرتب.", icon: FiImage, mode: "images", popular: true },
  { id: "markdown-to-pdf", slug: "markdown-to-pdf", category: "convert-to", name: "نصوص وماركداون إلى PDF", en: "Markdown to PDF", description: "حوّل نصوص الماركداون والتقارير إلى ملف PDF منسق وجاهز للطباعة.", icon: FiFileText },
  { id: "html-to-pdf", slug: "html-to-pdf", category: "convert-to", name: "HTML وكود إلى PDF", en: "HTML to PDF", description: "حوّل نصوص وأكواد وتنسيقات HTML وصفحات الويب إلى مستند PDF.", icon: FiCode },

  // --- Convert from PDF ---
  { id: "pdf-to-word", slug: "pdf-to-word", category: "convert-from", name: "PDF إلى Word (OCR)", en: "PDF to Word (OCR)", description: "حوّل ملف PDF إلى مستند Word (.docx) قابل للتحرير بالكامل مع دعم OCR عربي فائق الدقة.", icon: FiFileText, badge: "OCR عربي", popular: true },
  { id: "pdf-to-jpg", slug: "pdf-to-jpg", category: "convert-from", name: "PDF إلى صور عالية الجودة", en: "PDF to Image (JPG/PNG)", description: "حوّل كل صفحات المستند إلى صور عالية الدقة داخل ملف ZIP.", icon: FiImage, popular: true },
  { id: "pdf-to-text", slug: "pdf-to-text", category: "convert-from", name: "استخراج النصوص (PDF to Text)", en: "PDF to RTF / Text", description: "استخرج كافة النصوص المكتوبة في المستند إلى ملف نصي .txt أو RTF.", icon: FiFileText },
  { id: "pdf-to-csv", slug: "pdf-to-csv", category: "convert-from", name: "استخراج الجداول إلى CSV", en: "PDF to CSV", description: "استخرج البيانات الجدولية من المستند إلى جدول بيانات بصيغة CSV.", icon: FiSliders },
  { id: "pdf-to-html", slug: "pdf-to-html", category: "convert-from", name: "PDF إلى HTML", en: "PDF to HTML", description: "حوّل صفحات ومحتويات PDF إلى كود ويب وتنسيق HTML جاهز.", icon: FiCode },

  // --- Sign & Security ---
  { id: "sign-pdf", slug: "sign-pdf", category: "security", name: "توقيع المستند (Sign)", en: "Sign PDF", description: "ارسم توقيعك بيدك على الشاشة أو ارفع صورة التوقيع واختمها على أي صفحة.", icon: FiFeather, badge: "جديد", popular: true },
  { id: "watermark", slug: "watermark-pdf", category: "security", name: "إضافة علامة مائية", en: "Add Watermark", description: "أضف علامة مائية نصية مخصصة للتحكم بالملكية ومنع النسخ.", icon: FiDroplet },
  { id: "add-stamp", slug: "add-stamp-to-pdf", category: "security", name: "إضافة ختم معتمد (Stamp)", en: "Add Stamp to PDF", description: "أضف أختاماً رسمية (معتمد، سري، مسودة، مدفوع، مرفوض) بألوان مميزة.", icon: FiCheckCircle },
  { id: "redact-pdf", slug: "redact-pdf", category: "security", name: "تعتيم وتظليل النصوص (Redact)", en: "Auto / Manual Redact", description: "تغطية وتظليل البيانات الحساسة أو أرقام الهويات بأشرطة حجب سوداء.", icon: FiEyeOff },
  { id: "sanitize-pdf", slug: "sanitize-pdf", category: "security", name: "تنظيف المستند (Sanitize)", en: "Sanitize PDF", description: "احذف البيانات المخفية، الميتا داتا، والنصوص الوصفية الحساسة لحماية الأسرار.", icon: FiShield },

  // --- View & Edit ---
  { id: "ocr-cleanup", slug: "ocr-cleanup-scans", category: "view-edit", name: "OCR وتنظيف المسح الضوئي", en: "OCR / Cleanup Scans", description: "تعرف ضوئي على الحروف العربية والإنجليزية واستخراج النصوص من الوثائق المصورة.", icon: FiEyeOff, badge: "OCR عربي" },
  { id: "extract-images", slug: "extract-images-from-pdf", category: "view-edit", name: "استخراج جميع الصور", en: "Extract Images", description: "استخرج جميع الصور والرسومات المضمنة في صفحات الـ PDF في ملف ZIP.", icon: FiImage },
  { id: "change-metadata", slug: "change-pdf-metadata", category: "view-edit", name: "تعديل الميتا داتا (Metadata)", en: "Change Metadata", description: "عدّل عنوان المستند، اسم المؤلف، الموضوع، والكلمات المفتاحية للملف.", icon: FiEdit3 },
  { id: "pdf-info", slug: "pdf-document-info", category: "view-edit", name: "معلومات وإحصائيات المستند", en: "Get ALL Info on PDF", description: "كشف شامل عن حجم الصفحات، إصدار PDF، الخطوط، وعدد الكلمات والصور.", icon: FiInfo },
  { id: "invert-colors", slug: "invert-pdf-colors", category: "view-edit", name: "عكس الألوان والوضع الليلي", en: "Replace & Invert Colors", description: "اقلب ألوان صفحات الـ PDF إلى الوضع الليلي لقراءة مريحة وتوفير الحبر.", icon: FiMoon },
  { id: "page-numbers", slug: "add-page-numbers", category: "view-edit", name: "ترقيم الصفحات", en: "Add Page Numbers", description: "أضف أرقام صفحات أنيقة ومخصصة في أسفل أو أعلى المستند.", icon: FiHash },
  { id: "flatten-pdf", slug: "flatten-pdf", category: "view-edit", name: "تسطيح الحقول والتعليقات (Flatten)", en: "Flatten PDF", description: "ثبّت حقول النماذج والتعليقات لتصبح جزءاً ثابتاً من الصفحة لا يمكن تعديله.", icon: FiCheckCircle },
  { id: "remove-blank-pages", slug: "remove-blank-pages", category: "view-edit", name: "حذف الصفحات الفارغة تلقائياً", en: "Remove Blank Pages", description: "يكتشف ويحذف الصفحات البيضاء والخالية من المحتوى تلقائياً لتنظيف الملف.", icon: FiTrash2 },

  // --- Advanced ---
  { id: "compress-pdf", slug: "compress-pdf", category: "advanced", name: "ضغط وتقليل حجم PDF", en: "Compress PDF", description: "قلل حجم ملف الـ PDF بدرجات ضغط مخصصة لمشاركته بسهولة عبر الإيميل.", icon: FiMinimize2, popular: true },
  { id: "fake-scan", slug: "fake-scan-effect", category: "advanced", name: "تأثير السكانر والفاكس (Fake Scan)", en: "Fake Scan", description: "اجعل ملفك يبدو وكأنه مطبوع وممسوح ضوئياً بجهاز سكانر قديم مع تشويش وميلان طبيعي!", icon: FiPrinter, badge: "الميزة الأشهر", popular: true },
  { id: "adjust-contrast", slug: "adjust-pdf-contrast", category: "advanced", name: "ضبط التباين والسطوع", en: "Adjust Colors / Contrast", description: "حسّن وضوح النصوص الباهتة والمستندات القديمة بضبط التباين والسطوع.", icon: FiSun },
  { id: "repair-pdf", slug: "repair-pdf", category: "advanced", name: "إصلاح وترميم ملفات PDF", en: "Repair PDF", description: "إعادة بناء وتنظيف بنية الـ PDF لعلاج الملفات المعطوبة والتي لا تفتح.", icon: FiSliders },
  { id: "overlay-pdf", slug: "overlay-pdfs", category: "advanced", name: "تركيب ومطابقة ملفين (Overlay)", en: "Overlay PDFs", description: "ضع صفحة من ملف PDF فوق صفحة من ملف آخر كخلفية أو ترويسة رسمية.", icon: FiLayers }
];

export const toolBySlug = (slug) => pdfTools.find((tool) => tool.slug === slug);
