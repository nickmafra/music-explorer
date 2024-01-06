export default class Timbre {
    audioCtx = null;
    type = 'sine';
    wave = null;
    adsr = {
        attackAmplitude: 1,
        attackDuration: 0.1,
        decayAmplitude: 0.5,
        decayDuration: 0.2,
        sustainDuration: 3,
        releaseDuration: 1,
    };

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    setWithHarmonics(harmonics) {
        this.harmonics = harmonics;

        this.type = 'custom';
        this.wave = new PeriodicWave(this.audioCtx, {
            real: new Float32Array(harmonics),
            imag: new Float32Array(harmonics.length),
        });
    }
};
