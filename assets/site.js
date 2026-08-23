(function () {
  const works = window.DUANE_WORK || [];
  const labels = {
    "what-we-leave-behind": "what we leave behind",
    "the-garden": "the garden",
    "second-look": "second look",
    "making": "making",
    "seeing": "seeing",
    "community": "community",
    "place": "place",
    "memory": "memory",
    "belonging": "belonging",
    "change": "change",
    "care": "care",
    "family": "family"
  };

  function niceTheme(t) { return labels[t] || t.replaceAll("-", " "); }

  const featured = document.querySelector("#featured-work");
  if (featured) {
    works.slice(-6).reverse().forEach(w => featured.appendChild(workRow(w)));
  }

  const list = document.querySelector("#archive-list");
  if (list) {
    const search = document.querySelector("#search");
    const year = document.querySelector("#year-filter");
    const filters = document.querySelector("#theme-filters");
    const count = document.querySelector("#result-count");

    [...new Set(works.map(w => w.year))].sort((a,b)=>a-b).forEach(y => {
      const o = document.createElement("option"); o.value = y; o.textContent = y; year.appendChild(o);
    });

    const themes = [...new Set(works.flatMap(w => w.themes))].sort();
    const all = document.createElement("button");
    all.className = "chip active"; all.dataset.theme = ""; all.textContent = "all";
    filters.appendChild(all);
    themes.forEach(t => {
      const b = document.createElement("button");
      b.className = "chip"; b.dataset.theme = t; b.textContent = niceTheme(t);
      filters.appendChild(b);
    });

    function render() {
      const q = (search.value || "").toLowerCase().trim();
      const y = year.value;
      const active = filters.querySelector(".chip.active")?.dataset.theme || "";
      const result = works.filter(w =>
        (!q || [w.title,w.publication,w.place,w.type,...w.themes].join(" ").toLowerCase().includes(q)) &&
        (!y || String(w.year) === y) &&
        (!active || w.themes.includes(active))
      );
      list.innerHTML = "";
      result.forEach(w => list.appendChild(workRow(w)));
      count.textContent = `${result.length} ${result.length === 1 ? "piece" : "pieces"}`;
    }

    filters.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      filters.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); render();
    });
    search.addEventListener("input", render);
    year.addEventListener("change", render);

    const params = new URLSearchParams(location.search);
    const thread = params.get("thread");
    if (thread && filters.querySelector(`[data-theme="${thread}"]`)) {
      filters.querySelector(`[data-theme="${thread}"]`).click();
    } else render();
  }

  function workRow(w) {
    const article = document.createElement("article");
    article.className = "work-row";
    const link = document.createElement(w.url ? "a" : "div");
    if (w.url) { link.href = w.url; link.target = "_blank"; link.rel = "noopener"; }
    link.innerHTML = `
      <div class="work-year">${w.year}</div>
      <div class="work-main">
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.publication)} · ${escapeHtml(w.type)}</p>
      </div>
      <div class="work-tags">${w.themes.slice(0,3).map(t => `<span>${escapeHtml(niceTheme(t))}</span>`).join("")}</div>
      <div class="work-arrow">${w.url ? "↗" : "•"}</div>
    `;
    article.appendChild(link);
    return article;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
})();
