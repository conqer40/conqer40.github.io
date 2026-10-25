"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storyCovers } from "@/data/covers";
import { asset } from "@/lib/asset";

import type { Lesson } from "@/data/types";
import { loadProgress, type Progress } from "@/lib/progress";

type Props = { items: Lesson[] };

export default function LessonList({ items }: Props) {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((lesson) => {
        const best = progress?.completed[lesson.id];
        const cover = lesson.kind === "story" ? storyCovers[lesson.id] : undefined;
        return (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.id}`}
            className="flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(`/stories/${lesson.id}.svg`)}
                alt=""
                className="h-40 w-full border-b-2 border-ink object-cover"
                style={{ backgroundColor: cover.bg }}
              />
            ) : null}
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-lg font-black">{lesson.titleAr}</span>
                <span dir="ltr" className="text-sm text-ink-soft">
                  {lesson.title} · {lesson.sentences.length} جمل
                </span>
              </div>
              {best === undefined ? (
                <span className="shrink-0 rounded-full bg-cyan px-3 py-1 text-xs font-bold text-card">ابدأ</span>
              ) : (
                <span className="shrink-0 rounded-full bg-orange px-3 py-1 text-xs font-bold text-card">
                  مكتمل · <span dir="ltr">{best}%</span>
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
