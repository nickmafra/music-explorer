import Timbre from "./Timbre.mjs";

export default class AudioPlayer {
    /** @type {Timbre} */
    timbre = null;
    frequency = null;
    oscillatorNode = null;
    gainNode = null;

    constructor(timbre, frequency) {
        this.timbre = timbre;
        this.frequency = frequency;
        
        this.oscillatorNode = timbre.audioCtx.createOscillator();
        if (this.timbre.type === 'custom') {
            this.oscillatorNode.setPeriodicWave(timbre.wave);
        } else {
            this.oscillatorNode.type = timbre.type;
        }
        this.oscillatorNode.frequency.value = frequency;

        this.gainNode = timbre.audioCtx.createGain();
        this.gainNode.gain.value = 0;

        this.oscillatorNode
            .connect(this.gainNode)
            .connect(timbre.audioCtx.destination);
        this.oscillatorNode.start();
    }

    start() {
        const adsr = this.timbre.adsr;
        let time = this.timbre.audioCtx.currentTime;
        this.gainNode.gain.cancelScheduledValues(time);

        this.gainNode.gain.setValueAtTime(0, time);

        time += adsr.attackDuration;
        this.gainNode.gain.linearRampToValueAtTime(adsr.attackAmplitude, time);

        time += adsr.decayDuration;
        this.gainNode.gain.linearRampToValueAtTime(adsr.decayAmplitude, time);

        if (adsr.sustainDuration) {
            time += adsr.sustainDuration;
            this.gainNode.gain.linearRampToValueAtTime(0, time);
        }
    }

    stop() {
        const adsr = this.timbre.adsr;
        let time = this.timbre.audioCtx.currentTime;
        this.gainNode.gain.cancelScheduledValues(time);

        time += adsr.releaseDuration;
        this.gainNode.gain.linearRampToValueAtTime(0, time);
    }

};
