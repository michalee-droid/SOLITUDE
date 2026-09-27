// src/js/ui/uiModals.js

import { player, currentLocation, LOCATIONS_DATA, LOCATION_SUBLOCATIONS, currentSublocations, ACTIONS_CONFIG } from '../state/gameState.js';
import { updateStatsUI, updateLocationUI, addLogEntry, addXP } from './uiPlayer.js';
import { playChime } from '../systems/audio.js';

export let selectedTransport = null;
export let activeTimer = null;
export let currentActionKey = null;

export function openRoomMenuModal(onSublocationSwitch) {
    renderRoomMenuGrid(onSublocationSwitch);
    const modal = document.getElementById('roomMenuModal');
    const card = document.getElementById('roomMenuModalCard');
    if (modal && card) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }
}

export function closeRoomMenuModal() {
    const modal = document.getElementById('roomMenuModal');
    const card = document.getElementById('roomMenuModalCard');
    if (modal && card) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
}

export function renderRoomMenuGrid(onSublocationSwitch) {
    const container = document.getElementById('roomsGridContainer');
    if (!container) return;
    container.innerHTML = '';

    const sublocs = LOCATION_SUBLOCATIONS[currentLocation];
    if (!sublocs) return;

    const currentSubId = currentSublocations[currentLocation];

    Object.keys(sublocs).forEach(sId => {
        const sub = sublocs[sId];
        const isActive = sId === currentSubId;

        const btn = document.createElement('button');
        btn.className = `glass-panel rounded-2xl p-3 flex flex-col items-center text-center gap-2 border transition-all duration-300 cursor-pointer ${
            isActive ? 'border-amber-300/80 bg-amber-500/25 shadow-lg scale-105' : 'border-white/15 hover:border-white/40 hover:bg-white/10'
        }`;

        btn.onclick = () => {
            if (typeof onSublocationSwitch === 'function') {
                onSublocationSwitch(sId);
            }
            closeRoomMenuModal();
        };

        btn.innerHTML = `
            <div class="w-10 h-10 rounded-xl ${isActive ? 'bg-amber-400 text-stone-900' : 'bg-white/15 text-white'} flex items-center justify-center transition-colors">
                <i data-lucide="${sub.icon || 'map-pin'}" class="w-5 h-5"></i>
            </div>
            <div>
                <span class="font-serif font-bold text-xs text-white block leading-tight">${sub.name}</span>
                <span class="text-[9px] text-stone-300 block mt-0.5">${sub.subtext || ''}</span>
            </div>
        `;
        container.appendChild(btn);
    });
    if (window.lucide) window.lucide.createIcons();
}

export function openActivitiesMenuModal() {
    renderActivitiesMenuGrid();
    const modal = document.getElementById('activitiesMenuModal');
    const card = document.getElementById('activitiesMenuModalCard');
    if (modal && card) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }
}

export function closeActivitiesMenuModal() {
    const modal = document.getElementById('activitiesMenuModal');
    const card = document.getElementById('activitiesMenuModalCard');
    if (modal && card) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
}

