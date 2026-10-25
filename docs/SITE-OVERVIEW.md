# نظرة شاملة على موقع elhawyai.com

آخر مراجعة: 25 أكتوبر 2026. المشروع: `conqer40/conqer40.github.io` (مستودع الموقع الذي ينشر على `www.elhawyai.com`).

> ملاحظة على التغطية: هذا الملف يغطي كل المستودع من حيث **البنية والوظائف وقاعدة البيانات والنشر والمخاطر**، وقرأت بالتفصيل الملفات الأساسية (الراوتر، الهيدر، الحسابات، المخطط، Edge Function، الـ Worker، سير النشر، ملفات الاختبار والسكريبتات، صفحة "من أنا" الثابتة). ملفات التنسيق CSS الكبيرة وصفحات الأدوات المجانية التفصيلية قرأتها بالمسح لا بالسطر. الأجزاء دي موضحة في آخر الملف.

---

## 1. نظرة عامة

موقع شخصي لـ **محمد الحاوي** ثنائي اللغة (عربي/إنجليزي)، ويضم:

- ملف شخصي وسيرة ذاتية، ومشروعات (JARVIS، F.R.I.D.A.Y، ELHAWY AI).
- دليل أدوات ذكاء اصطناعي (كتالوج من 5,748 أداة).
- مقالات منشورة من قاعدة البيانات.
- مكتبة ملفات (Library) وفيديوهات تعليمية.
- أدوات مجانية تعمل داخل المتصفح (PDF، QR، صور، Excel، ترجمة، تفقيط).
- مساعد دراسي بالذكاء الاصطناعي مقيد بالمنهج.
- حساب مستخدم بالهاتف، ولوحة أدمن لإدارة المحتوى.

التقنيات: **React 19 + Vite 6 + React Router 7**، و**Supabase** (قاعدة بيانات، ومصادقة، وتخزين صور، وEdge Function)، والنشر على **GitHub Pages** مع ملف Worker للنشر على Cloudflare.

---

## 2. الخريطة: الصفحات والمسارات (من `src/App.jsx`)

| المسار | الصفحة | الوصف |
|---|---|---|
| `/` | `PersonalHome` | الصفحة الرئيسية: هيرو بصورة الشخصية، واختصارات للأقسام، ومشروعات، ومقالات، وفيديو مميز، وأدوات. |
| `/about` | ملف ثابت | "من أنا": صفحة البروتوفوليو الكاملة (انظر القسم 6). `/resume` يحوّل إليها. |
| `/projects/jarvis` | `JarvisPage` | شرح مشروع JARVIS (وكيل ذكاء اصطناعي). |
| `/projects/friday` | `FridayPage` | شرح مشروع F.R.I.D.A.Y (نظام تشغيل ذكاء اصطناعي سيادي). |
| `/ai` | `Home` (الكتالوج) | دليل أدوات الذكاء الاصطناعي: بحث وتصفية. |
| `/tools` | `Tools` | قائمة الأدوات. |
| `/categories`, `/category/:category` | `Categories`, `Category` | تصنيفات الأدوات. |
| `/tool/:id` | `Tool` | صفحة تفاصيل أداة (من `public/data/tool-details`). |
| `/articles`, `/articles/category/:slug`, `/articles/:slug` | `Articles`, `Article` | المقالات (من جدول `site_articles`). |
| `/library/item/:id`, `/library/category/:slug` | `LibraryItem`, `LibraryCategory` | مكتبة الملفات. `/library` يحوّل إلى `/articles`. |
| `/videos`, `/videos/:slug`, `/videos/watch/:slug` | `VideoLessons` … | دروس الفيديو. |
| `/free-tools` وفروعه | أدوات مجانية | انظر القسم 5. |
| `/study-ai` | `StudyAssistant` | المساعد الدراسي. |
| `/login`, `/profile` | تسجيل الدخول، والملف | انظر القسم 4. |
| `/contact` | `ContactPage` | نموذج/وسائل تواصل. |
| `/developers` | `Developers` | صفحة للمطورين. |
| `/admin/library` | `LibraryAdmin` | لوحة إدارة المكتبة (للأدمن فقط). |
| `*` | `Missing` | صفحة غير موجودة. |

ملاحظة: لا يوجد رابط "Projects" في الهيدر، لأن المشروعات معروضة في الصفحة الرئيسية (قرار مكتوب في `AGENTS.md`).

