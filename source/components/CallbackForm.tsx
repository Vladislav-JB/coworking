"use client";
import { useState } from "react";

export default function CallbackForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="cb"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input required placeholder="Имя" aria-label="Имя" autoComplete="name" />
      <input required type="tel" placeholder="Телефон" aria-label="Телефон" autoComplete="tel" />
      <button className="btn btn--acc" type="submit" disabled={sent}>
        Перезвоните мне
      </button>
      {sent && <p className="ok">Спасибо! Перезвоним за 10 минут. (Демо: заявка никуда не отправлена.)</p>}
    </form>
  );
}
