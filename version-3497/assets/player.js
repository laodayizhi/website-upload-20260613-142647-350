(function () {
    window.setupMoviePlayer = function (options) {
        const Hls = window.Hls;
        const video = document.getElementById(options.videoId);
        const overlay = document.getElementById(options.overlayId);
        const button = document.getElementById(options.buttonId);
        const status = document.getElementById(options.statusId);
        const playUrl = options.playUrl;
        let hls = null;
        let attached = false;

        if (!video || !overlay || !button || !playUrl) {
            return;
        }

        const setStatus = function (text) {
            if (status) {
                status.textContent = text;
            }
        };

        const attach = function () {
            if (attached) {
                return;
            }

            attached = true;

            if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(playUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("点击播放");
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("加载失败，请稍后重试");
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = playUrl;
                setStatus("点击播放");
            } else {
                setStatus("加载失败，请稍后重试");
            }
        };

        const play = function () {
            attach();

            const run = function () {
                const promise = video.play();

                if (promise && typeof promise.then === "function") {
                    promise.then(function () {
                        overlay.classList.add("is-hidden");
                    }).catch(function () {
                        setStatus("再次点击播放");
                    });
                } else {
                    overlay.classList.add("is-hidden");
                }
            };

            if (video.readyState > 0) {
                run();
            } else {
                setStatus("正在加载");
                video.addEventListener("canplay", run, { once: true });
                window.setTimeout(run, 900);
            }
        };

        overlay.addEventListener("click", play);
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            play();
        });

        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });

        video.addEventListener("error", function () {
            setStatus("加载失败，请稍后重试");
            overlay.classList.remove("is-hidden");
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });

        attach();
    };
})();
