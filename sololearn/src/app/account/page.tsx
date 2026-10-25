"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lessons } from "@/data/lessons";
import { loadProgress, saveProgress, type Progress } from "@/lib/progress";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function AccountPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    setNameInput(loaded.name);
    supabase?.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase?.auth.signOut();
    setEmail(null);
  }

  if (!progress) return null;

  const completedCount = Object.keys(progress.completed).length;

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    const next = { ...progress!, name: nameInput.trim() };
    saveProgress(next);
    setProgress(next);
    setSaved(true);
  }

  function reset() {
    const cleared = { name: progress!.name, completed: {} };
    saveProgress(cleared);
    setProgress(cleared);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-black">حسابي</h1>
        {email ? (
          <p className="text-ink-soft">
            داخل باسم <span dir="ltr" className="font-bold">{email}</span>. التقدم بيتحفظ في حسابك.
            <button onClick={signOut} className="mr-3 font-bold text-cyan-dark underline">
              خروج
            </button>
          </p>
        ) : (
          <p className="text-ink-soft">
            {supabaseConfigured ? (
              <>
                إنت مش داخل حساب دلوقتي، والتقدم محفوظ على الجهاز ده بس.{" "}
                <Link href="/login" className="font-bold text-cyan-dark underline">
                  سجّل دخول
                </Link>{" "}
                عشان يتحفظ في حسابك.
              </>
            ) : (
              "الحساب ده محفوظ على الجهاز ده بس. تسجيل الدخول لسه مش متوصّل."
            )}
          </p>
        )}
      </section>

      <form
        onSubmit={saveName}
        className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
      >
        <label htmlFor="name" className="font-bold">
          اسمك
        </label>
        <div className="flex gap-3">
          <input
            id="name"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setSaved(false);
            }}
            placeholder="اكتب اسمك"
            maxLength={40}
            className="flex-1 rounded-full border-2 border-ink bg-page px-4 py-2 outline-none focus:border-cyan"
          />
          <button
            type="submit"
            className="rounded-full bg-orange px-5 py-2 font-bold text-card shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-orange-dark"
          >
            حفظ
          </button>
        </div>
        {saved ? <p className="text-sm font-semibold text-cyan-dark">تم الحفظ.</p> : null}
      </form>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">تقدمك</h2>
          <span className="text-sm font-semibold text-ink-soft">
            {completedCount} من {lessons.length} دروس مكتملة
          </span>
        </div>

        {lessons.map((lesson) => {
          const best = progress.completed[lesson.id];
          return (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-2xl border-2 border-ink bg-card px-5 py-4"
            >
              <span className="font-bold">{lesson.titleAr}</span>
              {best === undefined ? (
                <Link href={`/learn/${lesson.id}`} className="text-sm font-bold text-cyan-dark underline">
                  ابدأ الدرس
                </Link>
              ) : (
                <span className="text-sm font-bold text-orange">
                  مكتمل · <span dir="ltr">{best}%</span>
                </span>
              )}
            </div>
          );
        })}

        {completedCount > 0 ? (
          <button onClick={reset} className="self-start text-sm font-semibold text-ink-soft underline">
            مسح التقدم
          </button>
        ) : null}
      </section>
    </div>
  );
}
