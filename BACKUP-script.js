document.addEventListener('DOMContentLoaded', () => {
    // === FORCE SCROLL TO TOP ON LOAD ===
    window.scrollTo(0, 0);

    // === NAVBAR HIDE ON SCROLL ===
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    const handleNavbar = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleNavbar);

    // === SCROLL REVEAL ANIMATION ===
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // === STARRY BACKGROUND CANVAS ===
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return; // safety

    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    const numStars = 150; // adjust for more or less density

    const initCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    };

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Most stars are tiny, some are a bit bigger
            this.size = Math.random() * 1.5 + 0.5;
            // Twinkling effect base opacity
            this.baseOpacity = Math.random() * 0.5 + 0.2;
            this.opacity = this.baseOpacity;
            // Movement speed: subtle upward/drift
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2 - 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Screen wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Twinkling effect (sine wave based on time + offset)
            this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.001 * this.size) * 0.3;
            if (this.opacity < 0.1) this.opacity = 0.1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Some white, some fuchsia-ish
            if (Math.random() > 0.95) {
                ctx.fillStyle = `rgba(255, 0, 255, ${this.opacity})`; // fuchsia stars occasionally
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            }
            ctx.fill();
        }
    }

    const initStars = () => {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    };

    const animateStars = () => {
        // Clear canvas with a slight trail effect or completely clean
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animateStars);
    };

    // Initialize & Start
    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateStars();
});
