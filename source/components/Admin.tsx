"use client";
import { useEffect, useMemo, useState } from "react";
import { Booking as B, CLOSE_HOUR, KIND_LABEL, OPEN_HOUR, SPACES, loadBookings, resetBookings, rub, saveBookings, space, ymd } from "@/lib/data";

const ST: Record<B["status"], string> = { new: "Новая", confirmed: "Подтверждена", cancelled: "Отменена" };

export default function Admin() {
  const [all, setAll] = useState<B[]>([]);
  const [fStatus, setFStatus] = useState("");
  const [fSpace, setFSpace] = useState("");
  const [fDate, setFDate] = useState("");
  useEffect(() => setAll(loadBookings()), []);

  function update(id: string, status: B["status"]) {
    const next = all.map((b) => (b.id === id ? { ...b, status } : b));
    setAll(next);
    saveBookings(next);
  }

  const today = ymd(new Date());
  const active = all.filter((b) => b.status !== "cancelled");
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
  const last30 = active.filter((b) => b.date >= ymd(monthAgo) && b.date <= today);
  const revenue = last30.reduce((s, b) => s + b.hours * space(b.spaceId).price, 0);
  const capacity = SPACES.length * (CLOSE_HOUR - OPEN_HOUR) * 30;
  const load = Math.round((last30.reduce((s, b) => s + b.hours, 0) / capacity) * 100);
  const todayCount = active.filter((b) => b.date === today).length;
  const newCount = all.filter((b) => b.status === "new").length;

  // Выручка по дням: 21 день назад + 7 вперёд
  const days = useMemo(() => {
    const out: { key: string; label: string; sum: number; fut: boolean }[] = [];
    for (let i = -20; i <= 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const key = ymd(d);
      const sum = active.filter((b) => b.date === key).reduce((s, b) => s + b.hours * space(b.spaceId).price, 0);
      out.push({ key, label: `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`, sum, fut: i > 0 });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);
  const maxDay = Math.max(1, ...days.map((d) => d.sum));

  const bySpace = SPACES.map((s) => {
    const h = last30.filter((b) => b.spaceId === s.id).reduce((x, b) => x + b.hours, 0);
    return { s, pct: Math.round((h / ((CLOSE_HOUR - OPEN_HOUR) * 30)) * 100) };
  });

  const list = all
    .filter((b) => b.date >= today)
    .filter((b) => !fStatus || b.status === fStatus)
    .filter((b) => !fSpace || b.spaceId === fSpace)
    .filter((b) => !fDate || b.date === fDate)
    .sort((a, b) => (a.status === "new" ? -1 : 0) - (b.status === "new" ? -1 : 0) || a.date.localeCompare(b.date) || a.start - b.start)
    .slice(0, 40);

  return (
    <>
      <p className="note">Демо-админка: данные хранятся в вашем браузере. В боевой версии – вход по паролю, база данных и уведомления о новых бронях в Telegram.</p>
      <div className="kpi">
        <div><b>{rub(revenue)}</b><span>выручка за 30 дней</span></div>
        <div><b>{load}%</b><span>загрузка пространств</span></div>
        <div><b>{todayCount}</b><span>броней сегодня</span></div>
        <div><b>{newCount}</b><span>ждут подтверждения</span></div>
      </div>
      <div className="grid2">
        <div className="panel">
          <h3>Выручка по дням</h3>
          <div className="chart" role="img" aria-label="Столбчатая диаграмма выручки по дням">
            {days.map((d) => (
              <div key={d.key} className={d.fut ? "fut" : ""} style={{ height: `${(d.sum / maxDay) * 100}%` }} data-t={`${d.label}: ${rub(d.sum)}`} />
            ))}
          </div>
          <div className="axis"><span>{days[0]?.label}</span><span>сегодня</span><span>{days[days.length - 1]?.label}</span></div>
        </div>
        <div className="panel">
          <h3 style={{ marginBottom: 14 }}>Загрузка за 30 дней</h3>
          <div className="hbars">
            {bySpace.map(({ s, pct }) => (
              <div className="hb" key={s.id}><span>{s.name}</span><span className="t"><i style={{ width: `${pct}%` }} /></span><b>{pct}%</b></div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="adm-top">
          <h3>Ближайшие брони</h3>
          <div className="filters">
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} aria-label="Статус">
              <option value="">Все статусы</option><option value="new">Новые</option><option value="confirmed">Подтверждённые</option><option value="cancelled">Отменённые</option>
            </select>
            <select value={fSpace} onChange={(e) => setFSpace(e.target.value)} aria-label="Пространство">
              <option value="">Все пространства</option>
              {SPACES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} aria-label="Дата" />
            <button className="btn btn--sm" onClick={() => { setAll(resetBookings()); }}>Сбросить демо</button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Дата и время</th><th>Пространство</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th></th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id}>
                  <td>{b.date.slice(8)}.{b.date.slice(5, 7)} · {b.start}:00–{b.start + b.hours}:00</td>
                  <td>{space(b.spaceId).name}<br /><small className="muted">{KIND_LABEL[space(b.spaceId).kind]}</small></td>
                  <td>{b.name}<br /><small className="muted">{b.phone}</small></td>
                  <td>{rub(b.hours * space(b.spaceId).price)}</td>
                  <td><span className={`st ${b.status}`}>{ST[b.status]}</span></td>
                  <td className="acts">
                    {b.status === "new" && <button className="btn btn--sm btn--acc" onClick={() => update(b.id, "confirmed")}>Подтвердить</button>}
                    {b.status !== "cancelled" && <button className="btn btn--sm" onClick={() => update(b.id, "cancelled")}>Отменить</button>}
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={6} className="muted">Броней не найдено</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
