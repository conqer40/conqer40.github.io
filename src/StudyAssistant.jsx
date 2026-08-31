import { useState } from "react";
import { FiBookOpen, FiMessageCircle, FiSend, FiShield } from "react-icons/fi";
import { supabaseReady } from "./supabase.js";
import "./study-assistant.css";

const endpoint = `${import.meta.env.VITE_SUPABASE_URL || ""}/functions/v1/study-assistant`;

export function StudyAssistant() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "أهلًا! أنا مساعد Elhawy التعليمي. اسألني عن المنهج، أدوات الموقع، المقالات أو محتوى المكتبة وسأشرحه لك ببساطة." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user", text: question }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      if (!supabaseReady) throw new Error("الخدمة غير متصلة حاليًا.");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ question, history: next.slice(-8).map(({ role, text }) => ({ role, text })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر الحصول على الإجابة.");
      setMessages((items) => [...items, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages((items) => [...items, { role: "assistant", text: error.message || "حدث خطأ، حاول مرة أخرى." }]);
    } finally { setLoading(false); }
  };

  return <main className="study-page">
    <section className="study-intro"><span>ELHAWY LEARNING AI</span><h1>اسأل المنهج<br/><em>وافهم ببساطة</em></h1><p>مساعد تعليمي مقيد بمحتوى المنهج والموقع. يشرح، يلخص، يضع أمثلة وأسئلة للمراجعة من المصادر المتاحة فقط.</p><div><FiShield /> لا يخرج عن محتوى المنهج والموقع</div></section>
    <section className="study-chat">
      <header><span><FiMessageCircle /></span><div><b>مساعد Elhawy التعليمي</b><small>متصل بقاعدة معرفة الموقع</small></div></header>
      <div className="study-messages">{messages.map((m, i) => <article key={i} className={m.role}><span>{m.role === "assistant" ? <FiBookOpen /> : "أنت"}</span><p>{m.text}</p></article>)}{loading && <article className="assistant typing"><span><FiBookOpen /></span><p>أفكر في محتوى المنهج…</p></article>}</div>
      <form onSubmit={send}><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); } }} placeholder="اكتب سؤالك عن المنهج أو الموقع…" rows="2" maxLength="1200"/><button disabled={!input.trim() || loading} aria-label="إرسال"><FiSend /></button></form>
      <small className="study-note">قد يخطئ المساعد؛ راجع المادة الأصلية في القرارات المهمة.</small>
    </section>
  </main>;
}
