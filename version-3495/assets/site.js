(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

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
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    show(0);
    restart();
  }

  function initGlobalSearch() {
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var data = window.MOVIE_SEARCH_DATA || [];

    if (!input || !results || !data.length) {
      return;
    }

    function render(items) {
      if (!items.length) {
        results.innerHTML = '<div class="search-result-item"><span>没有找到匹配影片</span></div>';
        results.classList.add('is-open');
        return;
      }

      results.innerHTML = items.slice(0, 14).map(function (item) {
        return [
          '<a class="search-result-item" href="', item.url, '">',
          '<img src="', item.cover, '" alt="', item.title, '">',
          '<span><strong>', item.title, '</strong><span>', item.year, ' · ', item.type, ' · ', item.region, '</span></span>',
          '</a>'
        ].join('');
      }).join('');
      results.classList.add('is-open');
    }

    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      if (!query) {
        results.classList.remove('is-open');
        results.innerHTML = '';
        return;
      }
      var matched = data.filter(function (item) {
        return item.searchText.indexOf(query) !== -1;
      });
      render(matched);
    });

    document.addEventListener('click', function (event) {
      if (!results.contains(event.target) && event.target !== input) {
        results.classList.remove('is-open');
      }
    });
  }

  function initPageFilter() {
    var input = document.querySelector('[data-filter-cards]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var count = document.querySelector('[data-filter-count]');

    if (!input || !cards.length) {
      return;
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-category') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
    }

    var cache = cards.map(function (card) {
      return {
        card: card,
        text: cardText(card)
      };
    });

    function apply() {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      cache.forEach(function (entry) {
        var matched = !query || entry.text.indexOf(query) !== -1;
        entry.card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = query ? '匹配 ' + visible + ' 条' : '';
      }
    }

    input.addEventListener('input', apply);
    apply();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('.player-overlay');
      var sources = [];
      var hls = null;
      var sourceIndex = 0;
      var ready = false;

      try {
        sources = JSON.parse(player.getAttribute('data-sources') || '[]');
      } catch (error) {
        sources = [];
      }

      if (!video || !sources.length) {
        return;
      }

      function attachSource(url) {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
          hls = null;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              tryNextSource();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else {
          video.src = url;
        }
        ready = true;
      }

      function tryNextSource() {
        sourceIndex += 1;
        if (sourceIndex < sources.length) {
          attachSource(sources[sourceIndex]);
          video.play().catch(function () {});
        }
      }

      function startPlayback() {
        if (!ready) {
          attachSource(sources[sourceIndex]);
        }
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        video.play().catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }

      if (overlay) {
        overlay.addEventListener('click', startPlayback);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });

      video.addEventListener('error', tryNextSource);
    });
  }

  initHero();
  initGlobalSearch();
  initPageFilter();
  initPlayers();
})();
