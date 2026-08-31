import { useRef, useState } from "react";
import { FiImage, FiLoader, FiUploadCloud } from "react-icons/fi";
import { supabase } from "./supabase.js";

export function ImageUpload({ value, onChange, folder = "general" }) {
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("اختر ملف صورة فقط");
    if (file.size > 6 * 1024 * 1024)
      return setError("حجم الصورة يجب ألا يتجاوز 6 ميجابايت");
    setUploading(true);
    setError("");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (uploadError) setError("تعذر رفع الصورة. حاول مرة أخرى");
    else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };
  return (
    <div className="image-uploader">
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={(e) => upload(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <FiLoader /> جارٍ رفع الصورة
          </>
        ) : (
          <>
            <FiUploadCloud /> رفع صورة من الكمبيوتر
          </>
        )}
      </button>
      {value ? (
        <img src={value} alt="معاينة الصورة المرفوعة" />
      ) : (
        <div className="upload-placeholder">
          <FiImage />
          <span>PNG, JPG أو WEBP — حتى 6MB</span>
        </div>
      )}
      {error && <small>{error}</small>}
    </div>
  );
}
