import { startMinigame, moveMinigameCar, setBrakeState } from './minigames/minigameDriving.js';
import { playBGM, playChime } from './systems/audio.js';
import { initWeatherCanvas, updateWeatherLogic } from './systems/weather.js';
import { tickSimTime, fastForwardOneMonth } from './systems/timeSystem.js';
import { player, currentLocation, setCurrentLocation, currentSublocations, LOCATION_SUBLOCATIONS, LOCATIONS_DATA } from './state/gameState.js';
import { updatePlayerInfoUI, updateStatsUI, updateClockDisplays, updateWeatherUI, updateLocationUI, addLogEntry } from './ui/uiPlayer.js';
import { openSmartphonePage, closeSmartphonePage, openPhonePageApp, closePhonePageApp } from './ui/uiSmartphone.js';
import { startMinigame, moveMinigameCar } from './minigames/minigameDriving.js';
import { 
    openRoomMenuModal, closeRoomMenuModal, 
    openActivitiesMenuModal, closeActivitiesMenuModal, 
    openLocationTransportModal, closeTransportLocationModal,
    selectTransportMode, backToTransportSelection,
    startGenericActivity, activeTimer, stopCurrentActivity, selectedTransport
} from './ui/uiModals.js';

window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // Inisialisasi Tampilan & Sistem
    initWeatherCanvas();
    updatePlayerInfoUI();
    updateStatsUI();
    updateLocationUI();
    updateClockDisplays();
    updateWeatherUI();

    // Loop interval simulasi waktu
    setInterval(() => tickSimTime(activeTimer), 1500);

    // Event Listener Smartphone
    const btnSmart = document.getElementById('btnOpenSmartphone');
    if (btnSmart) {
        btnSmart.onclick = (e) => {
            e.preventDefault();
            openSmartphonePage();
        };
    }

    const btnCloseSmart = document.getElementById('btnCloseSmartphonePage');
    if (btnCloseSmart) btnCloseSmart.onclick = closeSmartphonePage;

    const btnCloseAppDetail = document.getElementById('btnPhonePageBackHome');
    if (btnCloseAppDetail) btnCloseAppDetail.onclick = closePhonePageApp;

    // Direct listener untuk App Grid Smartphone
    const appButtons = document.querySelectorAll('[data-app-target]');
    appButtons.forEach(btn => {
        btn.onclick = () => openPhonePageApp(btn.getAttribute('data-app-target'), travelToLocation);
    });

    // Event Listener Modal Ruangan/Sublokasi (Diperbaiki agar membawa callback switchSublocation)
    const btnOpenRoom = document.getElementById('btnOpenRoomMenu');
    if (btnOpenRoom) btnOpenRoom.onclick = () => openRoomMenuModal(switchSublocation);

    const btnCloseRoom = document.getElementById('btnCloseRoomMenuModal');
    if (btnCloseRoom) btnCloseRoom.onclick = closeRoomMenuModal;

    // Event Listener Modal Aktivitas
    const btnOpenAct = document.getElementById('btnOpenActivitiesMenu');
    if (btnOpenAct) btnOpenAct.onclick = openActivitiesMenuModal;

    const btnCloseAct = document.getElementById('btnCloseActivitiesMenuModal');
    if (btnCloseAct) btnCloseAct.onclick = closeActivitiesMenuModal;

    const btnStopAct = document.getElementById('btnStopActivity');
    if (btnStopAct) btnStopAct.onclick = stopCurrentActivity;

    // Event Listener Modal Transportasi
    const btnOpenTransport = document.getElementById('btnOpenTransportModal');
    if (btnOpenTransport) btnOpenTransport.onclick = () => openLocationTransportModal(confirmTravelWithMinigame);

    const btnCloseTransport = document.getElementById('btnCloseTransportModal');
    if (btnCloseTransport) btnCloseTransport.onclick = closeTransportLocationModal;

    const btnBackTransport = document.getElementById('btnBackToTransport');
    if (btnBackTransport) btnBackTransport.onclick = backToTransportSelection;

    // Transport Mode Option Selection Listeners
    ['taksi', 'ojek', 'bus', 'pribadi'].forEach(mode => {
        const btn = document.getElementById(`btnSelectMode_${mode}`);
        if (btn) btn.onclick = () => selectTransportMode(mode, confirmTravelWithMinigame);
    });

    // Event Listener Minigame Berkendara
    const btnMinigameLeft = document.getElementById('btnMinigameLeft');
    if (btnMinigameLeft) btnMinigameLeft.onclick = () => moveMinigameCar('left');

    const btnMinigameRight = document.getElementById('btnMinigameRight');
    if (btnMinigameRight) btnMinigameRight.onclick = () => moveMinigameCar('right');

    // Event Listener Log
    const btnClearLogs = document.getElementById('btnClearLogs');
    if (btnClearLogs) {
        btnClearLogs.onclick = () => {
            const stack = document.getElementById('journalStack');
            if (stack) stack.innerHTML = '';
        };
    }

    // Fast Forward Time Listener
    const btnFastForward = document.getElementById('btnFastForwardMonth');
    if (btnFastForward) {
        btnFastForward.onclick = () => fastForwardOneMonth(activeTimer);
    }

    addLogEntry('SISTEM', 'Simulasi Dimulai', `Selamat datang kembali, ${player.nama}. Sistem simulasi kehidupan siap dijalankan.`, 'sparkles', 'text-amber-200', 'border-l-amber-400', 'bg-amber-400/20 text-amber-200 border-amber-300/40');
    playBGM();
});

