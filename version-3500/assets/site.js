(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function unique(values) {
    return values.filter(function (value, index, array) {
      return value && array.indexOf(value) === index;
    }).sort(function (a, b) {
      return String(b).localeCompare(String(a), "zh-CN");
    });
  }

  function fillSelect(select, values) {
    if (!select || select.options.length > 1) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initMenu() {
    var toggle = qs("[data-menu-toggle]");
    var menu = qs("[data-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHeroSlider() {
    var slider = qs("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = qsa("[data-slide]", slider);
    var dots = qsa("[data-slide-dot]", slider);
    var prev = qs("[data-slide-prev]", slider);
    var next = qs("[data-slide-next]", slider);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide-dot")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function initFilters() {
    var panels = qsa("[data-filter-panel]");
    panels.forEach(function (panel) {
      var scope = panel.closest("section") || document;
      var cards = qsa(".searchable-card", scope);
      var search = qs("[data-search-input]", panel);
      var region = qs("[data-filter-region]", panel);
      var type = qs("[data-filter-type]", panel);
      var year = qs("[data-filter-year]", panel);
      var category = qs("[data-filter-category]", panel);

      fillSelect(region, unique(cards.map(function (card) { return card.dataset.region; })));
      fillSelect(type, unique(cards.map(function (card) { return card.dataset.type; })));
      fillSelect(year, unique(cards.map(function (card) { return card.dataset.year; })));

      function apply() {
        var keyword = search ? search.value.trim().toLowerCase() : "";
        var regionValue = region ? region.value : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var categoryValue = category ? category.value : "";

        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          var matched = true;
          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }
          if (regionValue && card.dataset.region !== regionValue) {
            matched = false;
          }
          if (typeValue && card.dataset.type !== typeValue) {
            matched = false;
          }
          if (yearValue && card.dataset.year !== yearValue) {
            matched = false;
          }
          if (categoryValue && card.dataset.category !== categoryValue) {
            matched = false;
          }
          card.classList.toggle("is-filtered-out", !matched);
        });
      }

      [search, region, type, year, category].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function initPlayer(source, options) {
    var settings = options || {};
    var video = document.getElementById(settings.videoId || "moviePlayer");
    var button = document.getElementById(settings.buttonId || "playButton");
    var notice = document.getElementById(settings.noticeId || "playerNotice");
    var hls = null;

    if (!video || !source) {
      return;
    }

    function showNotice(message) {
      if (!notice) {
        return;
      }
      notice.textContent = message;
      notice.hidden = false;
    }

    function bindSource() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showNotice("播放暂时不可用，请稍后再试");
          }
        });
        return;
      }
      showNotice("浏览器暂不支持播放，请更换现代浏览器");
    }

    function start() {
      if (button) {
        button.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    bindSource();

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
        if (button) {
          button.classList.remove("is-hidden");
        }
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (button) {
        button.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.MoviePlayer = {
    init: initPlayer
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHeroSlider();
    initFilters();
  });
})();
