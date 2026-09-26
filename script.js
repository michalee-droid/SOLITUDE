lucide.createIcons();

// Audio Elements & Controls
const bgmAudio = document.getElementById('bgmAudio');
bgmAudio.volume = 0.35;
let isBgmPlaying = false;

function playBGM() {
    bgmAudio.play().then(() => {
        isBgmPlaying = true;
    }).catch(err => {
        isBgmPlaying = false;
    });
}

function pauseBGM() {
    bgmAudio.pause();
    isBgmPlaying = false;
}

function toggleBGM() {
    if (isBgmPlaying) pauseBGM();
    else playBGM();
}

// DEKLARASI DATA CUACA
const WEATHER_LIST = [
    { cond: 'Cerah', tempMin: 28, tempMax: 33, icon: 'sun' },
    { cond: 'Cerah Berawan', tempMin: 26, tempMax: 30, icon: 'cloud-sun' },
    { cond: 'Berawan', tempMin: 24, tempMax: 27, icon: 'cloud' },
    { cond: 'Hujan Gerimis', tempMin: 22, tempMax: 25, icon: 'cloud-drizzle' },
    { cond: 'Hujan Lebat', tempMin: 20, tempMax: 23, icon: 'cloud-rain' }
];

let currentWeather = { cond: 'Cerah Berawan', temp: 28, icon: 'cloud-sun' };

// SISTEM EFEK PARTIKEL CUACA CANVAS
const weatherCanvas = document.getElementById('weatherCanvas');
const ctx = weatherCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    weatherCanvas.width = window.innerWidth;
    weatherCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// SISTEM CUACA DINAMIS & SIMULASI SIKLUS WAKTU & TANGGAL
let simMinutes = 360; 
let currentDate = new Date(2026, 0, 15);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function updateWeatherLogic() {
    const index = Math.floor(Math.random() * WEATHER_LIST.length);
    const w = WEATHER_LIST[index];
    const randomTemp = Math.floor(Math.random() * (w.tempMax - w.tempMin + 1)) + w.tempMin;
    currentWeather = { cond: w.cond, temp: randomTemp, icon: w.icon };
    updateWeatherUI();
}

function updateWeatherUI() {
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

    lucide.createIcons();
}

