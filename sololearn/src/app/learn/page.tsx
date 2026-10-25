import LessonList from "@/components/LessonList";
import { lessons } from "@/data/lessons";
import type { Level } from "@/data/types";

const levels: { level: Level; name: string; description: string }[] = [
  { level: "A1", name: "مبتدئ", description: "جمل قصيرة وعملية للبداية." },
  { level: "A2", name: "أساسي", description: "مواقف يومية بجمل أطول شوية." },
  { level: "B1", name: "متوسط", description: "موضوعات أعمق وتعبيرات طبيعية أكتر." },
];

export default function LearnPage() {
  const stories = lessons.filter((lesson) => lesson.kind === "story");

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-black sm:text-4xl">كل الدروس</h1>
        <p className="text-ink-soft">اختار المستوى اللي يناسبك، أو ابدأ بالقصص لو عايز تتدرب على جمل كاملة.</p>
        <nav className="flex flex-wrap gap-2 pt-2">
          {levels.map(({ level, name }) => (
            <a
              key={level}
              href={`#${level.toLowerCase()}`}
              className="rounded-full border-2 border-ink bg-card px-4 py-1.5 text-sm font-bold hover:bg-page"
            >
              {name} <span dir="ltr">{level}</span>
            </a>
          ))}
          <a
            href="#stories"
            className="rounded-full border-2 border-ink bg-card px-4 py-1.5 text-sm font-bold hover:bg-page"
          >
            القصص
          </a>
        </nav>
      </header>

      {levels.map(({ level, name, description }) => {
        const items = lessons.filter((lesson) => lesson.level === level && lesson.kind !== "story");
        return (
          <section key={level} id={level.toLowerCase()} className="flex scroll-mt-6 flex-col gap-5">
            <header className="flex flex-col gap-1 border-b-2 border-ink pb-3">
              <h2 className="text-2xl font-black">
                {name} <span dir="ltr" className="text-orange">{level}</span>
              </h2>
              <p className="text-ink-soft">
                {description} · {items.length} درس
              </p>
            </header>
            <LessonList items={items} />
          </section>
        );
      })}

      <section id="stories" className="flex scroll-mt-6 flex-col gap-5">
        <header className="flex flex-col gap-1 border-b-2 border-ink pb-3">
          <h2 className="text-2xl font-black">القصص</h2>
          <p className="text-ink-soft">
            اسمع القصة واكتبها جملة بجملة. بتفتح على وضع الإملاء تلقائيا. · {stories.length} قصة
          </p>
        </header>
        <LessonList items={stories} />
      </section>
    </div>
  );
}
