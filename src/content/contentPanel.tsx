import { useEffect, useState } from "react"
import { IntroCard } from "./introCard"
import { ContentLayout } from "./layout";
import { SceneEvents, SceneManager } from "../experience";

export const ContentPanel = () => {
    const [isIntroStarted, setIsIntroStarted] = useState(false);
    const [isIntroComplete, setIsIntroComplete] = useState(false);

    useEffect(() => {
        const fn = () => {
            setIsIntroComplete(true)
        };
        const resetFn = () => {
            setIsIntroStarted(false);
            setIsIntroComplete(false);
        }
        SceneManager.emitter.addEventListener(SceneEvents.INTRO_COMPLETE, fn);
        SceneManager.emitter.addEventListener(SceneEvents.INTRO_RESET, resetFn);
        return () => {
            SceneManager.emitter.removeEventListener(SceneEvents.INTRO_COMPLETE, fn)
            SceneManager.emitter.removeEventListener(SceneEvents.INTRO_RESET, resetFn)
        }
    }, [])

    return <div id="overlay">
        {isIntroStarted && isIntroComplete ? <ContentLayout></ContentLayout> : <></>}
        {!isIntroStarted && !isIntroComplete ? (
            <IntroCard 
                setIsIntroStarted={setIsIntroStarted} 
                onStartGame={() => { window.location.hash = 'game'; }}
            />
        ) : <></>}
    </div>
}