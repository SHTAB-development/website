/* SHTAB — движение и атмосфера. Контент виден и без JS: анимации только усиливают.
   Скрипт собирается один раз, поэтому всё, что зависит от страницы, вешается на astro:page-load
   и снимается на astro:before-swap. Фон (canvas) живёт между страницами. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ?static — режим для скриншотов и QA: всё видно сразу, без сцен и живого фона */
const staticMode = new URLSearchParams(location.search).has('static');
const reduced = staticMode || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (staticMode) document.documentElement.classList.add('static');
const coarse = matchMedia('(pointer: coarse)').matches;
const easeOut = 'power4.out';

/* ---------- Фон: свет наводит порядок.
   Вдали от курсора точки лежат вразнобой и тусклые, в круге света встают в ровную сетку
   и загораются латунью. Цикл отрисовки работает только пока что-то меняется. ---------- */
function initGrid() {
  const canvas = document.getElementById('grid') as HTMLCanvasElement | null;
  if (!canvas || (canvas as any).__live) return;
  (canvas as any).__live = true;
  const ctx = canvas.getContext('2d')!;
  const GAP = 56, R = 260, JITTER = 14;
  let W = 0, H = 0, dots: { x: number; y: number; jx: number; jy: number; o: number }[] = [];
  const mouse = { x: 0, y: 0 };
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - .5; };

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 7; dots = [];
    for (let x = GAP / 2; x < W; x += GAP)
      for (let y = GAP / 2; y < H; y += GAP)
        dots.push({ x, y, jx: reduced ? 0 : rnd() * 2 * JITTER, jy: reduced ? 0 : rnd() * 2 * JITTER, o: 0 });
    if (coarse || reduced) { mouse.x = W / 2; mouse.y = H * .42; }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, R * 1.3);
    g.addColorStop(0, 'rgba(201,162,75,0.07)'); g.addColorStop(1, 'rgba(201,162,75,0)');
    ctx.fillStyle = g; ctx.fillRect(mouse.x - R * 1.3, mouse.y - R * 1.3, R * 2.6, R * 2.6);
    let moving = false;
    for (const d of dots) {
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const target = dist < R ? 1 - (dist / R) ** 2 : 0;
      const delta = target - d.o;
      if (Math.abs(delta) > .002) { d.o += delta * .1; moving = true; } else d.o = target;
      const chaos = 1 - d.o;
      const x = d.x + d.jx * chaos, y = d.y + d.jy * chaos;
      if (d.o > .02) {
        ctx.fillStyle = `rgba(201,162,75,${0.08 + d.o * 0.6})`;
        ctx.beginPath(); ctx.arc(x, y, 1.3 + d.o * 1.6, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(242,239,232,0.06)';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    return moving;
  }

  /* цикл живёт, пока точки двигаются или курсор был активен в последние полсекунды */
  let running = false, lastMove = 0;
  function loop() {
    const moving = draw();
    if (moving || performance.now() - lastMove < 500) requestAnimationFrame(loop);
    else running = false;
  }
  const wake = () => { lastMove = performance.now(); if (!running) { running = true; requestAnimationFrame(loop); } };

  build();
  addEventListener('resize', () => { build(); wake(); });
  if (reduced) { draw(); return; }
  mouse.x = W / 2; mouse.y = H * .42; // свет уже горит при загрузке, пока курсор не двинулся
  addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; wake(); }, { passive: true });
  wake();
}

/* ---------- Лампа: свет за курсором на карточках (.lamp) ---------- */
function initLamp() {
  if ((document as any).__lamp) return;
  (document as any).__lamp = true;
  document.addEventListener('pointermove', (e) => {
    const el = (e.target as Element | null)?.closest?.('.lamp') as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });
}

/* ---------- Навигация: фон после прокрутки, меню на телефоне ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav || nav.dataset.bound) return;
  nav.dataset.bound = '1';
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = nav.querySelector<HTMLButtonElement>('.nav-burger');
  burger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

/* ---------- Форма заявки: /api/lead → почта + Telegram; без сервера — готовое письмо ---------- */
function initLead() {
  const lead = document.getElementById('lead') as HTMLFormElement | null;
  if (!lead || lead.dataset.bound) return;
  lead.dataset.bound = '1';
  const status = lead.querySelector<HTMLElement>('.lead-status')!;
  const button = lead.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const el = (n: string) => lead.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement;
  const required = [el('task'), el('contact')];

  const check = (f: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = f.value.trim().length > 1;
    f.closest('.field')!.classList.toggle('invalid', !ok);
    f.setAttribute('aria-invalid', String(!ok));
    const error = document.getElementById(f.id + '-error')!;
    error.hidden = ok;
    if (ok) f.removeAttribute('aria-describedby'); else f.setAttribute('aria-describedby', error.id);
    return ok;
  };
  required.forEach((f) => f.addEventListener('input', () => { if (f.closest('.field')!.classList.contains('invalid')) check(f); }));

  const mailto = (d: { task: string; contact: string; name: string }) => {
    const body = `${d.task}\n\nContact: ${d.contact}` + (d.name ? `\nName: ${d.name}` : '');
    return `mailto:${lead.dataset.mail}?subject=${encodeURIComponent('A task for SHTAB')}&body=${encodeURIComponent(body)}`;
  };

  lead.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = required.filter((f) => !check(f));
    if (invalid.length) { invalid[0].focus(); return; }
    const data = { task: el('task').value.trim(), contact: el('contact').value.trim(), name: el('name').value.trim(), website: el('website').value };

    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data), signal: AbortSignal.timeout(15000),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        lead.classList.add('sent');
        status.textContent = "Got it. We'll get back to you, usually within a working day.";
        return;
      }
      if (res.status === 429) { status.textContent = 'Too many requests from your network. Try again in an hour or write to ' + lead.dataset.mail + '.'; button.disabled = false; return; }
      if (res.status === 400) { status.textContent = out.message || 'Check the fields and try again.'; button.disabled = false; return; }
    } catch { /* сеть или таймаут — ниже откроем письмо */ }
    button.disabled = false;
    location.href = mailto(data);
    status.innerHTML = `We couldn't send it from the site, so we've opened an email in your mail app — just hit Send. If nothing opened, write to <a href="mailto:${lead.dataset.mail}">${lead.dataset.mail}</a>.`;
  });
}

