"use client";

import { useEffect, useRef, useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

// Every use below is guarded by supabaseConfigured, so the client exists when it runs.
const supabase = maybeSupabase!;

type Friend = { id: string; name: string };
type Msg = { id: number; sender_id: string; recipient_id: string; body: string; created_at: string };

export default function ChatWidget() {
  const [me, setMe] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [active, setActive] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Track who is signed in.
  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setMe(session?.user?.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  // Load friends when the panel opens.
  useEffect(() => {
    if (!me || !open) return;
    (async () => {
      const { data: rows } = await supabase
        .from("friendships")
        .select("requester_id,addressee_id,requester:profiles!requester_id(display_name),addressee:profiles!addressee_id(display_name)")
        .eq("status", "accepted")
        .or(`requester_id.eq.${me},addressee_id.eq.${me}`);
      const list: Friend[] = (rows ?? []).map((r: any) => {
        const isRequester = r.requester_id === me;
        const other = isRequester ? r.addressee : r.requester;
        return { id: isRequester ? r.addressee_id : r.requester_id, name: other?.display_name || "مستخدم" };
      });
      setFriends(list);
    })();
  }, [me, open]);

  // Load the conversation with the selected friend.
  useEffect(() => {
    if (!me || !active) return;
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("id,sender_id,recipient_id,body,created_at")
        .or(`and(sender_id.eq.${me},recipient_id.eq.${active.id}),and(sender_id.eq.${active.id},recipient_id.eq.${me})`)
        .order("created_at", { ascending: true })
        .limit(200);
      setMessages((data as Msg[]) ?? []);
    })();
  }, [me, active]);

  // Live messages for me.
  useEffect(() => {
    if (!me) return;
    const channel = supabase
      .channel(`chat-${me}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as Msg;
        if (m.sender_id !== me && m.recipient_id !== me) return;
        setMessages((list) => {
          if (list.some((x) => x.id === m.id)) return list;
          const belongs = active && (m.sender_id === active.id || m.recipient_id === active.id);
          return belongs ? [...list, m] : list;
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [me, active]);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!me || !active || !text.trim()) return;
    const body = text.trim().slice(0, 1000);
    setText("");
    const { data } = await supabase
      .from("messages")
      .insert({ sender_id: me, recipient_id: active.id, body })
      .select("id,sender_id,recipient_id,body,created_at")
      .single();
    if (data) setMessages((list) => (list.some((x) => x.id === data.id) ? list : [...list, data as Msg]));
  }

  if (!supabaseConfigured || !me) return null;

  return (
    <div dir="rtl" className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
      {open ? (
        <div className="flex h-[420px] w-[300px] flex-col overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-[6px_6px_0_0_var(--color-ink)]">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-card">
            <span className="font-black">{active ? active.name : "الشات"}</span>
            <div className="flex gap-3 text-sm">
              {active ? (
                <button onClick={() => setActive(null)} className="font-bold">
                  رجوع
                </button>
              ) : null}
              <button onClick={() => setOpen(false)} className="font-bold">
                إغلاق
              </button>
            </div>
          </div>

          {!active ? (
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
              {friends.length === 0 ? <p className="p-2 text-sm text-ink-soft">مفيش أصدقاء لسه. ابعت طلبات صداقة من صفحة الناس.</p> : null}
              {friends.map((f) => (
                <button key={f.id} onClick={() => setActive(f)} className="rounded-2xl border-2 border-ink bg-page px-4 py-3 text-right font-bold">
                  {f.name}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.sender_id === me ? "self-end bg-orange text-card" : "self-start bg-page"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="flex gap-2 border-t-2 border-ink p-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                  placeholder="اكتب رسالة"
                  className="flex-1 rounded-full border-2 border-ink bg-page px-3 py-2 text-sm"
                />
                <button type="submit" className="rounded-full bg-cyan px-4 py-2 text-sm font-bold text-card">
                  إرسال
                </button>
              </form>
            </>
          )}
        </div>
      ) : null}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="فتح الشات"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-orange text-2xl shadow-[4px_4px_0_0_var(--color-ink)] transition hover:-translate-y-0.5"
      >
        💬
      </button>
    </div>
  );
}
