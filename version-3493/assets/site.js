(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function initNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener('click', function () {
      var opened = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        show(itemIndex);
        start();
      });
    });

    show(0);
    start();
  }

  function initFilters() {
    var input = document.getElementById('movieSearch');
    var region = document.getElementById('regionFilter');
    var year = document.getElementById('yearFilter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
    if (!cards.length || (!input && !region && !year)) {
      return;
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matched = true;
        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        card.classList.toggle('hidden-by-filter', !matched);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }
    if (region) {
      region.addEventListener('change', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
  }

  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    if (window.__firstVideoHlsCallbacks) {
      window.__firstVideoHlsCallbacks.push(callback);
      return;
    }
    window.__firstVideoHlsCallbacks = [callback];
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
    script.onload = function () {
      var callbacks = window.__firstVideoHlsCallbacks || [];
      window.__firstVideoHlsCallbacks = null;
      callbacks.forEach(function (item) {
        item();
      });
    };
    script.onerror = function () {
      var callbacks = window.__firstVideoHlsCallbacks || [];
      window.__firstVideoHlsCallbacks = null;
      callbacks.forEach(function (item) {
        item();
      });
    };
    document.head.appendChild(script);
  }

  window.initMoviePlayer = function (videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var prepared = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function playVideo() {
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function attachAndPlay() {
      if (prepared) {
        playVideo();
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        playVideo();
        return;
      }
      loadHlsLibrary(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
        } else {
          video.src = source;
          playVideo();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', attachAndPlay);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
  });
})();
