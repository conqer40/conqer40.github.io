export const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
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
