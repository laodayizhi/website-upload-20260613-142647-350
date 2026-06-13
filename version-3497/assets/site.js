(function () {
    const ready = function (callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    };

    ready(function () {
        const toggle = document.querySelector("[data-menu-toggle]");
        const menu = document.querySelector("[data-mobile-menu]");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("open");
            });
        }

        const hero = document.querySelector("[data-hero]");

        if (hero) {
            const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
            const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
            const prev = hero.querySelector("[data-hero-prev]");
            const next = hero.querySelector("[data-hero-next]");
            let active = 0;
            let timer = null;

            const show = function (index) {
                if (!slides.length) {
                    return;
                }

                active = (index + slides.length) % slides.length;

                slides.forEach(function (slide, position) {
                    const isActive = position === active;
                    slide.classList.toggle("active", isActive);
                    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
                });

                dots.forEach(function (dot, position) {
                    dot.classList.toggle("active", position === active);
                });
            };

            const restart = function () {
                if (timer) {
                    window.clearInterval(timer);
                }

                timer = window.setInterval(function () {
                    show(active + 1);
                }, 5000);
            };

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    restart();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(active - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(active + 1);
                    restart();
                });
            }

            show(0);
            restart();
        }

        document.querySelectorAll("[data-filter-section]").forEach(function (section) {
            const input = section.querySelector("[data-filter-search]");
            const year = section.querySelector("[data-filter-year]");
            const type = section.querySelector("[data-filter-type]");
            const region = section.querySelector("[data-filter-region]");
            const empty = section.querySelector("[data-filter-empty]");
            const cards = Array.from(section.querySelectorAll("[data-movie-card]"));

            const apply = function () {
                const term = input ? input.value.trim().toLowerCase() : "";
                const yearValue = year ? year.value : "";
                const typeValue = type ? type.value : "";
                const regionValue = region ? region.value : "";
                let visible = 0;

                cards.forEach(function (card) {
                    const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
                    const yearMatch = !yearValue || card.getAttribute("data-year") === yearValue;
                    const typeMatch = !typeValue || card.getAttribute("data-type") === typeValue;
                    const regionMatch = !regionValue || card.getAttribute("data-region") === regionValue;
                    const termMatch = !term || keywords.indexOf(term) !== -1;
                    const matched = yearMatch && typeMatch && regionMatch && termMatch;

                    card.hidden = !matched;

                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            };

            [input, year, type, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    });
})();
