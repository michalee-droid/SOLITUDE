import { player, currentLocation, LOCATIONS_DATA } from '../state/gameState.js';
import { updateClockDisplays } from './uiPlayer.js';
import { toggleBGM, isBgmPlaying } from '../systems/audio.js';
import { openModal } from './uiModals.js';

// Inisialisasi Event Listener Tombol UI Smartphone Utama
export function initSmartphoneUI() {
    const navAppBtn = document.getElementById('app-navigation') || document.getElementById('btn-app-peta');
    const activityAppBtn = document.getElementById('app-activity') || document.getElementById('btn-app-freelance');

    // Listener Tombol Navigasi
    if (navAppBtn) {
        navAppBtn.onclick = (e) => {
            e.preventDefault();
            // Buka halaman aplikasi smartphone untuk Peta/Navigasi
            openSmartphonePage();
            openPhonePageApp('peta');
        };
    }

    // Listener Tombol Aktivitas
    if (activityAppBtn) {
        activityAppBtn.onclick = (e) => {
            e.preventDefault();
            // Buka halaman aplikasi smartphone untuk Karir/Aktivitas
            openSmartphonePage();
            openPhonePageApp('freelance');
        };
    }

    // Event listener untuk tombol tutup smartphone jika ada
    const closeBtn = document.getElementById('btnCloseSmartphonePage');
    if (closeBtn) {
        closeBtn.onclick = () => closeSmartphonePage();
    }

    // Event listener untuk tombol kembali ke home smartphone jika ada
    const backBtn = document.getElementById('btnBackSmartphoneHome');
    if (backBtn) {
        backBtn.onclick = () => closePhonePageApp();
    }
}

export function openSmartphonePage() {
    const fullPage = document.getElementById('smartphoneFullPage');
    if (fullPage) {
        fullPage.classList.remove('hidden');
    }
    const homeView = document.getElementById('phonePageHomeView');
    if (homeView) {
        homeView.classList.remove('hidden');
    }
    const appDetail = document.getElementById('phonePageAppDetail');
    if (appDetail) {
        appDetail.classList.add('hidden');
    }
    updateClockDisplays();
}

export function closeSmartphonePage() {
    const fullPage = document.getElementById('smartphoneFullPage');
    if (fullPage) {
        fullPage.classList.add('hidden');
    }
}

export function openPhonePageApp(appName, travelToLocCallback) {
    const homeView = document.getElementById('phonePageHomeView');
    if (homeView) {
        homeView.classList.add('hidden');
    }
    
    const detailView = document.getElementById('phonePageAppDetail');
    const detailTitle = document.getElementById('phonePageAppDetailTitle');
    const detailBody = document.getElementById('phonePageAppDetailBody');
    
    if (detailView) {
        detailView.classList.remove('hidden');
        detailView.classList.add('flex');
    }

    if (!detailBody) return;

    if (appName === 'peta') {
        if (detailTitle) detailTitle.innerText = 'GPS & Peta Travel';
        renderPhoneAppPetaToContainer(detailBody, travelToLocCallback);
    } else if (appName === 'wallet') {
        if (detailTitle) detailTitle.innerText = 'Finansial & Dompet';
        renderPhoneAppWalletToContainer(detailBody);
    } else if (appName === 'bisnis') {
        if (detailTitle) detailTitle.innerText = 'Bisnis & Properti';
        renderPhoneAppBisnisToContainer(detailBody);
    } else if (appName === 'investasi') {
        if (detailTitle) detailTitle.innerText = 'Investasi Pasar';
        renderPhoneAppInvestasiToContainer(detailBody);
    } else if (appName === 'freelance') {
        if (detailTitle) detailTitle.innerText = 'Karir & Pekerjaan';
        renderPhoneAppFreelanceToContainer(detailBody);
    } else if (appName === 'medsos') {
        if (detailTitle) detailTitle.innerText = 'Medsos & Koneksi';
        renderPhoneAppMedsosToContainer(detailBody);
    } else if (appName === 'chat') {
        if (detailTitle) detailTitle.innerText = 'Pesan Singkat';
        renderPhoneAppChatToContainer(detailBody);
    } else if (appName === 'profil') {
        if (detailTitle) detailTitle.innerText = 'Profil Identitas';
        renderPhoneAppProfilToContainer(detailBody);
    } else if (appName === 'musik') {
        if (detailTitle) detailTitle.innerText = 'Audio Player';
        renderPhoneAppMusikToContainer(detailBody);
    }
}

