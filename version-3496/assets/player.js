function initMoviePlayer(src) {
    var video = document.getElementById('movie-player');
    var overlay = document.querySelector('[data-player-overlay]');
    if (!video || !src) {
        return;
    }

    function attach() {
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            window.addEventListener('beforeunload', function () {
                hls.destroy();
            });
        } else {
            video.src = src;
        }
    }

    function play() {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {});
        }
    }

    attach();

    if (overlay) {
        overlay.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 && overlay) {
            overlay.classList.remove('is-hidden');
        }
    });
}
