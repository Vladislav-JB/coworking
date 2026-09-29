import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/Nav";
import "./globals.css";

const manrope = Manrope({ variable: "--font", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Этаж · коворкинг с онлайн-бронированием",
  description: "Рабочие места, кабинеты и переговорные с бронированием по часам онлайн. Свободное время видно в календаре. Демо-сайт на Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={manrope.variable}>
        <header className="hdr">
          <div className="wrap hdr__in">
            <Link className="logo" href="/">
              <span className="logo__mk">Э</span>Этаж
            </Link>
            <Nav />
          </div>
        </header>
        {children}
        <footer className="ftr">
          <div className="wrap ftr__in">
            <div>
              <b>Коворкинг «Этаж»</b>
              <p>Ежедневно 8:00–23:00 · +7 (900) 000-00-00</p>
            </div>
            <nav>
              <Link href="/spaces/">Пространства</Link>
              <Link href="/booking/">Бронирование</Link>
              <Link href="/prices/">Цены</Link>
              <Link href="/contacts/">Контакты</Link>
              <Link href="/admin/">Админка (демо)</Link>
            </nav>
            <p className="ftr__demo">Демо-сайт на Next.js: название, цены и брони условные. Брони хранятся только в вашем браузере.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
