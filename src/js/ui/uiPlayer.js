import { player, getRequiredXP, currentLocation, LOCATION_SUBLOCATIONS, currentSublocations, LOCATIONS_DATA } from '../state/gameState.js';
import { currentWeather } from '../state/weatherState.js';
import { getMonthYearSimDate, getFormattedSimTime, getFullFormattedSimDate } from '../systems/timeSystem.js';

export function updatePlayerInfoUI() {
    const a = document.getElementById('charNameDisplay'); if(a) a.innerText = player.nama;
    const b = document.getElementById('charMetaDisplay'); if(b) b.innerText = `${player.gender} • ${player.tempatLahir}`;
}
export function setRingDashArray(elementId, percentage) {
    const ring = document.getElementById(elementId);
    if (ring) {
        const value = Math.max(0, Math.min(100, percentage));
        ring.setAttribute('stroke-dasharray', `${value}, 100`);
    }
}
export function updateStatsUI() {
    const set = (id,val)=>{ const e=document.getElementById(id); if(e) e.innerText=val; };
    set('statUangVal', `Rp ${player.uang}`);
    set('statEnergiVal', `${player.energi}`); setRingDashArray('statEnergiRing', player.energi);
    set('statKesegaranVal', `${player.kesegaran}`); setRingDashArray('statKesegaranRing', player.kesegaran);
    set('statKebahagiaanVal', `${player.kebahagiaan}`); setRingDashArray('statKebahagiaanRing', player.kebahagiaan);
    set('statFisikVal', `Lv.${player.fisik.level}`); setRingDashArray('statFisikRing', (player.fisik.xp / getRequiredXP(player.fisik.level)) * 100);
    set('statKecerdasanVal', `Lv.${player.kecerdasan.level}`); setRingDashArray('statKecerdasanRing', (player.kecerdasan.xp / getRequiredXP(player.kecerdasan.level)) * 100);
    set('statSosialVal', `Lv.${player.sosial.level}`); setRingDashArray('statSosialRing', (player.sosial.xp / getRequiredXP(player.sosial.level)) * 100);
    set('statPesonaVal', `Lv.${player.pesona.level}`); setRingDashArray('statPesonaRing', (player.pesona.xp / getRequiredXP(player.pesona.level)) * 100);
}
export function updateWeatherUI() {
    const badgeIcon = document.getElementById('weatherBadgeIcon');
    const badgeText = document.getElementById('weatherBadgeText');
    if (badgeIcon) badgeIcon.setAttribute('data-lucide', currentWeather.icon);
    if (badgeText) badgeText.innerText = `${currentWeather.temp}°C ${currentWeather.cond}`;
    const phoneWidgetIcon = document.getElementById('phoneWeatherWidgetIcon');
    const phoneWidgetText = document.getElementById('phoneWeatherWidgetText');
    if (phoneWidgetIcon) phoneWidgetIcon.setAttribute('data-lucide', currentWeather.icon);
    if (phoneWidgetText) phoneWidgetText.innerText = `${currentWeather.temp}°C ${currentWeather.cond}`;
    const pageWeatherIcon = document.getElementById('phonePageWeatherIcon');
    const pageWeatherText = document.getElementById('phonePageWeatherText');
    if (pageWeatherIcon) pageWeatherIcon.setAttribute('data-lucide', currentWeather.icon);
    if (pageWeatherText) pageWeatherText.innerText = `${currentWeather.temp}°C ${currentWeather.cond}`;
    if (window.lucide) window.lucide.createIcons();
}
export function updateClockDisplays() {
    const monthYearFormatted = getMonthYearSimDate();
    const formattedTime = getFormattedSimTime();
    const fullFormattedDate = getFullFormattedSimDate();
    const simDisplay = document.getElementById('simTimeDisplay'); if (simDisplay) simDisplay.innerText = monthYearFormatted;
    const widgetClock = document.getElementById('phoneWidgetClock'); if (widgetClock) widgetClock.innerText = formattedTime;
    const widgetDate = document.getElementById('phoneWidgetDate'); if (widgetDate) widgetDate.innerText = fullFormattedDate;
    const pageClock = document.getElementById('phonePageClock'); if (pageClock) pageClock.innerText = formattedTime;
    const pageTimeLarge = document.getElementById('phonePageTimeLarge'); if (pageTimeLarge) pageTimeLarge.innerText = formattedTime;
    const pageDate = document.getElementById('phonePageDate'); if (pageDate) pageDate.innerText = fullFormattedDate;
}
export function updateLocationUI() {
    const locObj = LOCATIONS_DATA.find(l => l.id === currentLocation) || LOCATIONS_DATA[0];
    const currentLocNameText = document.getElementById('currentLocNameText');
    const sublocs = LOCATION_SUBLOCATIONS[currentLocation];
    const activeSubId = currentSublocations[currentLocation];
    const activeSub = sublocs ? sublocs[activeSubId] : null;
    const subName = activeSub ? activeSub.name : 'Area Utama';
    const a = document.getElementById('currentRoomNameDisplay'); if(a) a.innerText = subName;
    if(currentLocNameText) currentLocNameText.innerText = `${locObj.name} • ${subName}`;
    const body = document.getElementById('bodyBg');
    if(body){
        if (currentLocation === 'rumah_saya') {
            body.className = `bg-room-${activeSubId} bg-dynamic min-h-screen font-sans text-stone-100 antialiased selection:bg-amber-200 selection:text-stone-900 overflow-hidden relative`;
        } else {
            body.className = locObj.bgClass;
        }
    }
}
export function addXP(statType, amount) {
    if (!player[statType]) return;
    let stat = player[statType];
    stat.xp += amount;
    let requiredXP = getRequiredXP(stat.level);
    while (stat.xp >= requiredXP) {
        stat.xp -= requiredXP;
        stat.level += 1;
        requiredXP = getRequiredXP(stat.level);
        let statName = statType.toUpperCase();
        addLogEntry('LEVEL UP!', `Level ${statName} Naik!`, `Selamat! Tingkat ${statName} kini mencapai Level ${stat.level}.`, 'award', 'text-amber-200', 'border-l-amber-400', 'bg-amber-400/30 text-amber-100 border-amber-200');
        triggerXPAnimation(`LEVEL UP! ${statName} LV. ${stat.level}`);
    }
    updateStatsUI();
}
export function triggerXPAnimation(text) {
    const floatElem = document.createElement('div');
    floatElem.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-lg text-amber-200 bg-black/80 px-4 py-2 rounded-2xl border border-amber-300/60 shadow-2xl z-50 pointer-events-none animate-float-xp';
    floatElem.innerText = text;
    document.body.appendChild(floatElem);
    setTimeout(() => floatElem.remove(), 1200);
}
export function addLogEntry(category, title, desc, iconName, colorClass, borderColorClass, badgeBgClass) {
    const stack = document.getElementById('journalStack');
    if (!stack) return;
    const timeStr = getFormattedSimTime();
    const card = document.createElement('div');
    card.className = `glass-log-card rounded-2xl p-2.5 sm:p-3 flex items-start gap-2.5 sm:gap-3 border-l-4 ${borderColorClass} animate-slide-in shrink-0 transition-all duration-300 hover:border-white/40`;
    card.innerHTML = `
        <div class="p-2 rounded-xl bg-white/10 text-stone-100 shrink-0 mt-0.5">
            <i data-lucide="${iconName || 'activity'}" class="w-4 h-4 ${colorClass}"></i>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-0.5">
                <div class="flex items-center gap-1.5 min-w-0">
                    <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeBgClass} shrink-0">${category}</span>
                    <h4 class="font-bold text-xs text-white truncate">${title}</h4>
                </div>
                <span class="text-[9px] text-stone-300 shrink-0">${timeStr}</span>
            </div>
            <p class="text-[11px] text-stone-200 leading-snug break-words">${desc}</p>
        </div>
    `;
    stack.insertBefore(card, stack.firstChild);
    if (window.lucide) window.lucide.createIcons();
    while (stack.children.length > 20) { stack.removeChild(stack.lastChild); }
}
