class AudioController {
    constructor() {
        this.numberSound = document.getElementById('numberSound');
        this.bingoSound = document.getElementById('bingoSound');
        this.winSound = document.getElementById('winSound');
        this.soundsEnabled = true;
    }

    playNumberSound() {
        if (this.soundsEnabled) {
            this.numberSound.currentTime = 0;
            this.numberSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playBingoSound() {
        if (this.soundsEnabled) {
            this.bingoSound.currentTime = 0;
            this.bingoSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playWinSound() {
        if (this.soundsEnabled) {
            this.winSound.currentTime = 0;
            this.winSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        return this.soundsEnabled;
    }

    setVolume(volume) {
        this.numberSound.volume = volume;
        this.bingoSound.volume = volume;
        this.winSound.volume = volume;
    }
}