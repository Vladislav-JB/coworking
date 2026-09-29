import Link from "next/link";
import { SPACES, KIND_LABEL, rub } from "@/lib/data";

export const metadata = { title: "Пространства · коворкинг «Этаж»" };

export default function Page() {
  return (
    <main className="wrap">
      <div className="page-head">
        <span className="kick">Пространства</span>
        <h1>Места, кабинеты и переговорные</h1>
        <p>Всё можно забронировать по часам. Если нужно на месяц – посмотрите абонементы в разделе «Цены».</p>
      </div>
      <div className="cards" style={{ marginTop: 28 }}>
        {SPACES.map((s) => (
          <div className="card" key={s.id}>
            <span className="kick" style={{ color: "var(--muted)" }}>{KIND_LABEL[s.kind]}</span>
            <h3>{s.name}</h3>
            <p>До {s.seats} чел. · {s.note}</p>
            <p className="price">{rub(s.price)} <small>/ час</small></p>
            <Link className="btn btn--sm btn--acc" href={`/booking/?type=${s.kind}`}>Забронировать</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
