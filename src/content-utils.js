const arabicLatin = {
  ا: "a", أ: "a", إ: "e", آ: "a", ب: "b", ت: "t", ث: "th", ج: "j",
  ح: "h", خ: "kh", د: "d", ذ: "z", ر: "r", ز: "z", س: "s", ش: "sh",
  ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q",
  ك: "k", ل: "l", م: "m", ن: "n", ه: "h", ة: "a", و: "w", ؤ: "o",
  ي: "y", ى: "a", ئ: "e", ء: "", "َ": "", "ً": "", "ُ": "", "ٌ": "",
  "ِ": "", "ٍ": "", "ْ": "", "ّ": "", "ـ": "",
};
export const slugify = (value) => {
  const latin = [...String(value || "").trim().toLowerCase()]
    .map((char) => arabicLatin[char] ?? char)
    .join("");
  return latin
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || `content-${Date.now().toString(36)}`;
};
export const safeImage = (url) => {
  if (!url) return "";
  const drive = String(url).match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return drive
    ? `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1200`
    : url;
};
export const youtubeId = (url) =>
  String(url || "").match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/,
  )?.[1] || "";
