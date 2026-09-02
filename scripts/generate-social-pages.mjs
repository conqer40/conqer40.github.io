import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { featuredArticles } from "../src/featuredArticles.js";

const out = path.resolve(process.env.SOCIAL_OUT_DIR || "dist/client");
const template = await readFile(path.join(out, "index.html"), "utf8");
const base = "https://conqer40.github.io";
const api = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const esc = (value = "") => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const absolute = (url) => !url ? "" : new URL(url, base).href;
const meta = (html, item, route) => {
  const title = `${item.title} | Elhawy`;
  const description = item.summary || item.description || "محتوى من موقع محمد الحاوي";
  const image = absolute(item.cover_url);
  const canonical = `${base}${route}`;
  let next = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(canonical)}" />`);
  next = image
    ? next.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}" />`)
    : next.replace(/\s*<meta property="og:image"[^>]*>/, "");
  const twitter = `<meta name="twitter:title" content="${esc(title)}" /><meta name="twitter:description" content="${esc(description)}" />${image ? `<meta name="twitter:image" content="${esc(image)}" />` : ""}<link rel="canonical" href="${esc(canonical)}" />`;
  return next.replace("</head>", `  ${twitter}\n  </head>`);
};
const fetchRows = async (table) => {
  if (!api || !key) return [];
  const response = await fetch(`${api}/rest/v1/${table}?select=*&published=eq.true`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Unable to generate social pages for ${table}: ${response.status}`);
  return response.json();
};
for (const [table, prefix] of [["site_articles", "/articles/"], ["library_items", "/library/item/"]]) {
  const rows = await fetchRows(table);
  for (const row of rows.filter((item) => item.slug)) {
    const route = `${prefix}${encodeURIComponent(row.slug)}`;
    const directory = path.join(out, prefix.replace(/^\/+|\/+$/g, ""), row.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), meta(template, row, route));
  }
  console.log(`Generated ${rows.length} social preview pages for ${table}`);
}
for (const article of featuredArticles) {
  const route = `/articles/${article.slug}`;
  const directory = path.join(out, "articles", article.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), meta(template, article, route));
}
console.log(`Generated ${featuredArticles.length} bundled article preview pages`);
