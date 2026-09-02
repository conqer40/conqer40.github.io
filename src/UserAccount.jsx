import { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiFacebook,
  FiLock,
  FiLogIn,
  FiLogOut,
  FiPhone,
  FiTwitter,
  FiUser,
} from "react-icons/fi";
import { supabase, supabaseReady } from "./supabase.js";

const AuthContext = createContext({
  session: null,
  profile: null,
  loading: true,
});
export const accountEmail = (phone) => {
  const clean = String(phone || "").replace(/\D/g, "");
  return clean === "01022104948"
    ? `${clean}@admin.elhawy.local`
    : `${clean}@users.elhawy.local`;
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const readProfile = async (nextSession) => {
    setSession(nextSession);
    if (!nextSession) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", nextSession.user.id)
      .maybeSingle();
    if (data && data.active === false) {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } else setProfile(data || null);
    setLoading(false);
  };
  useEffect(() => {
    if (!supabaseReady) return setLoading(false);
    supabase.auth.getSession().then(({ data }) => readProfile(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      readProfile(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ session, profile, loading, readProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAccount = () => useContext(AuthContext);

export function LoginPage() {
  const { session, loading } = useAccount();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (!loading && session) return <Navigate to="/profile" replace />;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length !== 11) {
      setBusy(false);
      return setMessage("اكتب رقم موبايل مصري صحيح من 11 رقمًا");
    }
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: accountEmail(phone),
        password: form.password,
        options: { data: { full_name: form.name, phone } },
      });
      setMessage(
        error
          ? error.message.includes("registered")
            ? "رقم الهاتف مسجل بالفعل"
            : "تعذر إنشاء الحساب. تأكد من قوة كلمة المرور"
          : data.session
            ? "تم إنشاء الحساب بنجاح"
            : "تم إنشاء الحساب ويمكنك تسجيل الدخول الآن",
      );
      if (!error && data.session) navigate("/profile");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: accountEmail(phone),
        password: form.password,
      });
      if (error) setMessage("رقم الهاتف أو كلمة المرور غير صحيحة");
      else navigate(location.state?.from || "/profile");
    }
    setBusy(false);
  };
  return (
    <main className="account-page">
      <section className="account-promo">
        <span>ELHAWY COMMUNITY</span>
        <h1>مساحتك داخل مجتمع الحاوي</h1>
        <p>احفظ بياناتك وتابع المحتوى، بحساب بسيط يعتمد على رقم الهاتف.</p>
        <div>
          <FiCheckCircle /> دخول موحد للمستخدم والأدمن
        </div>
        <div>
          <FiCheckCircle /> بروفايل شخصي لكل عضو
        </div>
        <div>
          <FiCheckCircle /> حماية وإدارة مركزية للحسابات
        </div>
      </section>
      <form className="account-form" onSubmit={submit}>
        <div className="account-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            إنشاء حساب
          </button>
        </div>
        <FiUser className="account-form-icon" />
        <h2>{mode === "login" ? "أهلًا بعودتك" : "انضم إلى الموقع"}</h2>
        {mode === "signup" && (
          <label>
            الاسم الكامل
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
        )}
        <label>
          رقم الهاتف
          <input
            required
            inputMode="numeric"
            placeholder="01xxxxxxxxx"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          كلمة المرور
          <input
            required
            minLength="8"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {message && <div className="account-message">{message}</div>}
        <button className="account-submit" disabled={busy}>
          {busy ? (
            "جارٍ التنفيذ..."
          ) : mode === "login" ? (
            <>
              <FiLogIn /> دخول
            </>
          ) : (
            <>
              <FiUser /> إنشاء الحساب
            </>
          )}
        </button>
      </form>
    </main>
  );
}

export function ProfilePage() {
  const { session, profile, loading, readProfile } = useAccount();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => setName(profile?.full_name || ""), [profile]);
  if (loading)
    return (
      <main className="page">
        <div className="catalog-loading">جارٍ تحميل الحساب</div>
      </main>
    );
  if (!session)
    return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);
    setMessage(error ? "تعذر حفظ التعديل" : "تم حفظ بياناتك");
    if (!error) readProfile(session);
  };
  return (
    <main className="profile-page page">
      <section className="profile-card">
        <div className="profile-avatar">
          {(profile?.full_name || "م").charAt(0)}
        </div>
        <div>
          <span>
            {profile?.role === "admin" ? "مدير الموقع" : "عضو في مجتمع Elhawy"}
          </span>
          <h1>{profile?.full_name || "حسابي"}</h1>
          <p>
            <FiPhone /> {profile?.phone}
          </p>
        </div>
      </section>
      <div className="profile-grid">
        <form onSubmit={save}>
          <FiEdit3 />
          <h2>البيانات الشخصية</h2>
          <label>
            الاسم الكامل
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {message && <div className="account-message">{message}</div>}
          <button>حفظ التعديلات</button>
        </form>
        <aside>
          <FiLock />
          <h2>اختصارات الحساب</h2>
          {(profile?.role === "admin" || session.user.email === "01022104948@admin.elhawy.local") && (
            <Link to="/admin/library">
              فتح لوحة التحكم <FiArrowLeft />
            </Link>
          )}
          <button onClick={() => supabase.auth.signOut()}>
            <FiLogOut /> تسجيل الخروج
          </button>
        </aside>
      </div>
    </main>
  );
}

export function ContactPage() {
  return (
    <main className="contact-page page">
      <section className="contact-hero">
        <span>LET'S BUILD SOMETHING USEFUL</span>
        <h1>
          فكرة، مشروع، أو تعاون؟
          <br />
          خلّينا نتكلم.
        </h1>
        <p>
          تواصل مباشرة مع محمد الحاوي لمشروعات الذكاء الاصطناعي، التشغيل، التحول
          الرقمي وسلاسل الإمداد.
        </p>
      </section>
      <section className="contact-pro-grid">
        <article className="contact-person">
          <img src="/assets/mohamed-elhawy-transparent.png" alt="محمد الحاوي" />
          <div>
            <small>تواصل مع</small>
            <h2>محمد الحاوي</h2>
            <p>Logistics · Operations · Artificial Intelligence</p>
          </div>
        </article>
        <div className="contact-channels">
          <a href="tel:01022104948">
            <FiPhone />
            <div>
              <small>اتصال مباشر</small>
              <b>01022104948</b>
            </div>
          </a>
          <a href="https://wa.me/201022104948" target="_blank" rel="noreferrer">
            <FiPhone />
            <div>
              <small>واتساب</small>
              <b>ابدأ محادثة</b>
            </div>
          </a>
          <a
            href="https://www.facebook.com/MohamedElhawy0"
            target="_blank"
            rel="noreferrer"
          >
            <FiFacebook />
            <div>
              <small>Facebook</small>
              <b>MohamedElhawy0</b>
            </div>
          </a>
          <a href="https://x.com/elhawym" target="_blank" rel="noreferrer">
            <FiTwitter />
            <div>
              <small>X / Twitter</small>
              <b>@elhawym</b>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}

export function AccountNav() {
  const { session, profile } = useAccount();
  return session ? (
    <Link className="account-nav" to="/profile">
      <FiUser />
      <span>{profile?.full_name?.split(" ")[0] || "حسابي"}</span>
    </Link>
  ) : (
    <Link className="account-nav" to="/login">
      <FiLogIn />
      <span>دخول</span>
    </Link>
  );
}
