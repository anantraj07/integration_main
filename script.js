document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.flow-node');
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

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

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
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

    nodes.forEach(node => {
        const quote = node.querySelector('.data-pulse p:first-child');
        const originalQuote = quote.textContent;
        let typeInterval;
        
        node.addEventListener('mouseenter', () => {
            let index = 0;
            quote.textContent = '';
            typeInterval = setInterval(() => {
                if (index < originalQuote.length) {
                    quote.textContent += originalQuote[index++];
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);
        });
        
        node.addEventListener('mouseleave', () => {
            clearInterval(typeInterval);
            quote.textContent = originalQuote;
        });

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

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
});