function tickSimTime() {
    simMinutes += 1;
    if (simMinutes >= 1440) {
        simMinutes = simMinutes % 1440;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    updateClockDisplays();

    if (simMinutes % 180 === 0) {
        updateWeatherLogic();
    }
}
setInterval(tickSimTime, 1500);

function getFormattedSimTime() {
    let hours = Math.floor(simMinutes / 60);
    let mins = simMinutes % 60;
    let ampm = hours >= 12 ? 'PM' : 'AM';
    let formattedHours = hours % 12;
    formattedHours = formattedHours ? formattedHours : 12;
    let strHours = formattedHours < 10 ? '0' + formattedHours : formattedHours;
    let strMins = mins < 10 ? '0' + mins : mins;
    return `${strHours}:${strMins} ${ampm}`;
}

function getFormattedSimDate() {
    const dayNum = currentDate.getDate();
    const monthStr = MONTH_NAMES[currentDate.getMonth()];
    const yearNum = currentDate.getFullYear();
    return `${dayNum} ${monthStr} ${yearNum}`;
}

// PERBAHARUAN: Display waktu digantikan dengan Bulan dan Tahun
function getMonthYearSimDate() {
    const monthStr = MONTH_NAMES[currentDate.getMonth()];
    const yearNum = currentDate.getFullYear();
    return `${monthStr} ${yearNum}`;
}

function getFullFormattedSimDate() {
    const dayName = DAY_NAMES[currentDate.getDay()];
    return `${dayName}, ${getFormattedSimDate()}`;
}

function updateClockDisplays() {
    const monthYearFormatted = getMonthYearSimDate();
    const formattedTime = getFormattedSimTime();
    const fullFormattedDate = getFullFormattedSimDate();

    // Display Waktu Utama menggantikan tampilan jam menjadi Bulan dan Tahun
    const simDisplay = document.getElementById('simTimeDisplay');
    if (simDisplay) simDisplay.innerText = monthYearFormatted;

    const widgetClock = document.getElementById('phoneWidgetClock');
    if (widgetClock) widgetClock.innerText = formattedTime;

    const widgetDate = document.getElementById('phoneWidgetDate');
    if (widgetDate) widgetDate.innerText = fullFormattedDate;

    const pageClock = document.getElementById('phonePageClock');
    if (pageClock) pageClock.innerText = formattedTime;

    const pageTimeLarge = document.getElementById('phonePageTimeLarge');
    if (pageTimeLarge) pageTimeLarge.innerText = formattedTime;

    const pageDate = document.getElementById('phonePageDate');
    if (pageDate) pageDate.innerText = fullFormattedDate;
}

// FITUR PERCEPAT 1 BULAN
function fastForwardOneMonth() {
    if (activeTimer) return;
    
    // Menambah 1 Bulan
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateClockDisplays();
    updateWeatherLogic();
    
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

// Player Data State Default
let player = {
    nama: 'Pemain',
    gender: 'Laki-Laki',
    tempatLahir: 'Jakarta',
    umur: 17,
    uang: 150,
    punyaKendaraan: false, // Opsi Kepemilikan Kendaraan Pribadi
    
    energi: 100,
    kesegaran: 80,
    kebahagiaan: 75,

    fisik: { level: 1, xp: 0 },
    kecerdasan: { level: 1, xp: 0 },
    sosial: { level: 1, xp: 0 },
    pesona: { level: 1, xp: 0 }
};

function getRequiredXP(level) {
    return 10 + (level - 1) * 5;
}

let currentLocation = 'rumah_saya';

const LOCATION_SUBLOCATIONS = {
    rumah_saya: {
        teras: { id: 'teras', name: 'Teras Rumah', icon: 'door-open', subtext: 'Pintu Keluar Utama', desc: 'Teras rumah tempat bersantai sekaligus gerbang utama.' },
        ruang_tamu: { id: 'ruang_tamu', name: 'Ruang Tamu', icon: 'tv', subtext: 'Area Istirahat', desc: 'Ruang santai keluarga lengkap dengan sofa empuk.' },
        kamar_tidur: { id: 'kamar_tidur', name: 'Kamar Tidur', icon: 'bed', subtext: 'Area Pribadi', desc: 'Kamar tidur nyaman untuk istirahat atau rehat.' },
        dapur: { id: 'dapur', name: 'Dapur & Makan', icon: 'utensils', subtext: 'Area Kuliner', desc: 'Dapur bersih lengkap dengan kulkas makanan.' },
        kamar_mandi: { id: 'kamar_mandi', name: 'Kamar Mandi', icon: 'bath', subtext: 'Kebersihan Diri', desc: 'Kamar mandi segar untuk membersihkan diri.' },
        ruang_kerja: { id: 'ruang_kerja', name: 'Ruang Kerja', icon: 'laptop', subtext: 'Produktivitas', desc: 'Meja kerja tenang untuk belajar UTBK.' },
        taman: { id: 'taman', name: 'Taman & Kolam', icon: 'sun', subtext: 'Rekreasi Belakang', desc: 'Halaman belakang asri dengan kolam renang.' },
        garasi: { id: 'garasi', name: 'Garasi', icon: 'warehouse', subtext: 'Area Kendaraan', desc: 'Garasi untuk menyimpan kendaraan pribadi.' }
    },
    sekitar_rumah: {
        jalan_komplek: { id: 'jalan_komplek', name: 'Jalan Komplek', icon: 'footprints', subtext: 'Area Pemukiman', desc: 'Jalanan komplek yang tenang dan asri.' },
        taman_komplek: { id: 'taman_komplek', name: 'Taman Komplek', icon: 'trees', subtext: 'Ruang Hijau', desc: 'Taman publik warga komplek.' },
        pos_ronda: { id: 'pos_ronda', name: 'Pos Ronda', icon: 'shield', subtext: 'Pos Keamanan', desc: 'Pos penjagaan warga sekitar.' }
    },
    kawasan_komersial: {
        pusat_belanja: { id: 'pusat_belanja', name: 'Pusat Belanja', icon: 'shopping-bag', subtext: 'Mall & Ruko', desc: 'Pusat perbelanjaan ramai.' },
        kafe_kota: { id: 'kafe_kota', name: 'Kafe Perkotaan', icon: 'coffee', subtext: 'Area Nongkrong', desc: 'Kafe santai untuk minum kopi.' },
        area_perkantoran: { id: 'area_perkantoran', name: 'Perkantoran', icon: 'building', subtext: 'Pusat Bisnis', desc: 'Gedung perkantoran dan bisnis.' }
    }
};

let currentSublocations = {
    rumah_saya: 'kamar_tidur',
    sekitar_rumah: 'jalan_komplek',
    kawasan_komersial: 'pusat_belanja'
};

const LOCATIONS_DATA = [
    { id: 'rumah_saya', name: 'Rumah Saya', subtext: 'Area Dalam Rumah', baseDuration: 6, bgClass: 'bg-room-kamar_tidur bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' },
    { id: 'sekitar_rumah', name: 'Sekitar Rumah', subtext: 'Area Pemukiman Luar', baseDuration: 8, bgClass: 'bg-sekitar-rumah bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' },
    { id: 'kawasan_komersial', name: 'Kawasan Komersial', subtext: 'Pusat Perkantoran & Perkotaan', baseDuration: 12, bgClass: 'bg-kawasan-komersial bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' }
];

const ACTIONS_CONFIG = {
    santai_teras: { title: 'Bersantai di Teras', duration: 6, location: 'rumah_saya', room: 'teras', energiGain: 15, kebahagiaanGain: 10, icon: 'coffee', category: 'SANTAY', color: 'text-amber-200', borderColor: 'border-l-amber-400', badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-300/40', startDesc: 'Duduk santai sambil menghirup udara pagi yang segar...', finishDesc: 'Pikiran terasa tenang. Energi kembali pulih (+15 Energi, +10 Kebahagiaan).' },
    siram_bunga: { title: 'Menyiram Bunga', duration: 5, location: 'rumah_saya', room: 'teras', kebahagiaanGain: 15, kesegaranGain: 10, icon: 'flower2', category: 'RUMAH', color: 'text-emerald-300', borderColor: 'border-l-emerald-400', badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40', startDesc: 'Menyiram pot tanaman hias di teras rumah...', finishDesc: 'Tanaman tampak berseri dan harum (+15 Kebahagiaan, +10 Kesegaran).' },
    nonton_tv: { title: 'Menonton TV', duration: 8, location: 'rumah_saya', room: 'ruang_tamu', kebahagiaanGain: 20, icon: 'tv', category: 'HIBURAN', color: 'text-sky-300', borderColor: 'border-l-sky-400', badgeBg: 'bg-sky-400/20 text-sky-200 border-sky-300/40', startDesc: 'Menonton tayangan favorit di sofa empuk...', finishDesc: 'Perasaan gembira terisi kembali (+20 Kebahagiaan).' },
    istirahat_tidur: { title: 'Tidur & Rehat', duration: 10, location: 'rumah_saya', room: 'kamar_tidur', energiGain: 45, kesegaranGain: 20, icon: 'moon', category: 'ISTIRAHAT', color: 'text-indigo-200', borderColor: 'border-l-indigo-300', badgeBg: 'bg-indigo-400/20 text-indigo-200 border-indigo-300/40', startDesc: 'Tidur nyenyak di atas kasur empuk kamar pribadi...', finishDesc: 'Tubuh terasa bugar dan siap beraktivitas (+45 Energi, +20 Kesegaran).' },
    makan_kulkas: { title: 'Makan Makanan', duration: 8, location: 'rumah_saya', room: 'dapur', kesegaranGain: 35, energiGain: 10, icon: 'utensils', category: 'KULINER', color: 'text-orange-300', borderColor: 'border-l-orange-400', badgeBg: 'bg-orange-400/20 text-orange-200 border-orange-300/40', startDesc: 'Menyantap hidangan lezat di meja makan...', finishDesc: 'Perut kenyang dan energi terisi (+35 Kesegaran, +10 Energi).' },
    mandi_segar: { title: 'Mandi Air Segar', duration: 6, location: 'rumah_saya', room: 'kamar_mandi', kesegaranGain: 40, energiGain: 25, icon: 'bath', category: 'SEGAR', color: 'text-cyan-200', borderColor: 'border-l-cyan-300', badgeBg: 'bg-cyan-400/20 text-cyan-200 border-cyan-300/40', startDesc: 'Mandi air dingin yang membasuh kelelahan...', finishDesc: 'Badan terasa sangat bersih dan harum (+40 Kesegaran, +25 Energi).' },
    belajar_utbk: { title: 'Belajar UTBK', duration: 10, location: 'rumah_saya', room: 'ruang_kerja', statType: 'kecerdasan', icon: 'laptop', category: 'UTBK', color: 'text-purple-300', borderColor: 'border-l-purple-400', badgeBg: 'bg-purple-400/20 text-purple-200 border-purple-300/40', startDesc: 'Fokus membedah simulasi soal-soal UTBK...', finishDesc: 'Pemahaman materi meningkat secara signifikan.' },
    renang_taman: { title: 'Berenang Kolam', duration: 9, location: 'rumah_saya', room: 'taman', statType: 'fisik', kesegaranGain: 15, kebahagiaanGain: 10, icon: 'sun', category: 'OLAHARAGA', color: 'text-pink-300', borderColor: 'border-l-pink-400', badgeBg: 'bg-pink-400/20 text-pink-200 border-pink-300/40', startDesc: 'Berenang santai di kolam belakang rumah...', finishDesc: 'Stamina meningkat (+15 Kesegaran).' },
    joging_fisik: { title: 'Joging Komplek', duration: 10, location: 'sekitar_rumah', room: null, statType: 'fisik', icon: 'activity', category: 'OLAHARAGA', color: 'text-rose-300', borderColor: 'border-l-rose-400', badgeBg: 'bg-rose-400/20 text-rose-200 border-rose-300/40', startDesc: 'Berlari pagi mengelilingi perumahan komplek...', finishDesc: 'Fisik dan stamina terasa semakin terlatih.' }
};

window.addEventListener('DOMContentLoaded', () => {
    updatePlayerInfoUI();
    updateStatsUI();
    updateLocationUI();
    updateClockDisplays();
    updateWeatherUI();
    
    // override tombol smartphone agar membuka Halaman Baru, bukan Popup Modal HP
    const btnSmart = document.getElementById('btnOpenSmartphone');
    if (btnSmart) {
        btnSmart.onclick = (e) => {
            e.preventDefault();
            openSmartphonePage();
        };
    }

    addLogEntry('SISTEM', 'Simulasi Dimulai', `Selamat datang kembali, ${player.nama}. Sistem simulasi kehidupan siap dijalankan.`, 'sparkles', 'text-amber-200', 'border-l-amber-400', 'bg-amber-400/20 text-amber-200 border-amber-300/40');
    playBGM();
});

function updatePlayerInfoUI() {
    document.getElementById('charNameDisplay').innerText = player.nama;
    document.getElementById('charMetaDisplay').innerText = `${player.gender} • ${player.tempatLahir}`;
}

// PERBAHARUAN: Memperbarui Circular Progress Rings untuk Stat
function setRingDashArray(elementId, percentage) {
    const ring = document.getElementById(elementId);
    if (ring) {
        const value = Math.max(0, Math.min(100, percentage));
        ring.setAttribute('stroke-dasharray', `${value}, 100`);
    }
}

function updateStatsUI() {
    document.getElementById('statUangVal').innerText = `Rp ${player.uang}`;
    
    // Energi Ring
    document.getElementById('statEnergiVal').innerText = `${player.energi}`;
    setRingDashArray('statEnergiRing', player.energi);
    
    // Kesegaran Ring
    document.getElementById('statKesegaranVal').innerText = `${player.kesegaran}`;
    setRingDashArray('statKesegaranRing', player.kesegaran);

    // Kebahagiaan Ring
    document.getElementById('statKebahagiaanVal').innerText = `${player.kebahagiaan}`;
    setRingDashArray('statKebahagiaanRing', player.kebahagiaan);

    // Fisik Level Ring
    document.getElementById('statFisikVal').innerText = `Lv.${player.fisik.level}`;
    let reqFisik = getRequiredXP(player.fisik.level);
    setRingDashArray('statFisikRing', (player.fisik.xp / reqFisik) * 100);

    // Kecerdasan Level Ring
    document.getElementById('statKecerdasanVal').innerText = `Lv.${player.kecerdasan.level}`;
    let reqKecerdasan = getRequiredXP(player.kecerdasan.level);
    setRingDashArray('statKecerdasanRing', (player.kecerdasan.xp / reqKecerdasan) * 100);

    // Sosial Level Ring
    document.getElementById('statSosialVal').innerText = `Lv.${player.sosial.level}`;
    let reqSosial = getRequiredXP(player.sosial.level);
    setRingDashArray('statSosialRing', (player.sosial.xp / reqSosial) * 100);

    // Pesona Level Ring
    document.getElementById('statPesonaVal').innerText = `Lv.${player.pesona.level}`;
    let reqPesona = getRequiredXP(player.pesona.level);
    setRingDashArray('statPesonaRing', (player.pesona.xp / reqPesona) * 100);
}

function switchSublocation(subId) {
    const sublocs = LOCATION_SUBLOCATIONS[currentLocation];
    if (!sublocs || !sublocs[subId]) return;
    if (activeTimer) return;

    closeRoomMenuModal();
    if (currentSublocations[currentLocation] === subId) return;

    const targetSub = sublocs[subId];
    currentSublocations[currentLocation] = subId;
    updateLocationUI(); 
    
    addLogEntry('BERPINDAH', targetSub.name, `Melangkah ke ${targetSub.name.toLowerCase()}.`, targetSub.icon, 'text-amber-200', 'border-l-amber-400', 'bg-amber-400/20 text-amber-200 border-amber-300/40');
    playChime(659.25);
}

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
                currentLocation = locId;
                updateLocationUI();
                addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
                playChime(783.99);
                if (activePhoneApp === 'peta') {
                    renderPhoneAppPeta();
                }
            }
        );
    } else {
        currentLocation = locId;
        updateLocationUI();

        addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
        playChime(783.99);

        if (activePhoneApp === 'peta') {
            renderPhoneAppPeta();
        }
    }
}

