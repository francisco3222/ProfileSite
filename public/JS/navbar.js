(function () {
    function qs(sel, root = document) { return root.querySelector(sel); }
    function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

    // wait for fonts/layout to settle
    function readyForLayout() {
        const promises = [];
        if (document.fonts && document.fonts.ready) promises.push(document.fonts.ready);
        promises.push(new Promise(r => requestAnimationFrame(r)));
        promises.push(new Promise(r => setTimeout(r, 20)));
        return Promise.all(promises);
    }

    // wrap characters of nav text links in spans and set staggered delays
    function splitNavLetters(navbar) {
        const allLinks = qsa('.nav-links a', navbar);
        const textLinks = allLinks.filter(l => !l.querySelector('img')); // skip image-based links (lang)
        textLinks.forEach(link => {
            const original = (link.getAttribute('aria-label') || link.textContent || '').trim();
            if (!original) return;
            // avoid double-wrapping
            if (link.querySelector('.nav-letter')) {
                link.setAttribute('aria-label', original);
                return;
            }
            link.setAttribute('aria-label', original);
            // build spans
            const frag = document.createDocumentFragment();
            let delayIndex = 0;
            for (let i = 0; i < original.length; i++) {
                const ch = original[i];
                const span = document.createElement('span');
                span.className = 'nav-letter';
                span.setAttribute('aria-hidden', 'true');
                // keep spaces visible
                span.innerHTML = (ch === ' ') ? '&nbsp;' : ch;
                // set CSS variable for stagger
                span.style.setProperty('--delay', `${delayIndex * 35}ms`);
                frag.appendChild(span);
                // increment only for visible characters (skip extra delays for repeated spaces)
                if (ch !== ' ') delayIndex++;
            }
            // replace content
            link.textContent = ''; // clear
            link.appendChild(frag);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const indicator = document.getElementById('navIndicator');
        const navbar = qs('.navbar');
        if (!navbar) return;

        const links = qsa('.nav-links a', navbar).filter(Boolean);
        if (!links.length) return;

        function moveTo(el) {
            if (!indicator || !el) return;
            const linkRect = el.getBoundingClientRect();
            const navRect = navbar.getBoundingClientRect();
            const offsetLeft = linkRect.left - navRect.left;
            indicator.style.width = `${Math.round(linkRect.width)}px`;
            indicator.style.transform = `translateX(${Math.round(offsetLeft)}px)`;
            indicator.style.opacity = '1';
        }

        const active = qs('.nav-links .active', navbar) || links[0];

        // prepare letters and initial placement after layout is ready
        readyForLayout()
            .then(() => {
                splitNavLetters(navbar);
                moveTo(active);
            })
            .catch(() => {
                splitNavLetters(navbar);
                moveTo(active);
            });

        // update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // re-split (in case fonts/layout changed) and move indicator
                splitNavLetters(navbar);
                moveTo(qs('.nav-links .active', navbar) || links[0]);
            }, 120);
        });

        // click -> animate then navigate (preserve previous behaviour)
        links.forEach(link => {
            const href = link.getAttribute('href');
            // language button handling (has image)
            if (link.classList.contains('lang-btn') || link.querySelector('img')) {
                link.addEventListener('click', (e) => {
                    const hrefLocal = link.getAttribute('href');
                    if (!hrefLocal) return;
                    e.preventDefault();
                    // add flip class to trigger animation
                    link.classList.add('lang-flip');
                    // remove after animation completes (fallback timeout)
                    const cleanup = () => { link.classList.remove('lang-flip'); };
                    link.addEventListener('animationend', cleanup, { once: true });
                    setTimeout(() => { cleanup(); window.location.href = hrefLocal; }, 380);
                });
                return;
            }

            // normal nav links
            link.addEventListener('click', (e) => {
                const href2 = link.getAttribute('href');
                if (!href2 || href2.startsWith('#') || href2 === window.location.pathname) {
                    return;
                }
                e.preventDefault();

                // set active class and move indicator
                qsa('.nav-links a', navbar).forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // ensure layout update before moving
                requestAnimationFrame(() => moveTo(link));

                setTimeout(() => { window.location.href = href2; }, 160);
            });
        });
    });
})();