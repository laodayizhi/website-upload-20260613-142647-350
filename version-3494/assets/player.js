(function () {
  function preparePlayer(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play-button]');
    var streamUrl = video ? video.getAttribute('data-play') : '';
    var hls = null;
    var initialized = false;

    function launch() {
      if (!video || !streamUrl) {
        return;
      }

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (initialized) {
        video.play().catch(function () {});
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          }
        });
        return;
      }

      video.src = streamUrl;
      video.play().catch(function () {});
    }

    if (overlay) {
      overlay.addEventListener('click', launch);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          launch();
        }
      });

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(preparePlayer);
})();
