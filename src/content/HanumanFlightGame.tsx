import React, { useEffect, useRef, useState, useCallback } from 'react';
import './HanumanFlightGame.css';

interface Hanuman {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: number;
    gravity: number;
    jump: number;
    rotation: number;
}

interface Obstacle {
    x: number;
    topHeight: number;
    bottomY: number;
    scored: boolean;
    onFire?: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    color: string;
}

interface Lotus {
    x: number;
    y: number;
    collected: boolean;
}

interface Cloud {
    x: number;
    y: number;
    width: number;
    speed: number;
}

interface BgMountain {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    color: string;
}

interface Star {
    x: number;
    y: number;
    size: number;
    twinkle: number;
}

interface ForestTree {
    x: number;
    width: number;
    height: number;
    speed: number;
}

const HanumanFlightGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(Number(localStorage.getItem('hanumanHighScore')) || 0);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const scoreRef = useRef(0);
    const gameRef = useRef({
        hanuman: {
            x: 80,
            y: 320,
            width: 50,
            height: 50,
            velocity: 0,
            gravity: 0.5,
            jump: -9,
            rotation: 0
        } as Hanuman,
        obstacles: [] as Obstacle[],
        lotuses: [] as Lotus[],
        fireParticles: [] as Particle[],
        clouds: [] as Cloud[],
        bgMountains: [] as BgMountain[],
        stars: [] as Star[],
        forestTrees: [] as ForestTree[],
        frameCount: 0,
        gap: 220,
        obstacleSpeed: 3,
        spawnRate: 110,
        obstacleWidth: 60,
        isGameOver: false,
        isGameStarted: false,
        sunPulse: 0
    });

    // Handle Responsiveness
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
                if (!gameRef.current.isGameStarted) {
                    gameRef.current.hanuman.y = clientHeight / 2;
                }
            }
        };
        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) observer.observe(containerRef.current);
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    useEffect(() => {
        const { width, height } = dimensions;
        // Init clouds
        const clouds: Cloud[] = [];
        for (let i = 0; i < 6; i++) {
            clouds.push({
                x: Math.random() * width,
                y: Math.random() * 300,
                width: 80 + Math.random() * 60,
                speed: 0.1 + Math.random() * 0.1
            });
        }
        gameRef.current.clouds = clouds;

        // Init Stars (Dimmer for dawn)
        const stars: Star[] = [];
        for (let i = 0; i < 20; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.5,
                size: Math.random() * 1.5 + 0.5,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        gameRef.current.stars = stars;

        // Init BG Mountains
        const mountains: BgMountain[] = [];
        for (let i = 0; i < 6; i++) {
            mountains.push({
                x: (width / 2) * i,
                y: height * 0.5,
                width: width * 0.8,
                height: height * 0.55,
                speed: 0.3,
                color: '#4A5D4E' // Misty Forest Green/Grey
            });
        }
        for (let i = 0; i < 6; i++) {
            mountains.push({
                x: (width / 1.5) * i,
                y: height * 0.65,
                width: width * 0.65,
                height: height * 0.45,
                speed: 0.6,
                color: '#2D3A2F' // Darker Jungle Green
            });
        }
        gameRef.current.bgMountains = mountains;

        // Init Forest Trees
        const trees: ForestTree[] = [];
        for (let i = 0; i < 15; i++) {
            trees.push({
                x: Math.random() * width * 2,
                width: 40 + Math.random() * 60,
                height: 100 + Math.random() * 150,
                speed: 1.2 + Math.random() * 0.4
            });
        }
        gameRef.current.forestTrees = trees;
    }, [dimensions]);

    const jump = useCallback(() => {
        if (gameRef.current.isGameStarted && !gameRef.current.isGameOver) {
            gameRef.current.hanuman.velocity = gameRef.current.hanuman.jump;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    const startGame = () => {
        scoreRef.current = 0;
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        
        gameRef.current = {
            ...gameRef.current,
            isGameStarted: true,
            isGameOver: false,
            hanuman: {
                ...gameRef.current.hanuman,
                y: dimensions.height / 2,
                velocity: 0,
                rotation: 0
            },
            obstacles: [],
            lotuses: [],
            fireParticles: [],
            frameCount: 0,
            gap: 220,
            obstacleSpeed: 3,
            spawnRate: 110
        };
    };

    const endGame = useCallback(() => {
        gameRef.current.isGameOver = true;
        gameRef.current.isGameStarted = false;
        setGameOver(true);
        setGameStarted(false);
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('hanumanHighScore', scoreRef.current.toString());
        }
    }, [highScore]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const loop = () => {
            if (gameRef.current.isGameStarted && !gameRef.current.isGameOver) {
                update();
            }
            draw(ctx);
            animationFrameId = requestAnimationFrame(loop);
        };

        const update = () => {
            const state = gameRef.current;
            const { width, height } = dimensions;
            state.frameCount++;
            state.sunPulse = Math.sin(state.frameCount * 0.04) * 6;

            // Update Stars
            state.stars.forEach((s: Star) => {
                s.twinkle += 0.04;
            });

            // Update BG Mountains
            state.bgMountains.forEach((m: BgMountain) => {
                m.x -= m.speed;
                if (m.x + m.width < 0) {
                    m.x = width;
                }
            });

            // Update Forest Trees
            state.forestTrees.forEach((t: ForestTree) => {
                t.x -= t.speed;
                if (t.x + t.width < 0) {
                    t.x = width + Math.random() * 100;
                }
            });

            // Difficulty adjustment
            const currentScore = scoreRef.current;
            state.obstacleSpeed = 3.5 + (currentScore * 0.07);
            state.gap = Math.max(160, 220 - (currentScore * 0.7));

            // Update Hanuman
            state.hanuman.velocity += state.hanuman.gravity;
            state.hanuman.y += state.hanuman.velocity;
            state.hanuman.rotation = Math.min(Math.max(state.hanuman.velocity * 0.04, -0.4), 0.4);

            if (state.hanuman.y + state.hanuman.height > height || state.hanuman.y < 0) {
                endGame();
            }

            // Update clouds
            state.clouds.forEach((cloud: Cloud) => {
                cloud.x -= cloud.speed;
                if (cloud.x + cloud.width < 0) {
                    cloud.x = width;
                    cloud.y = Math.random() * 300;
                }
            });

            // Create obstacles
            if (state.frameCount % state.spawnRate === 0) {
                const minH = 120;
                const maxH = height - state.gap - minH;
                const topH = minH + Math.random() * (maxH - minH);
                state.obstacles.push({
                    x: width,
                    topHeight: topH,
                    bottomY: topH + state.gap,
                    scored: false
                });
                if (Math.random() > 0.4) {
                    state.lotuses.push({
                        x: width + state.obstacleWidth / 2,
                        y: topH + state.gap / 2,
                        collected: false
                    });
                }
            }

            // Update obstacles
            state.obstacles.forEach((obs: Obstacle, index: number) => {
                obs.x -= state.obstacleSpeed;
                if (!obs.scored && obs.x + state.obstacleWidth < state.hanuman.x) {
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                    obs.scored = true;
                    obs.onFire = true;
                    createFireParticles(obs.x, obs.topHeight, obs.bottomY);
                }
                // Collision
                if (state.hanuman.x + state.hanuman.width - 12 > obs.x && 
                    state.hanuman.x + 12 < obs.x + state.obstacleWidth) {
                    if (state.hanuman.y + 12 < obs.topHeight || 
                        state.hanuman.y + state.hanuman.height - 12 > obs.bottomY) {
                        endGame();
                    }
                }
                if (obs.x + state.obstacleWidth < 0) state.obstacles.splice(index, 1);
            });

            // Update particles
            state.fireParticles.forEach((p: Particle, index: number) => {
                p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.size *= 0.95;
                if (p.life <= 0) state.fireParticles.splice(index, 1);
            });

            // Update lotuses
            state.lotuses.forEach((l: Lotus, index: number) => {
                l.x -= state.obstacleSpeed;
                if (!l.collected &&
                    Math.abs(state.hanuman.x + state.hanuman.width/2 - l.x) < 30 &&
                    Math.abs(state.hanuman.y + state.hanuman.height/2 - l.y) < 30) {
                    l.collected = true;
                    scoreRef.current += 5;
                    setScore(scoreRef.current);
                }
                if (l.x < 0) state.lotuses.splice(index, 1);
            });
        };

        const createFireParticles = (x: number, topH: number, botY: number) => {
            const state = gameRef.current;
            for (let i = 0; i < 8; i++) {
                state.fireParticles.push({
                    x: x + Math.random() * state.obstacleWidth,
                    y: topH - 5, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 4 - 2,
                    size: Math.random() * 8 + 4, life: 1, color: '#4ADE80' // Green sparks
                });
                state.fireParticles.push({
                    x: x + Math.random() * state.obstacleWidth,
                    y: botY + 5, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 4 + 2,
                    size: Math.random() * 8 + 4, life: 1, color: '#FCD34D' // Yellow sparks
                });
            }
        };

        const draw = (ctx: CanvasRenderingContext2D) => {
            const state = gameRef.current;
            const { width, height } = dimensions;
            ctx.clearRect(0, 0, width, height);
            
            // Dawn Sky Gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
            skyGrad.addColorStop(0, '#2E1065'); // Deep Night Purple
            skyGrad.addColorStop(0.4, '#701A75'); // Magenta
            skyGrad.addColorStop(0.7, '#F43F5E'); // Rose Orange
            skyGrad.addColorStop(1, '#FBBF24'); // Amber Gold
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, width, height);

            // Rising Sun
            const sunY = height * 0.8;
            const sunX = width * 0.2;
            const sunSize = 70 + state.sunPulse;
            const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunSize * 1.5);
            sunGrad.addColorStop(0, '#FFFBEB');
            sunGrad.addColorStop(0.2, '#FDE68A');
            sunGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
            sunGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunSize * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Dim Twinkling Stars
            state.stars.forEach((s: Star) => {
                ctx.fillStyle = '#FFF';
                ctx.globalAlpha = (Math.sin(s.twinkle) + 1) / 2 * 0.4;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // BG Mountains (Misty Jungle Peaks)
            state.bgMountains.forEach((m: BgMountain) => {
                ctx.fillStyle = m.color;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(m.x, height);
                ctx.lineTo(m.x + m.width / 2, m.y);
                ctx.lineTo(m.x + m.width, height);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // Clouds (Misty Dawn)
            state.clouds.forEach((c: Cloud) => {
                ctx.fillStyle = 'rgba(255, 230, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.width / 3, 0, Math.PI * 2);
                ctx.arc(c.x + c.width / 3, c.y - 12, c.width / 4, 0, Math.PI * 2);
                ctx.arc(c.x + c.width / 2, c.y, c.width / 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Forest Layer (Silhouettes)
            state.forestTrees.forEach((t: ForestTree) => {
                ctx.fillStyle = 'rgba(10, 30, 10, 0.7)';
                ctx.beginPath();
                ctx.moveTo(t.x, height);
                ctx.lineTo(t.x + t.width / 2, height - t.height);
                ctx.lineTo(t.x + t.width, height);
                ctx.fill();
                // Tree Trunk
                ctx.fillStyle = 'rgba(20, 10, 5, 0.8)';
                ctx.fillRect(t.x + t.width / 2 - 5, height - 30, 10, 30);
            });

            // Obstacles - Jungle Spikes
            state.obstacles.forEach((obs: Obstacle) => {
                const w = state.obstacleWidth;
                ctx.shadowBlur = 10;
                ctx.shadowColor = obs.onFire ? 'rgba(74, 222, 128, 0.5)' : 'rgba(0,0,0,0.3)';
                if (obs.topHeight > 0) {
                    ctx.fillStyle = obs.onFire ? '#064E3B' : '#14532D';
                    ctx.beginPath();
                    ctx.moveTo(obs.x, 0); ctx.lineTo(obs.x + w/2, obs.topHeight); ctx.lineTo(obs.x + w, 0); ctx.fill();
                }
                if (obs.bottomY < height) {
                    ctx.fillStyle = obs.onFire ? '#064E3B' : '#14532D';
                    ctx.beginPath();
                    ctx.moveTo(obs.x, height); ctx.lineTo(obs.x + w/2, obs.bottomY); ctx.lineTo(obs.x + w, height); ctx.fill();
                }
                ctx.shadowBlur = 0;
            });

            // Particles
            state.fireParticles.forEach((p: Particle) => {
                ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
            });

            // Lotuses (Water Lily)
            state.lotuses.forEach((l: Lotus) => {
                if (l.collected) return;
                ctx.save(); ctx.translate(l.x, l.y);
                ctx.shadowBlur = 12; ctx.shadowColor = '#F472B6';
                for (let i = 0; i < 8; i++) {
                    ctx.save(); ctx.rotate((Math.PI*2/8)*i); ctx.fillStyle = '#F472B6';
                    ctx.beginPath(); ctx.ellipse(0, -10, 7, 14, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
                }
                ctx.fillStyle = '#FEF3C7'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill(); ctx.restore();
            });

            // Hanuman with Jungle Aura
            const h = state.hanuman;
            ctx.save();
            ctx.translate(h.x + h.width / 2, h.y + h.height / 2);
            ctx.rotate(h.rotation);
            
            // Aura
            const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
            auraGrad.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
            auraGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = auraGrad;
            ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.fill();

            const s = h.width / 40;
            // Tail
            ctx.strokeStyle = '#3F2C23'; ctx.lineWidth = 4*s; ctx.beginPath(); ctx.moveTo(15*s, 0); ctx.quadraticCurveTo(32*s, -16*s, 36*s, -6*s); ctx.stroke();
            // Body
            ctx.fillStyle = '#B45309'; ctx.beginPath(); ctx.ellipse(0, 5*s, 14*s, 18*s, 0, 0, Math.PI*2); ctx.fill();
            // Dhoti (Earthy Yellow)
            ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.moveTo(-14*s, 8*s); ctx.lineTo(14*s, 8*s); ctx.lineTo(10*s, 22*s); ctx.lineTo(-10*s, 22*s); ctx.fill();
            // Gada
            ctx.fillStyle = '#444'; ctx.fillRect(16*s, 11*s, 3.5*s, 22*s);
            ctx.fillStyle = '#92400E'; ctx.beginPath(); ctx.arc(17.5*s, 11*s, 7*s, 0, Math.PI*2); ctx.fill();
            // Head
            ctx.fillStyle = '#78350F'; ctx.beginPath(); ctx.arc(0, -11*s, 17*s, 0, Math.PI*2); ctx.fill();
            // Face
            ctx.fillStyle = '#D97706'; ctx.beginPath(); ctx.ellipse(0, -9*s, 12.5*s, 14*s, 0, 0, Math.PI*2); ctx.fill();
            // Eyes
            ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(-6.5*s, -11*s, 5.5*s, 0, Math.PI*2); ctx.arc(6.5*s, -11*s, 5.5*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-6.5*s, -11*s, 3.5*s, 0, Math.PI*2); ctx.arc(6.5*s, -11*s, 3.5*s, 0, Math.PI*2); ctx.fill();
            // Crown
            ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.moveTo(-12*s, -22*s); ctx.lineTo(0, -32*s); ctx.lineTo(12*s, -22*s); ctx.fill();
            ctx.fillStyle = '#B91C1C'; ctx.beginPath(); ctx.arc(0, -26*s, 3*s, 0, Math.PI*2); ctx.fill();
            // Tilak
            ctx.fillStyle = '#991B1B'; ctx.beginPath(); ctx.ellipse(0, -15*s, 2.5*s, 5*s, 0, 0, Math.PI*2); ctx.fill();
            
            ctx.restore();
        };

        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, endGame]);

    return (
        <div className="game-page-wrapper">
            <div className="game-container" ref={containerRef}>
                <canvas 
                    ref={canvasRef} 
                    width={dimensions.width} 
                    height={dimensions.height}
                    onClick={jump}
                    onTouchStart={(e) => { e.preventDefault(); jump(); }}
                />
                
                <div className="game-ui">
                    <div className="score-display">{score}</div>
                    <div className="high-score-display">Best: {highScore}</div>
                    <button className="close-game-btn" onClick={() => {
                        gameRef.current.isGameStarted = false;
                        gameRef.current.isGameOver = true;
                        onClose();
                    }} title="Close Game">✕</button>
                </div>

                {!gameStarted && !gameOver && (
                    <div className="game-screen start-screen" style={{ pointerEvents: 'auto' }}>
                        <h1>🙏 HANUMAN'S DIVINE FLIGHT</h1>
                        <p className="subtitle">THE LEGEND OF BAL HANUMAN</p>
                        <div className="divider"></div>
                        <div className="story-box">
                            <p>When young Hanuman mistook the sun for a ripe mango, he flew towards it with divine speed!</p>
                            <p style={{ marginTop: '10px' }}>Guide him through the sacred mountains and collect lotuses for extra points.</p>
                        </div>
                        <button className="game-btn primary" onClick={startGame}>Begin Journey</button>
                        <div className="controls-hint">
                            <span>🖱️ Click to Fly</span>
                            <span>⌨️ Space to Jump</span>
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div className="game-screen game-over-screen" style={{ pointerEvents: 'auto' }}>
                        <h1>JAI HANUMAN 🙏</h1>
                        <p className="subtitle">YOUR DIVINE JOURNEY PAUSES</p>
                        <div className="divider"></div>
                        <div className="final-score">Score: {score}</div>
                        <div className="story-box" style={{ marginBottom: '20px' }}>
                            <p>Even the mighty Hanuman rests between adventures. Rise again and surpass your legend!</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="game-btn primary" onClick={startGame}>Rebirth</button>
                            <button className="game-btn secondary" onClick={() => {
                                gameRef.current.isGameStarted = false;
                                gameRef.current.isGameOver = true;
                                onClose();
                            }}>Exit</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HanumanFlightGame;
