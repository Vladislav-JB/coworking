"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  ["/spaces/", "Пространства"],
  ["/prices/", "Цены"],
  ["/contacts/", "Контакты"],
  ["/admin/", "Админка"],
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = () => {
    const hdr = document.querySelector(".hdr");
    hdr?.classList.toggle("open", !open);
    setOpen(!open);
  };
  const close = () => {
    document.querySelector(".hdr")?.classList.remove("open");
    setOpen(false);
  };
  return (
    <>
      <nav className="nav" aria-label="Разделы">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} aria-current={path === href ? "page" : undefined} onClick={close}>
            {label}
          </Link>
        ))}
        <Link className="btn btn--acc btn--sm" href="/booking/" onClick={close}>
          Забронировать
        </Link>
      </nav>
      <button className="burger" aria-label="Меню" aria-expanded={open} onClick={toggle}>
        ☰
      </button>
    </>
  );
}
