document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, #video-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const menuItem = document.getElementById('menu-item');
    const omnitrixLogo = document.querySelector('.omnitrix-logo');
    const sliderSection = document.getElementById('slider-section');
    const items = [
        { name: 'Home', href: '/HTML/index.html' },
        { name: 'Explore', href: '#slider-section' },
        { name: 'About', href: '/HTML/about.html' },
        { name: 'Contact', href: '/HTML/contact.html' }
    ];
    let index = 0;

    // Sound effects
    const clickSound1 = document.getElementById('click-sound1');
    const clickSound2 = document.getElementById('click-sound2');

    // Update the displayed menu item
    function updateMenuItem(newIndex, direction) {
        menuItem.textContent = items[newIndex].name;
        menuItem.href = items[newIndex].href;

        omnitrixLogo.classList.add(direction === 'right' ? 'rotate-logo-right' : 'rotate-logo-left');

        // Play click sound
        clickSound1.currentTime = 0;
        clickSound1.play();

        // Remove animation classes after animation ends
        setTimeout(() => {
            omnitrixLogo.classList.remove('rotate-logo-right', 'rotate-logo-left');
        }, 1000); // Match this duration with the animation duration in CSS
    }

    // Event listeners for the switch buttons
    document.querySelector('.left-btn').addEventListener('click', () => {
        const newIndex = (index - 1 + items.length) % items.length;
        updateMenuItem(newIndex, 'left');
        index = newIndex;
    });

    document.querySelector('.right-btn').addEventListener('click', () => {
        const newIndex = (index + 1) % items.length;
        updateMenuItem(newIndex, 'right');
        index = newIndex;
    });

    // Scroll to slider and highlight on clicking "Explore"
    menuItem.addEventListener('click', (event) => {
        if (items[index].name === 'Explore') {
            clickSound2.currentTime = 0;
            clickSound2.play();
            event.preventDefault();
            // clickSound2.play();
            sliderSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to slider section
            sliderSection.classList.add('highlight');
            setTimeout(() => {
                sliderSection.classList.remove('highlight');
            }, 4000); // Highlight effect duration

        } else {
            // Play the second click sound and allow navigation while sound is playing
            event.preventDefault();
            clickSound2.currentTime = 0;
            clickSound2.play();
            const href = items[index].href;

            // Delay navigation until the sound finishes playing
            setTimeout(() => {
                window.location.href = href;
            }, clickSound2.duration * 1000);
        }
    });
    

});
