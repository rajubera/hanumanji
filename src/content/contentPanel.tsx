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
        SceneManager.emitter.addEventListener(SceneEvents.INTRO_COMPLETE, fn);
        return ()=>{
            SceneManager.emitter.removeEventListener(SceneEvents.INTRO_COMPLETE, fn)
        }
    }, [])
    return <div id="overlay">
        {isIntroStarted && isIntroComplete ? <ContentLayout></ContentLayout> : <></>}
        {!isIntroStarted && !isIntroComplete ? <IntroCard setIsIntroStarted={setIsIntroStarted} ></IntroCard> : <></>}

    </div>
}