export class AudioPlayer {
    public initialized: boolean;
    private audioContext: AudioContext;
    private analyser: AnalyserNode | undefined;
    private data: Uint8Array | undefined;
    private source: MediaElementAudioSourceNode | undefined;

    constructor(public fftSize: number, private audioElement: HTMLAudioElement) {
        this.initialized = false;
        this.audioContext = new AudioContext();
    }

    async init() {
        this.initialized = false;
        try {
            this.source = this.audioContext.createMediaElementSource(this.audioElement)
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.data = new Uint8Array(this.analyser.frequencyBinCount);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            this.initialized = true;
        } catch (err) {
            console.log("Audio setup failed: " + err);
        }
    }

    getSamples(): number[] {
        if (!this.initialized) return [];
        this.analyser!.getByteTimeDomainData(this.data!);
        return [...this.data!].map(e => e/128-1);
    }

    getVolume(): number {
        if (!this.initialized || this.data!.length === 0) return 0;
        this.analyser!.getByteTimeDomainData(this.data!);
        return [...this.data!].map(e => Math.pow(e/128-1, 2)).reduce((acc, curr) => acc+curr) / this.data!.length;
    }
}