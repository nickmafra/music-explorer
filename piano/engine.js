var engine = {

    updateFunction: () => {},
    objects: [],
    clickStartObject: null,
    clickingObject: null,
    clickStopObject: null,

    start: function() {
        this.canvas = document.createElement("canvas");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");
    
        addEventListener("resize", () => this.resize());
        this.resize();

        document.addEventListener('mousedown', (e) => this.onClickStart(e));
        document.addEventListener('mouseup', (e) => this.onClickStop(e));

        this.loop();
    },

    resize: function() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.unit = Math.min(this.canvas.width, this.canvas.height)/2; // center to nearest border
    },

    loop: function() {
        this.updateFunction();
        this.draw();

        this.clickStartObject = null;
        this.clickStopObject = null;
    
        requestAnimationFrame(() => this.loop());
    },

    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.objects.forEach(obj => {
            this.ctx.fillStyle = obj.c;
            this.ctx.fillRect(
                this.canvas.width/2 + this.unit * (obj.x - obj.w/2),
                this.canvas.height/2 + this.unit * (obj.y - obj.h/2),
                this.unit * obj.w,
                this.unit * obj.h
            );
        });
    },

    onClickStart: function(e) {
        var x = (e.clientX - this.canvas.width/2) / this.unit;
        var y = (e.clientY - this.canvas.height/2) / this.unit;

        for (var i = this.objects.length - 1; i >= 0; i--) {
            var obj = this.objects[i];
            if (obj.clickable && Math.abs(x - obj.x) <= obj.w/2 && Math.abs(y - obj.y) <= obj.h/2) {
                this.clickStartObject = obj;
                this.clickingObject = obj;
                return;
            }
        }
    },

    onClickStop: function(e) {
        this.clickStopObject = this.clickingObject;
        this.clickingObject = null;
    }
}