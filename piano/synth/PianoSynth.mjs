import Timbre from "./Timbre.mjs";
import AudioPlayer from "./AudioPlayer.mjs";

export default class PianoSynth {
    /** @type {Timbre} */
    timbre = null;
    keysMap = {};

    constructor(data) {
        this.data = data = {
            firstPitch: 9,
            lastPitch: 72,
            harmonics: [
                1.0,
                0.6,
                0.2,
                0.3,
                0.1,
                0.5,
                0.1,
                0.4,
                0.1,
                0.1,
            ],
            adsr: {
                attackAmplitude: 1,
                attackDuration: 0.1,
                decayAmplitude: 0.5,
                decayDuration: 0.2,
                sustainDuration: 3,
                releaseDuration: 1,
            },
            ...data,
        }

        this.timbre = new Timbre();
        this.timbre.setWithHarmonics(data.harmonics);
        this.timbre.adsr = data.adsr;

        for (var pitch = data.firstPitch; pitch <= data.lastPitch; pitch++) {
            const frequency = this.#calcFrequency(pitch);
            this.keysMap[pitch] = new AudioPlayer(this.timbre, frequency);
        }
    }

    #calcFrequency(midiNumber) {
        return 440 * Math.pow(2, (midiNumber - 69)/12);
    }

    press(pitch) {
        const audioPlayer = this.keysMap[pitch];
        if (audioPlayer) audioPlayer.start();
    }

    release(pitch) {
        const audioPlayer = this.keysMap[pitch];
        if (audioPlayer) audioPlayer.stop();
    }
}