// LOGIKA HALAMAN SMARTPHONE (PENGGANTI POPUP)
function openSmartphonePage() {
    const fullPage = document.getElementById('smartphoneFullPage');
    fullPage.classList.remove('hidden');
    document.getElementById('phonePageHomeView').classList.remove('hidden');
    document.getElementById('phonePageAppDetail').classList.add('hidden');
    updateClockDisplays();
}

function closeSmartphonePage() {
    document.getElementById('smartphoneFullPage').classList.add('hidden');
}

function openPhonePageApp(appName) {
    document.getElementById('phonePageHomeView').classList.add('hidden');
    const detailView = document.getElementById('phonePageAppDetail');
    const detailTitle = document.getElementById('phonePageAppDetailTitle');
    const detailBody = document.getElementById('phonePageAppDetailBody');
    
    detailView.classList.remove('hidden');
    detailView.classList.add('flex');

    if (appName === 'peta') {
        detailTitle.innerText = 'GPS & Peta Travel';
        renderPhoneAppPetaToContainer(detailBody);
    } else if (appName === 'wallet') {
        detailTitle.innerText = 'Finansial & Dompet';
        renderPhoneAppWalletToContainer(detailBody);
    } else if (appName === 'bisnis') {
        detailTitle.innerText = 'Bisnis & Properti';
        renderPhoneAppBisnisToContainer(detailBody);
    } else if (appName === 'investasi') {
        detailTitle.innerText = 'Investasi Pasar';
        renderPhoneAppInvestasiToContainer(detailBody);
    } else if (appName === 'freelance') {
        detailTitle.innerText = 'Karir & Pekerjaan';
        renderPhoneAppFreelanceToContainer(detailBody);
    } else if (appName === 'medsos') {
        detailTitle.innerText = 'Medsos & Koneksi';
        renderPhoneAppMedsosToContainer(detailBody);
    } else if (appName === 'chat') {
        detailTitle.innerText = 'Pesan Singkat';
        renderPhoneAppChatToContainer(detailBody);
    } else if (appName === 'profil') {
        detailTitle.innerText = 'Profil Identitas';
        renderPhoneAppProfilToContainer(detailBody);
    } else if (appName === 'musik') {
        detailTitle.innerText = 'Audio Player';
        renderPhoneAppMusikToContainer(detailBody);
    }
}

