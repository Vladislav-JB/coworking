// Демо-данные коворкинга и хранилище броней (в браузере, localStorage).
// В боевой версии эти функции заменяются запросами к API и базе данных.

export type SpaceKind = "desk" | "office" | "meeting";
export type Space = {
  id: string;
  kind: SpaceKind;
  name: string;
  seats: number;
  price: number; // ₽ в час
  note: string;
};

export const KIND_LABEL: Record<SpaceKind, string> = {
  desk: "Рабочее место",
  office: "Кабинет",
  meeting: "Переговорная",
};

export const SPACES: Space[] = [
  { id: "d1", kind: "desk", name: "Место у окна", seats: 1, price: 250, note: "Open space, розетки, лампа" },
  { id: "d2", kind: "desk", name: "Место в тихой зоне", seats: 1, price: 300, note: "Без звонков, шумоизоляция" },
  { id: "o1", kind: "office", name: "Кабинет на двоих", seats: 2, price: 700, note: "Дверь с замком, 9 м²" },
  { id: "o2", kind: "office", name: "Кабинет на четверых", seats: 4, price: 1100, note: "Окно, доска, 16 м²" },
  { id: "m1", kind: "meeting", name: "Переговорная «Малая»", seats: 6, price: 900, note: "ТВ 55″, веб-камера" },
  { id: "m2", kind: "meeting", name: "Переговорная «Большая»", seats: 12, price: 1600, note: "Проектор, флипчарт" },
];

export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 22;

export type Booking = {
  id: string;
  spaceId: string;
  date: string; // YYYY-MM-DD
  start: number; // час начала
  hours: number;
  name: string;
  phone: string;
  created: number;
  status: "new" | "confirmed" | "cancelled";
};

const KEY = "cw-bookings-v2";

export const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Детерминированные демо-брони на 14 дней вперёд и 30 назад
function seed(): Booking[] {
  let s = 42;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const names = ["Анна К.", "Игорь П.", "ООО «Сфера»", "Мария Д.", "Олег С.", "Студия «Кадр»", "Дмитрий Л.", "Елена В."];
  const out: Booking[] = [];
  const today = new Date();
  for (let off = -30; off <= 14; off++) {
    const d = new Date(today);
    d.setDate(d.getDate() + off);
    if (d.getDay() === 0 && rnd() < 0.6) continue;
    for (const sp of SPACES) {
      let h = OPEN_HOUR;
      while (h < CLOSE_HOUR - 1) {
        if (rnd() < (sp.kind === "desk" ? 0.35 : 0.28)) {
          const len = sp.kind === "desk" ? 3 + Math.floor(rnd() * 6) : 1 + Math.floor(rnd() * 3);
          const hours = Math.min(len, CLOSE_HOUR - h);
          out.push({
            id: `s${out.length}`,
            spaceId: sp.id,
            date: ymd(d),
            start: h,
            hours,
            name: names[Math.floor(rnd() * names.length)],
            phone: "+7 (900) 000-00-00",
            created: d.getTime() - 86400000 * (1 + Math.floor(rnd() * 5)),
            status: off < 0 || off > 3 ? "confirmed" : rnd() < 0.15 ? "new" : "confirmed",
          });
          h += hours + 1;
        } else h += 1;
      }
    }
  }
  return out;
}

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const b = seed();
  saveBookings(b);
  return b;
}

export function saveBookings(b: Booking[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(b));
  } catch {}
}

export function resetBookings(): Booking[] {
  const b = seed();
  saveBookings(b);
  return b;
}

// Занятые часы места на дату
export function busyHours(all: Booking[], spaceId: string, date: string): Set<number> {
  const set = new Set<number>();
  for (const b of all)
    if (b.spaceId === spaceId && b.date === date && b.status !== "cancelled")
      for (let h = b.start; h < b.start + b.hours; h++) set.add(h);
  return set;
}

export const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
export const space = (id: string) => SPACES.find((s) => s.id === id)!;
