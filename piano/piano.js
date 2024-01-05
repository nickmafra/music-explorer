var piano = {

    adsr: {
        attackAmplitude: 1,
        attackDuration: 0.02,
        decayAmplitude: 0.5,
        decayDuration: 0.2,
        sustainDuration: 2,
        releaseDuration: 0.1
    },
    harmonics: [
        1.0,
        0.6,
        0.2,
        0.3,
        0.1, // 5
        0.5,
        0.1,
        0.4,
        0.1,
        0.1, // 10
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
    ],

    makeKeyObjects: function(y, width, keyCount = 88) {
        var whiteKeyCountEstimate = keyCount - Math.floor(keyCount*5/12);
        var scale = 1 * width * 88 / whiteKeyCountEstimate;
        const space = scale * 0.035;
        const whiteKeyWidth = scale * 0.033;
        const whiteKeyHeight = scale * 0.2;
        const blackKeyWidth = whiteKeyWidth*2/3;
        const blackKeyHeight = whiteKeyHeight*3/5;
        const blackIndexes = [1,4,6,9,11];
        var note = keyCount == 88 ? 0 : 3;
        var octave = Math.floor((88 - keyCount) / 24);
        var keyX = -whiteKeyCountEstimate/2 * space;
        var keys = [];
        while (keys.length < keyCount) {
            var isBlack = blackIndexes.includes(note);
            var freq = core.calcFrequency(note, octave);
            var key = {
                note,
                octave,
                isBlack,
                audioPlayer: this.audioPlayer(freq),
                clickable: true
            };
            if (isBlack) {
                key.c = '#222';
                key.w = blackKeyWidth;
                key.h = blackKeyHeight;
                key.x = keyX - whiteKeyWidth/2;
                key.y = y - whiteKeyHeight/2 + blackKeyHeight/2;
            } else {
                key.c = '#eee';
                key.w = whiteKeyWidth;
                key.h = whiteKeyHeight;
                key.x = keyX;
                keyX += space;
                key.y = y;
            }
            keys.push(key);
            
            note++;
            if (note == 12) {
                note = 0;
                octave++;
            }
        }
        keys.sort((a,b) => a.isBlack ? 1 : b.isBlack ? -1 : 0);
        return keys;
    },

    audioPlayer: function(freq) {
        const audioPlayer = {};
        audioPlayer.start = () => {
            if (audioPlayer.oscillator) {
                audioPlayer.oscillator.stop();
            }

            audioPlayer.oscillator = core.makeHarmonicNode(freq, this.harmonics);
            audioPlayer.envelope = core.makeEnvelopeNode(this.adsr);

            audioPlayer.oscillator
                .connect(audioPlayer.envelope)
                .connect(core.audioCtx.destination);

            audioPlayer.oscillator.start();
        };
        audioPlayer.stop = () => {
            core.releaseEnvelope(audioPlayer.envelope, this.adsr);
            audioPlayer.oscillator.stop(core.audioCtx.currentTime + this.adsr.releaseDuration);
        };
        return audioPlayer;
    }
};