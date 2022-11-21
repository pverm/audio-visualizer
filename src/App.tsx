import { useEffect, useRef } from "react";
import TopBar from "./components/TopBar";
import "./App.css";
import { useState } from "react";
import { AudioEffect } from "./model/audio-effect";

function resize(canvas: HTMLCanvasElement, effect: AudioEffect) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    effect.resize(width, height, canvas.getContext("2d")!);
};

function animate(canvas: HTMLCanvasElement, effect: AudioEffect) {
    const ctx = canvas.getContext("2d")!;
    effect.draw(ctx);
    requestAnimationFrame(() => animate(canvas, effect));
}

const App = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [audioFile, setAudioFile] = useState<string | undefined>(undefined);
    const [audioEffect, setAudioEffect] = useState<AudioEffect | undefined>(undefined);

    function onFileChange(file: File) {
        if (!audioRef.current) return;
        audioRef.current.src = window.URL.createObjectURL(file);
        setAudioFile(file.name);
        if (audioEffect) audioEffect.init();
    }

    useEffect(() => {
        const cachedFile = audioRef.current?.currentSrc.split("/").pop();
        if (cachedFile) setAudioFile(cachedFile);
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d")!;
        const effect = new AudioEffect(0, 0, ctx, audioRef.current!);
        setAudioEffect(effect);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !audioEffect) return;
        window.addEventListener("resize", () => resize(canvasRef.current!, audioEffect));
        audioEffect.init();
        resize(canvasRef.current, audioEffect);
        animate(canvasRef.current, audioEffect);
    }, [audioEffect]);

    return (
        <div className="App">
            <TopBar audioRef={audioRef} onFileChange={onFileChange} fileName={audioFile}/>
            <audio ref={audioRef} id="audio" src="./Jorgenson - Gothic 1 - Kampfkraft und Wendigkeit (Cor Angar)"></audio>
            <img src="./headphones.svg" alt="headphones" id="headphones"/>
            <div>
                <canvas ref={canvasRef}/>
            </div>
        </div>
    );
}

export default App;
