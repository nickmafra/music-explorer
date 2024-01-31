const notes = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];

export default {
    chromaToText(chroma) {
        return notes[chroma];
    },
    textToChroma(text) {
        const letter = text.substring(0, 1);
        let chroma = notes.indexOf(letter);
        text = text.substring(1);
        if (text.startsWith('#')) chroma++;
        if (text.startsWith('b')) chroma--;
        return (chroma + 12) % 12;
    },
    pitchToText(midiNumber) {
        const chroma = midiNumber % 12;
        const octave = Math.floor(midiNumber / 12) - 1;

        return this.chromaToText(chroma) + octave;
    },
    textToPitch(text) {
        const chroma = this.textToChroma(text);
        text = text.substring(1);
        if (text.startsWith('#') || text.startsWith('b')) text = text.substring(1);
        const octave = parseInt(text);
        return 12 * (octave + 1) + chroma;
    },
};
