"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DEMO = "I love learning English.";

function TypingDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => (c >= DEMO.length + 6 ? 0 : c + 1));
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const typed = DEMO.slice(0, Math.min(count, DEMO.length));
  const next = typed.length;

  return (
    <div dir="ltr" className="rounded-2xl border-2 border-ink bg-page p-5 text-center font-mono text-2xl sm:text-3xl">
      {DEMO.split("").map((char, i) => {
        const className =
          i < typed.length ? "text-cyan-dark" : i === next ? "border-b-4 border-orange text-orange" : "text-ink/25";
        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </div>
  );
}

type Slide = {
  kicker: string;
  title: string;
  body: string;
  visual?: React.ReactNode;
};

const slides: Slide[] = [
  {
    kicker: "مرحبا بيك",
    title: "Solo Learn",
    body: "موقع بيعلّمك الإنجليزية بنفسك، جملة بجملة، من غير مدرس ومن غير تكلفة.",
  },
  {
    kicker: "الهدف",
    title: "تفتكر الكلمة لما تكتبها وتسمعها",
    body: "أغلب الناس بيحفظوا الكلمة، لكنهم بينسوها لما يحتاجوها. الكتابة مع السمع بتثبّتها في دماغك.",
  },
  {
    kicker: "الخطوة ١",
    title: "اسمع",
    body: "الجملة بتتقال بصوت واضح قبل ما تكتبها، وتقدر تسمعها تاني في أي وقت.",
  },
  {
    kicker: "الخطوة ٢",
    title: "اكتب حرف بحرف",
    body: "الحرف الغلط مش بيتقبل، والصح بيكمّل. الحرف اللي عليه خط برتقالي هو اللي المفروض تكتبه.",
    visual: <TypingDemo />,
  },
  {
    kicker: "الخطوة ٣",
    title: "شوف المعنى",
    body: "كل جملة ليها ترجمة عربية، ومعنى كل كلمة قدامك وإنت بتكتب.",
  },
  {
    kicker: "الخطوة ٤",
    title: "اتقدّم",
    body: "كل درس بيتسجل، ونسبة دقتك بتظهر، وتنتقل للي بعده على راحتك.",
  },
  {
    kicker: "المحتوى",
    title: "ثلاث مستويات وقصص",
    body: "مبتدئ، وأساسي، ومتوسط، بجانب قصص قصيرة تتكتب جملة بجملة.",
    visual: (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["A1 مبتدئ", "A2 أساسي", "B1 متوسط", "القصص"].map((label) => (
          <div
            key={label}
            className="rounded-2xl border-2 border-ink bg-page px-3 py-4 text-center font-bold"
          >
            {label}
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "ابدأ الآن",
    title: "اختار درسك الأول",
    body: "مش محتاج تسجّل عشان تبدأ. ولو عايز تحفظ تقدمك، ممكن تعمل حساب بعدين.",
    visual: (
      <Link
        href="/learn"
        className="inline-block rounded-full bg-orange px-6 py-3 font-bold text-card shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-orange-dark"
      >
        روح للدروس
      </Link>
    ),
  },
];

const INTERVAL_MS = 7000;

export default function ExplainerSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, index]);

  const slide = slides[index];

  function go(delta: number) {
    setPaused(true);
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <section
      aria-label="شرح الموقع"
      className="flex flex-col gap-5 rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-8"
    >
      <div className="flex min-h-72 flex-col justify-center gap-5" key={index}>
        <span className="w-fit rounded-full bg-ink px-3 py-1 text-xs font-bold text-card">{slide.kicker}</span>
        <h2 className="text-2xl font-black leading-snug sm:text-3xl">{slide.title}</h2>
        <p className="text-lg leading-relaxed text-ink-soft">{slide.body}</p>
        {slide.visual ? <div>{slide.visual}</div> : null}
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => go(1)}
          aria-label="الشريحة اللي بعدها"
          className="rounded-full border-2 border-ink bg-page px-4 py-2 font-bold hover:bg-line"
        >
          التالي ←
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="اختيار الشريحة">
          {slides.map((s, i) => (
            <button
              key={s.title}
              role="tab"
              aria-selected={i === index}
              aria-label={`الشريحة ${i + 1}`}
              onClick={() => {
                setPaused(true);
                setIndex(i);
              }}
              className={`h-3 rounded-full border-2 border-ink transition-all ${
                i === index ? "w-8 bg-orange" : "w-3 bg-card"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(-1)}
          aria-label="الشريحة اللي قبلها"
          className="rounded-full border-2 border-ink bg-page px-4 py-2 font-bold hover:bg-line"
        >
          → السابق
        </button>
      </div>
    </section>
  );
}
