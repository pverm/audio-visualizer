import { AudioPlayer } from "./audio-player";
import { Bar } from "./bar";

export class AudioEffect {
    private fftSize: number;
    public bars: Array<Bar>;
    public player: AudioPlayer;
    public linearGradient: CanvasGradient;
    public radialGradient: CanvasGradient;

    constructor(public width: number, public height: number, ctx: CanvasRenderingContext2D, audioElement: HTMLAudioElement) {
        this.fftSize = 512;
        this.player = new AudioPlayer(this.fftSize, audioElement);
        this.bars = this.createBars();
        this.linearGradient = this.createLinearGradient(ctx);
        this.radialGradient = this.createRadialGradient(ctx);
    }

    get barWidth() {
        return this.width / (this.fftSize/2)
    }

    async init() {
        await this.player.init();
    }

    resume() {
        this.player.resume();
    }

    createBars(): Array<Bar> {
        const bars = [];
        for (let i=0; i<this.fftSize/2; i++) {
            bars.push(new Bar(10, 300, 0.5, 100, "red", i))
        }
        return bars;
    }

    createLinearGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(0, 0, 300, 350);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.2, "yellow");
        gradient.addColorStop(0.4, "green");
        gradient.addColorStop(0.6, "cyan");
        gradient.addColorStop(0.8, "blue");
        gradient.addColorStop(1, "magenta");
        return gradient;
    }

    createRadialGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(0, 0, 300, 0, 0, this.width);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.2, "yellow");
        gradient.addColorStop(0.4, "green");
        gradient.addColorStop(0.6, "cyan");
        gradient.addColorStop(0.8, "blue");
        gradient.addColorStop(1, "magenta");
        return gradient;
    }

    resize(width: number, height: number, ctx: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.bars = this.createBars();
        this.linearGradient = this.createLinearGradient(ctx);
        this.radialGradient = this.createRadialGradient(ctx);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.player.initialized) return;
        ctx.clearRect(0, 0, this.width, this.height);
        const samples = this.player.getSamples();
        ctx.save();
        ctx.translate(this.width/2, this.height/2 - 40);
        // ctx.strokeStyle = this.radialGradient;
        ctx.strokeStyle = this.linearGradient;
        this.bars.forEach((bar, i) => {
            bar.update(samples[i]);
            bar.draw(ctx, 1);
        });

        // draw centered circle
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.linearGradient;
        ctx.arc(0, 0, 300, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}