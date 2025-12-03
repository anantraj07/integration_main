/* --- script.js --- */
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('flowCanvas'); // Updated ID
    const ctx = canvas.getContext('2d');
    const nodes = document.querySelectorAll('.flow-node'); // Updated selector
    const toggle = document.getElementById('themeToggle');
    const body = document.body;

    let particles = [];
    let devNodes = []; 
    let width, height;

    // Function to retrieve CSS variables dynamically
    function getThemeColors() {
        const style = getComputedStyle(body);
        return {
            bg: style.getPropertyValue('--theme-bg').trim(),
            particle: style.getPropertyValue('--accent-primary').trim(),
            connection: style.getPropertyValue('--accent-primary').trim().replace(')', ', 0.15)').replace('rgb', 'rgba'),
            active: style.getPropertyValue('--accent-secondary').trim(),
        };
    }

    // --- Particle Class ---
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

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticles() {
        particles = [];
        devNodes = [];
        const numStandardParticles = 100;
        
        for (let i = 0; i < numStandardParticles; i++) {
            particles.push(new Particle(false));
        }
        
        nodes.forEach((node, index) => {
            const devParticle = new Particle(true, null, null, index);
            particles.push(devParticle);
            devNodes.push(devParticle);
        });
    }

    // --- Main Animation Loop (Reads dynamic colors every frame) ---
    let hoveredNodeId = -1;

    function animateIntegrationFlow() { // Updated function name
        requestAnimationFrame(animateIntegrationFlow);
        const colors = getThemeColors();

        // Clear canvas with a trail effect based on the current theme background
        ctx.fillStyle = colors.bg.replace(')', ', 0.1)').replace('rgb', 'rgba');
        ctx.fillRect(0, 0, width, height);
        
        // 1. Draw Connections
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
        
        // 2. Draw Particles
        particles.forEach(p => {
            p.update();
            const isActive = p.isDev && p.id === hoveredNodeId;
            p.draw(colors, isActive);
        });

        ctx.globalAlpha = 1; 
    }
    
    // --- Theme Toggle Synchronization ---
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

    // --- Node Hover Listeners ---
    nodes.forEach(node => {
        const id = parseInt(node.dataset.nodeId);
        
        node.addEventListener('mouseenter', () => { hoveredNodeId = id; });
        node.addEventListener('mouseleave', () => { hoveredNodeId = -1; });
    });

    // Start the integration flow
    createParticles();
    animateIntegrationFlow();
    
    // Navbar Toggle (Standard)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});
