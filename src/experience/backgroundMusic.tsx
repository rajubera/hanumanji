import { useRef } from "react"
import { SceneManager } from "./sceneManager";

export const BackgroundMusic = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
     SceneManager.backgroundMusic = audioRef;
    return <>
        <audio ref={audioRef} src="/media/mantra.mp3" preload="true"></audio>
    </>
}