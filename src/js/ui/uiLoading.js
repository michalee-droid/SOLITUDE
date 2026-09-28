export function startTravelLoading(transportType, destinationName, onComplete) {
    const loadingScreen = document.getElementById('travel-loading-screen');
    const loadingText = document.getElementById('travel-loading-text');
    const progressBar = document.getElementById('travel-progress-bar');
    const loadingBg = document.getElementById('travel-loading-bg');
    
    if (!loadingScreen) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    const backgrounds = {
        ojek: 'https://res.cloudinary.com/dl2egfdw2/image/upload/v1790492573/taksi_2_cdl6py.png',
        taksi: 'https://res.cloudinary.com/dl2egfdw2/image/upload/v1790492567/taksi_1_mzbpvx.png',
        bus: 'https://res.cloudinary.com/dl2egfdw2/image/upload/v1790492569/taksi_3_louv6s.png',
        pribadi: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop'
    };

    if (loadingBg) loadingBg.style.backgroundImage = `url('${backgrounds[transportType]}')`;
    if (loadingText) loadingText.textContent = `Sedang menuju ke ${destinationName} (${transportType.toUpperCase()})...`;

    // FIX UTAMA: pakai .active + .show biar pasti muncul
    loadingScreen.classList.add('active');
    loadingScreen.classList.add('show');
    if (progressBar) progressBar.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
        progress += 1.2;
        if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.remove('show');
                if (typeof onComplete === 'function') onComplete();
            }, 300);
        }
    }, 30);
}