---

## 3. الهيدر والتنقل

- الشعار يودي للرئيسية.
- الروابط الأساسية: الرئيسية، من أنا، Elhawy AI، المقالات، الفيديوهات، أدوات مجانية، تواصل.
- زر حساب (`AccountNav`)، وزر تبديل اللغة **AR / EN**، وزر قائمة للموبايل.
- اللغة الافتراضية عربي، والاتجاه RTL.

---

## 4. الحسابات وتسجيل الدخول

**الآلية الحالية:** الدخول **بالهاتف** وليس بالإيميل:
- المستخدم يكتب رقم موبايل مصري من 11 رقم وكلمة سر.
- الكود يحوّل الرقم لإيميل وهمي داخلي: `<الرقم>@users.elhawy.local`، والأدمن: `01022104948@admin.elhawy.local`.
- عند التسجيل يُحفظ الاسم والهاتف في metadata، والـ trigger `handle_new_user` ينشئ صف في `profiles`.
- لو الحساب `active = false` يتم تسجيل الخروج تلقائياً.
- `/profile` لعرض البيانات وتعديلها.

**الصلاحيات:** الأدمن معرّف بالإيميل الثابت `01022104948@admin.elhawy.local` في سياسات RLS والـ trigger. المستخدم العادي يقرأ ويعدل صفه فقط، والـ trigger `protect_profile_admin_fields` يمنعه من تغيير `role` و`active` و`phone`.

**ملاحظات مهمة:**
- الهاتف `unique` في جدول `profiles`، فلو رقم مكرر ممكن يفشل التسجيل.
- **رقم الأدمن ظاهر في الكود والمستودع العام** (`UserAccount.jsx`، `schema.sql`). ده مش ثغرة في حد ذاته، لكن يفضل نقله لإعداد خارجي لو عايز تقلل المعلومات المكشوفة.

---

## 5. الأدوات المجانية (`/free-tools`)

كلها تعمل **داخل المتصفح** بدون رفع الملفات لسيرفر:

| الأداة | المسار | المكتبة |
|---|---|---|
| حزمة PDF (33 أداة): دمج، تقسيم، ضغط، توقيع، تحويل، OCR، Fake Scan، تنظيم الصفحات | `/free-tools/pdf-tools` | `pdf-lib`، `pdfjs-dist`، `tesseract.js` |
| QR Code (إنشاء وقراءة) | `/free-tools/qr-tools` | `qrcode`، `jsqr` |
| الصور ومعالجة الوسائط | `/free-tools/image-tools` | محركات داخلية |
| Excel AI Studio | `/free-tools/excel-tools` | `xlsx` |
| الترجمة والذكاء الاصطناعي للمستندات | `/free-tools/translation-tools` | `docx`، `jszip`، `translationEngine.js` |
| التفقيط المالي (تحويل الأرقام لكلام عربي/إنجليزي) | `/free-tools/tafqeet` | `tafqeetEngine.js` |

الفكرة العامة في كل الصفحات: رفع ملف → معالجة محلية → تحميل الناتج.

---

## 6. صفحة "من أنا" (البروتوفوليو)

الملفات: `public/about/index.html` و`main.js` و`style.css` (ثابتة، بدون React). وهي الصفحة الأكثر تفاعلاً في الموقع:

- **هيرو** بالاسم الكبير وبطاقة متحركة، وقائمة أيقونات (Dock) للقفز بين الأقسام.
- **أعمال مختارة (Selected work):** 6 كروت تفتح "ملف مشروع" كامل (السياق، النظرة العامة، الإمكانيات، الأدوات، المحاور). المشروعات: JARVIS، F.R.I.D.A.Y، ELHAWY AI، توثيق اللوجستيات، لعبة تيك توك، **Solo Learn** (الأخير مضاف حديثاً، وزرّه يفتح `/sololearn/`).
- **الخبرة:** مسار زمني (Elsalhy Group، Horizon، ELHAWY AI المستقل).
- **التعليم والشهادات** و**المهارات**.
- **قسم تواصل** بنموذج محادثة متحرك وروابط.
- تأثيرات: GSAP وScrollTrigger، وLenis للتمرير، وصوت تفاعلي بسيط مولّد بالكود (بدون ملفات صوت)، ومؤشر ماوس عادي.

