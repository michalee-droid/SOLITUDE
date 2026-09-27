import { addLogEntry } from '../ui/uiPlayer.js';

// State Management
let minigameTargetLocId = null;
let minigameBaseDuration = 10;
let minigameTimer = 10;
let animationFrameId = null;
let lastTimestamp = 0;

// Entities & Control State
let carLane = 0; // 0: Kiri (20%), 1: Kanan (60%)
let hasCrashed = false;
let score = 0;
let bonusCollected = 0;

// Obstacle & Item Config
const LANES = [20, 60]; // Persentase 'left' untuk 2 jalur
let obstacle = { lane: 1, top: -20, speed: 60 }; // Speed dalam % per detik
let collectible = { lane: 0, top: -50, speed: 50, active: true };

// Key listener reference for cleanup
let handleKeyDown = null;

export function startMinigame(targetLocId, duration, onMinigameFinish) {
    // Reset State & Safety Cleanup
    stopMinigameLoop();
    
    hasCrashed = false;
    score = 0;
    bonusCollected = 0;
    carLane = 0;
    
    minigameTimer = 10.0;
    minigameTargetLocId = targetLocId;
    minigameBaseDuration = duration;

    // Reset Entities
    resetObstacle();
    resetCollectible();

    const modal = document.getElementById('drivingMinigameModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.remove('animate-shake'); // Clear previous FX
    }

    // Attach Event Listeners
    setupInputListeners();

    // Initial Render
    renderPositions();

    // Start Smooth Game Loop
    lastTimestamp = performance.now();
    animationFrameId = requestAnimationFrame((timestamp) => gameLoop(timestamp, onMinigameFinish));
}

function gameLoop(timestamp, onMinigameFinish) {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Konversi ke detik
    lastTimestamp = timestamp;

    // Update Timer
    minigameTimer -= deltaTime;
    const timerDisp = document.getElementById('minigameTimerDisplay');
    if (timerDisp) {
        timerDisp.innerText = `${Math.max(0, minigameTimer).toFixed(1)}s`;
    }

    // Update Obstacle Position
    obstacle.top += obstacle.speed * deltaTime;
    if (obstacle.top > 100) {
        resetObstacle();
        score += 10;
    }

    // Update Collectible Position
    if (collectible.active) {
        collectible.top += collectible.speed * deltaTime;
        if (collectible.top > 100) {
            resetCollectible();
        }
    }

    // Collision Detection: Obstacle
    if (
        obstacle.top > 60 && obstacle.top < 85 &&
        carLane === obstacle.lane &&
        !hasCrashed
    ) {
        hasCrashed = true;
        triggerCrashEffect();
    }

    // Collision Detection: Collectible (Bonus)
    if (
        collectible.active &&
        collectible.top > 60 && collectible.top < 85 &&
        carLane === collectible.lane
    ) {
        collectible.active = false;
        bonusCollected += 1;
        triggerCollectEffect();
    }

    renderPositions();

    // Check Finish Condition
    if (minigameTimer <= 0) {
        stopMinigameLoop();
        finishMinigame(onMinigameFinish);
    } else {
        animationFrameId = requestAnimationFrame((t) => gameLoop(t, onMinigameFinish));
    }
}

export function moveMinigameCar(dir) {
    if (dir === 'left') carLane = 0;
    if (dir === 'right') carLane = 1;
    renderPositions();
}

function renderPositions() {
    const pCar = document.getElementById('playerMinigameCar');
    const oCar = document.getElementById('obstacleMinigameCar');
    const bonusItem = document.getElementById('bonusMinigameItem');

    if (pCar) pCar.style.left = `${LANES[carLane]}%`;
    if (oCar) {
        oCar.style.left = `${LANES[obstacle.lane]}%`;
        oCar.style.top = `${obstacle.top}%`;
    }
    if (bonusItem) {
        bonusItem.style.left = `${LANES[collectible.lane]}%`;
        bonusItem.style.top = `${collectible.top}%`;
        bonusItem.style.display = collectible.active ? 'block' : 'none';
    }
}

function resetObstacle() {
    obstacle.lane = Math.random() > 0.5 ? 1 : 0;
    obstacle.top = -20;
    // Variasi kecepatan opsional untuk tantangan
    obstacle.speed = 55 + Math.random() * 25;
}

function resetCollectible() {
    collectible.lane = Math.random() > 0.5 ? 1 : 0;
    collectible.top = -60; // Muncul lebih jarang
    collectible.active = true;
}

function triggerCrashEffect() {
    const modalContent = document.getElementById('drivingMinigameModalContent');
    if (modalContent) {
        modalContent.classList.add('animate-shake');
        setTimeout(() => modalContent.classList.remove('animate-shake'), 500);
    }
}

function triggerCollectEffect() {
    const bonusDisp = document.getElementById('minigameScoreDisplay');
    if (bonusDisp) {
        bonusDisp.innerText = `Bonus: +${bonusCollected}`;
    }
}

function setupInputListeners() {
    removeInputListeners();
    handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveMinigameCar('left');
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveMinigameCar('right');
    };
    window.addEventListener('keydown', handleKeyDown);
}

function removeInputListeners() {
    if (handleKeyDown) {
        window.removeEventListener('keydown', handleKeyDown);
        handleKeyDown = null;
    }
}

function stopMinigameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    removeInputListeners();
}

function finishMinigame(onMinigameFinish) {
    const modal = document.getElementById('drivingMinigameModal');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');

    let finalDuration = minigameBaseDuration;

    // Kalkulasi Penalti / Bonus
    if (hasCrashed) {
        finalDuration = Math.round(minigameBaseDuration * 1.4);
        addLogEntry('MINIGAME', 'Kecelakaan Jalan', 'Mengalami tabrakan! Perjalanan memakan waktu lebih lama.', 'alert-triangle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
    } else {
        // Diskon waktu hingga 40% jika banyak mengumpulkan item bonus
        const bonusDiscount = bonusCollected * 0.1;
        const multiplier = Math.max(0.5, 0.8 - bonusDiscount);
        finalDuration = Math.max(2, Math.round(minigameBaseDuration * multiplier));
        
        const detailMsg = bonusCollected > 0 
            ? `Sempurna! Berhasil mengambil ${bonusCollected} boost dan tiba jauh lebih cepat.`
            : 'Perjalanan lancar tanpa kendala!';

        addLogEntry('MINIGAME', 'Berkendara Mulus', detailMsg, 'sparkles', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
    }

    if (onMinigameFinish) onMinigameFinish(finalDuration);
}
