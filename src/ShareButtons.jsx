import { FiCopy, FiFacebook, FiShare2 } from "react-icons/fi";
export function ShareButtons({ title, summary = "", url }) {
  const link = url || (typeof location !== "undefined" ? location.href : "");
  const shareText = [title, summary, `للمزيد زور الرابط: ${link}`].filter(Boolean).join("\n\n");
  const encoded = encodeURIComponent(link), text = encodeURIComponent(shareText);
  const copy = () => navigator.clipboard?.writeText(shareText);
  const native = () => navigator.share
    ? navigator.share({ title, text: shareText }).catch(() => {})
    : navigator.clipboard?.writeText(shareText);
  return (
    <div className="share-panel">
      <span>
        <FiShare2 /> مشاركة
      </span>
      <a
        href={`https://wa.me/?text=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        واتساب
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}&quote=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        <FiFacebook /> فيسبوك
      </a>
      <button onClick={native}>إنستجرام / مشاركة الجهاز</button>
      <button onClick={copy}>
        <FiCopy /> نسخ نص المشاركة
      </button>
    </div>
  );
}
