// src/js/ui/uiLoading.js

/**
 * Menjalankan Loading Screen Perjalanan dengan Latar Gambar
 * @param {string} transportType - Jenis transportasi ('ojek', 'taksi', 'bus')
 * @param {string} destinationName - Nama lokasi tujuan
 * @param {function} onComplete - Callback yang dipanggil saat loading selesai
 */
export function startTravelLoading(transportType, destinationName, onComplete) {
    const loadingScreen = document.getElementById('travel-loading-screen');
    const loadingText = document.getElementById('travel-loading-text');
    const progressBar = document.getElementById('travel-progress-bar');
    const loadingBg = document.getElementById('travel-loading-bg');

    if (!loadingScreen) {
        console.warn('Elemen #travel-loading-screen tidak ditemukan di HTML.');
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    // Pemetaan Latar Belakang Gambar Berdasarkan Transportasi
    const backgrounds = {
        ojek: 'assets/images/bg-ojek.jpg',
        taksi: 'assets/images/bg-taksi.jpg',
        bus: 'assets/images/bg-bus.jpg'
    };

    // Set background image
    if (loadingBg) {
        const bgUrl = backgrounds[transportType] || 'assets/images/bg-travel.jpg';
        loadingBg.style.backgroundImage = `url('${bgUrl}')`;
    }

    // Set teks status perjalanan
    if (loadingText) {
        const transportLabel = transportType ? transportType.toUpperCase() : 'PERJALANAN';
        loadingText.textContent = `Sedang menuju ke ${destinationName || 'lokasi tujuan'} menggunakan ${transportLabel}...`;
    }

    // Tampilkan Loading Screen
    loadingScreen.classList.add('active');
    if (progressBar) progressBar.style.width = '0%';

    let progress = 0;
    const duration = 2500; // Durasi loading dalam milidetik (2.5 detik)
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
        progress += step;
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Sembunyikan Loading Screen
                loadingScreen.classList.remove('active');
                
                // Eksekusi callback perpindahan lokasi
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }, 300);
        }
    }, intervalTime);
}
