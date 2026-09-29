import Booking from "@/components/Booking";

export const metadata = { title: "Бронирование · коворкинг «Этаж»" };

export default function Page() {
  return (
    <main className="wrap">
      <div className="page-head">
        <span className="kick">Онлайн-бронирование</span>
        <h1>Выберите место и время</h1>
        <p>Серые часы уже заняты. Нажмите на начало, затем на конец нужного интервала – цена посчитается сразу.</p>
      </div>
      <div style={{ marginTop: 24 }}>
        <Booking />
      </div>
    </main>
  );
}
