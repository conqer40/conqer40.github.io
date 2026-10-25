import Link from "next/link";
import ExplainerSlider from "@/components/ExplainerSlider";
import HeroBackground from "@/components/HeroBackground";
import Reveal from "@/components/Reveal";
import { lessons } from "@/data/lessons";

const totalSentences = lessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0);

const steps = [
  { title: "اسمع", text: "الجملة بتتقال بصوت واضح قبل ما تكتبها.", img: "/sections/step-listen.webp" },
  { title: "اكتب", text: "اكتب الحروف واحد واحد. الحرف الغلط مش بيتقبل، والصح بيكمّل.", img: "/sections/step-type.webp" },
  { title: "شوف المعنى", text: "كل كلمة ليها معناها بالعربي وإنت بتكتب.", img: "/sections/step-meaning.webp" },
  { title: "اتقدّم", text: "كل درس بيتسجل، ونسبة دقتك بتظهر، وتعدّي للي بعده.", img: null },
];

const features = [
  { title: "كتابة حرف بحرف", text: "بتتعود على هجاء الكلمة ونطقها في نفس الوقت." },
  { title: "وضع الإملاء", text: "اخفي النص واسمع بس، واكتب من غير ما تبص." },
  { title: "ترجمة فورية", text: "كل جملة ليها ترجمة عربية، ومعنى كل كلمة قدامك." },
  { title: "قصص قصيرة", text: "قصص من 6 إلى 8 جمل تتكتب جملة بجملة." },
  { title: "مستويات متدرجة", text: "من المبتدئ للمتوسط، بموضوعات من الحياة اليومية." },
  { title: "مجاني بالكامل", text: "كل الدروس مفتوحة. التسجيل اختياري لحفظ التقدم." },
];

