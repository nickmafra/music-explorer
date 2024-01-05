export default {

    audioCtx: null,

    start: function() {
        if (!this.audioCtx)
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    },

    makeHarmonicNode: function(frequency, harmonics) {

        const wave = new PeriodicWave(this.audioCtx, {
            real: new Float32Array(harmonics),
            imag: new Float32Array(harmonics.length),
        });
        
        const oscillator = new OscillatorNode(this.audioCtx, {
            frequency,
            type: "custom",
            periodicWave: wave
        });
        return oscillator;
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

    createAudioPlayer: function(freq, harmonics, adsr) {
        const audioPlayer = {};
        audioPlayer.start = () => {
            if (audioPlayer.oscillator) {
                audioPlayer.oscillator.stop();
            }

            audioPlayer.oscillator = this.makeHarmonicNode(freq, harmonics);
            audioPlayer.envelope = this.makeEnvelopeNode(adsr);

            audioPlayer.oscillator
                .connect(audioPlayer.envelope)
                .connect(this.audioCtx.destination);

            audioPlayer.oscillator.start();
        };
        audioPlayer.stop = () => {
            this.releaseEnvelope(audioPlayer.envelope, adsr);
            audioPlayer.oscillator.stop(this.audioCtx.currentTime + adsr.releaseDuration);
        };
        return audioPlayer;
    },

}
