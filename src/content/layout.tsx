import { LitUpDiyaBtn, SceneManager } from "../experience"
import FlipBook from "./flipBook"
import { Header } from "./header"
import FloatingMenu, { type IFloatingMenuItem } from "./floatingMenu"
import SacredBook from "./sacredBook"
import { useState } from "react"
import { AudioDisabled, AudioEnabled, BookOpen } from "./icons"

export const ContentLayout = () => {
    const [isBookOpen, setIsBookOpen] = useState(false);

    const rightMenuItems: IFloatingMenuItem[] = [
        {
            icon: <BookOpen />, name: 'open_book', onClick: () => {
                setIsBookOpen(true)
            }
        },

    ];
    const AudioControl = () => {
        const [isRunning, setIsRunning] = useState(true);

        const toggleAudio = () => {
            isRunning ? SceneManager.backgroundMusic.current?.pause() : SceneManager.backgroundMusic.current?.play();
            
            setIsRunning(!isRunning)
        }

        return <div onClick={toggleAudio} className="book-wrapper" data-tooltip-id="globalTooltip"
            data-tooltip-content={isRunning ? "Offer Silence" : "Invoke the Chant"}>
            {isRunning ? <AudioEnabled></AudioEnabled> : <AudioDisabled></AudioDisabled>}
        </div>
    }
     const leftMenuItems: IFloatingMenuItem[] = [
        {
            icon: <AudioControl />, name: 'audio_control'
        },

    ];
    return <>
        <Header></Header>
        {!isBookOpen ? <>
            <LitUpDiyaBtn></LitUpDiyaBtn>
            <FloatingMenu menuItems={leftMenuItems} side="left"></FloatingMenu>
            <FloatingMenu menuItems={rightMenuItems} side="right"></FloatingMenu>
        </> : <></>}


        <div className="overlay-ui">
            {isBookOpen && <FlipBook setIsBookOpen={setIsBookOpen}></FlipBook>}
            {/* <SacredBook></SacredBook> */}
        </div>
    </>
}