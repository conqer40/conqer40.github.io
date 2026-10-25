import { notFound } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { getLesson, lessons } from "@/data/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{lesson.titleAr}</h1>
        <span dir="ltr" className="text-sm text-zinc-500">
          {lesson.title} · {lesson.level}
        </span>
      </header>
      <LessonPlayer lesson={lesson} />
    </section>
  );
}
