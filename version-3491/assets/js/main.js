document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector("[data-mobile-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")));
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5600);
        }
    }

    const toolbar = document.querySelector("[data-filter-toolbar]");
    const list = document.querySelector("[data-filter-list]");
    const emptyState = document.querySelector("[data-empty-state]");

    if (toolbar && list) {
        const input = toolbar.querySelector("[data-filter-input]");
        const yearFilter = toolbar.querySelector("[data-year-filter]");
        const typeFilter = toolbar.querySelector("[data-type-filter]");
        const cards = Array.from(list.querySelectorAll("[data-filter-card]"));
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";

        if (input && query) {
            input.value = query;
        }

        function yearMatches(cardYear, selected) {
            if (!selected) {
                return true;
            }
            const year = Number(cardYear || 0);
            if (selected === "2010") {
                return year >= 2010 && year <= 2019;
            }
            if (selected === "2000") {
                return year >= 2000 && year <= 2009;
            }
            if (selected === "1990") {
                return year >= 1990 && year <= 1999;
            }
            return String(year) === selected;
        }

        function applyFilter() {
            const keyword = (input ? input.value : "").trim().toLowerCase();
            const selectedYear = yearFilter ? yearFilter.value : "";
            const selectedType = typeFilter ? typeFilter.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const searchText = (card.getAttribute("data-search") || "").toLowerCase();
                const cardYear = card.getAttribute("data-year") || "";
                const cardType = card.getAttribute("data-type") || "";
                const matchesKeyword = !keyword || searchText.includes(keyword);
                const matchesYear = yearMatches(cardYear, selectedYear);
                const matchesType = !selectedType || cardType.includes(selectedType);
                const show = matchesKeyword && matchesYear && matchesType;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, yearFilter, typeFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilter);
                control.addEventListener("change", applyFilter);
            }
        });

        applyFilter();
    }
});
