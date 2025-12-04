document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('flowCanvas');
    const ctx = canvas.getContext('2d');
    const nodes = document.querySelectorAll('.flow-node');
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const techDropdown = document.getElementById('techDropdown');

    let particles = [];
    let devNodes = [];
    let width, height;
    let hoveredNodeId = -1;

    // Get theme colors dynamically
    function getThemeColors() {
        const style = getComputedStyle(body);
        return {
            bg: style.getPropertyValue('--theme-bg').trim(),
            particle: style.getPropertyValue('--accent-primary').trim(),
            connection: style.getPropertyValue('--accent-primary').trim().replace(')', ', 0.15)').replace('rgb', 'rgba'),
            active: style.getPropertyValue('--accent-secondary').trim(),
        };
    }

    // Particle Class
    class Particle {
        constructor(isDev, x, y, id) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.vx = Math.random() * 0.5 - 0.25;
            this.vy = Math.random() * 0.5 - 0.25;
            this.radius = isDev ? 4 : 1.5;
            this.isDev = isDev;
            this.id = id;
        }

        update() {
            if (this.isDev) {
                const rect = nodes[this.id].getBoundingClientRect();
                this.x = rect.left + rect.width / 2;
                this.y = rect.top + rect.height / 2 + window.scrollY;
                return;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw(colors, active) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            const color = this.isDev ? colors.active : colors.particle;
            ctx.shadowBlur = this.isDev ? 15 : 5;
            ctx.shadowColor = active ? colors.active : color;
            ctx.fillStyle = active ? colors.active : color;
            ctx.fill();
        }
    }

    // Resize Canvas
    function resizeCanvas() {
        width = window.innerWidth;
        height = document.documentElement.scrollHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create Particles
    function createParticles() {
        particles = [];
        devNodes = [];
        const numStandardParticles = 80;
        
        for (let i = 0; i < numStandardParticles; i++) {
            particles.push(new Particle(false));
        }
        
        nodes.forEach((node, index) => {
            const devParticle = new Particle(true, null, null, index);
            particles.push(devParticle);
            devNodes.push(devParticle);
        });
    }

    // Animation Loop
    function animateIntegrationFlow() {
        requestAnimationFrame(animateIntegrationFlow);
        const colors = getThemeColors();

        ctx.fillStyle = colors.bg.replace(')', ', 0.1)').replace('rgb', 'rgba');
        ctx.fillRect(0, 0, width, height);
        
        // Draw Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    const isActive = (p1.isDev && p1.id === hoveredNodeId) || (p2.isDev && p2.id === hoveredNodeId);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = isActive ? colors.active : colors.connection;
                    ctx.lineWidth = isActive ? 1.5 : 0.5;
                    ctx.globalAlpha = isActive ? 1 : opacity * (hoveredNodeId === -1 ? 1 : 0.2);
                    
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw Particles
        particles.forEach(p => {
            p.update();
            const isActive = p.isDev && p.id === hoveredNodeId;
            p.draw(colors, isActive);
        });

        ctx.globalAlpha = 1;
    }

    // Theme Toggle
    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
            }
        });
    }

    // Node Hover Effects
    nodes.forEach(node => {
        const id = parseInt(node.dataset.nodeId);
        node.addEventListener('mouseenter', () => { hoveredNodeId = id; });
        node.addEventListener('mouseleave', () => { hoveredNodeId = -1; });
    });

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown for mobile
    if (techDropdown) {
        techDropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && e.target.classList.contains('nav-link')) {
                e.preventDefault();
                techDropdown.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });

    // Initialize
    createParticles();
    animateIntegrationFlow();

    // Recalculate on scroll for mobile
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            resizeCanvas();
        }
    });
});
