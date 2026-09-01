(function () {
  const photos = window.DUANE_PHOTOS || [];
  const grid = document.querySelector('#photo-grid');
  const count = document.querySelector('#photo-count');
  const lightbox = document.querySelector('#photo-lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const close = document.querySelector('.lightbox-close');
  const prev = document.querySelector('.lightbox-prev');
  const next = document.querySelector('.lightbox-next');
  let current = 0;

  if (count) count.textContent = `${photos.length} photographs`;

  function displayName(photo) {
    return photo.date ? photo.date.replaceAll('-', '.') : photo.file;
  }

  function openAt(index) {
    if (!photos.length) return;
    current = (index + photos.length) % photos.length;
    const p = photos[current];
    lightboxImage.src = p.src;
    lightboxImage.alt = `Photograph by Duane Noriyuki, ${displayName(p)}`;
    lightboxCaption.textContent = p.date ? `Duane Noriyuki · ${p.date}` : 'Duane Noriyuki';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeBox() { lightbox.hidden = true; document.body.style.overflow = ''; lightboxImage.src = ''; }

  if (grid) {
    photos.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'photo-card';
      card.innerHTML = `<button type="button" aria-label="Open photograph from ${displayName(p)}"><img src="${p.thumb}" alt="Photograph by Duane Noriyuki" loading="lazy"><span class="photo-meta"><span>Duane Noriyuki</span><span>${p.year || ''}</span></span></button>`;
      card.querySelector('button').addEventListener('click', () => openAt(i));
      grid.appendChild(card);
    });
  }

  document.querySelectorAll('[data-open-photo]').forEach(el => {
    el.addEventListener('click', () => {
      const i = photos.findIndex(p => p.id === el.dataset.openPhoto);
      if (i >= 0) openAt(i);
    });
  });
  close?.addEventListener('click', closeBox);
  prev?.addEventListener('click', () => openAt(current - 1));
  next?.addEventListener('click', () => openAt(current + 1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeBox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') openAt(current - 1);
    if (e.key === 'ArrowRight') openAt(current + 1);
  });
})();
