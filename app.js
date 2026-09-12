/* app.js — motion controller */
(() => {
  // scroll progress
  const bar = document.getElementById('progress');
  addEventListener('scroll', () => {
    const h = document.body.scrollHeight - innerHeight;
    bar.style.width = (scrollY / h) * 100 + '%';
  }, { passive: true });

  // cursor glow
  const glow = document.getElementById('glow');
  addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    document.querySelectorAll('.blob').forEach((b, i) => {
      const k = (i + 1) * 12;
      b.style.marginLeft = (e.clientX / innerWidth - .5) * k + 'px';
      b.style.marginTop = (e.clientY / innerHeight - .5) * k + 'px';
    });
  });

  // hero text stagger
  document.querySelectorAll('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) =>
      `<span class="ch" style="animation-delay:${i * .045}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  });

  // reveal + counters + bars
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(n => {
      const to = parseFloat(n.dataset.count), dec = (n.dataset.count.split('.')[1] || '').length;
      let s = null;
      const step = t => {
        s ??= t;
        const p = Math.min((t - s) / 1400, 1);
        n.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    e.target.querySelectorAll('[data-bar]').forEach(b => b.style.width = b.dataset.bar + '%');
    io.unobserve(e.target);
  }), { threshold: .18 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // 3D tilt
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `translate(-5px,-9px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });

  // nav
  const b = document.querySelector('.burger');
  b && b.addEventListener('click', () => document.querySelector('.menu').classList.toggle('open'));
})();
/* ===== MEMBERS: click to reveal comment (append) ===== */
(() => {
  const cards = document.querySelectorAll('.mcard');
  if (!cards.length) return;

  const close = c => { c.classList.remove('open'); c.setAttribute('aria-expanded', 'false'); };

  cards.forEach(c => {
    c.addEventListener('click', () => {
      const wasOpen = c.classList.contains('open');
      document.querySelectorAll('.mcard.open').forEach(close); // 常に1枚だけ開く
      if (!wasOpen) { c.classList.add('open'); c.setAttribute('aria-expanded', 'true'); }
    });
    c.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
    });
  });

  // 余白クリックで全部閉じる
  document.addEventListener('click', e => {
    if (!e.target.closest('.mcard')) document.querySelectorAll('.mcard.open').forEach(close);
  });
})();
