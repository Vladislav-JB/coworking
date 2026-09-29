import Admin from "@/components/Admin";

export const metadata = { title: "Админка · коворкинг «Этаж»", robots: { index: false } };

export default function Page() {
  return (
    <main className="wrap">
      <div className="page-head">
        <span className="kick">Панель администратора</span>
        <h1>Брони и статистика</h1>
      </div>
      <div style={{ marginTop: 24 }}>
        <Admin />
      </div>
    </main>
  );
}
