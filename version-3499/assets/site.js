(function () {
  function initMenu() {
    const btn = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-nav-links]');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  function initHeroSlider() {
    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    if (!slides.length) return;
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx < 0) idx = 0;
    function show(i) {
      slides.forEach((s, n) => s.classList.toggle('active', n === i));
    }
    show(idx);
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 4200);
  }

  function initFilters() {
    const inputs = document.querySelectorAll('[data-filter-input]');
    inputs.forEach(input => {
      const scope = input.closest('[data-filter-scope]') || document;
      const items = Array.from(scope.querySelectorAll('[data-card], [data-row]'));
      const buttons = scope.querySelectorAll('[data-filter-btn]');
      const resetButtons = () => buttons.forEach(btn => btn.classList.remove('active'));
      if (buttons.length) {
        buttons.forEach(btn => btn.addEventListener('click', () => {
          resetButtons();
          btn.classList.add('active');
          const term = (btn.dataset.filterBtn || '').trim();
          const query = (input.value || '').trim().toLowerCase();
          items.forEach(item => {
            const text = (item.dataset.search || item.textContent || '').toLowerCase();
            const ok = (!term || text.includes(term.toLowerCase())) && (!query || text.includes(query));
            item.classList.toggle('hide', !ok);
          });
        }));
      }
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        items.forEach(item => {
          const text = (item.dataset.search || item.textContent || '').toLowerCase();
          const ok = !q || text.includes(q);
          item.classList.toggle('hide', !ok);
        });
      });
    });
  }

  function initPlayer() {
    const video = document.querySelector('video[data-hls]');
    if (!video) return;
    const hls = video.dataset.hls;
    const mp4 = video.dataset.mp4;
    try {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hls;
      } else {
        video.src = mp4;
      }
    } catch (e) {
      video.src = mp4;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHeroSlider();
    initFilters();
    initPlayer();
  });
})();
