export class Bar {
    private levelCoeff = 400;
    private fadeOutCoeff = 0.03;
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public color: string,
        public index: number
    ) {}

    update(volume: number) {
        const soundLevel = volume * this.levelCoeff;
        if (soundLevel > this.height) this.height = soundLevel;
        else this.height -= this.height * this.fadeOutCoeff;
    }

    draw(ctx: CanvasRenderingContext2D, volume: number) {
        //ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.rotate(this.index * 0.02);
        ctx.beginPath();
        ctx.bezierCurveTo(this.x, this.y*4, this.height * 4, this.height + 250, this.x, this.y)
        ctx.stroke();
    }
}