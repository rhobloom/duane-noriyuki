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
  let visible = photos;
  let opener;

  function openAt(index) {
    if (!visible.length) return;
    current = (index + visible.length) % visible.length;
    const p = visible[current];
    lightboxImage.src = p.src;
    lightboxImage.alt = p.alt;
    lightboxCaption.textContent = [p.alt, p.date, p.id].filter(Boolean).join(" · ");
    lightbox.hidden = false;
    close.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeBox() { lightbox.hidden = true; document.body.style.overflow = ''; lightboxImage.removeAttribute('src'); opener?.focus(); }

  function render(category) {
    visible = category === 'All' ? photos : photos.filter(p => p.category === category);
    grid.replaceChildren();
    count.textContent = visible.length + ' photographs';
    visible.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'photo-card';
      card.innerHTML = `<button type="button"><img src="${p.thumb}" alt="" loading="lazy"><span class="photo-meta"><span>${p.category}</span><span>${p.year || ''}</span></span></button>`;
      const button = card.querySelector('button');
      button.setAttribute('aria-label', 'Open photograph: ' + p.alt);
      button.addEventListener('click', event => { opener = event.currentTarget; openAt(i); });
      grid.appendChild(card);
    });
  }

  const filters = document.querySelectorAll('.photo-filters button');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render(button.textContent);
  }));
  render('All');
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
