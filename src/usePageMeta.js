import { useEffect } from "react";

const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
};

export function usePageMeta(item, type = "website") {
  useEffect(() => {
    if (!item) return undefined;
    const title = `${item.title} | Elhawy`;
    const description = item.summary || item.description || "محتوى من موقع محمد الحاوي";
    const image = item.cover_url ? new URL(item.cover_url, location.origin).href : "";
    document.title = title;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: location.href });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: type });
    const oldImage = document.head.querySelector('meta[property="og:image"]');
    if (image) ensureMeta('meta[property="og:image"]', { property: "og:image", content: image });
    else oldImage?.remove();
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    const oldTwitterImage = document.head.querySelector('meta[name="twitter:image"]');
    if (image) ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    else oldTwitterImage?.remove();
    return () => { document.title = "Mohamed Elhawy — Logistics, Operations & AI"; };
  }, [item, type]);
}
