# Сайт SHTAB — devshtab.com

Многостраничный сайт студии: главная, кейсы, услуги, о студии, контакты.
Тёмный премиум по [брендбуку](https://github.com/SHTAB-development/SHTAB/blob/main/BRAND.md):
Ink + Ivory + латунь, Unbounded + Onest, «свет наводит порядок» (фон на canvas, лампа за курсором на карточках).

**Статус:** в проде на Railway, домен devshtab.com.

## Стек

Astro 7 (статические страницы + Node-адаптер для одного серверного маршрута `/api/lead`),
GSAP для hero и пин-скролла услуг, нативные scroll-driven анимации для появлений,
View Transitions между страницами. Кейсы — Markdown в `src/content/work/`.

## Запуск локально

```bash
npm install
npm run dev          # http://localhost:4321
npm run build && npm start   # как в проде: node ./dist/server/entry.mjs
```

Режим `?static` на любой странице отключает сцены и живой фон — для скриншотов и QA.

## Заявки с сайта

Форма шлёт POST `/api/lead` → письмо (SMTP) + сообщение в Telegram. Переменные окружения — в `.env.example`.
Без них сервер отвечает 503, и форма открывает готовое письмо на shtab@shtabdev.com.

## Деплой

Railway собирает `Dockerfile` автоматически на push в `main`. Переменные окружения задаются в Railway.

## Структура

- `src/pages/` — страницы: `index`, `work/`, `work/[slug]`, `services`, `about`, `contact`, `404`, `api/lead.ts`
- `src/content/work/*.md` — кейсы, схема в `src/content.config.ts`
- `src/components/` — Nav, Footer, Facts, CaseCard, Services (пин-скролл), Process, Cta, LeadForm
- `src/scripts/motion.ts` — фон, лампа, навигация, форма, сцены GSAP (перезапуск на каждой странице)
- `src/styles/global.css` — токены бренда и стили
- `public/img/work/` — обложки и экраны кейсов, `public/og.png` — превью для соцсетей

---

<sub>Сделано в <a href="https://github.com/SHTAB-development">SHTAB</a></sub>
