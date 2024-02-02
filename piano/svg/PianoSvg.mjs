const svgNs = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(svgNs, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
}

const whiteKeySize = { width: 10, height: 30 };
const blackKeySize = { width: 6,  height: 18 };
const baseKeyData = [
    { type: 'w', x: 0 },
    { type: 'b', x: 6.5 },
    { type: 'w', x: 10 },
    { type: 'b', x: 17.5 },
    { type: 'w', x: 20 },

    { type: 'w', x: 30 },
    { type: 'b', x: 36.5 },
    { type: 'w', x: 40 },
    { type: 'b', x: 47 },
    { type: 'w', x: 50 },
    { type: 'b', x: 57.5 },
    { type: 'w', x: 60 },
];
const strokeWidth = 1;

class PianoKeySvg {

    constructor(data, piano) {
        this.data = data;
        this.piano = piano;
        data.attributes = {
            rx: 1,
            stroke: 'black',
            'stroke-width': strokeWidth,
            y: 1,
            ...data.attributes
        }
        this.element = createSvgElement('rect', data.attributes);
        this.element.addEventListener('mousedown', () => this.onClickStart());
        this.element.addEventListener('mouseup', () => this.onClickEnd());
        this.element.addEventListener('mouseout', () => this.onClickEnd());
        this.element.classList.add(this.data.typeClass);
    }

    onClickStart() {
        if (this.piano.onKeyPress)
            this.piano.onKeyPress(this);
    }

    onClickEnd() {
        if (this.piano.onKeyRelease)
            this.piano.onKeyRelease(this);
    }

    addHighlight() {
        this.element.classList.add(this.piano.data.highlightClass);
    }

    clearHighlight() {
        this.element.classList.remove(this.piano.data.highlightClass);
    }
}

class PianoSvg {

    keys = [];
    onKeyPress = null;
    onKeyRelease = null;

    constructor(data) {
        this.data = {
            whiteFill: 'white',
            blackFill: 'black',
            whiteTypeClass: 'key-white',
            blackTypeClass: 'key-black',
            highlightClass: 'key-highlighted',
            firstPitch: 9,
            lastPitch: 72,
            ...data,
        }
        const allKeyData = [];
        const whiteKeyData = [];
        const blackKeyData = [];
        for (var p = this.data.firstPitch; p <= this.data.lastPitch; p++) {
            const data = this.#createKeyData(p);
            allKeyData.push(data);
            (data.type == 'w' ? whiteKeyData : blackKeyData).push(data);
        }
        const xOffset = allKeyData[0].attributes.x - strokeWidth;
        allKeyData.forEach(data => data.attributes.x -= xOffset);

        const width = 2 + whiteKeyData.length * whiteKeySize.width;
        const height = 2 + whiteKeySize.height;
        const attributes = {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
        }
        this.element = createSvgElement('svg', attributes);

        whiteKeyData.forEach(data => this.#addKey(data));
        blackKeyData.forEach(data => this.#addKey(data));
    }

    #createKeyData(pitch) {
        const chroma = pitch % 12;
        const octave = Math.floor(pitch / 12);
        const keyData = {
            ...baseKeyData[chroma],
            pitch,
            chroma,
            octave,
        };
        const isBlack = keyData.type == 'b';
        keyData.attributes = {
            fill: this.data[isBlack ? 'blackFill' : 'whiteFill'],
            ...(isBlack ? blackKeySize : whiteKeySize),
        };
        keyData.attributes.x = octave * 7 * whiteKeySize.width + keyData.x + 1;
        keyData.typeClass = this.data[isBlack ? 'blackTypeClass' : 'whiteTypeClass'];
        return keyData;
    }

    #addKey(data) {
        const key = new PianoKeySvg(data, this);
        this.keys.push(key);
        this.element.appendChild(key.element);
    }

    findKey(pitch) {
        return this.keys.find(key => key.data.pitch == pitch);
    }
};

export default PianoSvg;