export function renderActivitiesMenuGrid() {
    const container = document.getElementById('activitiesGridContainer');
    if (!container) return;
    container.innerHTML = '';

    const activeSubId = currentSublocations[currentLocation];
    const activeActions = Object.keys(ACTIONS_CONFIG).filter(actKey => {
        const act = ACTIONS_CONFIG[actKey];
        if (act.location !== currentLocation) return false;
        if (act.room && act.room !== activeSubId) return false;
        return true;
    });

    if (activeActions.length === 0) {
        container.innerHTML = `<div class="col-span-2 text-center text-xs text-stone-300/80 italic py-8">Tidak ada aktivitas khusus di sublokasi ini...</div>`;
        return;
    }

    activeActions.forEach(actKey => {
        const act = ACTIONS_CONFIG[actKey];
        const btn = document.createElement('button');
        btn.className = 'glass-panel rounded-2xl p-3.5 flex items-center justify-between border border-white/15 hover:border-amber-300/60 hover:bg-white/10 transition-all duration-300 cursor-pointer text-left group';
        btn.onclick = () => {
            closeActivitiesMenuModal();
            startAction(actKey);
        };

        btn.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-white/10 ${act.color} group-hover:scale-110 transition-transform">
                    <i data-lucide="${act.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${act.badgeBg} block w-max mb-1">${act.category}</span>
                    <h5 class="font-bold text-xs text-white">${act.title}</h5>
                </div>
            </div>
            <i data-lucide="play" class="w-4 h-4 text-stone-400 group-hover:text-amber-200 transition-colors"></i>
        `;
        container.appendChild(btn);
    });
    if (window.lucide) window.lucide.createIcons();
}

export function startAction(actionKey) {
    if (activeTimer) return;
    const act = ACTIONS_CONFIG[actionKey];
    if (!act) return;

    currentActionKey = actionKey;

    document.getElementById('modalTitle').innerText = act.title;
    document.getElementById('modalDesc').innerText = act.startDesc;
    document.getElementById('modalIcon').setAttribute('data-lucide', act.icon);
    if (window.lucide) window.lucide.createIcons();

    const modal = document.getElementById('activityModal');
    const card = document.getElementById('activityModalCard');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-90');
    card.classList.add('scale-100');

    addLogEntry(act.category, act.title, act.startDesc, act.icon, act.color, act.borderColor, act.badgeBg);

    let totalTime = act.duration;
    let timeRemaining = totalTime;

    updateTimerProgress(timeRemaining, totalTime);

    activeTimer = setInterval(() => {
        timeRemaining--;
        updateTimerProgress(timeRemaining, totalTime);

        if (act.statType) {
            addXP(act.statType, 1);
        }

        if (timeRemaining <= 0) {
            finishCurrentActivity(true);
        }
    }, 1000);
}

export function updateTimerProgress(remaining, total) {
    document.getElementById('modalTimerText').innerText = `${remaining}s`;
    let percentage = (remaining / total) * 100;
    document.getElementById('modalProgressBar').style.width = `${percentage}%`;
}

export function stopCurrentActivity() {
    if (!activeTimer) return;
    clearInterval(activeTimer);
    activeTimer = null;

    closeActivityModal();
    addLogEntry('DIBATALKAN', 'Aktivitas Dihentikan', 'Aktivitas dihentikan sebelum selesai.', 'alert-circle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
    currentActionKey = null;
}

export function finishCurrentActivity(completed) {
    if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
    }

    closeActivityModal();

    if (completed && currentActionKey) {
        const act = ACTIONS_CONFIG[currentActionKey];

        if (act.energiGain) player.energi = Math.min(100, player.energi + act.energiGain);
        if (act.kesegaranGain) player.kesegaran = Math.min(100, player.kesegaran + act.kesegaranGain);
        if (act.kebahagiaanGain) player.kebahagiaan = Math.min(100, player.kebahagiaan + act.kebahagiaanGain);

        updateStatsUI();
        addLogEntry(act.category, act.title, act.finishDesc, act.icon, act.color, act.borderColor, act.badgeBg);
        playChime(880);
    }

    currentActionKey = null;
}

export function closeActivityModal() {
    const modal = document.getElementById('activityModal');
    const card = document.getElementById('activityModalCard');
    if (modal && card) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-90');
    }
}

export function openLocationTransportModal(onConfirmTravel) {
    selectedTransport = null;
    const modal = document.getElementById('transportLocationModal');
    const card = document.getElementById('transportLocationModalCard');

    document.getElementById('stepTransportOptions').classList.remove('hidden');
    document.getElementById('stepLocationOptions').classList.add('hidden');
    document.getElementById('transportModalSubtitle').innerText = 'Pilih moda transportasi yang tersedia untuk memulai perjalanan.';

    renderPribadiOptionBox();

    modal.classList.remove('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
    if (window.lucide) window.lucide.createIcons();
}

export function closeTransportLocationModal() {
    const modal = document.getElementById('transportLocationModal');
    const card = document.getElementById('transportLocationModalCard');
    if (modal && card) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
}

export function renderPribadiOptionBox() {
    const container = document.getElementById('pribadiOptionBox');
    if (!container) return;

    if (player.punyaKendaraan) {
        container.innerHTML = `
            <button id="btnSelectPribadi" class="glass-panel p-4 rounded-2xl flex items-center gap-3.5 border border-indigo-400/30 hover:border-indigo-300 hover:bg-white/10 transition-all text-left cursor-pointer group w-full">
                <div class="p-3 rounded-xl bg-indigo-400/20 border border-indigo-300/40 text-indigo-300 group-hover:scale-110 transition-transform shrink-0">
                    <i data-lucide="navigation-2" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-sm text-white">Kendaraan Pribadi</h4>
                        <span class="text-[9px] bg-indigo-400/30 text-indigo-200 border border-indigo-300/40 px-2 py-0.5 rounded-md font-bold">Milik Sendiri</span>
                    </div>
                    <p class="text-[10px] text-stone-300 mt-0.5">Bebas biaya, paling leluasa.</p>
                </div>
            </button>
        `;
    } else {
        container.innerHTML = `
            <div class="glass-panel p-4 rounded-2xl flex items-center gap-3.5 border border-white/10 opacity-60 cursor-not-allowed w-full">
                <div class="p-3 rounded-xl bg-stone-700/40 border border-white/10 text-stone-400 shrink-0">
                    <i data-lucide="lock" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-sm text-stone-300">Kendaraan Pribadi</h4>
                        <span class="text-[9px] bg-rose-500/30 text-rose-200 border border-rose-300/30 px-2 py-0.5 rounded-md font-bold">Terkunci</span>
                    </div>
                    <p class="text-[10px] text-stone-400 mt-0.5">Belum memiliki kendaraan pribadi.</p>
                </div>
            </div>
        `;
    }
}

export function selectTransportMode(mode, onConfirmTravel) {
    let cost = 0;
    let modeLabel = '';

    if (mode === 'taksi') { cost = 25; modeLabel = 'Taksi Konvensional (Rp 25)'; }
    else if (mode === 'ojek') { cost = 12; modeLabel = 'Ojek Online (Rp 12)'; }
    else if (mode === 'pribadi') { cost = 0; modeLabel = 'Kendaraan Pribadi'; }
    else if (mode === 'bus') { cost = 0; modeLabel = 'Bus Umum (Gratis)'; }

    if (player.uang < cost) {
        addLogEntry('KEUANGAN', 'Gagal Naik Transportasi', `Uang Anda tidak cukup untuk membayar ${modeLabel}.`, 'alert-circle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
        playChime(300);
        return;
    }

    // Menyimpan `id` dan `mode` agar kompatibel dengan app.js
    selectedTransport = { id: mode, mode, cost, label: modeLabel };

    document.getElementById('stepTransportOptions').classList.add('hidden');
    document.getElementById('stepLocationOptions').classList.remove('hidden');
    document.getElementById('transportModalSubtitle').innerText = 'Pilih lokasi yang ingin dituju.';
    document.getElementById('selectedVehicleLabel').innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Mode: ${modeLabel}`;

    renderLocationsForTransport(onConfirmTravel);
    if (window.lucide) window.lucide.createIcons();
}

export function backToTransportSelection() {
    selectedTransport = null;
    document.getElementById('stepTransportOptions').classList.remove('hidden');
    document.getElementById('stepLocationOptions').classList.add('hidden');
    document.getElementById('transportModalSubtitle').innerText = 'Pilih moda transportasi yang tersedia untuk memulai perjalanan.';
}

export function renderLocationsForTransport(onConfirmTravel) {
    const grid = document.getElementById('locationCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    LOCATIONS_DATA.forEach(loc => {
        const isCurrent = loc.id === currentLocation;

        let speedMultiplier = 1;
        if (selectedTransport && selectedTransport.mode === 'ojek') speedMultiplier = 0.8;
        if (selectedTransport && selectedTransport.mode === 'pribadi') speedMultiplier = 0.7;
        if (selectedTransport && selectedTransport.mode === 'bus') speedMultiplier = 1.2;

        let duration = Math.round(loc.baseDuration * speedMultiplier);

        const card = document.createElement('div');
        card.className = `glass-panel p-4 rounded-2xl flex items-center justify-between border ${isCurrent ? 'border-amber-400/50 bg-amber-400/10' : 'border-white/15 hover:border-cyan-300/50'} transition-all`;

        card.innerHTML = `
            <div>
                <h4 class="font-bold text-sm text-white flex items-center gap-2">
                    ${loc.name}
                    ${isCurrent ? '<span class="text-[9px] bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded-md">Lokasi Anda</span>' : ''}
                </h4>
                <p class="text-[10px] text-stone-300 mt-0.5">${loc.subtext}</p>
                <div class="flex items-center gap-3 mt-2 text-[10px] text-cyan-200 font-semibold">
                    <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> Est. ${duration} detik</span>
                    <span class="flex items-center gap-1"><i data-lucide="coins" class="w-3 h-3"></i> Rp ${selectedTransport ? selectedTransport.cost : 0}</span>
                </div>
            </div>
            <div>
                ${isCurrent ? 
                    '<button disabled class="px-4 py-2 bg-stone-700 text-stone-400 font-bold text-xs rounded-xl cursor-not-allowed">Di Sini</button>' : 
                    `<button id="btn-travel-confirm-${loc.id}" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl border border-cyan-300/40 cursor-pointer shadow-lg transition-all active:scale-95">Berangkat</button>`
                }
            </div>
        `;
        grid.appendChild(card);

        if (!isCurrent) {
            const btn = document.getElementById(`btn-travel-confirm-${loc.id}`);
            if (btn) {
                btn.onclick = () => {
                    closeTransportLocationModal();
                    if (typeof onConfirmTravel === 'function') {
                        onConfirmTravel(loc.id, duration);
                    }
                };
            }
        }
    });
    if (window.lucide) window.lucide.createIcons();
}
