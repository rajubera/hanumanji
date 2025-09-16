
import { SceneManager } from "../experience";
import panchmukhiHanuman from '../assets/images/panchmukhi-1.png';

export const IntroCard = ({ setIsIntroStarted }: { setIsIntroStarted: (f: boolean) => void }) => {


    const startIntro = () => {
        setIsIntroStarted(true);
        SceneManager.isIntroStarted = true;
        SceneManager.playBackgroundMusic();
    }

    return <>
       
        <div className="content-card hanumanji-intro-container">
            <div className="hanuman-ji-image-wrap">
                 <img className="hanumanji-intro-image" src={panchmukhiHanuman} alt="" />
            </div>
            
            <h2 className='hanuman-logo-text'>ॐ श्री हनुमते नमः</h2>
            <p>
                Each diya  you light spreads warmth and positivity.
                Join in by lighting up to <strong>5 diyas</strong> around Hanuman Ji.
            </p>
            <button onClick={startIntro}>Experience 🪔 aura</button>
        </div>
    </>
}