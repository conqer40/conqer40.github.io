"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

// Every use below is guarded by supabaseConfigured, so the client exists when it runs.
const supabase = maybeSupabase!;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured) return <p className="text-ink-soft">تسجيل الدخول مش متوصّل دلوقتي.</p>;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setMessage("كلمة السر لازم تكون 6 حروف على الأقل.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage(`حصلت مشكلة: ${error.message}`);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6">
        <h1 className="text-2xl font-black">اتغيرت كلمة السر</h1>
        <Link href="/profile" className="font-bold text-cyan-dark underline">
          دخول لحسابي
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
      <h1 className="text-2xl font-black">كلمة سر جديدة</h1>
      <label className="flex flex-col gap-2 font-bold">
        كلمة السر الجديدة
        <input
          type="password"
          required
          minLength={6}
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal"
        />
      </label>
      {message ? <p className="text-sm font-semibold text-orange-dark">{message}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-fit rounded-full bg-orange px-6 py-3 font-bold text-card hover:bg-orange-dark disabled:opacity-60"
      >
        حفظ
      </button>
    </form>
  );
}
