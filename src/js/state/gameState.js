export let player = {
    nama: 'Pemain',
    gender: 'Laki-Laki',
    tempatLahir: 'Jakarta',
    umur: 17,
    uang: 150,
    punyaKendaraan: false,
    
    energi: 100,
    kesegaran: 80,
    kebahagiaan: 75,

    fisik: { level: 1, xp: 0 },
    kecerdasan: { level: 1, xp: 0 },
    sosial: { level: 1, xp: 0 },
    pesona: { level: 1, xp: 0 }
};

export function getRequiredXP(level) {
    return 10 + (level - 1) * 5;
}

export let currentLocation = 'rumah_saya';
export function setCurrentLocation(loc) { currentLocation = loc; }

export let currentSublocations = {
    rumah_saya: 'kamar_tidur',
    sekitar_rumah: 'jalan_komplek',
    kawasan_komersial: 'pusat_belanja'
};

export const LOCATION_SUBLOCATIONS = {
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

export const LOCATIONS_DATA = [
    { id: 'rumah_saya', name: 'Rumah Saya', subtext: 'Area Dalam Rumah', baseDuration: 6, bgClass: 'bg-room-kamar_tidur bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' },
    { id: 'sekitar_rumah', name: 'Sekitar Rumah', subtext: 'Area Pemukiman Luar', baseDuration: 8, bgClass: 'bg-sekitar-rumah bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' },
    { id: 'kawasan_komersial', name: 'Kawasan Komersial', subtext: 'Pusat Perkantoran & Perkotaan', baseDuration: 12, bgClass: 'bg-kawasan-komersial bg-dynamic min-h-screen font-sans text-stone-100 overflow-hidden relative' }
];

export const ACTIONS_CONFIG = {
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


// FIX: Persistence & immutability helper
export function saveGame() {
  try {
    localStorage.setItem('solitude_player', JSON.stringify(player));
    localStorage.setItem('solitude_location', currentLocation);
    localStorage.setItem('solitude_sublocations', JSON.stringify(currentSublocations));
  } catch(e) {}
}
export function loadGame() {
  try {
    const p = JSON.parse(localStorage.getItem('solitude_player')||'null');
    if(p) Object.assign(player, p);
    const loc = localStorage.getItem('solitude_location');
    if(loc) setCurrentLocation(loc);
    const sub = JSON.parse(localStorage.getItem('solitude_sublocations')||'null');
    if(sub) Object.keys(sub).forEach(k=> currentSublocations[k]=sub[k]);
  } catch(e) {}
}
