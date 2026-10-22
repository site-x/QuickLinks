// Marketing showreel: play with sound, and pause the background music while it plays
document.addEventListener('DOMContentLoaded', () => {
    const reel = document.querySelector('[data-reel]');
    if (!reel) return;
    const video = reel.querySelector('video');
    const play = reel.querySelector('.reel-play');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let pausedMusic = false;

    function resumeMusic() {
        if (pausedMusic && musicToggle) musicToggle.click();
        pausedMusic = false;
    }

    play.addEventListener('click', () => {
        video.muted = false;
        video.loop = false;
        video.controls = true;
        video.currentTime = 0;
        reel.classList.add('is-playing');
        if (bgMusic && !bgMusic.paused && musicToggle) { musicToggle.click(); pausedMusic = true; }
        video.play();
    });
    video.addEventListener('pause', () => { if (!video.ended) resumeMusic(); });
    video.addEventListener('play', () => {
        if (!pausedMusic && bgMusic && !bgMusic.paused && !video.muted && musicToggle) { musicToggle.click(); pausedMusic = true; }
    });
    video.addEventListener('ended', () => {
        video.controls = false;
        reel.classList.remove('is-playing');
        resumeMusic();
    });
});
