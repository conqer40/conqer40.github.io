"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

// Every use below is guarded by supabaseConfigured, so the client exists when it runs.
const supabase = maybeSupabase!;

type ProfileRow = {
  display_name: string;
  bio: string;
  gender: "male" | "female" | null;
  birth_date: string | null;
  level: "A1" | "A2" | "B1" | null;
  role: "user" | "admin";
};

type NotificationRow = { id: number; title: string; body: string; created_at: string; read_at: string | null };

const PHONE_PATTERN = /^\+?[0-9]{10,15}$/;

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [phone, setPhone] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [notes, setNotes] = useState<NotificationRow[]>([]);
  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const id = auth.user?.id ?? null;
      setUserId(id);
      if (id) {
        const [{ data: p }, { data: c }, { data: n }, { count }] = await Promise.all([
          supabase.from("profiles").select("display_name,bio,gender,birth_date,level,role").eq("id", id).single(),
          supabase.from("profile_contacts").select("phone").eq("user_id", id).maybeSingle(),
          supabase.from("notifications").select("id,title,body,created_at,read_at").order("created_at", { ascending: false }).limit(50),
          supabase.from("lesson_progress").select("lesson_id", { count: "exact", head: true }).eq("user_id", id),
        ]);
        setProfile(p as ProfileRow);
        setPhone(c?.phone ?? "");
        setHasPhone(Boolean(c?.phone));
        setNotes((n as NotificationRow[]) ?? []);
        setCompleted(count ?? 0);
      }
      setLoaded(true);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !profile) return;
    if (!PHONE_PATTERN.test(phone.trim())) {
      setMessage("اكتب رقم تليفون صحيح (10 لـ 15 رقم، ممكن يبدأ بـ +).");
      return;
    }
    setSaving(true);
    setMessage(null);
    const [{ error: pErr }, { error: cErr }] = await Promise.all([
      supabase
        .from("profiles")
        .update({
          display_name: profile.display_name.trim(),
          bio: profile.bio.trim(),
          gender: profile.gender,
          birth_date: profile.birth_date || null,
          level: profile.level,
        })
        .eq("id", userId),
      supabase.from("profile_contacts").upsert({ user_id: userId, phone: phone.trim() }, { onConflict: "user_id" }),
    ]);
    setSaving(false);
    if (pErr || cErr) {
      setMessage(`حصلت مشكلة: ${(pErr || cErr)?.message}`);
      return;
    }
    setHasPhone(true);
    setMessage("اتحفظ بنجاح.");
  }

  async function markRead(id: number) {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setNotes((list) => list.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  }

  if (!supabaseConfigured) {
    return <p className="text-ink-soft">تسجيل الدخول مش متوصّل دلوقتي.</p>;
  }
  if (!loaded) return <p className="text-ink-soft">جاري التحميل…</p>;
  if (!userId || !profile) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6">
        <h1 className="text-2xl font-black">لازم تسجّل دخول الأول</h1>
        <Link href="/login" className="font-bold text-cyan-dark underline">
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  const unread = notes.filter((n) => !n.read_at).length;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black sm:text-4xl">لوحة حسابي</h1>
        <p className="text-ink-soft">
          عدد الدروس المكتملة: <span className="font-bold text-orange">{completed}</span>
        </p>
        {profile.role === "admin" ? (
          <Link href="/admin" className="w-fit rounded-full bg-ink px-4 py-2 text-sm font-bold text-card">
            لوحة الأدمن
          </Link>
        ) : null}
      </header>

      {!hasPhone ? (
        <div className="rounded-2xl border-2 border-orange bg-card p-4 font-bold text-orange-dark">
          لازم تكتب رقم تليفونك عشان تقدر تبعت طلبات صداقة وتدردش مع الناس.
        </div>
      ) : null}

      <form onSubmit={save} className="grid gap-5 rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--color-ink)] sm:grid-cols-2">
        <h2 className="text-xl font-black sm:col-span-2">بياناتي</h2>

        <label className="flex flex-col gap-2 font-bold">
          الاسم
          <input
            value={profile.display_name}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            maxLength={40}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          رقم التليفون (إجباري)
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            placeholder="+20 1xxxxxxxxx"
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold sm:col-span-2">
          نبذة عني
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            maxLength={300}
            rows={3}
            className="rounded-2xl border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          النوع
          <select
            value={profile.gender ?? ""}
            onChange={(e) => setProfile({ ...profile, gender: (e.target.value || null) as ProfileRow["gender"] })}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          >
            <option value="">اختار</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 font-bold">
          تاريخ الميلاد
          <input
            type="date"
            value={profile.birth_date ?? ""}
            onChange={(e) => setProfile({ ...profile, birth_date: e.target.value || null })}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 font-bold sm:col-span-2">
          مستواك في الإنجليزية
          <select
            value={profile.level ?? ""}
            onChange={(e) => setProfile({ ...profile, level: (e.target.value || null) as ProfileRow["level"] })}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
          >
            <option value="">اختار</option>
            <option value="A1">مبتدئ A1</option>
            <option value="A2">أساسي A2</option>
            <option value="B1">متوسط B1</option>
          </select>
        </label>

        {message ? <p className="text-sm font-bold text-cyan-dark sm:col-span-2">{message}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-full bg-orange px-6 py-3 font-bold text-card hover:bg-orange-dark disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "جاري الحفظ…" : "حفظ"}
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-black">
          الإشعارات {unread > 0 ? <span className="text-orange">({unread} جديد)</span> : null}
        </h2>
        {notes.length === 0 ? <p className="text-ink-soft">مفيش إشعارات لسه.</p> : null}
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`rounded-2xl border-2 border-ink p-4 text-right ${n.read_at ? "bg-card" : "bg-page"}`}
          >
            <p className="font-black">{n.title}</p>
            <p className="text-ink-soft">{n.body}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
