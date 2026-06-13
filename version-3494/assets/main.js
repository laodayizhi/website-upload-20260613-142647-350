(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var filterButton = document.querySelector('[data-filter-button]');
  var emptyState = document.querySelector('[data-empty-state]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  function applyFilters() {
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var selectedType = typeFilter ? typeFilter.value : '';
    var selectedYear = yearFilter ? yearFilter.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var cardType = card.getAttribute('data-type') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (selectedType && cardType !== selectedType) {
        matched = false;
      }

      if (selectedYear && cardYear !== selectedYear) {
        matched = false;
      }

      card.hidden = !matched;

      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  if (filterInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get('q');

    if (queryParam) {
      filterInput.value = queryParam;
    }

    filterInput.addEventListener('input', applyFilters);

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilters);
    }

    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilters);
    }

    if (filterButton) {
      filterButton.addEventListener('click', applyFilters);
    }

    applyFilters();
  }
})();