const faqs = [
  { q: "هل الموقع مجاني؟", a: "أيوه، كل الدروس والقصص مفتوحة للكل من غير أي دفع." },
  { q: "لازم أعمل حساب؟", a: "لأ. تقدر تبدأ فورا. لو عملت حساب، تقدمك بيتحفظ عندك على أي جهاز." },
  { q: "لازم أعرف إنجليزي قبل ما أبدأ؟", a: "لأ. ابدأ من مستوى المبتدئ، والترجمة العربية موجودة معاك طول الوقت." },
  {
    q: "هل لازم أكتب علامات التنصيص والفاصلة؟",
    a: "لأ. علامات التنصيص والفاصلة العليا بتتكتب لوحدها. لكن انتبه للحروف الكبيرة والصغيرة، لأن I مش i.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative isolate -mx-4 overflow-hidden rounded-[2rem] border-2 border-ink bg-ink px-6 py-20 text-card shadow-[8px_8px_0_0_var(--color-ink)] sm:-mx-0 sm:px-12 sm:py-28">
        <HeroBackground />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sections/hero.webp" alt="" aria-hidden="true" className="absolute inset-y-0 end-0 hidden h-full w-1/2 rounded-s-[2rem] object-cover md:block" />
        <div className="relative flex max-w-xl flex-col items-start gap-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-bold tracking-wide text-ink">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-orange" />
              علّم نفسك
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-5xl font-black leading-[1.1] text-card sm:text-7xl">
              تعلّم <span className="text-orange">الإنجليزية</span>
              <br />
              <span className="text-cyan">بنفسك، حرفًا بحرف</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-2xl text-lg leading-relaxed text-card/80 sm:text-xl">
              Solo Learn موقع بيساعدك تتعلم الإنجليزية من غير مدرس. بتسمع الجملة، وتكتبها بإيدك حرف بحرف،
              وبتشوف معناها بالعربي.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/learn"
                className="rounded-full bg-orange px-7 py-3.5 text-lg font-bold text-card shadow-[4px_4px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-orange-dark"
              >
                ابدأ الدروس
              </Link>
              <a
                href="#how"
                className="rounded-full border-2 border-card bg-transparent px-7 py-3.5 text-lg font-bold text-card transition hover:-translate-y-0.5 hover:bg-card/10"
              >
                إزاي بيشتغل؟
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "درس وقصة", value: String(lessons.length) },
            { label: "جملة", value: String(totalSentences) },
            { label: "تكلفة", value: "مجاني" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-3xl border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)] transition hover:-translate-y-1"
            >
              <dt className="text-lg text-ink-soft">{stat.label}</dt>
              <dd className="text-4xl font-black">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <ExplainerSlider />

      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="text-3xl font-black sm:text-4xl">الهدف من الموقع</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-lg leading-loose text-ink-soft">
            معظم الناس بيحفظوا الكلمات، لكنهم بيتعثروا لما يكتبوها أو يتكلموا. الهدف هنا إنك تتعلم الكلمة
            بالكتابة والسمع مع بعض، عشان تفتكرها وإنت بتكتب وإنت بتتكلم. مش محتاج مدرس ولا تسجيل، تبدأ من
            أول جملة وتكمّل بسرعتك.
          </p>
        </Reveal>
      </section>

      <section id="how" className="flex scroll-mt-6 flex-col gap-8 rounded-[2rem] border-2 border-ink bg-card p-8 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-12">
        <Reveal>
          <p className="text-sm font-bold text-orange">الخطوات</p>
          <h2 className="text-3xl font-black sm:text-4xl">إزاي بيشتغل؟</h2>
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <li className="group flex h-full flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6 shadow-[4px_4px_0_0_var(--color-ink)] transition duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_var(--color-ink)]">
                {step.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={step.img} alt="" className="h-28 w-28 object-contain transition duration-300 group-hover:scale-110" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-xl font-black text-card transition group-hover:rotate-12 group-hover:bg-orange">
                    {i + 1}
                  </span>
                )}
                <span className="text-xl font-black">{step.title}</span>
                <span className="text-ink-soft">{step.text}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-8">
        <Reveal>
          <p className="text-sm font-bold text-cyan-dark">ليه Solo Learn؟</p>
          <h2 className="text-3xl font-black sm:text-4xl">المميزات</h2>
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 100}>
              <li className="flex h-full flex-col gap-3 rounded-3xl border-2 border-ink bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan">
                <span className="text-xl font-black">{feature.title}</span>
                <span className="text-ink-soft">{feature.text}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="text-3xl font-black sm:text-4xl">لمين الموقع ده؟</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-lg leading-loose text-ink-soft">
            لأي حد بيتكلم العربي وعايز يتعلم الإنجليزية بنفسه، من المبتدئ اللي بيبدأ من الصفر، لحد اللي عنده
            أساس وعايز يقوّي كتابته ونطقه. ومش محتاج تدفع أو تسجّل عشان تبدأ.
          </p>
        </Reveal>
      </section>

      <section className="flex flex-col gap-8">
        <Reveal>
          <h2 className="text-3xl font-black sm:text-4xl">أسئلة شائعة</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 2) * 120}>
              <details className="group h-full rounded-3xl border-2 border-ink bg-card p-6 transition open:shadow-[4px_4px_0_0_var(--color-ink)]">
                <summary className="cursor-pointer text-lg font-black">{faq.q}</summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="relative isolate flex flex-col items-start gap-5 overflow-hidden rounded-[2rem] border-2 border-ink bg-ink p-10 text-card sm:p-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sections/cta-bg.webp" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
          <h2 className="text-3xl font-black sm:text-5xl">جاهز تبدأ؟</h2>
          <p className="max-w-xl text-lg text-card/80">أول درس بياخد دقايق قليلة. اختار مستواك وابدأ.</p>
          <Link
            href="/learn"
            className="rounded-full bg-orange px-8 py-4 text-lg font-bold text-card transition hover:-translate-y-0.5 hover:bg-orange-dark"
          >
            ابدأ الدروس
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
