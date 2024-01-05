import Note from './note.mjs';

const OCTAVE_IN_CENTS = 1200;
const ETT_FIFTH_RATIO = Math.pow(2, 7/12);

function compareByChroma(note1, note2) {
    return note1.chroma - note2.chroma;
}

class MeantoneTuningSystem {
    params = {
        noteCount: 12,
        baseFrequency: 440, // A
        fifthRatio: ETT_FIFTH_RATIO,
        firstFifthTuned: -9, // Gb
        zeroFifth: -4, // F
    }

    constructor(params) {
        this.params = {
            ...this.params,
            ...params,
        }
    }

    generateNotes() {
        let notes = [];
        for (var i = this.params.firstFifthTuned; i < this.params.firstFifthTuned + this.params.noteCount; i++) {
            let frequencyRatio = Math.pow(this.params.fifthRatio, i);
            let interval = Note.ratioToInterval(frequencyRatio);
            interval = Note.intervalInsideOctave(pitch);
            let frequency = Note.intervalToFrequency(interval);
            notes.push(new Note(frequency));
        }
        return notes.sort(Note.compareByPitch);
    }
}

export {
    MeantoneTuningSystem
};
