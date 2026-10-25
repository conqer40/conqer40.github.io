"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "@/data/lessons";
import { markComplete } from "@/lib/progress";
import { accuracy, applyKey, emptyState, isComplete, percentage, type TypingState } from "@/lib/typing";

type Props = { lesson: Lesson };
type Totals = { correct: number; mistakes: number };

const NO_TOTALS: Totals = { correct: 0, mistakes: 0 };

export default function LessonPlayer({ lesson }: Props) {
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<TypingState>(emptyState);
  const [totals, setTotals] = useState<Totals>(NO_TOTALS);
  const [dictation, setDictation] = useState(lesson.kind === "story");
  const [finished, setFinished] = useState(false);

  const sentence = lesson.sentences[index];
  const target = sentence.en;
  const done = isComplete(target, state);

  // Letter-by-letter input from the physical keyboard.
  useEffect(() => {
    if (finished) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      event.preventDefault();
      setState((current) => applyKey(target, current, event.key));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, finished]);

  // Move on shortly after a sentence is completed.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => {
      const nextTotals = {
        correct: totals.correct + state.typed.length,
        mistakes: totals.mistakes + state.mistakes,
      };
      setTotals(nextTotals);

      if (index + 1 >= lesson.sentences.length) {
        markComplete(lesson.id, percentage(nextTotals.correct, nextTotals.mistakes));
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setState(emptyState);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [done, index, lesson.id, lesson.sentences.length, state, totals]);

  function speak() {
    if (sentence.audio) {
      new Audio(sentence.audio).play();
      return;
    }
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function restart() {
    setIndex(0);
    setState(emptyState);
    setTotals(NO_TOTALS);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-ink bg-card p-10 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
        <span className="text-5xl">🎉</span>
        <h2 className="text-3xl font-black">أحسنت! خلصت الدرس</h2>
        <p className="text-ink-soft">
          دقتك في الدرس: <span dir="ltr" className="font-bold text-orange">{percentage(totals.correct, totals.mistakes)}%</span>
        </p>
        <p className="text-sm text-ink-soft">التقدم اتحفظ على جهازك.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-full bg-orange px-6 py-3 font-bold text-card shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-orange-dark"
          >
            ابدأ من جديد
          </button>
          <Link
            href="/"
            className="rounded-full border-2 border-ink bg-card px-6 py-3 font-bold hover:bg-page"
          >
            كل الدروس
          </Link>
        </div>
      </div>
    );
  }

  const typed = state.typed;
  const progressPercent = ((index + (done ? 1 : 0)) / lesson.sentences.length) * 100;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between text-sm font-semibold text-ink-soft">
        <span>
          الجملة {index + 1} من {lesson.sentences.length}
        </span>
        <span>
          الدقة <span dir="ltr">{accuracy(state)}%</span>
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-line">
        <div className="h-full bg-cyan transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setDictation((d) => !d)}
          aria-pressed={dictation}
          className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition ${
            dictation ? "bg-ink text-card" : "bg-card hover:bg-page"
          }`}
        >
          {dictation ? "إيقاف الإملاء" : "وضع الإملاء"}
        </button>
        <button
          onClick={speak}
          className="rounded-full border-2 border-ink bg-card px-4 py-2 text-sm font-bold hover:bg-page"
        >
          🔊 استمع
        </button>
      </div>

      <div
        dir="ltr"
        className="min-h-40 break-words rounded-3xl border-2 border-ink bg-card px-4 py-8 text-center font-mono text-3xl leading-relaxed tracking-wide shadow-[6px_6px_0_0_var(--color-ink)] sm:text-4xl"
      >
        {dictation && !done ? (
          <DictationView target={target} typed={typed} />
        ) : (
          <TypingView target={target} typed={typed} />
        )}
      </div>

      <p className="text-center text-sm text-ink-soft">
        انتبه للحروف الكبيرة والصغيرة: <span dir="ltr" className="font-bold">I</span> مش{" "}
        <span dir="ltr" className="font-bold">i</span>. علامات التنصيص مش لازم تكتبها.
      </p>

      {!dictation || done ? (
        <p dir="rtl" className="text-center text-lg text-ink-soft">
          {sentence.ar}
        </p>
      ) : null}

      {state.mistakes > 0 && !done ? (
        <p className="text-center text-sm font-bold text-orange-dark">
          حرف غلط. اكتب الحرف اللي تحته خط برتقالي.
        </p>
      ) : null}
    </div>
  );
}

function TypingView({ target, typed }: { target: string; typed: string }) {
  return (
    <>
      {target.split("").map((char, i) => {
        const isTyped = i < typed.length;
        const isNext = i === typed.length;
        const className = isTyped
          ? "text-cyan-dark"
          : isNext
            ? "border-b-4 border-orange text-orange"
            : "text-ink/25";
        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </>
  );
}

function DictationView({ target, typed }: { target: string; typed: string }) {
  return (
    <>
      {target.split("").map((char, i) => {
        if (char === " ") return <span key={i}>{" "}</span>;
        const shown = i < typed.length ? typed[i] : "_";
        return (
          <span key={i} className={i < typed.length ? "text-cyan-dark" : "text-ink/40"}>
            {shown}
          </span>
        );
      })}
    </>
  );
}
