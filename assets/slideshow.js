(async function () {
  const frame = document.querySelector('.home-slides');
  const image = document.querySelector('#slide-image');
  const controls = document.querySelector('#slide-controls');
  const toggle = document.querySelector('#slide-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let response;
  try {
    response = await fetch('assets/home-slides.txt');
    if (!response.ok) return;
    const photos = new Map(window.DUANE_PHOTOS.map(photo => [photo.id, photo]));
    const slides = (await response.text()).trim().split(/\s+/).map(id => photos.get(id)).filter(Boolean);
    if (!slides.length) { frame.hidden = true; return; }
    let index = 0;
    let playing = !motion.matches;
    let timer;
    function show(offset = 0) {
      index = (index + slides.length + offset) % slides.length;
      image.src = slides[index].src;
      image.alt = slides[index].alt;
      document.querySelector('#slide-position').textContent = (index + 1) + ' / ' + slides.length;
    }
    function schedule() {
      clearInterval(timer);
      toggle.textContent = playing ? 'Pause' : 'Play';
      if (playing && !document.hidden && slides.length > 1) timer = setInterval(() => show(1), 6500);
    }
    function step(offset) { playing = false; show(offset); schedule(); }
    document.querySelector('#slide-prev').onclick = () => step(-1);
    document.querySelector('#slide-next').onclick = () => step(1);
    toggle.onclick = () => { playing = !playing; schedule(); };
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { playing = !motion.matches; schedule(); });
    show();
    controls.hidden = slides.length < 2;
    schedule();
  } catch { /* Keep the static photograph if the selection cannot load. */ }
})();
