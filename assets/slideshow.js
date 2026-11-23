(async function () {
  const frame = document.querySelector('.home-slides');
  const image = document.querySelector('#slide-image');
  const controls = document.querySelector('#slide-controls');
  const toggle = document.querySelector('#slide-toggle');
  const music = document.querySelector('#slide-music');
  const musicToggle = document.querySelector('#music-toggle');
  const status = document.querySelector('#music-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let slides;
  try {
    const [selection, timing] = await Promise.all([
      fetch('assets/home-slides.txt'), fetch('assets/duane-slideshow/slides.json')
    ]);
    if (!selection.ok || !timing.ok) return;
    const catalog = new Map(window.DUANE_PHOTOS.map(p => [p.id, { ...p, seconds: 6.5 }]));
    for (const [id, seconds] of Object.entries(await timing.json())) {
      catalog.set(id, { src: 'assets/duane-slideshow/' + id + '.webp', seconds });
    }
    slides = (await selection.text()).trim().split(/\s+/).map(id => catalog.get(id)).filter(Boolean);
  } catch {
    return;
  }
  if (!slides.length) { frame.hidden = true; return; }

  let index = 0;
  let playing = !motion.matches;
  let timer;
  function schedule() {
    clearTimeout(timer);
    toggle.textContent = playing ? 'Pause' : 'Play';
    if (playing && !document.hidden && slides.length > 1) {
      timer = setTimeout(() => show(1), slides[index].seconds * 1000);
    }
  }
  function show(offset) {
    index = (index + slides.length + offset) % slides.length;
    image.src = slides[index].src;
    image.alt = slides[index].alt || 'Faces & Places of the McKenzie River Valley, slide ' + (index + 1);
    document.querySelector('#slide-position').textContent = (index + 1) + ' / ' + slides.length;
    schedule();
  }
  function step(offset) { playing = false; show(offset); }
  document.querySelector('#slide-prev').onclick = () => step(-1);
  document.querySelector('#slide-next').onclick = () => step(1);
  toggle.onclick = () => { playing = !playing; schedule(); };
  musicToggle.onclick = async () => {
    status.textContent = '';
    if (!music.paused) { music.pause(); return; }
    try { await music.play(); }
    catch { status.textContent = 'Music could not play. Please try again.'; }
  };
  function updateMusic() {
    musicToggle.textContent = music.paused ? 'Play music' : 'Pause music';
    musicToggle.setAttribute('aria-pressed', String(!music.paused));
  }
  music.addEventListener('play', updateMusic);
  music.addEventListener('pause', updateMusic);
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { playing = !motion.matches; schedule(); });
  controls.hidden = false;
  show(0);
})();
