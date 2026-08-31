import { FiCopy, FiFacebook, FiShare2 } from "react-icons/fi";
export function ShareButtons({ title, url }) {
  const link = url || (typeof location !== "undefined" ? location.href : "");
  const encoded = encodeURIComponent(link),
    text = encodeURIComponent(title || "");
  const copy = () => navigator.clipboard?.writeText(link);
  const native = () => navigator.share?.({ title, url: link }).catch(() => {});
  return (
    <div className="share-panel">
      <span>
        <FiShare2 /> مشاركة
      </span>
      <a
        href={`https://wa.me/?text=${text}%20${encoded}`}
        target="_blank"
        rel="noreferrer"
      >
        واتساب
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noreferrer"
      >
        <FiFacebook /> فيسبوك
      </a>
      <button onClick={native}>إنستجرام / مشاركة الجهاز</button>
      <button onClick={copy}>
        <FiCopy /> نسخ الرابط
      </button>
    </div>
  );
}
