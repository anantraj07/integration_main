document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.flow-node');
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    // Title glitch effect
    const title = document.querySelector('.master-title');
    const originalText = title.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    function glitchText() {
        if (Math.random() > 0.95) {
            let glitched = '';
            for (let i = 0; i < originalText.length; i++) {
                glitched += Math.random() > 0.9 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : originalText[i];
            }
            title.textContent = glitched;
            setTimeout(() => { title.textContent = originalText; }, 50);
        }
    }
    setInterval(glitchText, 3000);

    // Parallax scroll effect
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking && window.innerWidth > 768) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                nodes.forEach((node, i) => {
                    const speed = (i % 3 + 1) * 0.02;
                    node.style.transform = `translateY(${scrolled * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // Node hover effects
    nodes.forEach(node => {
        const quote = node.querySelector('.data-pulse p:first-child');
        const originalQuote = quote.textContent;
        let typeInterval;
        
        node.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                let index = 0;
                quote.textContent = '';
                typeInterval = setInterval(() => {
                    if (index < originalQuote.length) {
                        quote.textContent += originalQuote[index++];
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 30);
            }
        });
        
        node.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                clearInterval(typeInterval);
                quote.textContent = originalQuote;
            }
        });

        // Ripple effect on click
        node.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 140, 0, 0.5) 0%, transparent 70%);
                width: 20px;
                height: 20px;
                left: ${e.clientX - node.getBoundingClientRect().left - 10}px;
                top: ${e.clientY - node.getBoundingClientRect().top - 10}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            node.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Theme toggle
    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            }
            
            const slider = toggle.nextElementSibling;
            slider.style.transform = 'scale(1.2)';
            setTimeout(() => { slider.style.transform = ''; }, 200);
        });
    }

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Mobile dropdown handling
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const parent = trigger.closest('.nav-item');
                parent.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Close mobile menu
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
            
            // Close all dropdowns when clicking outside
            if (!e.target.closest('.nav-item.has-dropdown')) {
                document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                    item.classList.remove('active');
                });
            }
        }
    });

    // Close dropdowns when clicking on a dropdown item
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset mobile states on desktop
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});
