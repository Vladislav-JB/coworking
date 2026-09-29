# Коворкинг «Этаж» – исходный код (Next.js 15, App Router, TypeScript)

Демо: https://vladislav-jb.github.io/coworking/

- app/ – страницы: главная, пространства, цены, контакты, бронирование, админка
- components/Booking.tsx – календарь свободного времени и бронирование
- components/Admin.tsx – админка: брони, статусы, статистика
- lib/data.ts – пространства, цены и хранилище броней (в демо – localStorage; в боевой версии – API и база данных)

Запуск: npm install, затем npm run dev
