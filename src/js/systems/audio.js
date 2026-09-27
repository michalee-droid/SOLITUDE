// BGM & Audio System
const bgmAudio = document.getElementById('bgmAudio');
if (bgmAudio) bgmAudio.volume = 0.35;

export let isBgmPlaying = false;

export function playBGM() {
    if (!bgmAudio) return;
    bgmAudio.play().then(() => {
        isBgmPlaying = true;
    }).catch(() => {
        isBgmPlaying = false;
    });
}

export function pauseBGM() {
    if (!bgmAudio) return;
    bgmAudio.pause();
    isBgmPlaying = false;
}

export function toggleBGM() {
    if (isBgmPlaying) pauseBGM();
    else playBGM();
}

export function playChime(freq) {
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
