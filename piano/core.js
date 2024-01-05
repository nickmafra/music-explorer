var core = {

    audioCtx: null,

    start: function() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    },

    calcFrequency: function(note, octave) {
        return 440 * Math.pow(2, octave - 4 + note/12);
    },

    makeEnvelopeNode: function(adsr, time) {
        if (!time) time = this.audioCtx.currentTime;

        const env = new GainNode(this.audioCtx);
        env.gain.cancelScheduledValues(time);
        env.gain.setValueAtTime(0, time);
        env.gain.linearRampToValueAtTime(adsr.attackAmplitude, time + adsr.attackDuration);
        env.gain.linearRampToValueAtTime(
            adsr.decayAmplitude,
            time + adsr.attackDuration + adsr.decayDuration
        );
        if (adsr.sustainDuration) {
            env.gain.linearRampToValueAtTime(
                0,
                time + adsr.attackDuration + adsr.decayDuration + adsr.sustainDuration
            );
        }
        return env;
    },

    releaseEnvelope: function(env, adsr, time) {
        if (!time) time = this.audioCtx.currentTime;

        env.gain.linearRampToValueAtTime(
            0,
            time + adsr.releaseDuration
        );
    },

    makeHarmonicNode: function(frequency, harmonics) {

        const wave = new PeriodicWave(this.audioCtx, {
            real: new Float32Array(harmonics),
            imag: new Float32Array(harmonics.length)
        });
        
        const oscillator = new OscillatorNode(this.audioCtx, {
            frequency,
            type: "custom",
            periodicWave: wave
        });
        return oscillator;
    }

};