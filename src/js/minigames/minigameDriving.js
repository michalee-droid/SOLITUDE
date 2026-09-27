import { addLogEntry } from '../ui/uiPlayer.js';

export let minigameTargetLocId = null;
export let minigameBaseDuration = 10;
export let minigameInterval = null;
export let minigameTimer = 10;
export let carPosition = 20; 
export let obstaclePosition = 60; 
export let obstacleTop = 0;
export let hasCrashed = false;

export function startMinigame(targetLocId, duration, onMinigameFinish) {
    hasCrashed = false;
    carPosition = 20;
    obstaclePosition = Math.random() > 0.5 ? 20 : 60;
    obstacleTop = 0;
    minigameTimer = 10.0;
    minigameTargetLocId = targetLocId;
    minigameBaseDuration = duration;

    const modal = document.getElementById('drivingMinigameModal');
    if (modal) modal.classList.remove('opacity-0', 'pointer-events-none');

    updateMinigameCarPositions();

    minigameInterval = setInterval(() => {
        minigameTimer -= 0.1;
        const timerDisp = document.getElementById('minigameTimerDisplay');
        if (timerDisp) timerDisp.innerText = `${Math.max(0, minigameTimer).toFixed(1)}s`;

        obstacleTop += 4;
        if (obstacleTop > 80) {
            obstacleTop = 0;
            obstaclePosition = Math.random() > 0.5 ? 20 : 60;
        }

        if (obstacleTop > 50 && obstacleTop < 80 && Math.abs(carPosition - obstaclePosition) < 15) {
            hasCrashed = true;
        }

        updateMinigameCarPositions();

        if (minigameTimer <= 0) {
            clearInterval(minigameInterval);
            finishMinigame(onMinigameFinish);
        }
    }, 100);
}

export function moveMinigameCar(dir) {
    if (dir === 'left') carPosition = 20;
    if (dir === 'right') carPosition = 60;
    updateMinigameCarPositions();
}

function updateMinigameCarPositions() {
    const pCar = document.getElementById('playerMinigameCar');
    const oCar = document.getElementById('obstacleMinigameCar');
    if (pCar) pCar.style.left = `${carPosition}%`;
    if (oCar) {
        oCar.style.left = `${obstaclePosition}%`;
        oCar.style.top = `${obstacleTop}%`;
    }
}

function finishMinigame(onMinigameFinish) {
    const modal = document.getElementById('drivingMinigameModal');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');

    let finalDuration = minigameBaseDuration;
    if (hasCrashed) {
        finalDuration = Math.round(minigameBaseDuration * 1.5);
        addLogEntry('MINIGAME', 'Kecelakaan Jalan', 'Mengalami tabrakan ringan! Durasi perjalanan bertambah.', 'alert-triangle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
    } else {
        finalDuration = Math.max(3, Math.round(minigameBaseDuration * 0.7));
        addLogEntry('MINIGAME', 'Berkendara Mulus', 'Perjalanan lancar tanpa kendala! Tiba lebih cepat.', 'sparkles', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
    }

    if (onMinigameFinish) onMinigameFinish(finalDuration);
}
