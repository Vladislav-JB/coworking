import Link from "next/link";
import CallbackForm from "@/components/CallbackForm";
import { SPACES, KIND_LABEL, rub } from "@/lib/data";

const minPrice = (k: string) => Math.min(...SPACES.filter((s) => s.kind === k).map((s) => s.price));

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="hero__in">
            <div className="hero__txt">
              <span className="kick">Коворкинг в центре · 8:00–23:00</span>
              <h1>Рабочее место, кабинет или переговорная – по часам</h1>
              <p className="lede">Свободное время видно сразу в календаре. Выбираете зал, день и часы – бронь подтверждается за минуту, без звонков и переписки.</p>
              <div className="hero__cta">
                <Link className="btn btn--acc" href="/booking/">Выбрать время</Link>
                <Link className="btn" href="/spaces/">Посмотреть пространства</Link>
              </div>
            </div>
            <div className="hero__pic" aria-hidden="true">
              <div className="plan">
                <div className="big free">Переговорная<br />свободна</div><div>Место</div><div className="free">Место</div><div>Место</div><div className="free">Место</div>
                <div>Место</div><div className="free">Место</div><div>Место</div><div>Место</div>
                <div className="wide">Кабинет на 4</div><div className="wide free">Кабинет на 2</div>
                <div className="wide">Кухня</div><div className="wide">Лаунж</div>
              </div>
              <div className="hero__badge"><b>14 мест</b>свободно сейчас</div>
            </div>
          </div>
          <div className="stats">
            <div><b>60</b><span>рабочих мест</span></div>
            <div><b>6</b><span>кабинетов</span></div>
            <div><b>2</b><span>переговорные</span></div>
            <div><b>1 мин</b><span>на бронирование онлайн</span></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec__head"><div><span className="kick">Пространства</span><h2>Что можно забронировать</h2></div><p>Цена за час. Чем дольше бронь – тем выгоднее: от 8 часов действует дневной тариф.</p></div>
          <div className="cards">
            {(["desk", "office", "meeting"] as const).map((k, i) => (
              <div className="card" key={k}>
                <span className="ic">{["💻", "🚪", "🗣"][i]}</span>
                <h3>{KIND_LABEL[k]}</h3>
                <p>{["Стол в open space или тихой зоне: розетки, лампа, быстрый Wi-Fi, кофе без ограничений.", "Закрытый кабинет на 2–4 человека с замком – для команды или звонков без помех.", "Переговорные на 6 и 12 человек: экран, камера для видеозвонков, флипчарт."][i]}</p>
                <p className="price">от {rub(minPrice(k))} <small>/ час</small></p>
                <Link className="btn btn--sm" href={`/booking/?type=${k}`}>Выбрать время</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec__head"><div><span className="kick">Как это работает</span><h2>Бронь за 4 шага</h2></div></div>
          <ol className="steps">
            <li><h3>Выберите пространство</h3><p>Место, кабинет или переговорную – с ценой и вместимостью.</p></li>
            <li><h3>Найдите свободное время</h3><p>Календарь показывает свободные часы на каждый день.</p></li>
            <li><h3>Оставьте контакты</h3><p>Имя и телефон – без регистрации и паролей.</p></li>
            <li><h3>Приходите</h3><p>Подтверждение придёт по SMS, на ресепшене вас уже ждут.</p></li>
          </ol>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec__head"><div><span className="kick">Включено в цену</span><h2>Всё для работы</h2></div></div>
          <div className="amen">
            {["Wi-Fi 500 Мбит/с", "Кофе и чай", "Кухня", "Принтер и сканер", "Шкафчики", "Душ", "Парковка для велосипедов", "Юр. адрес – по запросу", "Ресепшн с 8:00", "Тихая зона"].map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
      </section>

      <section className="sec faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec__head"><div><span className="kick">Вопросы</span><h2>Частые вопросы</h2></div></div>
          <details><summary>Можно ли отменить бронь?</summary><p>Да, бесплатно – не позднее чем за 2 часа до начала. Позже – оплачивается первый час.</p></details>
          <details><summary>Как оплатить?</summary><p>Картой на месте или по ссылке после подтверждения. Для компаний – по счёту с закрывающими документами.</p></details>
          <details><summary>Есть ли абонементы?</summary><p>Да: 10 дней в месяц, безлимит на месяц и фиксированное место. Цены – в разделе «Цены».</p></details>
          <details><summary>Можно прийти посмотреть?</summary><p>Конечно. Первый визит на 2 часа – бесплатно, просто забронируйте место.</p></details>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="band">
            <div><h2>Перезвоним и поможем выбрать</h2><p>Оставьте телефон – администратор перезвонит за 10 минут и подберёт пространство под вашу задачу.</p></div>
            <CallbackForm />
          </div>
        </div>
      </section>
    </main>
  );
}
