/* SHTAB — движение и атмосфера. Контент виден и без JS: анимации только усиливают. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Навигация: фон после прокрутки ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Форма заявки: отправка на сервис форм, без него — готовое письмо ---------- */
  const lead = document.getElementById('lead');
  if (lead) {
    const status = lead.querySelector('.lead-status');
    const button = lead.querySelector('button[type="submit"]');
    const required = [lead.elements.task, lead.elements.contact];

    const check = el => {
      const ok = el.value.trim().length > 1;
      el.closest('.field').classList.toggle('invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      const error = document.getElementById(el.id + '-error');
      error.hidden = ok;
      if (ok) el.removeAttribute('aria-describedby');
      else el.setAttribute('aria-describedby', error.id);
      return ok;
    };
    required.forEach(el => el.addEventListener('input', () => {
      if (el.closest('.field').classList.contains('invalid')) check(el);
    }));

    const mailto = data => {
      const body = `${data.task}\n\nКонтакт: ${data.contact}` + (data.name ? `\nИмя: ${data.name}` : '');
      return `mailto:${lead.dataset.mail}?subject=${encodeURIComponent('Задача для SHTAB')}&body=${encodeURIComponent(body)}`;
    };

    lead.addEventListener('submit', async e => {
      e.preventDefault();
      if (lead.elements.website.value) return; // honeypot: боты заполняют скрытое поле
      const invalid = required.filter(el => !check(el));
      if (invalid.length) { invalid[0].focus(); return; }

      const data = {
        task: lead.elements.task.value.trim(),
        contact: lead.elements.contact.value.trim(),
        name: lead.elements.name.value.trim(),
      };
      const { endpoint, key, mail } = lead.dataset;

      if (endpoint) {
        button.disabled = true;
        status.textContent = 'Отправляем…';
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...(key && { access_key: key }), subject: 'Заявка с сайта SHTAB', ...data }),
          });
          if (!res.ok) throw new Error(res.status);
          lead.classList.add('sent');
          status.textContent = 'Заявка у нас. Ответим на контакт, который вы оставили.';
          return;
        } catch {
          button.disabled = false;
        }
      }

      location.href = mailto(data);
      status.innerHTML = `Открыли письмо в вашей почтовой программе — осталось нажать «Отправить». Если письмо не открылось, напишите на <a href="mailto:${mail}">${mail}</a>.`;
    });
  }

  /* ---------- Лампа: свет за курсором на карточках (.lamp) ---------- */
  document.addEventListener('pointermove', e => {
    const el = e.target.closest?.('.lamp');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });

  /* ---------- Фон: свет наводит порядок.
     Вдали от курсора точки лежат вразнобой и тусклые, в круге света встают
     в ровную сетку и загораются латунью. ---------- */
  const canvas = document.getElementById('grid');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  const GAP = 56, R = 260, JITTER = 14;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const mouse = { x: 0, y: 0 };

  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - .5; }; // одинаковый «хаос» при каждом build

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 7; dots = [];
    for (let x = GAP / 2; x < W; x += GAP)
      for (let y = GAP / 2; y < H; y += GAP)
        dots.push({ x, y, jx: rnd() * 2 * JITTER, jy: rnd() * 2 * JITTER, o: 0 });
    if (coarse) { mouse.x = W / 2; mouse.y = H * .42; } // без мыши свет стоит в центре экрана
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // мягкое пятно света
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

  build();
  addEventListener('resize', build);
  if (reduced) {
    for (const d of dots) { d.jx = d.jy = 0; } // без движения: ровная тихая сетка
    mouse.x = -1e4; mouse.y = -1e4; draw();
  } else {
    mouse.x = W / 2; mouse.y = H * .42; // свет уже горит при загрузке, пока курсор не двинулся
    addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    (function loop() { draw(); requestAnimationFrame(loop); })();
  }

  /* ---------- Дальше только motion: без GSAP, с reduced-motion или ?static выходим,
     контент при этом остаётся полностью видимым ---------- */
  const staticMode = new URLSearchParams(location.search).has('static');
  if (staticMode) document.documentElement.classList.add('static');
  if (reduced || staticMode || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const easeOut = 'power4.out';

  /* Hero: колонны знака поднимаются, затем текст */
  gsap.timeline()
    .from('.hero-mark .base', { scaleX: 0, transformOrigin: 'center', duration: .6, ease: easeOut })
    .from('.hero-mark .col', { y: 60, opacity: 0, duration: .7, ease: easeOut, stagger: .09 }, '-=.25')
    .from('.hero-title', { y: 36, opacity: 0, duration: .8, ease: easeOut }, '-=.35')
    .from('.hero-sub, .hero-actions', { y: 24, opacity: 0, duration: .7, ease: easeOut, stagger: .12 }, '-=.5')
    .from('.hero-hint', { opacity: 0, duration: 1 }, '+=.4');

  /* Числа: счётчики при появлении */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo(el, { textContent: 0 }, {
        textContent: target, duration: 1.4, ease: 'power2.out',
        snap: { textContent: 1 },
      }),
    });
  });

  /* Кейсы: текст и макет въезжают с разных сторон */
  document.querySelectorAll('.case').forEach(c => {
    const flip = c.classList.contains('case-flip');
    gsap.from(c.querySelector('.case-text'), {
      x: flip ? 48 : -48, opacity: 0, duration: .9, ease: easeOut,
      scrollTrigger: { trigger: c, start: 'top 72%' },
    });
    gsap.from(c.querySelector('.case-visual'), {
      x: flip ? -48 : 48, opacity: 0, duration: .9, ease: easeOut,
      scrollTrigger: { trigger: c, start: 'top 72%' },
    });
  });

  /* Кейсы: «до» гаснет, «после» загорается, когда свет доходит до макета */
  document.querySelectorAll('.case-delta').forEach(el => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%' } })
      .from(el.querySelector('s'), { opacity: 0, duration: .5, ease: easeOut })
      .from(el.querySelector('span'), { opacity: 0, x: -8, duration: .4, ease: easeOut })
      .from(el.querySelector('b'), { opacity: 0, textShadow: '0 0 0 rgba(201,162,75,0)', duration: .6, ease: easeOut })
      .to(el.querySelector('b'), { textShadow: '0 0 14px rgba(201,162,75,.55)', duration: .5, yoyo: true, repeat: 1 });
  });

  /* Авито-кейс: реплики диалога появляются по очереди */
  const chat = document.querySelector('.mock-chat');
  if (chat) gsap.from(chat.querySelectorAll('.bubble, .bubble-meta, .chat-day'), {
    y: 16, opacity: 0, duration: .5, ease: easeOut, stagger: .18,
    scrollTrigger: { trigger: chat, start: 'top 75%' },
  });

  /* Услуги: горизонтальный пин-скролл на десктопе */
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const track = document.querySelector('.services-track');
      const vw = () => document.documentElement.clientWidth;
      const shift = () => -(track.scrollWidth - vw()); // последняя карточка встаёт на правую границу контейнера
      gsap.to(track, {
        x: shift, ease: 'none',
        scrollTrigger: {
          trigger: '.services-pin', start: 'top top',
          end: () => '+=' + (track.scrollWidth - vw() + 400),
          pin: true, scrub: .7, invalidateOnRefresh: true,
        },
      });
    },
  });

  /* Процесс и CTA: мягкое появление */
  gsap.from('.step', {
    y: 32, opacity: 0, duration: .7, ease: easeOut, stagger: .1,
    scrollTrigger: { trigger: '.steps', start: 'top 78%' },
  });
  gsap.from('.cta-text > *, .lead', {
    y: 28, opacity: 0, duration: .8, ease: easeOut, stagger: .1,
    scrollTrigger: { trigger: '.cta', start: 'top 75%' },
  });
})();
