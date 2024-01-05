var main = {

    start: function() {
        core.start();

        this.objects = piano.makeKeyObjects(0, 1, 37);

        engine.updateFunction = () => this.update();
        engine.start();
    },

    update: function() {
        engine.objects = [...this.objects];
        if (engine.clickStartObject != null && engine.clickStartObject.audioPlayer) {
            engine.clickStartObject.audioPlayer.start();
        }
        if (engine.clickStopObject != null && engine.clickStopObject.audioPlayer) {
            engine.clickStopObject.audioPlayer.stop();
        }
    },

    randomColorString: function() {
        var rgb = Array(3).fill(255).map(x => Math.floor(x * Math.random()));
        return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    },

    objects: [
        {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            c: 'gray',
            clickable: true
        },
        {
            x: 0.5,
            y: 0.5,
            w: 0.5,
            h: 0.5,
            c: 'cyan',
            clickable: true
        },
    ]
}