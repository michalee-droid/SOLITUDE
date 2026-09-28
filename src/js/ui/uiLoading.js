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
    const defaultBg = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop';
    if (loadingBg) {
        const bgUrl = backgrounds[transportType] || defaultBg;
        loadingBg.style.backgroundImage = `url('${bgUrl}')`;
    }
    if (loadingText) {
        const modeLabel = transportType ? transportType.toUpperCase() : 'PERJALANAN';
        const destination = destinationName || 'LOKASI TUJUAN';
        loadingText.textContent = `Sedang menuju ke ${destination} (${modeLabel})...`;
    }
    // FIX: use .active not .show (CSS uses .active, we support both now)
    loadingScreen.classList.add('active');
    loadingScreen.classList.add('show');
    if (progressBar) progressBar.style.width = '0%';
    let progress = 0;
    const duration = 2500;
    const intervalTime = 30;
    const step = (intervalTime / duration) * 100;
    const interval = setInterval(() => {
        progress += step;
        if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.remove('show');
                if (typeof onComplete === 'function') onComplete();
            }, 300);
        }
    }, intervalTime);
}
