import { asset } from "@/lib/asset";
import type { Metadata } from "next";
import Link from "next/link";
import { Cairo } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Solo Learn | علم نفسك الإنجليزية",
  description: "تعلّم الإنجليزية بنفسك بالاستماع والكتابة حرفًا بحرف.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-page text-ink">
        <header className="bg-ink text-card">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-3 text-lg font-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/icon.png")} alt="" className="h-9 w-9 rounded-xl" />
              Solo Learn
            </Link>
            <div className="flex items-center gap-5 text-sm font-semibold">
              <Link href="/learn" className="text-card/80 hover:text-card">
                الدروس
              </Link>
              <Link href="/people" className="text-card/80 hover:text-card">
                الناس
              </Link>
              <Link href="/about" className="text-card/80 hover:text-card">
                عن الموقع
              </Link>
              <Link href="/profile" className="text-card/80 hover:text-card">
                حسابي
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
