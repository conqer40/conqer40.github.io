import { FiCheckCircle, FiDownload, FiExternalLink, FiMail } from "react-icons/fi";

const d = {
  ar: {
    eyebrow: "من أنا", title: "محمد الحاوي — خبرة عملية ورؤية رقمية",
    intro: "متخصص في اللوجستيات وسلاسل الإمداد والتجارة الدولية، وأبني حلولًا رقمية ووكلاء ذكاء اصطناعي يحولون العمل المعقد إلى أنظمة واضحة وفعالة. هنا تجد قصتي المهنية وسيرتي الذاتية كاملة في صفحة واحدة.",
    download: "تحميل السيرة PDF", experience: "الخبرات المهنية", skills: "المهارات الأساسية", education: "التعليم والشهادات",
    jobs: [
      ["2017 — حتى الآن", "مشرف الخدمات اللوجستية", "شركة الصالحي للاستيراد والتجارة والاستثمار", ["إدارة عمليات الاستيراد والتصدير عبر Nafeza وCargoX.", "قيادة فريق يتعامل مع أكثر من 200 حاوية سنويًا.", "تطوير أنظمة رفعت كفاءة سلسلة الإمداد بنسبة 25%.", "الحفاظ على سجل امتثال خالٍ من المخالفات."]],
      ["2019 — حتى الآن", "أخصائي إدخال بيانات وتقنية معلومات", "شركة الصالحي للاستيراد والتجارة والاستثمار", ["إدارة البيانات والتقارير التشغيلية.", "إنشاء لوحات متابعة وتحسين دقة التقارير.", "دعم الأنظمة الرقمية ومبادرات التحول التقني."]],
    ],
    skillList: ["Logistics & Supply Chain", "CargoX & Nafeza", "Data Analysis & Power BI", "SAP, Oracle & Odoo", "International Trade", "WordPress & AI Automation"],
    edu: ["بكالوريوس الخدمة الاجتماعية — المعهد العالي للخدمة الاجتماعية بالزقازيق", "أساسيات إدارة سلسلة التوريد — Coursera", "تحليل البيانات باستخدام Excel وPower BI", "WordPress Development Essentials", "Lean Six Sigma Fundamentals"],
  },
  en: {
    eyebrow: "About Me", title: "Mohamed Elhawy — practical experience, digital vision",
    intro: "A logistics, supply-chain and international-trade professional building digital systems and AI agents that turn complex work into clear, effective operations. This page brings my story and full résumé together.",
    download: "Download résumé PDF", experience: "Professional experience", skills: "Core skills", education: "Education & certifications",
    jobs: [
      ["2017 — Present", "Logistics Supervisor", "El-Salhy Company for Import, Trade & Investment", ["Managed import and export operations through Nafeza and CargoX.", "Led a logistics team handling 200+ containers annually.", "Developed systems that improved supply-chain efficiency by 25%.", "Maintained a zero compliance-violations record."]],
      ["2019 — Present", "Data Entry & IT Specialist", "El-Salhy Company for Import, Trade & Investment", ["Managed operational data and reporting.", "Built dashboards and improved reporting accuracy.", "Supported digital systems and transformation initiatives."]],
    ],
    skillList: ["Logistics & Supply Chain", "CargoX & Nafeza", "Data Analysis & Power BI", "SAP, Oracle & Odoo", "International Trade", "WordPress & AI Automation"],
    edu: ["Bachelor of Social Work — Higher Institute of Social Work, Zagazig", "Supply Chain Management Fundamentals — Coursera", "Data Analysis with Excel & Power BI", "WordPress Development Essentials", "Lean Six Sigma Fundamentals"],
  },
};

export function ResumePage({ lang }) {
  const c = d[lang];
  return <main className="resume-page"><section className="resume-hero podcast-hero"><div><span>{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p><div><a href="/Mohamed-Elhawy-CV.pdf" download><FiDownload />{c.download}</a><a href="mailto:m.elhawy2023@gmail.com"><FiMail />{lang === "ar" ? "تواصل معي" : "Contact me"}</a></div></div><img src="/assets/mohamed-elhawy-podcast.png" alt={lang === "ar" ? "محمد الحاوي في بودكاست" : "Mohamed Elhawy in a podcast studio"} /></section><section className="resume-section"><header><span>01</span><h2>{c.experience}</h2></header><div className="resume-jobs">{c.jobs.map(([date,title,company,items]) => <article key={title}><time>{date}</time><h3>{title}</h3><p>{company}</p><ul>{items.map(x => <li key={x}><FiCheckCircle />{x}</li>)}</ul></article>)}</div></section><section className="resume-section split"><div><header><span>02</span><h2>{c.skills}</h2></header><div className="skill-list">{c.skillList.map(x => <span key={x}>{x}</span>)}</div></div><div><header><span>03</span><h2>{c.education}</h2></header><ul className="education-list">{c.edu.map(x => <li key={x}>{x}</li>)}</ul></div></section><section className="resume-cta"><h2>{lang === "ar" ? "هل تريد مناقشة فرصة أو مشروع؟" : "Want to discuss an opportunity or project?"}</h2><a href="mailto:m.elhawy2023@gmail.com">m.elhawy2023@gmail.com <FiExternalLink /></a></section></main>;
}
