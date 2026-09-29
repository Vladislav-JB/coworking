import CallbackForm from "@/components/CallbackForm";

export const metadata = { title: "Контакты · коворкинг «Этаж»" };

export default function Page() {
  return (
    <main className="wrap">
      <div className="page-head">
        <span className="kick">Контакты</span>
        <h1>Как нас найти</h1>
      </div>
      <div className="contact" style={{ marginTop: 28 }}>
        <div className="panel">
          <dl>
            <dt>Адрес</dt><dd>ул. Примерная, 1, 3 этаж</dd>
            <dt>Часы</dt><dd>ежедневно 8:00–23:00</dd>
            <dt>Телефон</dt><dd>+7 (900) 000-00-00</dd>
            <dt>Почта</dt><dd>hello@example.com</dd>
          </dl>
          <div className="band" style={{ marginTop: 20, gridTemplateColumns: "minmax(0,1fr)", padding: 24 }}>
            <div><h3>Заказать звонок</h3></div>
            <CallbackForm />
          </div>
        </div>
        <div className="map">Здесь будет Яндекс Карта</div>
      </div>
    </main>
  );
}
