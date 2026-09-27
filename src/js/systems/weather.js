import { WEATHER_LIST, currentWeather, setCurrentWeather } from '../state/weatherState.js';

const weatherCanvas = document.getElementById('weatherCanvas');
const ctx = weatherCanvas ? weatherCanvas.getContext('2d') : null;
let particles = [];

export function initWeatherCanvas() {
    if (!weatherCanvas) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initParticles();
    animateParticles();
}

function resizeCanvas() {
    if (!weatherCanvas) return;
    weatherCanvas.width = window.innerWidth;
    weatherCanvas.height = window.innerHeight;
}

class WeatherParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * weatherCanvas.width;
        this.y = weatherCanvas.height + Math.random() * 20;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.25 + 0.1; 
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.4 + 0.15;
        this.fadeSpeed = 0.003 + Math.random() * 0.003;
        this.state = 'fadeIn';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        const topBoundary = weatherCanvas.height * 0.55;

        if (this.state === 'fadeIn') {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= this.maxOpacity) {
                this.opacity = this.maxOpacity;
                this.state = 'active';
            }
        }
        
        if (this.y <= topBoundary || this.state === 'fadeOut') {
            this.state = 'fadeOut';
            this.opacity -= this.fadeSpeed * 1.5;
            if (this.opacity <= 0) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        let color = '255, 230, 180';
        if (currentWeather.cond.includes('Berawan')) color = '200, 220, 240';
        if (currentWeather.cond.includes('Hujan')) color = '160, 200, 255';

        ctx.fillStyle = `rgba(${color}, ${Math.max(0, this.opacity)})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(${color}, ${Math.max(0, this.opacity)})`;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 20; i++) {
        particles.push(new WeatherParticle());
    }
}

function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

export function updateWeatherLogic(updateUINotifier) {
    const index = Math.floor(Math.random() * WEATHER_LIST.length);
    const w = WEATHER_LIST[index];
    const randomTemp = Math.floor(Math.random() * (w.tempMax - w.tempMin + 1)) + w.tempMin;
    setCurrentWeather({ cond: w.cond, temp: randomTemp, icon: w.icon });
    if (updateUINotifier) updateUINotifier();
}
