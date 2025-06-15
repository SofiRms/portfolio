document.addEventListener('DOMContentLoaded', function() {
     class NetworkAnimation {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.mouse = { x: null, y: null };
                
                this.init();
                this.bindEvents();
                this.animate();
            }

            init() {
                this.resizeCanvas();
                this.createParticles();
            }

            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }

            createParticles() {
                const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
                this.particles = [];
                
                for (let i = 0; i < particleCount; i++) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        size: Math.random() * 2 + 1
                    });
                }
            }

            bindEvents() {
                window.addEventListener('resize', () => {
                    this.resizeCanvas();
                    this.createParticles();
                });

                this.canvas.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });

                this.canvas.addEventListener('mouseleave', () => {
                    this.mouse.x = null;
                    this.mouse.y = null;
                });
            }

            drawParticle(particle) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = '#00f5ff';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00f5ff';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }

            drawLine(particle1, particle2, opacity) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle1.x, particle1.y);
                this.ctx.lineTo(particle2.x, particle2.y);
                this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }

            updateParticle(particle) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > this.canvas.width) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > this.canvas.height) {
                    particle.vy *= -1;
                }

                // Keep particles within bounds
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            animate() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Update and draw particles
                this.particles.forEach(particle => {
                    this.updateParticle(particle);
                    this.drawParticle(particle);
                });

                // Draw connections between nearby particles
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const dx = this.particles[i].x - this.particles[j].x;
                        const dy = this.particles[i].y - this.particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const maxDistance = 120;

                        if (distance < maxDistance) {
                            const opacity = (1 - distance / maxDistance) * 0.5;
                            this.drawLine(this.particles[i], this.particles[j], opacity);
                        }
                    }
                }

                // Draw connections to mouse
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    this.particles.forEach(particle => {
                        const dx = particle.x - this.mouse.x;
                        const dy = particle.y - this.mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const maxDistance = 150;

                        if (distance < maxDistance) {
                            const opacity = (1 - distance / maxDistance) * 0.8;
                            this.drawLine(particle, this.mouse, opacity);
                        }
                    });

                    // Draw mouse point
                    this.ctx.beginPath();
                    this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#bf00ff';
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = '#bf00ff';
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }

                requestAnimationFrame(() => this.animate());
            }
        }

        // Initialize the animation when the page loads
        window.addEventListener('load', () => {
            new NetworkAnimation('networkCanvas');
        });
});