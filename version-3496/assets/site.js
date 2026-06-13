(function () {
    function toggleMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
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

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
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
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-search-input]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
            var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-button]'));
            var current = { kind: 'all', value: 'all' };

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                cards.forEach(function (card) {
                    var text = card.textContent.toLowerCase();
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchFilter = true;
                    if (current.kind === 'year') {
                        matchFilter = String(card.getAttribute('data-year')) === current.value;
                    }
                    if (current.kind === 'type') {
                        matchFilter = String(card.getAttribute('data-type') || '').indexOf(current.value) !== -1;
                    }
                    card.hidden = !(matchQuery && matchFilter);
                });
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    buttons.forEach(function (item) {
                        item.classList.remove('active');
                    });
                    button.classList.add('active');
                    current.kind = button.getAttribute('data-filter-kind') || 'all';
                    current.value = button.getAttribute('data-filter-value') || 'all';
                    apply();
                });
            });
            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        toggleMenu();
        initHero();
        initFilters();
    });
})();
