import type { Metadata } from "next";
import { lessons } from "@/data/lessons";

export const metadata: Metadata = {
  title: "عن الموقع | Solo Learn",
  description: "تعرّف على Solo Learn والهدف منه، وعلى الشخص اللي عمله.",
};

const totalSentences = lessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0);

const contacts = [
  {
    label: "فيسبوك",
    value: "facebook.com/MohamedElhawy0",
    href: "https://www.facebook.com/MohamedElhawy0",
  },
  {
    label: "واتساب",
    value: "+20 102 210 4948",
    href: "https://wa.me/201022104948",
  },
  {
    label: "الموقع الشخصي",
    value: "www.elhawyai.com",
    href: "https://www.elhawyai.com",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-bold text-orange">عن الموقع</p>
        <h1 className="text-4xl font-black sm:text-5xl">Solo Learn</h1>
        <p className="text-lg leading-loose text-ink-soft">
          Solo Learn موقع عربي بيساعدك تتعلم الإنجليزية بنفسك، من غير مدرس ومن غير أي تكلفة. الفكرة إنك
          تسمع الجملة، وتكتبها حرف بحرف، وتشوف معناها بالعربي، عشان الكلمة تفضل في دماغك وتتعود على
          نطقها وهجائها.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { value: `${lessons.length}`, label: "درس وقصة" },
          { value: `${totalSentences}`, label: "جملة" },
          { value: "مجاني", label: "بالكامل" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border-2 border-ink bg-card p-6 text-center shadow-[4px_4px_0_0_var(--color-ink)]">
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-black">الهدف من الموقع</h2>
        <p className="text-lg leading-loose text-ink-soft">
          معظم الناس بيحفظوا الكلمات، لكنهم بيتعثروا لما يكتبوها أو يتكلموا. الموقع بيربط بين السمع
          والكتابة، عشان تتعلم الكلمة بالطريقتين مع بعض، ومن غير ما تحتاج مدرس أو اشتراك.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-8 shadow-[6px_6px_0_0_var(--color-ink)]">
        <h2 className="text-2xl font-black">إزاي اتعمل الموقع؟</h2>
        <p className="text-lg leading-loose text-ink-soft">
          الموقع اتعمل بمساعدة الذكاء الاصطناعي (AI)، في التصميم والبرمجة وكتابة المحتوى. وإحنا بنراجع
          الجمل والترجمات عشان تكون دقيقة ومناسبة لكل مستوى، والمراجعة مستمرة.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-black">عمله</h2>
        <p className="text-lg leading-loose text-ink-soft">
          الموقع من تصميم وتطوير <strong className="text-ink">محمد الحاوي</strong>. لو عندك أي اقتراح أو
          مشكلة أو سؤال، تقدر تتواصل معاه على القنوات دي:
        </p>
        <ul className="grid gap-4 md:grid-cols-3">
          {contacts.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col gap-1 rounded-3xl border-2 border-ink bg-card p-5 transition hover:-translate-y-1 hover:border-cyan"
              >
                <span className="text-sm font-bold text-orange">{c.label}</span>
                <span dir="ltr" className="text-left font-bold">
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
