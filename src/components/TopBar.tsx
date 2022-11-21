import { faPlay, faPause, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { AudioEffect } from "../model/audio-effect";
import VolumeSlider from "./VolumeSlider";

interface TopBarProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    audioEffect?: AudioEffect;
    onFileChange: (file: File) => void;
    fileName?: string;
}

const TopBar = ({audioRef, onFileChange, fileName, audioEffect}: TopBarProps) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            console.log("RESUME: ", audioEffect)
            audioEffect?.resume();
            audio.play();
            setPlaying(true);
        }
    }

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length < 1) return;
        onFileChange(files[0]);
        setPlaying(false);
    }

    const handleVolume = (vol: number) => {
        if (audioRef.current) audioRef.current.volume = vol;
        setVolume(vol);
    }

    const chooseFile = () => {
        inputRef.current?.click();
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("ended", () => setPlaying(false));
        }
    })

    return (
        <div className="hoverbox">
            <div className="controls">
                <FontAwesomeIcon size="xl" icon={playing ? faPause : faPlay} onClick={handleClick}/>
                <VolumeSlider volume={volume} onVolumeChange={handleVolume}/>

                <span className="file-input">
                    <input ref={inputRef} type="file" id="file" onChange={e => handleFileChange(e.target.files)}></input>
                    <span>{fileName ? fileName : "Select an audio file"}</span>
                    <FontAwesomeIcon size="xl" icon={faFile} onClick={chooseFile}/>
                </span>
            </div>
        </div>
  )
}
export default TopBar