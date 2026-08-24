/* SHTAB — движение и атмосфера. Контент виден и без JS: анимации только усиливают. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Навигация: фон после прокрутки ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Фон: чертёжная сетка точек с латунным откликом ---------- */
  const canvas = document.getElementById('grid');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  const GAP = 56;
  const mouse = { x: -1e4, y: -1e4 };

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let x = GAP / 2; x < W; x += GAP)
      for (let y = GAP / 2; y < H; y += GAP) dots.push({ x, y });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const glow = Math.max(0, 1 - dist / 200);
      if (glow > 0.02) {
        ctx.fillStyle = `rgba(201,162,75,${0.06 + glow * 0.5})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2 + glow * 1.4, 0, 7);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(242,239,232,0.055)';
        ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
      }
    }
  }

  build();
  addEventListener('resize', build);
  if (reduced) {
    draw(); // статичная сетка без анимации
  } else {
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
    .from('.hero-sub, .hero-actions', { y: 24, opacity: 0, duration: .7, ease: easeOut, stagger: .12 }, '-=.5');

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
      const shift = () => -(track.scrollWidth - innerWidth + 64);
      gsap.to(track, {
        x: shift, ease: 'none',
        scrollTrigger: {
          trigger: '.services-pin', start: 'top top',
          end: () => '+=' + (track.scrollWidth - innerWidth + 400),
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
  gsap.from('.cta > *', {
    y: 28, opacity: 0, duration: .8, ease: easeOut, stagger: .1,
    scrollTrigger: { trigger: '.cta', start: 'top 75%' },
  });
})();