/* ---------- Сцены GSAP: живут от page-load до before-swap ---------- */
let ctx: gsap.Context | null = null;

function initScenes() {
  ctx?.revert();
  if (reduced) return;
  ctx = gsap.context(() => {
    /* Hero: колонны знака поднимаются, слова заголовка выходят из тени */
    if (document.querySelector('.hero')) {
      gsap.timeline()
        .from('.hero-mark .base', { scaleX: 0, transformOrigin: 'center', duration: .6, ease: easeOut })
        .from('.hero-mark .col', { y: 60, opacity: 0, duration: .7, ease: easeOut, stagger: .09 }, '-=.25')
        .from('.hero-title .w', { y: 48, opacity: 0, duration: .9, ease: easeOut, stagger: .08 }, '-=.35')
        .from('.hero-sub, .hero-actions', { y: 24, opacity: 0, duration: .7, ease: easeOut, stagger: .12 }, '-=.6');
    }

    /* Внутренние страницы: заголовок входит сразу, без ожидания скролла */
    if (document.querySelector('.page-hero, .case-hero')) {
      gsap.from('.page-hero > *, .case-hero > *', { y: 24, opacity: 0, duration: .7, ease: easeOut, stagger: .08 });
    }

    /* Числа: счётчики при появлении */
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = +el.dataset.count!;
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.fromTo(el, { textContent: 0 }, { textContent: target, duration: 1.4, ease: 'power2.out', snap: { textContent: 1 } }),
      });
    });

    /* Кейсы на главной: «до» гаснет, «после» загорается */
    document.querySelectorAll<HTMLElement>('.case-card .delta').forEach((el) => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } })
        .from(el.querySelector('s'), { opacity: 0, duration: .5, ease: easeOut })
        .from(el.querySelector('span'), { opacity: 0, x: -8, duration: .4, ease: easeOut })
        .from(el.querySelector('b'), { opacity: 0, duration: .6, ease: easeOut })
        .to(el.querySelector('b'), { textShadow: '0 0 14px rgba(201,162,75,.55)', duration: .5, yoyo: true, repeat: 1 });
    });

    /* Услуги: горизонтальный пин-скролл на десктопе. Путь считается от контейнера:
       последняя карточка приезжает к правому краю полосы контента на любом мониторе.
       Фокус едет вместе со скроллом: карточка в фокусе полного размера и горит. */
    ScrollTrigger.matchMedia({
      '(min-width: 861px)': () => {
        const track = document.querySelector<HTMLElement>('.services-track');
        const title = document.querySelector<HTMLElement>('.services-title');
        if (!track || !title) return;
        const cards = gsap.utils.toArray<HTMLElement>('.service');
        const bar = document.querySelector<HTMLElement>('.services-progress span');
        const content = () => {
          const cs = getComputedStyle(title);
          return title.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        };
        const travel = () => {
          const first = cards[0], last = cards[cards.length - 1];
          return Math.max(0, last.offsetLeft + last.offsetWidth - first.offsetLeft - content());
        };
        const focus = (progress: number) => {
          const left = title.getBoundingClientRect().left + parseFloat(getComputedStyle(title).paddingLeft);
          const w = content();
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            const point = left + r.width / 2 + progress * (w - r.width);
            const d = Math.min(1, Math.abs(r.left + r.width / 2 - point) / (w * .8));
            c.style.opacity = String(1 - d * .55);
            c.style.transform = `scale(${1 - d * .06})`;
            c.classList.toggle('lit', d < .3);
          }
          if (bar) bar.style.transform = `scaleX(${progress})`;
        };
        gsap.to(track, {
          x: () => -travel(), ease: 'none',
          onUpdate() { focus(this.progress()); },
          scrollTrigger: {
            trigger: '.services-pin', start: 'top top',
            end: () => '+=' + Math.max(travel() * 1.6, innerHeight * .9),
            pin: true, scrub: .7, invalidateOnRefresh: true,
            onRefresh: (self) => focus(self.progress),
          },
        });
        focus(0);
        return () => cards.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; c.classList.remove('lit'); });
      },
    });

    /* Появление без scroll-driven CSS: браузеры без поддержки получают тот же эффект через GSAP */
    if (!CSS.supports('animation-timeline: view()')) {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, { y: 28, opacity: 0, duration: .7, ease: easeOut, scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
    }
  });
}

function onPageLoad() {
  initGrid();
  initLamp();
  initNav();
  initLead();
  initScenes();
  ScrollTrigger.refresh();
}

document.addEventListener('astro:page-load', onPageLoad);
document.addEventListener('astro:before-swap', () => {
  ctx?.revert(); ctx = null;
  document.body.style.overflow = '';
});