**إصلاح تم:** شاشة التحميل السوداء كانت تبقى ظاهرة (وتخفي المؤشر) لو توقف السكريبت بخطأ. أضيف مؤقت 5 ثوانٍ يزيلها.

**ملحوظة:** السكريبت فيه خطأ قديم في حلقة الـ folders (`Cannot read properties of null (reading 'addEventListener')`) يوقف باقي الكود بعده. الإصلاح الآمن إن نلفّ الحلقة في try/catch، ولم أعمله بعد.

---

## 7. الصفحة الرئيسية (`PersonalHome.jsx`)

- هيرو: صورة الشخصية، واسم، ومقدمة، واختصارات (مشروعات، أدوات، فيديو…).
- قسم "مشروعات مختارة": كروت (F.R.I.D.A.Y، JARVIS، ELHAWY AI، **Solo Learn**، أدوات PDF). كارت Solo Learn يفتح `/sololearn/` بتحميل صفحة كامل (`reloadDocument`).
- منتجان: المساعد الذكي (`/study-ai`) وغيره.
- مقالات مميزة، وفيديو مميز، ومحتوى من المكتبة.
- عناصر مشتركة: `HomeMediaCard`، `HomeSectionIntro`، `HomeContentGrid`، `Resource`، `Project`.

---

## 8. المقالات والمكتبة والفيديوهات (من Supabase)

| الجدول | الاستخدام | الصلاحيات |
|---|---|---|
| `site_articles` | المقالات، ولها صور داخل النص بين الفقرات (قرار مكتوب) | قراءة عامة للمنشور، وكتابة للأدمن |
| `library_categories`، `library_items` | مكتبة الملفات (تنزيل المرفقات أسفل الغلاف) | نفس النمط |
| `video_categories`، `video_lessons` | دروس الفيديو | نفس النمط |
| `ai_knowledge` | قاعدة معرفة للمساعد الدراسي | قراءة للمنشور، وكتابة للأدمن |
| `profiles` | الحسابات | انظر القسم 4 |
| Storage bucket `site-images` | صور المقالات والمكتبة (حد 6MB، jpeg/png/webp/gif) | قراءة عامة، وكتابة للأدمن |

**الفيديوهات:** `src/data/youtube-videos.json` (3 فيديوهات حالياً)، وسكريبت `sync-youtube.mjs` يحدّثها أثناء البناء.

**مكتبة الإدارة `/admin/library`:** نماذج لإضافة وتعديل التصنيفات والملفات والنشر.

---

## 9. دليل أدوات الذكاء الاصطناعي (الكتالوج)

- **5,748 أداة** مستوردة من موقع AItoolsBot بسكريبت `import-aitoolsbot.mjs`.
- الملخص في `public/data/tools.json` (مصفوفة)، والتفاصيل في `public/data/tool-details/*.json` (5,748 ملف).
- `import-status.json`: 5,731 متاحة، و17 غير متاحة (404 من المصدر).
- الصور المرفوعة متوقعة في `public/tool-images/` حسب `AGENTS.md`.
- البحث والتصفية من الواجهة (`Tools`، `Category`، `Tool`).

---

## 10. المساعد الدراسي (`/study-ai`)

- واجهة `StudyAssistant.jsx` ترسل السؤال لـ **Supabase Edge Function** اسمها `study-assistant`.
- الـ Function:
  - تبحث في `ai_knowledge` وفي المنهج المرفوع (`curriculum`) بمطابقة كلمات ترتيبها بالعنوان والمحتوى.
  - تبعت السياق لـ **Gemini** (`gemini-3.5-flash-lite`) مع تعليمات تحصر الإجابة في المنهج ومحتوى الموقع.
  - الأسئلة خارج النطاق **تُرفض** بدل ما تُجاب من معرفة النموذج العامة (قرار مكتوب في `AGENTS.md`).
- مفتاح Gemini موجود في إعدادات الـ Edge Function في Supabase، مش في الكود.

---

## 11. النشر والبيئة

- **GitHub Pages:** workflow `deploy-pages.yml` يشتغل على كل push على `main`، وكمان كل 6 ساعات (cron).
  - خطوات: `npm ci` ← `npm run build` (ويشمل `sync-youtube` ثم `vite build` ثم توليد صفحات السوشيال) ← نسخ `index.html` إلى `404.html` للروابط المباشرة ← رفع `dist/client`.
  - المتغيرات: `VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY` كأسرار في GitHub.
