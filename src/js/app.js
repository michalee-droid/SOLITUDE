// 1. Pengimporan Modul
import { playBGM, playChime } from './systems/audio.js';
import { initWeatherCanvas } from './systems/weather.js';
import { tickSimTime, fastForwardOneMonth } from './systems/timeSystem.js';
import { player, currentLocation, setCurrentLocation, currentSublocations, LOCATION_SUBLOCATIONS, LOCATIONS_DATA } from './state/gameState.js';
import { updatePlayerInfoUI, updateStatsUI, updateClockDisplays, updateWeatherUI, updateLocationUI, addLogEntry } from './ui/uiPlayer.js';
import { openSmartphonePage, closeSmartphonePage, openPhonePageApp, closePhonePageApp, initSmartphoneUI } from './ui/uiSmartphone.js';
import { 
    openRoomMenuModal, closeRoomMenuModal, 
    openActivitiesMenuModal, closeActivitiesMenuModal, 
    openLocationTransportModal, closeTransportLocationModal,
    selectTransportMode, backToTransportSelection,
    activeTimer, stopCurrentActivity, selectedTransport
} from './ui/uiModals.js';
import { startTravelLoading } from './ui/uiLoading.js';

window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // Inisialisasi Tampilan & Sistem
    initWeatherCanvas();
    updatePlayerInfoUI();
    updateStatsUI();
    updateLocationUI();
    updateClockDisplays();
    updateWeatherUI();
    initSmartphoneUI();

    // FIX: load save + safe interval
    try { const { loadGame } = await import('./state/gameState.js'); loadGame(); } catch(e){}
    setInterval(() => tickSimTime(activeTimer), 1500);
    // Auto save every 10s
    setInterval(async()=>{ try{ const { saveGame } = await import('./state/gameState.js'); saveGame(); }catch(e){} }, 10000);

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

    // Event Listener Modal Ruangan/Sublokasi
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

    // Event Listener Modal Transportasi / Navigasi (Menangani ID 'btnOpenTransport' dan 'btnOpenTransportModal')
    const btnOpenTransport = document.getElementById('btnOpenTransport') || document.getElementById('btnOpenTransportModal') || document.getElementById('btnOpenLocationMenu');
    if (btnOpenTransport) {
        btnOpenTransport.onclick = () => openLocationTransportModal(confirmTravelWithLoading);
    }

    const btnCloseTransport = document.getElementById('btnCloseTransportModal');
    if (btnCloseTransport) btnCloseTransport.onclick = closeTransportLocationModal;

    const btnBackTransport = document.getElementById('btnBackToTransport');
    if (btnBackTransport) btnBackTransport.onclick = backToTransportSelection;

    // Transport Mode Option Selection Listeners
    ['taksi', 'ojek', 'bus', 'pribadi'].forEach(mode => {
        const btn = document.getElementById(`btnSelectMode_${mode}`);
        if (btn) btn.onclick = () => selectTransportMode(mode, confirmTravelWithLoading);
    });

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

    if (window.lucide) window.lucide.createIcons();
}

// Travel Location Manager (Direct)
function travelToLocation(locId) {
    if (activeTimer) return;
    const targetLoc = LOCATIONS_DATA.find(l => l.id === locId);
    if (!targetLoc) return;

    setCurrentLocation(locId);
    updateLocationUI();

    addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
    playChime(783.99);

    if (window.lucide) window.lucide.createIcons();
}

// Sistem Perjalanan Transportasi Menggunakan Loading Screen Latar Gambar
function confirmTravelWithLoading(targetLocId, duration) {
    if (selectedTransport && selectedTransport.cost > 0) {
        player.uang -= selectedTransport.cost;
        updatePlayerInfoUI();
        updateStatsUI();
    }

    // Tutup Modal Pilihan Transportasi
    closeTransportLocationModal();

    const targetLoc = LOCATIONS_DATA.find(l => l.id === targetLocId);
    const destinationName = targetLoc ? targetLoc.name : 'Tujuan';
    const transportType = selectedTransport ? (selectedTransport.mode || selectedTransport.id) : 'ojek';

    // Jalankan Loading Screen dengan Latar Belakang Gambar
    startTravelLoading(transportType, destinationName, () => {
        // Callback Setelah Loading Selesai
        setCurrentLocation(targetLocId);
        updateLocationUI();
        addLogEntry(
            'TRAVEL', 
            destinationName, 
            `Tiba di kawasan ${destinationName} menggunakan ${selectedTransport ? selectedTransport.label : 'transportasi'}.`, 
            'map-pin', 
            'text-emerald-300', 
            'border-l-emerald-400', 
            'bg-emerald-400/20 text-emerald-200 border-emerald-300/40'
        );
        playChime(783.99);

        if (window.lucide) window.lucide.createIcons();
    });
}

// Mendaftarkan Fungsi ke Objek Global (window)
window.switchSublocation = switchSublocation;
window.travelToLocation = travelToLocation;
window.openRoomMenuModal = () => openRoomMenuModal(switchSublocation);
window.openLocationTransportModal = () => openLocationTransportModal(confirmTravelWithLoading);
window.openRoomMenuModal = () => openRoomMenuModal(switchSublocation);
window.closeSmartphonePage = closeSmartphonePage;
window.closeTransportLocationModal = closeTransportLocationModal;
