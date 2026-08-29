import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const DATA_DIR = join(ROOT, "public", "data");
const DETAILS_DIR = join(DATA_DIR, "tool-details");
const IMAGES_DIR = join(ROOT, "public", "tool-images");
const SITEMAP_URL = "https://www.aitoolsbot.com/assets/sitemaps/tools.xml";
const CONCURRENCY = Number(process.env.IMPORT_CONCURRENCY || 10);
const CHECKPOINT_EVERY = 100;

await Promise.all([
  mkdir(DATA_DIR, { recursive: true }),
  mkdir(DETAILS_DIR, { recursive: true }),
  mkdir(IMAGES_DIR, { recursive: true }),
]);

const decode = (value = "") => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

const text = (html = "") => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const match = (html, pattern) => decode(html.match(pattern)?.[1]?.trim() || "");
const idFor = (url) => createHash("sha1").update(url).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "AI-Guide-Local-Importer/1.0" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(400 * attempt);
    }
  }
  throw lastError;
}

async function downloadImage(url, id) {
  if (!url) return "";
  const rawExt = extname(new URL(url).pathname).toLowerCase();
  const extension = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].includes(rawExt) ? rawExt : ".webp";
  const filename = `${id}${extension}`;
  const destination = join(IMAGES_DIR, filename);
  try {
    await readFile(destination);
    return `/tool-images/${filename}`;
  } catch {}

  try {
    const response = await fetch(url, { headers: { "user-agent": "AI-Guide-Local-Importer/1.0" } });
    if (!response.ok) return "";
    await writeFile(destination, Buffer.from(await response.arrayBuffer()));
    return `/tool-images/${filename}`;
  } catch {
    return "";
  }
}

function parseTool(html, sourceUrl) {
  const id = idFor(sourceUrl);
  const slug = decodeURIComponent(new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1) || id);
  const name = match(html, /<h2 class="h3 fw-bold clr-neutral-90 mt-4">([\s\S]*?)<\/h2>/i) || slug;
  const description = match(html, /<meta name="description" content="([^"]*)"/i);
  const heroBlock = html.match(/<div class="p-5 p-sm-8 bg-neutral-4 rounded-4">([\s\S]*?)<div class="row justify-content-center">/i)?.[1] || "";
  const externalUrl = match(heroBlock, /<a href="([^"]+)"[^>]+target="_blank"/i);
  const imageUrl = match(heroBlock, /<img src="([^"]+)"/i);
  const category = text(heroBlock.match(/<a href="https:\/\/aitoolsbot\.com\/tools\/[^"]+"[^>]*>([\s\S]*?)<\/a>/i)?.[1] || "غير مصنف");
  const price = text(heroBlock.match(/<p class="clr-neutral-90 mt-4 text-center[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "غير محدد");
  const contentHtml = html.match(/<div class="contenttool[^>]*>([\s\S]*?)<\/div>/i)?.[1]?.trim() || "";
  return { id, slug, name: text(name), description: text(description), category, price, externalUrl, imageUrl, sourceUrl, contentHtml };
}

const sitemap = await fetchText(SITEMAP_URL);
const urls = [...sitemap.matchAll(/<loc>(https:\/\/aitoolsbot\.com\/tool\/[^<]+)<\/loc>/gi)].map((entry) => decode(entry[1]));
const priorPath = join(DATA_DIR, "tools.json");
let prior = [];
try { prior = JSON.parse(await readFile(priorPath, "utf8")); } catch {}
const completed = new Map(prior.filter((tool) => !tool.unavailable).map((tool) => [tool.sourceUrl, tool]));
const failures = [];
let cursor = 0;
let processed = 0;

console.log(`Found ${urls.length} public tool URLs; ${completed.size} already imported.`);

async function checkpoint() {
  const tools = [...completed.values()].sort((a, b) => a.name.localeCompare(b.name, "ar"));
  await writeFile(priorPath, `${JSON.stringify(tools, null, 2)}\n`);
  await writeFile(join(DATA_DIR, "import-status.json"), `${JSON.stringify({ total: urls.length, imported: tools.length, available: tools.filter((tool) => !tool.unavailable).length, unavailable: tools.filter((tool) => tool.unavailable).length, failures, updatedAt: new Date().toISOString() }, null, 2)}\n`);
}

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= urls.length) return;
    const sourceUrl = urls[index];
    if (completed.has(sourceUrl)) continue;
    try {
      const html = await fetchText(sourceUrl);
      const full = parseTool(html, sourceUrl);
      const localImage = await downloadImage(full.imageUrl, full.id);
      const indexTool = { id: full.id, slug: full.slug, name: full.name, description: full.description, category: full.category, price: full.price, externalUrl: full.externalUrl, sourceUrl: full.sourceUrl, image: localImage };
      await writeFile(join(DETAILS_DIR, `${full.id}.json`), `${JSON.stringify({ ...indexTool, contentHtml: full.contentHtml }, null, 2)}\n`);
      completed.set(sourceUrl, indexTool);
    } catch (error) {
      failures.push({ sourceUrl, error: String(error?.message || error) });
    }
    processed += 1;
    if (processed % CHECKPOINT_EVERY === 0) {
      await checkpoint();
      console.log(`Imported ${completed.size}/${urls.length}; failures ${failures.length}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
for (const failure of failures) {
  if (completed.has(failure.sourceUrl)) continue;
  const id = idFor(failure.sourceUrl);
  const slug = decodeURIComponent(new URL(failure.sourceUrl).pathname.split("/").filter(Boolean).at(-1) || id);
  const fallback = { id, slug, name: slug.replaceAll("-", " "), description: "الرابط مدرج في خريطة الموقع الأصلية، لكن صفحة الأداة لم تعد متاحة.", category: "غير متاح", price: "غير متاح", externalUrl: "", sourceUrl: failure.sourceUrl, image: "", unavailable: true };
  completed.set(failure.sourceUrl, fallback);
  await writeFile(join(DETAILS_DIR, `${id}.json`), `${JSON.stringify({ ...fallback, contentHtml: "" }, null, 2)}\n`);
}
await checkpoint();
console.log(`Done. Indexed ${completed.size}/${urls.length}; unavailable ${failures.length}`);
