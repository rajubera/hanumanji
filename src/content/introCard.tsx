import { SceneManager } from "../experience";
import panchmukhiHanuman from '../assets/images/panchmukhi-1.png';
import hanumanImg from '../assets/images/hanumanji-flying.png';

export const IntroCard = ({ 
    setIsIntroStarted, 
    onStartGame 
}: { 
    setIsIntroStarted: (f: boolean) => void,
    onStartGame: () => void 
}) => {


    const startIntro = () => {
        setIsIntroStarted(true);
        SceneManager.startIntro();
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
            <button className="hm-btn" onClick={startIntro}>Experience 🪔 aura</button>

            <div className="game-entry-divider">
                <span>OR</span>
            </div>

            <div className="game-entry-block" onClick={onStartGame}>
                <div className="game-entry-content">
                    <div className="game-icon">🚩</div>
                    <div className="game-info">
                        <h3>DIVINE FLIGHT</h3>
                        <p>
                            Hanuman's Sacred Journey | <a href="https://aponiar.com" target="_blank" rel="noopener noreferrer" className="intro-publisher-link">Aponiar</a>
                        </p>
                    </div>
                </div>
                <div className="game-play-btn">Play Now</div>
            </div>
            
            {/* Asset Preloader (Hidden) */}
            <div style={{ display: 'none' }}>
                <img src={hanumanImg} alt="" />
            </div>
        </div>
    </>
}