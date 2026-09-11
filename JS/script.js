'use strict';

// Resolve links relative to this script so the site also works in a subfolder.
const siteRoot = new URL('../', document.currentScript.src);
const menuItems = [
    ['Home', 'index.html'], ['Explore', 'index.html#slider-section'],
    ['About', 'HTML/about.html'], ['Contact', 'HTML/contact.html']
];
const playSound = (id) => {
    const audio = document.getElementById(id);
    if (!audio) return null;
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback) playback.catch(() => {}); // Sound must never block navigation.
    return audio;
};
const navigateAfterSound = (destination) => {
    const audio = document.getElementById('click-sound2');
    if (!audio) {
        window.location.href = destination;
        return;
    }

    let navigated = false;
    const navigate = () => {
        if (navigated) return;
        navigated = true;
        window.location.href = destination;
    };

    audio.currentTime = 0;
    audio.addEventListener('ended', navigate, { once: true });
    audio.addEventListener('error', navigate, { once: true });
    const playback = audio.play();
    if (playback) playback.catch(navigate);
};
const rotateOmnitrix = (image, direction) => {
    if (!image) return;
    image.classList.remove('rotate-logo-left', 'rotate-logo-right');
    const halfTurn = direction === 'right' ? 90 : -90;

    if (typeof image.animate === 'function') {
        image.getAnimations().forEach(animation => animation.cancel());
        image.animate(
            [
                { transform: 'rotate(0deg)' },
                { transform: `rotate(${halfTurn}deg)`, offset: 0.5 },
                { transform: 'rotate(0deg)' }
            ],
            { duration: 500, easing: 'ease-in-out' }
        );
    } else {
        void image.offsetWidth;
        image.classList.add('rotate-logo-' + direction);
    }
};

document.querySelectorAll('.site-nav a').forEach(link => {
    if (link.pathname === location.pathname && !link.hash) link.setAttribute('aria-current', 'page');
});
const menuLink = document.getElementById('menu-item');
if (menuLink) {
    let selected = 0;
    const updateMenu = () => {
        menuLink.textContent = menuItems[selected][0];
        menuLink.href = new URL(menuItems[selected][1], siteRoot).href;
    };
    const logo = menuLink.closest('.logo');
    logo.querySelector('.left-btn').addEventListener('click', () => {
        rotateOmnitrix(logo.querySelector('.omnitrix-logo'), 'left');
        selected = (selected + menuItems.length - 1) % menuItems.length;
        updateMenu();
        playSound('click-sound1');
    });
    logo.querySelector('.right-btn').addEventListener('click', () => {
        rotateOmnitrix(logo.querySelector('.omnitrix-logo'), 'right');
        selected = (selected + 1) % menuItems.length;
        updateMenu();
        playSound('click-sound1');
    });
    menuLink.addEventListener('click', event => {
        const destination = menuLink.href;
        const exploringHome = menuItems[selected][0] === 'Explore' && location.pathname.endsWith('/index.html');
        if (exploringHome) {
            event.preventDefault();
            playSound('click-sound2');
            const sliderSection = document.getElementById('slider-section');
            sliderSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sliderSection?.classList.add('highlight');
            window.setTimeout(() => sliderSection?.classList.remove('highlight'), 4000);
            return;
        }

        event.preventDefault();
        navigateAfterSound(destination);
    });
    updateMenu();
}

if (location.hash === '#slider-section') {
    const sliderSection = document.getElementById('slider-section');
    sliderSection?.classList.add('highlight');
    window.setTimeout(() => sliderSection?.classList.remove('highlight'), 4000);
}

// One visible slide, with no width calculations or timers to drift on resize.
// Without JavaScript every card remains readable in normal document flow.
document.querySelectorAll('.slider, .slider-wrapper').forEach((track, carouselIndex) => {
    const slides = Array.from(track.children);
    if (!slides.length) return;
    const isHomeCarousel = track.classList.contains('slider');
    let current = 0;
    track.id ||= `carousel-${carouselIndex}`;
    track.classList.add('carousel-ready');
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');
    track.setAttribute('aria-label', track.closest('section, .slideBorder')?.querySelector('h2')?.textContent || 'Explore');
    track.tabIndex = 0;
    // Keep the original Omnitrix slide switcher and homepage numbered buttons.
    const previous = document.querySelector('.left-btn1');
    const next = document.querySelector('.right-btn1');
    const slideOmnitrix = previous?.closest('.logo')?.querySelector('.omnitrix-logo');
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';
    track.before(status);
    const dots = isHomeCarousel ? Array.from(document.querySelectorAll('.slider-nav-btn')) : [];
    const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            if (i !== current && slide.contains(document.activeElement)) track.focus({ preventScroll: true });
            if (isHomeCarousel) {
                slide.hidden = false;
                slide.style.transform = `translateX(${(i - current) * 100}%)`;
                slide.setAttribute('aria-hidden', String(i !== current));
                slide.inert = i !== current;
            } else {
                slide.hidden = i !== current;
            }
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
        });
        status.textContent = `${current + 1} / ${slides.length}`;
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    };
    previous?.addEventListener('click', () => {
        rotateOmnitrix(slideOmnitrix, 'left');
        show(current - 1);
        playSound('click-sound1');
    });
    next?.addEventListener('click', () => {
        rotateOmnitrix(slideOmnitrix, 'right');
        show(current + 1);
        playSound('click-sound1');
    });
    dots.forEach((dot, i) => {
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        dot.setAttribute('aria-controls', track.id);
        dot.addEventListener('click', () => show(i));
    });
    track.addEventListener('keydown', event => {
        const offsets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
        if (!(event.key in offsets)) return;
        event.preventDefault();
        show(offsets[event.key]);
    });
    let start = null;
    let swiped = false;
    track.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse') return;
        start = { x: event.clientX, y: event.clientY };
        swiped = false;
    });
    track.addEventListener('pointerup', event => {
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        start = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            swiped = true;
            const direction = dx < 0 ? 'right' : 'left';
            rotateOmnitrix(slideOmnitrix, direction);
            show(current + (direction === 'right' ? 1 : -1));
            playSound('click-sound1');
        }
    });
    track.addEventListener('pointercancel', () => { start = null; });
    track.addEventListener('click', event => {
        if (swiped) { event.preventDefault(); swiped = false; }
    }, true);
    show(0);

    // The home carousel advances on its own. Pause while someone is reading or
    // operating it, then continue after they move away.
    if (isHomeCarousel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let autoplay = window.setInterval(() => show(current + 1), 2000);
        const stopAutoplay = () => {
            window.clearInterval(autoplay);
            autoplay = null;
        };
        const startAutoplay = () => {
            if (!autoplay && !document.hidden) autoplay = window.setInterval(() => show(current + 1), 2000);
        };

        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
        track.addEventListener('focusin', stopAutoplay);
        track.addEventListener('focusout', event => {
            if (!track.contains(event.relatedTarget)) startAutoplay();
        });
        track.addEventListener('pointerdown', stopAutoplay);
        track.addEventListener('pointerup', startAutoplay);
        document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
    }
});
