import { faVolumeHigh, faVolumeLow, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";

interface VolumeSliderProps {
    volume: number;
    onVolumeChange: (vol: number) => void;
}

const VolumeSlider = ({volume, onVolumeChange}: VolumeSliderProps) => {
    const [changing, setChanging] = useState(false);
    const comp = useRef<HTMLElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", e => {
            if (comp.current && !comp.current.contains(e.target as HTMLElement)) setChanging(false);
        })
    }, []);

    const renderIcon = () => {
        if (volume === 0) {
            return faVolumeMute;
        } else if (volume < 0.5) {
            return faVolumeLow;
        } else {
            return faVolumeHigh;
        }
    }

    return (
        <span ref={comp} className="volume-slider">
            <FontAwesomeIcon size="xl" icon={renderIcon()} onClick={() => setChanging(!changing)}/>
            {changing &&
                <div className="volume-overlay">
                    <input type="range" value={volume * 100} onChange={e => onVolumeChange(e.target.valueAsNumber / 100) }></input>
                </div>
            }
        </span>
    )
}
export default VolumeSlider