"use client";

import { useEffect, useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

// Every use below is guarded by supabaseConfigured, so the client exists when it runs.
const supabase = maybeSupabase!;

const ANY = "any";

export default function AdminPage() {
  const [loaded, setLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [gender, setGender] = useState(ANY);
  const [level, setLevel] = useState(ANY);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
        setIsAdmin(data?.role === "admin");
        const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
        setTotalUsers(count ?? 0);
      }
      setLoaded(true);
    })();
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!title.trim() || !body.trim()) {
      setResult("اكتب عنوان ونص الرسالة.");
      return;
    }
    setSending(true);
    const { data, error } = await supabase.rpc("send_broadcast", {
      p_title: title.trim(),
      p_body: body.trim(),
      p_gender: gender === ANY ? null : gender,
      p_level: level === ANY ? null : level,
      p_min_age: minAge ? Number(minAge) : null,
      p_max_age: maxAge ? Number(maxAge) : null,
    });
    setSending(false);
    if (error) {
      setResult(`حصلت مشكلة: ${error.message}`);
      return;
    }
    setResult(`اتبعتت لـ ${data} مستخدم.`);
    setTitle("");
    setBody("");
  }

  if (!supabaseConfigured) return <p className="text-ink-soft">تسجيل الدخول مش متوصّل دلوقتي.</p>;
  if (!loaded) return <p className="text-ink-soft">جاري التحميل…</p>;
  if (!isAdmin) {
    return <p className="rounded-2xl border-2 border-ink bg-card p-6 font-bold">الصفحة دي للأدمن بس.</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black sm:text-4xl">لوحة الأدمن</h1>
        <p className="text-ink-soft">
          عدد المستخدمين: <span className="font-bold text-orange">{totalUsers}</span>
        </p>
      </header>

      <form onSubmit={send} className="grid gap-5 rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--color-ink)] sm:grid-cols-2">
        <h2 className="text-xl font-black sm:col-span-2">إرسال رسالة لمجموعة</h2>

        <label className="flex flex-col gap-2 font-bold sm:col-span-2">
          العنوان
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold sm:col-span-2">
          نص الرسالة
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
            rows={4}
            className="rounded-2xl border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          النوع
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal">
            <option value={ANY}>الكل</option>
            <option value="male">ذكور</option>
            <option value="female">إناث</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 font-bold">
          المستوى
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal">
            <option value={ANY}>الكل</option>
            <option value="A1">مبتدئ A1</option>
            <option value="A2">أساسي A2</option>
            <option value="B1">متوسط B1</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 font-bold">
          أقل عمر
          <input type="number" min={0} max={120} value={minAge} onChange={(e) => setMinAge(e.target.value)} className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal" />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          أكبر عمر
          <input type="number" min={0} max={120} value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal" />
        </label>

        {result ? <p className="text-sm font-bold text-cyan-dark sm:col-span-2">{result}</p> : null}

        <button
          type="submit"
          disabled={sending}
          className="w-fit rounded-full bg-orange px-6 py-3 font-bold text-card hover:bg-orange-dark disabled:opacity-60 sm:col-span-2"
        >
          {sending ? "جاري الإرسال…" : "إرسال"}
        </button>
      </form>
    </div>
  );
}