- **Cloudflare (Sites):** ملفات `worker/index.js` و`.openai/hosting.json` و`scripts/prepare-sites-build.mjs` للنشر عبر Sites، ومعاها اختبار `tests/sites-worker.test.mjs`. ده مش المسار الحالي للنشر، لكن `AGENTS.md` يطلب إبقاءها سليمة.
- **الدومين:** `public/CNAME` = `www.elhawyai.com`.
- **Solo Learn:** مجلد `public/sololearn/` (النسخة الثابتة المبنية) ومجلد `sololearn/` (المصدر) داخل المستودع، والرابط `elhawyai.com/sololearn/`.

---

## 12. الاختبارات والأدوات المساعدة

- `tests/sites-worker.test.mjs`: يتأكد إن الـ Worker يخدم الملفات الثابتة، ويرجّع `index.html` للمسارات غير الموجودة.
- `scripts/`:
  - `sync-youtube.mjs`: يحدّث الفيديوهات.
  - `import-aitoolsbot.mjs`: يستورد الكتالوج (مستأنف، ما يعيدش تحميل المكتمل).
  - `generate-social-pages.mjs`: صفحات بيانات للمشاركة على السوشيال.
  - `prepare-sites-build.mjs`: تجهيز بناء Sites.
  - `extract-curriculum.py` و`build-curriculum-migration.py`: استخراج المنهج وتجهيزه للمساعد.
- `design-qa.md`: مقارنة بين التصميم المختار والتنفيذ.
- `elhawy_ai_facebook_post.md/.txt`: نصوص منشورات.
- `public/Mohamed-Elhawy-CV.pdf`: السيرة الذاتية (132KB).
- `return-elhawy/index.html`: قصة تفاعلية بعنوان "عودة الحاوي" (صفحة HTML مستقلة، ملف واحد).

---

## 13. الكود الإضافي الذي أضفته اليوم

- **كارت Solo Learn** في الصفحة الرئيسية وفي "أعمال مختارة" بالبروتوفوليو.
- **`public/sololearn/`**: النسخة الثابتة من Solo Learn (تم إصلاح مسارات الصور لتشمل `/sololearn`).
- **`sololearn/`**: مصدر Solo Learn كامل (بدون مفاتيح سرية ولا `node_modules`).
- **إصلاح الماوس**: مؤقت لإزالة شاشة التحميل في `public/about/main.js`.

---

## 14. نقاط تحتاج قراراً أو تنظيفاً

1. **تسجيل الدخول:** elhawyai بالهاتف، وSolo Learn بالإيميل، ومشروع Supabase مختلف. توحيدهم يحتاج قرار (انظر الملاحظة في المحادثة).
2. **رقم الأدمن** ظاهر في المستودع العام.
3. **خطأ حلقة المجلدات** في `public/about/main.js` (يوقف باقي السكريبت).
4. **الهاتف `unique`**: تكرار رقم يمنع التسجيل.
5. **المنشورات والملفات القديمة**: `elhawy_ai_facebook_post.md` و`.txt` مكررة، ومجلد `return-elhawy` ملف واحد كبير.
6. **`design-qa.md`** فيه مسارات محلية على جهاز قديم (`E:\ai\...`).
7. **ملفات الـ JSON الكبيرة** (5,748 ملف) تزيد حجم المستودع (مع الصور ~5,671 ملف في `public/`).

---

## 15. ما لم يُقرأ سطراً بسطر

- ملفات CSS التنسيقية (`approved-design.css`، `radical-redesign.css`، `site-overhaul.css`، `redesign.css`، `creator-*.css`، `unified-premium.css`، `navigation-v3.css`، وغيرها). فيها طبقات تنسيق متراكمة، وأي تعديل عليها يحتاج مراجعة لكل الطبقات.
- التفاصيل الداخلية لـ `FreeTools.jsx` (50KB)، و`PdfTools`، و`TranslationTools`.
- محتوى `JarvisPage.jsx` و`FridayPage.jsx` التفصيلي، و`ResumePage.jsx`.
- `LibraryAdmin.jsx` (34KB) و`ManagedArticles.jsx` و`VideoLessons.jsx` بالتفصيل.
- `public/about/style.css` (69KB).

لو عايز أغطي أي جزء منها سطر بسطر، أقولي أي ملف.
