# Сайт SHTAB

Представительский сайт студии: [github.com/SHTAB-development](https://github.com/SHTAB-development).
Тёмный премиум по [брендбуку](https://github.com/SHTAB-development/SHTAB/blob/main/BRAND.md):
Ink + Ivory + латунный акцент, Unbounded + Onest, GSAP-анимации со скроллом.

**Статус:** в проде на Railway.

## Стек

Статика без сборки: HTML + CSS + vanilla JS, GSAP + ScrollTrigger с CDN.
Раздаёт Caddy (см. `Dockerfile` и `Caddyfile`), порт берётся из `$PORT`.

## Запуск локально

```bash
python3 -m http.server 8080
# или: docker build -t shtab-site . && docker run -p 8080:8080 shtab-site
```

## Деплой

Railway собирает Dockerfile автоматически: `railway up` из корня репозитория.

## Структура

- `index.html` — вся страница: hero, факты, кейсы, услуги (пин-скролл), процесс, CTA
- `css/style.css` — токены бренда и стили
- `js/main.js` — фоновая сетка на canvas, счётчики, скролл-анимации
- Форма заявки в секции CTA: без `data-endpoint` открывает готовое письмо на shtab@shtabdev.com;
  с `data-endpoint` и `data-key` (например, Web3Forms) шлёт заявку без почтового клиента

---

<sub>Сделано в <a href="https://github.com/SHTAB-development">SHTAB</a></sub>