export function closePhonePageApp() {
    const detailView = document.getElementById('phonePageAppDetail');
    if (detailView) {
        detailView.classList.add('hidden');
        detailView.classList.remove('flex');
    }
    const homeView = document.getElementById('phonePageHomeView');
    if (homeView) {
        homeView.classList.remove('hidden');
    }
}

function renderPhoneAppPetaToContainer(container, travelToLocCallback) {
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
                        `<button id="btn-travel-${loc.id}" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-300/40 cursor-pointer shadow-lg transition-all">Pergi</button>`
                    }
                </div>
            `).join('')}
        </div>
    `;
    
    LOCATIONS_DATA.forEach(loc => {
        if (currentLocation !== loc.id) {
            const btn = document.getElementById(`btn-travel-${loc.id}`);
            if (btn) {
                btn.onclick = () => {
                    if (travelToLocCallback) travelToLocCallback(loc.id);
                    closeSmartphonePage();
                };
            }
        }
    });

    if (window.lucide) window.lucide.createIcons();
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
    if (window.lucide) window.lucide.createIcons();
}

function renderPhoneAppBisnisToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="building-2" class="w-12 h-12 text-indigo-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Manajemen Bisnis</h5>
            <p class="text-xs text-stone-300">Anda belum memiliki bisnis aktif. Kumpulkan modal untuk memulai usaha baru.</p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderPhoneAppInvestasiToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="line-chart" class="w-12 h-12 text-cyan-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Portofolio Saham & Kripto</h5>
            <p class="text-xs text-stone-300">Pasar saham sedang stabil. Fitur perdagangan akan segera terbuka.</p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderPhoneAppFreelanceToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="briefcase" class="w-12 h-12 text-purple-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Lowongan Karir</h5>
            <p class="text-xs text-stone-300">Tingkatkan Kecerdasan dan Sosial Anda untuk membuka pekerjaan freelance berbayar tinggi.</p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderPhoneAppMedsosToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 text-center py-10 max-w-lg mx-auto">
            <i data-lucide="share-2" class="w-12 h-12 text-pink-300 mx-auto"></i>
            <h5 class="font-bold text-base text-white">Jaringan Sosial</h5>
            <p class="text-xs text-stone-300">Posting kegiatan sehari-hari untuk menambah jumlah pengikut sosial Anda.</p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
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
    if (window.lucide) window.lucide.createIcons();
}

function renderPhoneAppProfilToContainer(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-3 max-w-lg mx-auto">
            <div class="glass-panel p-6 rounded-3xl border border-white/10 text-center">
                <div class="w-16 h-16 rounded-full bg-amber-200 text-stone-900 font-bold flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
                    ${player.nama ? player.nama.charAt(0) : 'P'}
                </div>
                <h5 class="font-bold text-base text-white">${player.nama || 'Pemain'}</h5>
                <p class="text-xs text-stone-300 mt-0.5">${player.gender || 'Pria'} • ${player.umur || 20} Tahun</p>
                <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-around text-xs">
                    <div>
                        <span class="text-stone-400 block">Kendaraan</span>
                        <span class="font-bold text-amber-200">${player.punyaKendaraan ? 'Punya' : 'Tidak Punya'}</span>
                    </div>
                    <div>
                        <span class="text-stone-400 block">Kota</span>
                        <span class="font-bold text-amber-200">${player.tempatLahir || 'Jakarta'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
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
            <button id="btnToggleBGMInApp" class="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl border border-rose-300/40 shadow-lg mx-auto cursor-pointer flex items-center gap-2">
                <i data-lucide="${isBgmPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
                <span>${isBgmPlaying ? 'Jeda Musik' : 'Putar Musik'}</span>
            </button>
        </div>
    `;

    const btn = document.getElementById('btnToggleBGMInApp');
    if (btn) {
        btn.onclick = () => {
            toggleBGM();
            renderPhoneAppMusikToContainer(container);
        };
    }

    if (window.lucide) window.lucide.createIcons();
}