// Switch Sublocation Manager
function switchSublocation(subId) {
    const sublocs = LOCATION_SUBLOCATIONS[currentLocation];
    if (!sublocs || !sublocs[subId] || activeTimer) return;

    closeRoomMenuModal();
    if (currentSublocations[currentLocation] === subId) return;

    const targetSub = sublocs[subId];
    currentSublocations[currentLocation] = subId;
    updateLocationUI(); 
    
    addLogEntry('BERPINDAH', targetSub.name, `Melangkah ke ${targetSub.name.toLowerCase()}.`, targetSub.icon, 'text-amber-200', 'border-l-amber-400', 'bg-amber-400/20 text-amber-200 border-amber-300/40');
    playChime(659.25);
}

// Travel Location Manager
function travelToLocation(locId) {
    if (activeTimer) return;
    const targetLoc = LOCATIONS_DATA.find(l => l.id === locId);
    if (!targetLoc) return;

    if (locId === 'sekitar_rumah') {
        let waitTime = 5;
        startGenericActivity(
            'Perjalanan Travel', 
            `Sedang berjalan menuju ${targetLoc.name}...`, 
            'compass', 
            waitTime, 
            () => {
                setCurrentLocation(locId);
                updateLocationUI();
                addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
                playChime(783.99);
            }
        );
    } else {
        setCurrentLocation(locId);
        updateLocationUI();

        addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
        playChime(783.99);
    }
}

// Minigame Travel Confirmation Callback
function confirmTravelWithMinigame(targetLocId, duration) {
    if (selectedTransport && selectedTransport.cost > 0) {
        player.uang -= selectedTransport.cost;
        updateStatsUI();
    }

    closeTransportLocationModal();
    
    startMinigame(targetLocId, duration, (finalDuration) => {
        const targetLoc = LOCATIONS_DATA.find(l => l.id === targetLocId);
        startGenericActivity(
            'Perjalanan Transportasi', 
            `Sedang menuju ${targetLoc ? targetLoc.name : 'tujuan'} dengan ${selectedTransport ? selectedTransport.label : 'kendaraan'}...`, 
            'navigation', 
            finalDuration, 
            () => {
                setCurrentLocation(targetLocId);
                updateLocationUI();
                addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
                playChime(783.99);
            }
        );
    });
}

// =========================================================================
// 🌐 Mendaftarkan Fungsi Penting ke Objek Global (window)
// =========================================================================
window.switchSublocation = switchSublocation;
window.travelToLocation = travelToLocation;
window.openRoomMenuModal = () => openRoomMenuModal(switchSublocation);
window.openLocationTransportModal = () => openLocationTransportModal(confirmTravelWithMinigame);

// ➕ Tambahkan fungsi-fungsi ini agar onclick di HTML bekerja:
window.closeSmartphonePage = closeSmartphonePage;
window.moveMinigameCar = moveMinigameCar;
window.closeTransportLocationModal = closeTransportLocationModal;
window.setBrakeState = setBrakeState;
