"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

const PHONE_PATTERN = /^\+?[0-9]{10,15}$/;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured || !maybeSupabase) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6">
        <h1 className="text-2xl font-black">تسجيل الدخول</h1>
        <p className="text-ink-soft">
          لسه مش متوصّل بـ Supabase. ضيف المفاتيح في ملف <span dir="ltr">.env.local</span> وأعد تشغيل
          الموقع.
        </p>
        <Link href="/" className="font-bold text-cyan-dark underline">
          رجوع للدروس
        </Link>
      </div>
    );
  }

  const client = maybeSupabase;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "forgot") {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/reset-password`,
      });
      setBusy(false);
      setMessage(error ? error.message : "بعتنالك رابط لتغيير كلمة السر على الإيميل.");
      return;
    }

    if (mode === "signin") {
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      setBusy(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      router.push("/profile");
      return;
    }

    if (!PHONE_PATTERN.test(phone.trim())) {
      setBusy(false);
      setMessage("لازم تكتب رقم تليفون صحيح (10 لـ 15 رقم، ممكن يبدأ بـ +).");
      return;
    }

    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { phone: phone.trim() } },
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data.session) {
      router.push("/profile");
    } else {
      setMessage("بعتنالك رابط تأكيد على الإيميل. أكده وبعدين سجّل دخول.");
    }
  }

  const titles = { signin: "تسجيل الدخول", signup: "حساب جديد", forgot: "نسيت كلمة السر" };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-black">{titles[mode]}</h1>

      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
      >
        <label className="flex flex-col gap-2 font-bold">
          الإيميل
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal outline-none focus:border-cyan"
          />
        </label>

        {mode === "signup" ? (
          <label className="flex flex-col gap-2 font-bold">
            رقم التليفون (إجباري)
            <input
              type="tel"
              required
              dir="ltr"
              placeholder="+20 1xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal outline-none focus:border-cyan"
            />
          </label>
        ) : null}

        {mode !== "forgot" ? (
          <label className="flex flex-col gap-2 font-bold">
            كلمة السر
            <input
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full border-2 border-ink bg-page px-4 py-2 font-normal outline-none focus:border-cyan"
            />
          </label>
        ) : null}

        {message ? <p className="text-sm font-semibold text-orange-dark">{message}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-orange px-6 py-3 font-bold text-card shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-orange-dark disabled:opacity-60"
        >
          {mode === "signin" ? "دخول" : mode === "signup" ? "إنشاء الحساب" : "ابعت رابط التغيير"}
        </button>
      </form>

      <div className="flex flex-wrap gap-4 text-sm font-semibold text-ink-soft">
        {mode !== "signup" ? (
          <button onClick={() => { setMode("signup"); setMessage(null); }} className="underline">
            ماعنديش حساب، أنشئ واحد
          </button>
        ) : (
          <button onClick={() => { setMode("signin"); setMessage(null); }} className="underline">
            عندي حساب، سجّل دخول
          </button>
        )}
        {mode === "signin" ? (
          <button onClick={() => { setMode("forgot"); setMessage(null); }} className="underline">
            نسيت كلمة السر؟
          </button>
        ) : null}
        {mode === "forgot" ? (
          <button onClick={() => { setMode("signin"); setMessage(null); }} className="underline">
            رجوع لتسجيل الدخول
          </button>
        ) : null}
      </div>
    </div>
  );
}
