import { updateWeatherLogic } from './weather.js';
import { updateClockDisplays, updateWeatherUI, addLogEntry, triggerXPAnimation } from '../ui/uiPlayer.js';
import { playChime } from './audio.js';

export let simMinutes = 360; 
export let currentDate = new Date(2008, 0, 15);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function tickSimTime(activeTimer) {
    simMinutes += 1;
    if (simMinutes >= 1440) {
        simMinutes = simMinutes % 1440;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    updateClockDisplays();

    if (simMinutes % 180 === 0) {
        updateWeatherLogic(updateWeatherUI);
    }
}

export function getFormattedSimTime() {
    let hours = Math.floor(simMinutes / 60);
    let mins = simMinutes % 60;
    let ampm = hours >= 12 ? 'PM' : 'AM';
    let formattedHours = hours % 12 || 12;
    let strHours = formattedHours < 10 ? '0' + formattedHours : formattedHours;
    let strMins = mins < 10 ? '0' + mins : mins;
    return `${strHours}:${strMins} ${ampm}`;
}

export function getFormattedSimDate() {
    return `${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

export function getMonthYearSimDate() {
    return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

export function getFullFormattedSimDate() {
    return `${DAY_NAMES[currentDate.getDay()]}, ${getFormattedSimDate()}`;
}

export function fastForwardOneMonth(activeTimer) {
    if (activeTimer) return;
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateClockDisplays();
    updateWeatherLogic(updateWeatherUI);
    
    addLogEntry(
        'WAKTU',
        'Maju 1 Bulan',
        `Waktu dipercepat satu bulan menjadi ${getMonthYearSimDate()}.`,
        'fast-forward',
        'text-amber-200',
        'border-l-amber-400',
        'bg-amber-400/20 text-amber-200 border-amber-300/40'
    );
    playChime(987.77);
    triggerXPAnimation(`+1 BULAN (${getMonthYearSimDate()})`);
}
