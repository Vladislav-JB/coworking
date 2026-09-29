"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Booking as B, CLOSE_HOUR, KIND_LABEL, OPEN_HOUR, SPACES, SpaceKind,
  busyHours, loadBookings, rub, saveBookings, space, ymd,
} from "@/lib/data";

const WD = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MON = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export default function Booking({ initialKind }: { initialKind?: SpaceKind }) {
  const [all, setAll] = useState<B[]>([]);
  const [kind, setKind] = useState<SpaceKind>(initialKind ?? "meeting");
  const [spaceId, setSpaceId] = useState(SPACES.find((s) => s.kind === (initialKind ?? "meeting"))!.id);
  const [week, setWeek] = useState(0);
  const [date, setDate] = useState(ymd(new Date()));
  const [sel, setSel] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<B | null>(null);

  useEffect(() => {
    setAll(loadBookings());
    const k = new URLSearchParams(location.search).get("type") as SpaceKind | null;
    if (k && KIND_LABEL[k]) pickKind(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickKind(k: SpaceKind) {
    setKind(k);
    setSpaceId(SPACES.find((s) => s.kind === k)!.id);
    setSel([]);
    setDone(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + week * 7 + i);
      out.push(d);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  const sp = space(spaceId);
  const busy = busyHours(all, spaceId, date);
  const nowHour = new Date().getHours();
  const isToday = date === ymd(new Date());
  const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i);
  const blocked = (h: number) => busy.has(h) || (isToday && h <= nowHour);

  function freeCount(d: Date) {
    const b = busyHours(all, spaceId, ymd(d));
    const t = ymd(d) === ymd(new Date());
    return hours.filter((h) => !b.has(h) && !(t && h <= nowHour)).length;
  }

  // Выбор непрерывного интервала: клик по началу, затем по концу
  function clickHour(h: number) {
    setDone(null);
    if (sel.length === 0 || sel.length > 1 || h < sel[0]) return setSel([h]);
    const range: number[] = [];
    for (let x = sel[0]; x <= h; x++) {
      if (blocked(x)) return setSel([h]);
      range.push(x);
    }
    setSel(range);
  }

  const total = sel.length * sp.price;
  const d = new Date(date);

  function book(e: React.FormEvent) {
    e.preventDefault();
    if (!sel.length) return;
    const b: B = {
      id: "u" + Date.now(), spaceId, date, start: sel[0], hours: sel.length,
      name: name.trim(), phone: phone.trim(), created: Date.now(), status: "new",
    };
    const next = [...all, b];
    setAll(next);
    saveBookings(next);
    setDone(b);
    setSel([]);
  }

  return (
    <div className="bk">
      <div className="panel">
        <div className="tabs" role="group" aria-label="Тип пространства">
          {(Object.keys(KIND_LABEL) as SpaceKind[]).map((k) => (
            <button key={k} className="tab" aria-pressed={kind === k} onClick={() => pickKind(k)}>
              {KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <div className="spaces">
          {SPACES.filter((s) => s.kind === kind).map((s) => (
            <button key={s.id} className="sp" aria-pressed={spaceId === s.id} onClick={() => { setSpaceId(s.id); setSel([]); setDone(null); }}>
              <b>{s.name}</b>
              <span>до {s.seats} чел. · {s.note}</span>
              <span><strong>{rub(s.price)}</strong> / час</span>
            </button>
          ))}
        </div>

        <div className="weeknav">
          <button className="btn btn--sm" onClick={() => setWeek(Math.max(0, week - 1))} disabled={week === 0} aria-label="Предыдущая неделя">←</button>
          <span>{days[0].getDate()} {MON[days[0].getMonth()]} – {days[6].getDate()} {MON[days[6].getMonth()]}</span>
          <button className="btn btn--sm" onClick={() => setWeek(Math.min(3, week + 1))} disabled={week === 3} aria-label="Следующая неделя">→</button>
        </div>
        <div className="days">
          {days.map((dd) => {
            const key = ymd(dd), n = all.length ? freeCount(dd) : 0;
            return (
              <button key={key} className="day" aria-pressed={date === key} disabled={n === 0 && all.length > 0}
                onClick={() => { setDate(key); setSel([]); setDone(null); }}>
                <span>{WD[dd.getDay()]}</span>
                <b>{dd.getDate()}</b>
                <i className={n === 0 ? "full" : ""}>{n === 0 ? "занято" : `${n} ч`}</i>
              </button>
            );
          })}
        </div>

        <div className="slots" aria-label="Время">
          {hours.map((h) => (
            <button key={h} className={"slot" + (sel.includes(h) ? " on" : "")} disabled={blocked(h)} onClick={() => clickHour(h)}>
              {String(h).padStart(2, "0")}:00
            </button>
          ))}
        </div>
        <div className="legend">
          <span><i style={{ background: "#fff", border: "1px solid var(--line)" }} />свободно</span>
          <span><i style={{ background: "var(--busy)" }} />занято</span>
          <span><i style={{ background: "var(--acc)" }} />ваш выбор</span>
          <span>Нажмите на начало, затем на конец интервала</span>
        </div>
      </div>

      <form className="panel sum" onSubmit={book}>
        <h3>Ваша бронь</h3>
        <dl>
          <dt>Пространство</dt><dd>{sp.name}</dd>
          <dt>Дата</dt><dd>{WD[d.getDay()]}, {d.getDate()} {MON[d.getMonth()]}</dd>
          <dt>Время</dt><dd>{sel.length ? `${sel[0]}:00 – ${sel[sel.length - 1] + 1}:00` : "не выбрано"}</dd>
          <dt>Часов</dt><dd>{sel.length || "–"}</dd>
        </dl>
        <div className="total"><span>Итого</span><span>{rub(total)}</span></div>
        <label className="field">Имя<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field">Телефон<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></label>
        <button className="btn btn--acc" type="submit" disabled={!sel.length}>Забронировать</button>
        {done && (
          <p className="done">
            Бронь создана: {space(done.spaceId).name}, {done.start}:00–{done.start + done.hours}:00.
            <small>Демо: бронь сохранилась в вашем браузере и уже видна в админке. На боевом сайте – SMS и письмо с подтверждением.</small>
          </p>
        )}
      </form>
    </div>
  );
}
