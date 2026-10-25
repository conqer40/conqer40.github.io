"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase as maybeSupabase, supabaseConfigured } from "@/lib/supabase";

// Every use below is guarded by supabaseConfigured, so the client exists when it runs.
const supabase = maybeSupabase!;

type Person = { id: string; display_name: string; bio: string; level: string | null; gender: string | null };
type Friendship = { id: number; requester_id: string; addressee_id: string; status: "pending" | "accepted" };

export default function PeoplePage() {
  const [me, setMe] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async (userId: string) => {
    const [{ data: others }, { data: rows }] = await Promise.all([
      supabase.from("profiles").select("id,display_name,bio,level,gender").neq("id", userId).order("display_name"),
      supabase.from("friendships").select("id,requester_id,addressee_id,status").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),
    ]);
    setPeople((others as Person[]) ?? []);
    setFriendships((rows as Friendship[]) ?? []);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const id = auth.user?.id ?? null;
      setMe(id);
      if (id) {
        const { data: contact } = await supabase.from("profile_contacts").select("user_id").eq("user_id", id).maybeSingle();
        setHasPhone(Boolean(contact));
        await refresh(id);
      }
      setLoaded(true);
    })();
  }, [refresh]);

  // Refresh when a friend request changes, so both sides see it.
  useEffect(() => {
    if (!me) return;
    const channel = supabase
      .channel("friendships-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, () => refresh(me))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [me, refresh]);

  async function sendRequest(addresseeId: string) {
    if (!me) return;
    const { error } = await supabase.from("friendships").insert({ requester_id: me, addressee_id: addresseeId, status: "pending" });
    setMessage(error ? "مقدرتش أبعت الطلب. اتأكد إن رقم تليفونك متسجل." : "اتبعت طلب الصداقة.");
    await refresh(me);
  }

  async function accept(friendshipId: number) {
    if (!me) return;
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    await refresh(me);
  }

  async function remove(friendshipId: number) {
    if (!me) return;
    await supabase.from("friendships").delete().eq("id", friendshipId);
    await refresh(me);
  }

  if (!supabaseConfigured) return <p className="text-ink-soft">تسجيل الدخول مش متوصّل دلوقتي.</p>;
  if (!loaded) return <p className="text-ink-soft">جاري التحميل…</p>;
  if (!me) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-card p-6">
        <h1 className="text-2xl font-black">لازم تسجّل دخول الأول</h1>
        <Link href="/login" className="font-bold text-cyan-dark underline">
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  const nameOf = (id: string) => people.find((p) => p.id === id)?.display_name ?? "مستخدم";
  const incoming = friendships.filter((f) => f.status === "pending" && f.addressee_id === me);
  const friends = friendships.filter((f) => f.status === "accepted");
  const relationWith = (id: string) => friendships.find((f) => (f.requester_id === id && f.addressee_id === me) || (f.addressee_id === id && f.requester_id === me));
  const visible = people.filter((p) => p.display_name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black sm:text-4xl">الناس</h1>
        <p className="text-ink-soft">ابعت طلب صداقة لأي حد، ولما يقبله تقدروا تتكلموا من الشات تحت على الشمال.</p>
      </header>

      {!hasPhone ? (
        <div className="rounded-2xl border-2 border-orange bg-card p-4 font-bold text-orange-dark">
          لازم تكتب رقم تليفونك في <Link href="/profile" className="underline">حسابي</Link> قبل ما تبعت طلبات صداقة.
        </div>
      ) : null}

      {message ? <p className="font-bold text-cyan-dark">{message}</p> : null}

      {incoming.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">طلبات صداقة جديدة</h2>
          {incoming.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-card p-4">
              <span className="font-bold">{nameOf(f.requester_id)}</span>
              <div className="flex gap-2">
                <button onClick={() => accept(f.id)} className="rounded-full bg-orange px-4 py-2 font-bold text-card">
                  قبول
                </button>
                <button onClick={() => remove(f.id)} className="rounded-full border-2 border-ink px-4 py-2 font-bold">
                  رفض
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-black">أصدقائي ({friends.length})</h2>
        {friends.length === 0 ? <p className="text-ink-soft">لسه مفيش أصدقاء.</p> : null}
        {friends.map((f) => {
          const other = f.requester_id === me ? f.addressee_id : f.requester_id;
          return (
            <div key={f.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-card p-4">
              <span className="font-bold">{nameOf(other)}</span>
              <button onClick={() => remove(f.id)} className="text-sm font-bold text-ink-soft underline">
                إلغاء الصداقة
              </button>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-black">كل المستخدمين</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم"
          className="rounded-full border-2 border-ink bg-card px-4 py-2"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((p) => {
            const rel = relationWith(p.id);
            return (
              <div key={p.id} className="flex flex-col gap-2 rounded-3xl border-2 border-ink bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black">{p.display_name || "مستخدم"}</span>
                  {p.level ? <span className="rounded-full bg-cyan px-3 py-1 text-xs font-bold text-card">{p.level}</span> : null}
                </div>
                {p.bio ? <p className="text-sm text-ink-soft">{p.bio}</p> : null}
                <div>
                  {!rel ? (
                    <button
                      onClick={() => sendRequest(p.id)}
                      disabled={!hasPhone}
                      className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-card disabled:opacity-50"
                    >
                      أضف صديق
                    </button>
                  ) : rel.status === "accepted" ? (
                    <span className="text-sm font-bold text-cyan-dark">صديق</span>
                  ) : rel.requester_id === me ? (
                    <span className="text-sm font-bold text-ink-soft">الطلب مستني رد</span>
                  ) : (
                    <button onClick={() => accept(rel.id)} className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-card">
                      قبول الطلب
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
