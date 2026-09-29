import Link from "next/link";

export const metadata = { title: "Цены · коворкинг «Этаж»" };

const PLANS = [
  { n: "Разовый визит", p: "от 250 ₽ / час", d: "Любое свободное место по часам. Дневной тариф от 8 часов – 1 600 ₽." },
  { n: "10 дней в месяц", p: "9 900 ₽", d: "Любые 10 дней в течение месяца, место – любое свободное." },
  { n: "Безлимит", p: "16 900 ₽ / мес", d: "Каждый день с 8:00 до 23:00, шкафчик и 4 часа переговорной включены." },
  { n: "Фиксированное место", p: "21 900 ₽ / мес", d: "Ваш стол, монитор и тумба с замком. Доступ 24/7." },
];

export default function Page() {
  return (
    <main className="wrap">
      <div className="page-head">
        <span className="kick">Цены</span>
        <h1>Тарифы и абонементы</h1>
        <p>Кабинеты и переговорные – по часам, цены указаны на странице пространств и в календаре бронирования.</p>
      </div>
      <div className="cards" style={{ marginTop: 28, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {PLANS.map((p) => (
          <div className="card" key={p.n}>
            <h3>{p.n}</h3>
            <p className="price">{p.p}</p>
            <p>{p.d}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24 }}><Link className="btn btn--acc" href="/booking/">Забронировать по часам</Link></p>
    </main>
  );
}
