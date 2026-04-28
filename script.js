  const DURATION = 4500;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsEl = document.querySelector('.dots');
  const progress = document.getElementById('progress-bar');
  const curNum = document.getElementById('cur-num');
  const totNum = document.getElementById('tot-num');
  let current = 0, timer = null, progTimer = null;

  totNum.textContent = String(slides.length).padStart(2, '0');

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  function getDots() { return Array.from(dotsEl.querySelectorAll('.dot')); }

  function goTo(idx) {
    if (idx === current) return;
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    slides[current].classList.add('prev');
    setTimeout(() => slides[current >= slides.length ? 0 : current]?.classList.remove('prev'), 800);

    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');

    getDots().forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    curNum.textContent = String(current + 1).padStart(2, '0');
    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.getElementById('next-btn').addEventListener('click', () => { next(); restartAuto(); });
  document.getElementById('prev-btn').addEventListener('click', () => { prev(); restartAuto(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); restartAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); restartAuto(); }
  });

  // Touch swipe
  let touchX = 0;
  document.getElementById('hero').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  document.getElementById('hero').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); restartAuto(); }
  });

  // Progress bar
  function resetProgress() {
    clearInterval(progTimer);
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${DURATION}ms linear`;
        progress.style.width = '100%';
      });
    });
  }

  function startAuto() {
    timer = setInterval(next, DURATION);
    resetProgress();
  }

  function restartAuto() {
    clearInterval(timer);
    startAuto();
  }

  startAuto();
