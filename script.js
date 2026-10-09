/* =====================================================
   Happy Teachers Day - Sir Shamaz
   Vanilla JavaScript: particles, stars, confetti, mouse
   ===================================================== */

(function () {
    'use strict';

    // Respect the user's motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elegant palette used for particles and confetti
    var COLORS = ['#f5c451', '#ffe9a8', '#22d3ee', '#8b5cf6', '#ffffff', '#2dd4bf'];

    /** Random number between min and max */
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    /** Pick a random item from an array */
    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    /* ---------- Subtle twinkling stars ---------- */
    function createStars() {
        var container = document.getElementById('stars');
        if (!container) return;

        var count = window.innerWidth < 600 ? 45 : 90;
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < count; i++) {
            var star = document.createElement('span');
            var size = rand(1, 2.6);
            star.className = 'star';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = rand(0, 100) + '%';
            star.style.top = rand(0, 100) + '%';
            star.style.setProperty('--dur', rand(3, 7) + 's');
            star.style.setProperty('--delay', rand(0, 6) + 's');
            fragment.appendChild(star);
        }
        container.appendChild(fragment);
    }

    /* ---------- Floating glowing particles (drift upward) ---------- */
    function createParticles() {
        var container = document.getElementById('particles');
        if (!container || prefersReducedMotion) return;

        var count = window.innerWidth < 600 ? 22 : 45;
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < count; i++) {
            var p = document.createElement('span');
            var size = rand(3, 11);
            var color = pick(COLORS);

            p.className = 'particle';
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = rand(0, 100) + '%';
            p.style.background = color;
            p.style.boxShadow = '0 0 ' + size * 2 + 'px ' + color;
            p.style.setProperty('--op', rand(0.25, 0.8).toFixed(2));
            p.style.setProperty('--dur', rand(18, 36).toFixed(1) + 's');   // slow
            p.style.setProperty('--delay', (-rand(0, 30)).toFixed(1) + 's'); // staggered start
            p.style.setProperty('--drift', rand(-60, 60).toFixed(0) + 'px');
            fragment.appendChild(p);
        }
        container.appendChild(fragment);
    }

    /* ---------- Mouse interaction (cursor glow + parallax) ---------- */
    function initMouseEffects() {
        if (prefersReducedMotion) return;

        var glow = document.getElementById('cursorGlow');
        var card = document.getElementById('glassCard');
        var decor = document.querySelectorAll('.decor__item');
        var ticking = false;

        function update(x, y) {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var nx = x / w - 0.5; // -0.5 .. 0.5
            var ny = y / h - 0.5;

            // Background glow follows the cursor
            if (glow) {
                var size = glow.offsetWidth;
                glow.style.transform =
                    'translate(' + (x - size / 2) + 'px,' + (y - size / 2) + 'px)';
            }

            // Decorations shift slightly (each has its own depth)
            decor.forEach(function (el) {
                var depth = parseFloat(el.dataset.depth) || 20;
                el.style.transform =
                    'translate(' + (nx * depth).toFixed(1) + 'px,' + (ny * depth).toFixed(1) + 'px)';
            });

            // Glass card tilts a tiny amount
            if (card) {
                card.style.setProperty('--ry', (nx * 4).toFixed(2) + 'deg');
                card.style.setProperty('--rx', (-ny * 4).toFixed(2) + 'deg');
            }
        }

        window.addEventListener('mousemove', function (e) {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                update(e.clientX, e.clientY);
                ticking = false;
            });
        });

        // Reset the card tilt when the mouse leaves the window
        document.addEventListener('mouseleave', function () {
            if (card) {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            }
        });
    }

    /* ---------- Confetti ---------- */
    function launchConfetti() {
        var layer = document.getElementById('confettiLayer');
        if (!layer) return;

        var count = window.innerWidth < 600 ? 70 : 140;
        var shapes = ['rect', 'circle', 'star'];
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < count; i++) {
            var piece = document.createElement('span');
            var shape = pick(shapes);
            var size = rand(7, 14);
            var color = pick(COLORS);
            var duration = rand(3.2, 5.8);
            var delay = rand(0, 1.2);

            piece.className = 'confetti';
            piece.style.left = rand(0, 100) + '%';
            piece.style.setProperty('--dur', duration.toFixed(2) + 's');
            piece.style.setProperty('--delay', delay.toFixed(2) + 's');
            piece.style.setProperty('--sway', rand(-140, 140).toFixed(0) + 'px');
            piece.style.setProperty('--spin', rand(360, 1080).toFixed(0) + 'deg');

            if (shape === 'star') {
                piece.textContent = '\u2726';
                piece.style.color = color;
                piece.style.fontSize = size * 1.5 + 'px';
                piece.style.textShadow = '0 0 8px ' + color;
            } else {
                piece.style.width = size + 'px';
                piece.style.height = shape === 'rect' ? size * 1.7 + 'px' : size + 'px';
                piece.style.background = color;
                piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
                piece.style.boxShadow = '0 0 8px ' + color;
            }

            // Remove each piece once its animation is finished
            piece.addEventListener('animationend', function () {
                this.remove();
            });

            fragment.appendChild(piece);
        }
        layer.appendChild(fragment);
    }

    /* ---------- Celebrate button ---------- */
    function initCelebrate() {
        var button = document.getElementById('celebrateBtn');
        var glow = document.getElementById('celebrateGlow');
        var toast = document.getElementById('toast');
        if (!button) return;

        var glowTimer;
        var toastTimer;

        button.addEventListener('click', function () {
            // 1. Confetti (skipped for reduced motion users)
            if (!prefersReducedMotion) {
                launchConfetti();
            }

            // 2. Temporary glow around the page
            if (glow) {
                glow.classList.add('is-active');
                clearTimeout(glowTimer);
                glowTimer = setTimeout(function () {
                    glow.classList.remove('is-active');
                }, 3500);
            }

            // 3. Thank-you message
            if (toast) {
                toast.textContent = 'Thank You for Being an Amazing Teacher!';
                toast.classList.add('is-visible');
                clearTimeout(toastTimer);
                toastTimer = setTimeout(function () {
                    toast.classList.remove('is-visible');
                }, 5000);
            }
        });
    }

    /* ---------- Gallery: reveal on scroll + lightbox ---------- */
    function initGallery() {
        var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
        if (!items.length) return;

        // Staggered reveal when scrolled into view
        items.forEach(function (item, i) { item.style.setProperty('--i', i); });
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            items.forEach(function (item) { io.observe(item); });
        } else {
            items.forEach(function (item) { item.classList.add('is-in'); });
        }

        // Lightbox
        var box = document.getElementById('lightbox');
        var img = document.getElementById('lbImg');
        var current = 0;
        var lastFocus = null;

        function show(index) {
            current = (index + items.length) % items.length;
            var src = items[current].querySelector('img');
            img.src = src.src;
            img.alt = src.alt;
            // restart zoom animation
            img.style.animation = 'none';
            void img.offsetWidth;
            img.style.animation = '';
        }
        function open(index) {
            lastFocus = document.activeElement;
            show(index);
            box.hidden = false;
            requestAnimationFrame(function () { box.classList.add('is-open'); });
            document.body.style.overflow = 'hidden';
            document.getElementById('lbClose').focus();
        }
        function close() {
            box.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(function () { box.hidden = true; }, 300);
            if (lastFocus) lastFocus.focus();
        }

        items.forEach(function (item, i) {
            item.addEventListener('click', function () { open(i); });
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
            });
        });
        document.getElementById('lbClose').addEventListener('click', close);
        document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
        document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
        box.addEventListener('click', function (e) { if (e.target === box) close(); });
        document.addEventListener('keydown', function (e) {
            if (box.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });
    }

    /* ---------- Start everything ---------- */
    function init() {
        createStars();
        createParticles();
        initMouseEffects();
        initCelebrate();
        initGallery();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
