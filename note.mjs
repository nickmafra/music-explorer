const BASE_FREQUENCY = 440; // Hz
const OCTAVE_INTERVAL = 1200; // cents

function positiveModule(pitch) {
    pitch = pitch % 12;
    return pitch < 0 ? (pitch + 12) : pitch;
}

export default class Note {

    constructor(frequency) {
        this.frequency = frequency;
        let midiNumber = Note.midiNumber(frequency);
        this.pitch = midiNumber;
        this.octave = Note.octaveNumber(midiNumber);
        this.chroma = Note.chromaNumber(midiNumber);
        this.fifth = Note.fifthNumber(midiNumber);
    }

    static midiNumber(frequency) {
        return 69 + 12 * Math.log2(frequency / BASE_FREQUENCY);
    }

    static octaveNumber(midiNumber) {
        return Math.floor(midiNumber / 12) - 1;
    }

    static chromaNumber(midiNumber) {
        return positiveModule(midiNumber + 3, 12);
    }

    static fifthNumber(midiNumber) {
        return (midiNumber - 65) * 7;
    }

    static ratioToInterval(frequencyRatio) {
        return OCTAVE_INTERVAL * Math.log2(frequencyRatio);
    }

    static intervalInsideOctave(interval) {
        return positiveModule(interval, OCTAVE_INTERVAL);
    }

    static intervalToFrequency(interval, baseFrequency) {
        return baseFrequency * Math.pow(2, interval / OCTAVE_INTERVAL);
    }

    static compareByPitch(note1, note2) {
        return note1.pitch - note2.pitch;
    }

    static compareByChroma(note1, note2) {
        return note1.chroma - note2.chroma;
    }
};
