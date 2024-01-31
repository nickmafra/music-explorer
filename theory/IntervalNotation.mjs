const intervals = [
    {n: 1, q: 'P'},
    {n: 2, q: 'm'},
    {n: 2, q: 'M'},
    {n: 3, q: 'm'},
    {n: 3, q: 'M'},
    {n: 4, q: 'P'},
    {n: 5, q: 'd'},
    {n: 5, q: 'P'},
    {n: 6, q: 'm'},
    {n: 6, q: 'M'},
    {n: 7, q: 'm'},
    {n: 7, q: 'M'},
];

export default {
    pitchToText(relativePitch) {
        const baseInterval = intervals[relativePitch % 12];
        const octave = Math.floor(relativePitch / 12);
        return baseInterval.q + (baseInterval.n + 7 * octave);
    },
    textToPitch(text) {
        const quality = text.substring(0, 1);
        const n = parseInt(text.substring(1));
        const baseN = 1 + (n-1) % 7;
        let baseInterval = intervals.find(i => i.n == baseN && i.q == quality);
        let change = 0;
        if (!baseInterval && quality == 'd') {
            baseInterval = intervals.find(i => i.n == baseN && (i.q == 'm' || i.q == 'P'));
            change = -1;
        }
        if (!baseInterval && (quality == 'a' || quality == 'A')) {
            baseInterval = intervals.find(i => i.n == baseN && (i.q == 'M' || i.q == 'P'));
            change = +1;
        }
        if (!baseInterval) {
            throw new Error('Pitch not found');
        }
        const chroma = intervals.indexOf(baseInterval) + change;
        return chroma + 12 * Math.floor((n-1) / 7);
    },
};