// ==========================================
// SMARTPHONE MODULE (smartphone.js)
// ==========================================

let activePhoneApp = null;

// Inisialisasi Event Listener Tombol Smartphone Utama
export function initSmartphoneModule(playerDataRef, locationsRef, callbacks) {
    const btnOpen = document.getElementById('btnOpenSmartphone');
    const modal = document.getElementById('smartphoneModal');
    const card = document.getElementById('smartphoneCard');

    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            card.classList.remove('scale-90');
            card.classList.add('scale-100');
        });
    }

    // Bind fungsi global agar bisa diakses onclick dari HTML dinamis
    window.openPhoneApp = (appName) => openApp(appName, playerDataRef, locationsRef, callbacks);
    window.closePhoneApp = closeApp;
    window.closeSmartphone = closeSmartphoneModal;
    window.closePhoneAppOrModal = closeAppOrModal;
}

function closeSmartphoneModal() {
    closeApp();
    const modal = document.getElementById('smartphoneModal');
    const card = document.getElementById('smartphoneCard');
    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-90');
}

function closeAppOrModal() {
    if (activePhoneApp) {
        closeApp();
    } else {
        closeSmartphoneModal();
    }
}

function openApp(appName, player, locations, callbacks) {
    activePhoneApp = appName;
    const appView = document.getElementById('phoneAppView');
    const appTitle = document.getElementById('phoneAppTitle');

    appView.classList.remove('hidden');

    switch (appName) {
        case 'peta':
            appTitle.innerText = 'GPS & Peta Travel';
            renderPetaApp(player, locations, callbacks.onTravel);
            break;
        case 'wallet':
            appTitle.innerText = 'Finansial & Kas';
            renderWalletApp(player);
            break;
        case 'bisnis':
            appTitle.innerText = 'Bisnis & Properti';
            renderBisnisApp();
            break;
        case 'investasi':
            appTitle.innerText = 'Investasi Pasar';
            renderInvestasiApp();
            break;
        case 'freelance':
            appTitle.innerText = 'Karir & Pekerjaan';
            renderFreelanceApp();
            break;
        case 'medsos':
            appTitle.innerText = 'Medsos & Koneksi';
            renderMedsosApp();
            break;
        case 'chat':
            appTitle.innerText = 'Pesan Singkat';
            renderChatApp();
            break;
        case 'profil':
            appTitle.innerText = 'Profil Identitas';
            renderProfilApp(player);
            break;
        case 'musik':
            appTitle.innerText = 'Audio Player';
            renderMusikApp(callbacks.onToggleBgm);
            break;
    }
}

function closeApp() {
    activePhoneApp = null;
    const appView = document.getElementById('phoneAppView');
    if (appView) appView.classList.add('hidden');
}

// Render Konten Aplikasi HP
function renderPetaApp(player, locations, onTravel) {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col gap-3">
            <p class="text-stone-300 text-[11px]">Pilih lokasi tujuan untuk berpindah kawasan:</p>
            ${locations.map(loc => `
                <div class="glass-panel p-3 rounded-2xl flex items-center justify-between border ${player.currentLocation === loc.id ? 'border-amber-400 bg-amber-400/20' : 'border-white/10'}">
                    <div>
                        <h5 class="font-bold text-white text-xs">${loc.name}</h5>
                        <p class="text-[10px] text-stone-300">${loc.subtext}</p>
                    </div>
                    ${player.currentLocation === loc.id ? 
                        `<span class="text-[9px] font-bold text-amber-200 bg-black/40 px-2 py-1 rounded-lg">Lokasi Saat Ini</span>` :
                        `<button id="travel-btn-${loc.id}" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] rounded-xl border border-white/20 cursor-pointer">Pergi</button>`
                    }
                </div>
            `).join('')}
        </div>
    `;
    
    // Event listener binding aman
    locations.forEach(loc => {
        const btn = document.getElementById(`travel-btn-${loc.id}`);
        if (btn) btn.onclick = () => onTravel(loc.id);
    });
}

function renderWalletApp(player) {
    document.getElementById('phoneAppBody').innerHTML = `
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
}

function renderBisnisApp() {
    document.getElementById('phoneAppBody').innerHTML = `<p class="text-stone-300">Modul Bisnis & Properti dalam pengembangan.</p>`;
}
function renderInvestasiApp() {
    document.getElementById('phoneAppBody').innerHTML = `<p class="text-stone-300">Modul Grafik Saham & Investasi aktif.</p>`;
}
function renderFreelanceApp() {
    document.getElementById('phoneAppBody').innerHTML = `<p class="text-stone-300">Daftar Pekerjaan Lepas tersedia.</p>`;
}
function renderMedsosApp() {
    document.getElementById('phoneAppBody').innerHTML = `<p class="text-stone-300">Linimasa Media Sosial kosong.</p>`;
}
function renderChatApp() {
    document.getElementById('phoneAppBody').innerHTML = `<p class="text-stone-300">Tidak ada pesan baru.</p>`;
}
function renderProfilApp(player) {
    document.getElementById('phoneAppBody').innerHTML = `
        <div class="glass-panel p-3 rounded-2xl flex flex-col gap-2">
            <span class="text-xs font-bold text-amber-200">Nama: ${player.nama}</span>
            <span class="text-xs text-stone-300">Gender: ${player.gender}</span>
            <span class="text-xs text-stone-300">Asal: ${player.tempatLahir}</span>
        </div>`;
}
function renderMusikApp(onToggleBgm) {
    const body = document.getElementById('phoneAppBody');
    body.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-4 py-8">
            <div class="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center animate-spin-slow text-rose-300">
                <i data-lucide="disc" class="w-10 h-10"></i>
            </div>
            <span class="text-xs font-bold text-white">Garden Ambient Audio</span>
            <button id="toggleBgmAppBtn" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold cursor-pointer">Putar / Jeda Musik</button>
        </div>
    `;
    lucide.createIcons();
    document.getElementById('toggleBgmAppBtn').onclick = onToggleBgm;
}