function closePhonePageApp() {
    document.getElementById('phonePageAppDetail').classList.add('hidden');
    document.getElementById('phonePageAppDetail').classList.remove('flex');
    document.getElementById('phonePageHomeView').classList.remove('hidden');
}

function renderPhoneAppPetaToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 max-w-lg mx-auto">
            <p class="text-stone-300 text-xs mb-1">Pilih lokasi tujuan untuk berpindah kawasan:</p>
            ${LOCATIONS_DATA.map(loc => `
                <div class="glass-panel p-4 rounded-2xl flex items-center justify-between border ${currentLocation === loc.id ? 'border-amber-400 bg-amber-400/20' : 'border-white/10'}">
                    <div>
                        <h5 class="font-bold text-white text-sm">${loc.name}</h5>
                        <p class="text-xs text-stone-300">${loc.subtext}</p>
                    </div>
                    ${currentLocation === loc.id ? 
                        `<span class="text-xs font-bold text-amber-200 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-300/30">Lokasi Saat Ini</span>` :
                        `<button onclick="travelToLocation('${loc.id}'); closeSmartphonePage();" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-300/40 cursor-pointer shadow-lg transition-all">Pergi</button>`
                    }
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppWalletToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-4 max-w-lg mx-auto">
            <div class="p-6 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-900 shadow-xl border border-amber-200">
                <span class="text-xs font-extrabold uppercase tracking-widest opacity-80 block">Saldo Dompet Saat Ini</span>
                <span class="font-serif text-3xl font-bold block mt-1">Rp ${player.uang}</span>
            </div>
            <div class="glass-panel p-4 rounded-2xl border border-white/10">
                <h5 class="font-bold text-xs text-white mb-1">Riwayat Keuangan</h5>
                <p class="text-xs text-stone-300">Belum ada transaksi besar tercatat hari ini.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppBisnisToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="building-2" class="w-12 h-12 text-indigo-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Manajemen Bisnis</h5>
            <p class="text-xs text-stone-300">Anda belum memiliki bisnis aktif. Kumpulkan modal untuk memulai usaha baru.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppInvestasiToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="line-chart" class="w-12 h-12 text-cyan-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Portofolio Saham & Kripto</h5>
            <p class="text-xs text-stone-300">Pasar saham sedang stabil. Fitur perdagangan akan segera terbuka.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppFreelanceToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="briefcase" class="w-12 h-12 text-purple-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Lowongan Karir</h5>
            <p class="text-xs text-stone-300">Tingkatkan Kecerdasan dan Sosial Anda untuk membuka pekerjaan freelance berbayar tinggi.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppMedsosToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="share-2" class="w-12 h-12 text-pink-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Jaringan Sosial</h5>
            <p class="text-xs text-stone-300">Posting kegiatan sehari-hari untuk menambah jumlah pengikut sosial Anda.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppChatToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 max-w-lg mx-auto">
            <div class="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-sm">S</div>
                <div>
                    <h5 class="font-bold text-xs text-white">Sistem Simulasi</h5>
                    <p class="text-xs text-amber-200">Selamat datang di aplikasi virtual smartphone!</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppProfilToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 max-w-lg mx-auto">
            <div class="glass-panel p-6 rounded-3xl border border-white/10 text-center">
                <div class="w-16 h-16 rounded-full bg-amber-200 text-stone-900 font-bold flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
                    ${player.nama.charAt(0)}
                </div>
                <h5 class="font-bold text-base text-white">${player.nama}</h5>
                <p class="text-xs text-stone-300 mt-0.5">${player.gender} • ${player.umur} Tahun</p>
                <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-around text-xs">
                    <div>
                        <span class="text-stone-400 block">Kendaraan</span>
                        <span class="font-bold text-amber-200">${player.punyaKendaraan ? 'Punya' : 'Tidak Punya'}</span>
                    </div>
                    <div>
                        <span class="text-stone-400 block">Kota</span>
                        <span class="font-bold text-amber-200">${player.tempatLahir}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppMusikToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-5 text-center py-6 max-w-lg mx-auto">
            <div class="w-24 h-24 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mx-auto shadow-2xl animate-spin-slow">
                <i data-lucide="disc" class="w-12 h-12"></i>
            </div>
            <div>
                <h5 class="font-bold text-base text-white">Garden Ambient BGM</h5>
                <p class="text-xs text-stone-300 mt-1">Musik Relaksasi Latar Belakang Game</p>
            </div>
            <button onclick="toggleBGM()" class="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl border border-rose-300/40 shadow-lg mx-auto cursor-pointer flex items-center gap-2">
                <i data-lucide="${isBgmPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
                <span>${isBgmPlaying ? 'Jeda Musik' : 'Putar Musik'}</span>
            </button>
        </div>
    `;
    lucide.createIcons();
}

// LOGIKA SELEKSI LOKASI & TRANSPORTASI LOKASI
let selectedTransport = null;

function openLocationTransportModal() {
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
    lucide.createIcons();
}

function closeTransportLocationModal() {
    const modal = document.getElementById('transportLocationModal');
    const card = document.getElementById('transportLocationModalCard');
    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
}

function renderPribadiOptionBox() {
    const container = document.getElementById('pribadiOptionBox');
    if (!container) return;

    if (player.punyaKendaraan) {
        container.innerHTML = `
            <button onclick="selectTransportMode('pribadi')" class="glass-panel p-4 rounded-2xl flex items-center gap-3.5 border border-indigo-400/30 hover:border-indigo-300 hover:bg-white/10 transition-all text-left cursor-pointer group w-full">
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

function selectTransportMode(mode) {
    let cost = 0;
    let modeLabel = '';

    if (mode === 'taksi') {
        cost = 25;
        modeLabel = 'Taksi Konvensional (Rp 25)';
    } else if (mode === 'ojek') {
        cost = 12;
        modeLabel = 'Ojek Online (Rp 12)';
    } else if (mode === 'pribadi') {
        cost = 0;
        modeLabel = 'Kendaraan Pribadi';
    } else if (mode === 'bus') {
        cost = 0;
        modeLabel = 'Bus Umum (Gratis)';
    }

    if (player.uang < cost) {
        addLogEntry('KEUANGAN', 'Gagal Naik Transportasi', `Uang Anda tidak cukup untuk membayar ${modeLabel}.`, 'alert-circle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
        playChime(300);
        return;
    }

    selectedTransport = { mode, cost, label: modeLabel };
    
    document.getElementById('stepTransportOptions').classList.add('hidden');
    document.getElementById('stepLocationOptions').classList.remove('hidden');
    document.getElementById('transportModalSubtitle').innerText = 'Pilih lokasi yang ingin dituju.';
    document.getElementById('selectedVehicleLabel').innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Mode: ${modeLabel}`;
    
    renderLocationsForTransport();
    lucide.createIcons();
}

function backToTransportSelection() {
    selectedTransport = null;
    document.getElementById('stepTransportOptions').classList.remove('hidden');
    document.getElementById('stepLocationOptions').classList.add('hidden');
    document.getElementById('transportModalSubtitle').innerText = 'Pilih moda transportasi yang tersedia untuk memulai perjalanan.';
}

function renderLocationsForTransport() {
    const grid = document.getElementById('locationCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    LOCATIONS_DATA.forEach(loc => {
        const isCurrent = loc.id === currentLocation;
        
        let speedMultiplier = 1;
        if (selectedTransport.mode === 'ojek') speedMultiplier = 0.8;
        if (selectedTransport.mode === 'pribadi') speedMultiplier = 0.7;
        if (selectedTransport.mode === 'bus') speedMultiplier = 1.2;

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
                    <span class="flex items-center gap-1"><i data-lucide="coins" class="w-3 h-3"></i> Rp ${selectedTransport.cost}</span>
                </div>
            </div>
            <div>
                ${isCurrent ? 
                    '<button disabled class="px-4 py-2 bg-stone-700 text-stone-400 font-bold text-xs rounded-xl cursor-not-allowed">Di Sini</button>' : 
                    `<button onclick="confirmTravelWithMinigame('${loc.id}',${duration})" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl border border-cyan-300/40 cursor-pointer shadow-lg transition-all active:scale-95">Berangkat</button>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// MINIGAME BERKENDARA LOGIK
let minigameTargetLocId = null;
let minigameBaseDuration = 10;
let minigameInterval = null;
let minigameTimer = 10;
let carPosition = 20; // left %
let obstaclePosition = 60; // obstacle left %
let obstacleTop = 0;
let hasCrashed = false;

function confirmTravelWithMinigame(targetLocId, duration) {
    if (selectedTransport.cost > 0) {
        player.uang -= selectedTransport.cost;
        updateStatsUI();
    }

    minigameTargetLocId = targetLocId;
    minigameBaseDuration = duration;
    closeTransportLocationModal();
    startMinigame();
}

function startMinigame() {
    hasCrashed = false;
    carPosition = 20;
    obstaclePosition = Math.random() > 0.5 ? 20 : 60;
    obstacleTop = 0;
    minigameTimer = 10.0;

    const modal = document.getElementById('drivingMinigameModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    updateMinigameCarPositions();

    minigameInterval = setInterval(() => {
        minigameTimer -= 0.1;
        document.getElementById('minigameTimerDisplay').innerText = `${Math.max(0, minigameTimer).toFixed(1)}s`;

        // Move obstacle down
        obstacleTop += 4;
        if (obstacleTop > 80) {
            obstacleTop = 0;
            obstaclePosition = Math.random() > 0.5 ? 20 : 60;
        }

        // Detect Collision
        if (obstacleTop > 50 && obstacleTop < 80 && Math.abs(carPosition - obstaclePosition) < 15) {
            hasCrashed = true;
        }

        updateMinigameCarPositions();

        if (minigameTimer <= 0) {
            clearInterval(minigameInterval);
            finishMinigame();
        }
    }, 100);
}

function moveMinigameCar(dir) {
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

function finishMinigame() {
    const modal = document.getElementById('drivingMinigameModal');
    modal.classList.add('opacity-0', 'pointer-events-none');

    let finalDuration = minigameBaseDuration;
    if (hasCrashed) {
        finalDuration = Math.round(minigameBaseDuration * 1.5);
        addLogEntry('MINIGAME', 'Kecelakaan Jalan', 'Mengalami tabrakan ringan! Durasi perjalanan bertambah.', 'alert-triangle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
    } else {
        finalDuration = Math.max(3, Math.round(minigameBaseDuration * 0.7));
        addLogEntry('MINIGAME', 'Berkendara Mulus', 'Perjalanan lancar tanpa kendala! Tiba lebih cepat.', 'sparkles', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
    }

    const targetLoc = LOCATIONS_DATA.find(l => l.id === minigameTargetLocId);
    
    startGenericActivity(
        'Perjalanan Transportasi', 
        `Sedang menuju ${targetLoc ? targetLoc.name : 'tujuan'} dengan ${selectedTransport ? selectedTransport.label : 'kendaraan'}...`, 
        'navigation', 
        finalDuration, 
        () => {
            currentLocation = minigameTargetLocId;
            updateLocationUI();
            addLogEntry('TRAVEL', targetLoc.name, `Tiba di kawasan ${targetLoc.name}.`, 'map-pin', 'text-emerald-300', 'border-l-emerald-400', 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40');
            playChime(783.99);
        }
    );
}

function startGenericActivity(title, desc, icon, duration, onComplete) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('modalIcon').setAttribute('data-lucide', icon);
    lucide.createIcons();

    const modal = document.getElementById('activityModal');
    const card = document.getElementById('activityModalCard');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-90');
    card.classList.add('scale-100');

    let totalTime = duration;
    let timeRemaining = totalTime;

    updateTimerProgress(timeRemaining, totalTime);

    activeTimer = setInterval(() => {
        timeRemaining--;
        updateTimerProgress(timeRemaining, totalTime);

        if (timeRemaining <= 0) {
            clearInterval(activeTimer);
            activeTimer = null;
            closeActivityModal();
            if (onComplete) onComplete();
        }
    }, 1000);
}

function updateLocationUI() {
    const locObj = LOCATIONS_DATA.find(l => l.id === currentLocation) || LOCATIONS_DATA[0];
    const currentLocNameText = document.getElementById('currentLocNameText');

    const sublocs = LOCATION_SUBLOCATIONS[currentLocation];
    const activeSubId = currentSublocations[currentLocation];
    const activeSub = sublocs ? sublocs[activeSubId] : null;

    const subName = activeSub ? activeSub.name : 'Area Utama';
    document.getElementById('currentRoomNameDisplay').innerText = subName;
    currentLocNameText.innerText = `${locObj.name} • ${subName}`;

    if (currentLocation === 'rumah_saya') {
        document.getElementById('bodyBg').className = `bg-room-${activeSubId} bg-dynamic min-h-screen font-sans text-stone-100 antialiased selection:bg-amber-200 selection:text-stone-900 overflow-hidden relative`;
    } else {
        document.getElementById('bodyBg').className = locObj.bgClass;
    }
}

function renderRoomMenuGrid() {
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
        btn.onclick = () => switchSublocation(sId);

        btn.innerHTML = `
            <div class="w-10 h-10 rounded-xl ${isActive ? 'bg-amber-400 text-stone-900' : 'bg-white/15 text-white'} flex items-center justify-center transition-colors">
                <i data-lucide="${sub.icon || 'map-pin'}" class="w-5 h-5"></i>
            </div>
            <div>
                <span class="font-serif font-bold text-xs text-white block leading-tight">${sub.name}</span>
                <span class="text-[9px] text-stone-300 block mt-0.5">${sub.subtext}</span>
            </div>
        `;
        container.appendChild(btn);
    });
    lucide.createIcons();
}

// RENDERING MODAL AKTIVITAS PUSAT
function renderActivitiesMenuGrid() {
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
    lucide.createIcons();
}

let activeTimer = null;
let currentActionKey = null;

function startAction(actionKey) {
    if (activeTimer) return;
    const act = ACTIONS_CONFIG[actionKey];
    if (!act) return;

    currentActionKey = actionKey;
    
    document.getElementById('modalTitle').innerText = act.title;
    document.getElementById('modalDesc').innerText = act.startDesc;
    document.getElementById('modalIcon').setAttribute('data-lucide', act.icon);
    lucide.createIcons();

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

function updateTimerProgress(remaining, total) {
    document.getElementById('modalTimerText').innerText = `${remaining}s`;
    let percentage = (remaining / total) * 100;
    document.getElementById('modalProgressBar').style.width = `${percentage}%`;
}

function stopCurrentActivity() {
    if (!activeTimer) return;
    clearInterval(activeTimer);
    activeTimer = null;

    closeActivityModal();
    addLogEntry('DIBATALKAN', 'Aktivitas Dihentikan', 'Aktivitas dihentikan sebelum selesai.', 'alert-circle', 'text-rose-300', 'border-l-rose-500', 'bg-rose-500/20 text-rose-200 border-rose-300/40');
    currentActionKey = null;
}

function finishCurrentActivity(completed) {
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

function closeActivityModal() {
    const modal = document.getElementById('activityModal');
    const card = document.getElementById('activityModalCard');
    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-90');
}

function addXP(statType, amount) {
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

function triggerXPAnimation(text) {
    const floatElem = document.createElement('div');
    floatElem.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-lg text-amber-200 bg-black/80 px-4 py-2 rounded-2xl border border-amber-300/60 shadow-2xl z-50 pointer-events-none animate-float-xp';
    floatElem.innerText = text;
    document.body.appendChild(floatElem);
    setTimeout(() => floatElem.remove(), 1200);
}

function addLogEntry(category, title, desc, iconName, colorClass, borderColorClass, badgeBgClass) {
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
    lucide.createIcons();

    while (stack.children.length > 20) {
        stack.removeChild(stack.lastChild);
    }
}

document.getElementById('btnClearLogs').addEventListener('click', () => {
    const stack = document.getElementById('journalStack');
    if (stack) stack.innerHTML = '';
});

// EVENT LISTENERS MODAL BERPINDAH
const roomMenuModal = document.getElementById('roomMenuModal');
const roomMenuModalCard = document.getElementById('roomMenuModalCard');

document.getElementById('btnOpenRoomMenu').addEventListener('click', () => {
    renderRoomMenuGrid();
    roomMenuModal.classList.remove('opacity-0', 'pointer-events-none');
    roomMenuModalCard.classList.remove('scale-95');
    roomMenuModalCard.classList.add('scale-100');
});

document.getElementById('btnCloseRoomMenuModal').addEventListener('click', closeRoomMenuModal);

function closeRoomMenuModal() {
    roomMenuModal.classList.add('opacity-0', 'pointer-events-none');
    roomMenuModalCard.classList.remove('scale-100');
    roomMenuModalCard.classList.add('scale-95');
}

// EVENT LISTENERS MODAL AKTIVITAS PUSAT
const activitiesMenuModal = document.getElementById('activitiesMenuModal');
const activitiesMenuModalCard = document.getElementById('activitiesMenuModalCard');

document.getElementById('btnOpenActivitiesMenu').addEventListener('click', () => {
    renderActivitiesMenuGrid();
    activitiesMenuModal.classList.remove('opacity-0', 'pointer-events-none');
    activitiesMenuModalCard.classList.remove('scale-95');
    activitiesMenuModalCard.classList.add('scale-100');
});

document.getElementById('btnCloseActivitiesMenuModal').addEventListener('click', closeActivitiesMenuModal);

function closeActivitiesMenuModal() {
    activitiesMenuModal.classList.add('opacity-0', 'pointer-events-none');
    activitiesMenuModalCard.classList.remove('scale-100');
    activitiesMenuModalCard.classList.add('scale-95');
}

// EVENT LISTENERS SMARTPHONE
const smartphoneModal = document.getElementById('smartphoneModal');
const smartphoneCard = document.getElementById('smartphoneCard');
let activePhoneApp = null;

function closeSmartphone() {
    closePhoneApp();
    smartphoneModal.classList.add('opacity-0', 'pointer-events-none');
    smartphoneCard.classList.remove('scale-100');
    smartphoneCard.classList.add('scale-90');
}

function closePhoneAppOrModal() {
    if (activePhoneApp) {
        closePhoneApp();
    } else {
        closeSmartphone();
    }
}

function openPhoneApp(appName) {
    activePhoneApp = appName;
    const appView = document.getElementById('phoneAppView');
    const appTitle = document.getElementById('phoneAppTitle');

    appView.classList.remove('hidden');

    if (appName === 'peta') {
        appTitle.innerText = 'GPS & Peta Travel';
        renderPhoneAppPeta();
    } else if (appName === 'wallet') {
        appTitle.innerText = 'Finansial & Kas';
        renderPhoneAppWallet();
    } else if (appName === 'bisnis') {
        appTitle.innerText = 'Bisnis & Properti';
        renderPhoneAppBisnis();
    } else if (appName === 'investasi') {
        appTitle.innerText = 'Investasi Pasar';
        renderPhoneAppInvestasi();
    } else if (appName === 'freelance') {
        appTitle.innerText = 'Karir & Pekerjaan';
        renderPhoneAppFreelance();
    } else if (appName === 'medsos') {
        appTitle.innerText = 'Medsos & Koneksi';
        renderPhoneAppMedsos();
    } else if (appName === 'chat') {
        appTitle.innerText = 'Pesan Singkat';
        renderPhoneAppChat();
    } else if (appName === 'profil') {
        appTitle.innerText = 'Profil Identitas';
        renderPhoneAppProfil();
    } else if (appName === 'musik') {
        appTitle.innerText = 'Audio Player';
        renderPhoneAppMusik();
    }
}

function closePhoneApp() {
    activePhoneApp = null;
    const appView = document.getElementById('phoneAppView');
    if (appView) appView.classList.add('hidden');
}

function renderPhoneAppPeta() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3">
            <p class="text-stone-300 text-[11px]">Pilih lokasi tujuan untuk berpindah kawasan:</p>
            ${LOCATIONS_DATA.map(loc => `
                <div class="glass-panel p-3 rounded-2xl flex items-center justify-between border ${currentLocation === loc.id ? 'border-amber-400 bg-amber-400/20' : 'border-white/10'}">
                    <div>
                        <h5 class="font-bold text-white text-xs">${loc.name}</h5>
                        <p class="text-[10px] text-stone-300">${loc.subtext}</p>
                    </div>
                    ${currentLocation === loc.id ? 
                        `<span class="text-[9px] font-bold text-amber-200 bg-black/40 px-2 py-1 rounded-lg">Lokasi Saat Ini</span>` :
                        `<button onclick="travelToLocation('${loc.id}')" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] rounded-xl border border-white/20 cursor-pointer">Pergi</button>`
                    }
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppWallet() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3">
            <div class="p-4 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-900 shadow-xl">
                <span class="text-[10px] font-extrabold uppercase tracking-widest opacity-80 block">Saldo Dompet</span>
                <span class="font-serif text-2xl font-bold block mt-1">Rp ${player.uang}</span>
            </div>
            <div class="glass-panel p-3 rounded-2xl border border-white/10">
                <h5 class="font-bold text-xs text-white mb-1">Riwayat Keuangan</h5>
                <p class="text-[10px] text-stone-300">Belum ada transaksi besar tercatat hari ini.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppBisnis() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-6">
            <i data-lucide="building-2" class="w-10 h-10 text-indigo-300 mx-auto"></i>
            <h5 class="font-bold text-sm text-white">Manajemen Bisnis</h5>
            <p class="text-[10px] text-stone-300">Anda belum memiliki bisnis aktif. Kumpulkan modal untuk memulai usaha baru.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppInvestasi() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-6">
            <i data-lucide="line-chart" class="w-10 h-10 text-cyan-300 mx-auto"></i>
            <h5 class="font-bold text-sm text-white">Portofolio Saham & Kripto</h5>
            <p class="text-[10px] text-stone-300">Pasar saham sedang stabil. Fitur perdagangan akan segera terbuka.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppFreelance() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-6">
            <i data-lucide="briefcase" class="w-10 h-10 text-purple-300 mx-auto"></i>
            <h5 class="font-bold text-sm text-white">Lowongan Karir</h5>
            <p class="text-[10px] text-stone-300">Tingkatkan Kecerdasan dan Sosial Anda untuk membuka pekerjaan freelance berbayar tinggi.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppMedsos() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-6">
            <i data-lucide="share-2" class="w-10 h-10 text-pink-300 mx-auto"></i>
            <h5 class="font-bold text-sm text-white">Jaringan Sosial</h5>
            <p class="text-[10px] text-stone-300">Posting kegiatan sehari-hari untuk menambah jumlah pengikut sosial Anda.</p>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppChat() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-2">
            <div class="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-xs">S</div>
                <div>
                    <h5 class="font-bold text-xs text-white">Sistem Simulasi</h5>
                    <p class="text-[10px] text-amber-200">Selamat datang di aplikasi virtual!</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppProfil() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3">
            <div class="glass-panel p-4 rounded-2xl border border-white/10 text-center">
                <div class="w-12 h-12 rounded-full bg-amber-200 text-stone-900 font-bold flex items-center justify-center text-lg mx-auto mb-2">
                    ${player.nama.charAt(0)}
                </div>
                <h5 class="font-bold text-sm text-white">${player.nama}</h5>
                <p class="text-[10px] text-stone-300">${player.gender} • ${player.umur} Tahun</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderPhoneAppMusik() {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-4 text-center py-4">
            <div class="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mx-auto shadow-2xl animate-spin-slow">
                <i data-lucide="disc" class="w-10 h-10"></i>
            </div>
            <div>
                <h5 class="font-bold text-sm text-white">Garden Ambient BGM</h5>
                <p class="text-[10px] text-stone-300">Musik Relaksasi Latar Belakang Game</p>
            </div>
            <button onclick="toggleBGM()" class="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl border border-rose-300/40 shadow-lg mx-auto cursor-pointer flex items-center gap-2">
                <i data-lucide="${isBgmPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
                <span>${isBgmPlaying ? 'Jeda Musik' : 'Putar Musik'}</span>
            </button>
        </div>
    `;
    lucide.createIcons();
}

function playChime(freq) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq || 523.25, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch(e) {}
}

let currentTimeInMinutes = 480; 
let isAccelerating = false;

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function updateDisplay() {
  const displayElement = document.getElementById('time-display');
  if (displayElement) {
    displayElement.textContent = formatTime(currentTimeInMinutes);
  }
}

function accelerateTime(addedMinutes, onComplete = null) {
  if (isAccelerating) return; 
  
  isAccelerating = true;
  const targetTime = currentTimeInMinutes + addedMinutes;
  
  const stepDuration = 15; 
  const incrementStep = Math.max(1, Math.floor(addedMinutes / 30)); 

  const timer = setInterval(() => {
    currentTimeInMinutes += incrementStep;

    if (currentTimeInMinutes >= targetTime) {
      currentTimeInMinutes = targetTime; 
      updateDisplay();
      clearInterval(timer);
      isAccelerating = false;
      
      if (onComplete) onComplete();
    } else {
      updateDisplay();
    }
  }, stepDuration);
}
