import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    WhatsappShareButton,
    TwitterShareButton,
    FacebookShareButton,
    EmailShareButton,
    LinkedinShareButton,
    WhatsappIcon,
    TwitterIcon,
    FacebookIcon,
    EmailIcon,
    LinkedinIcon
} from 'react-share';
import html2canvas from 'html2canvas';
import './HanumanFlightGame.css';
import hanumanImg from '../assets/images/hanumanji-flying.png';

interface Hanuman {
    x: number; y: number; width: number; height: number;
    velocity: number; gravity: number; jump: number; rotation: number;
}

interface Obstacle {
    x: number; topHeight: number; bottomY: number; scored: boolean;
    onFire?: boolean;
}

interface Particle {
    x: number; y: number; vx: number; vy: number; size: number;
    life: number; color: string;
}

interface Lotus {
    x: number; y: number; collected: boolean;
    type?: 'mantra_om' | 'mantra_ram' | 'lotus' | 'hibiscus' | 'jasmine';
}

interface Cloud {
    x: number; y: number; width: number; speed: number;
}

interface BgMountain {
    x: number; y: number; width: number; height: number;
    speed: number; color: string;
}

interface Star {
    x: number; y: number; size: number; twinkle: number;
}

interface ForestTree {
    x: number; width: number; height: number; speed: number;
}

interface Wildlife {
    x: number; y: number; speed: number; size: number; wingPhase: number;
}

interface EnvParticle {
    x: number; y: number; vx: number; vy: number; size: number;
    alpha: number; pulse: number;
}

interface GroundSegment {
    x: number; y: number; width: number; height: number; type: 'rock' | 'foliage' | 'slope';
}

interface WindLine {
    x: number; y: number; length: number; speed: number;
}

interface ForegroundLeaf {
    x: number; y: number; size: number; speed: number; angle: number;
}

const HanumanFlightGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [mantraCount, setMantraCount] = useState(0);
    const [flowerCount, setFlowerCount] = useState(0);
    const [isFlying, setIsFlying] = useState(false);
    const [highScore, setHighScore] = useState(Number(localStorage.getItem('hanumanHighScore')) || 0);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const scoreRef = useRef(0);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const isSharingRef = useRef(false);
    const hanumanImgRef = useRef<HTMLImageElement | null>(null);

    // Load Hanuman Asset
    useEffect(() => {
        const img = new Image();
        img.src = hanumanImg;
        img.onload = () => { hanumanImgRef.current = img; };
    }, []);

    const playBell = useCallback((freq: number) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
        } catch (e) { /* Audio Context fallback */ }
    }, []);

    const handleShareImage = async () => {
        if (isSharingRef.current) return;
        isSharingRef.current = true;

        const element = document.querySelector('.end-screen-content') as HTMLElement;
        if (!element) {
            alert("Could not find the score screen content.");
            isSharingRef.current = false;
            return;
        }

        try {
            // Capture the element as a high-res image with a custom background
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                useCORS: true,
                scale: 3, // Premium quality
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.querySelector('.end-screen-content') as HTMLElement;
                    if (el) {
                        // Create a beautiful "Card" look for the shared image
                        el.style.width = '550px';
                        el.style.height = 'auto';
                        el.style.padding = '80px 40px';
                        el.style.margin = '0 auto';
                        el.style.borderRadius = '0';
                        el.style.border = '10px solid rgba(251, 191, 36, 0.3)';
                        el.style.boxShadow = 'none';
                        el.style.display = 'flex';
                        el.style.flexDirection = 'column';
                        el.style.alignItems = 'center';
                        el.style.justifyContent = 'center';

                        // Signature Cinematic Gradient Background
                        el.style.background = 'linear-gradient(180deg, #1E1B4B 0%, #4C1D95 35%, #BE123C 75%, #F59E0B 100%)';

                        // Ensure all text elements are white and have high contrast
                        const allText = el.querySelectorAll('span, p, h1, h2, div');
                        allText.forEach(t => {
                            (t as HTMLElement).style.color = '#FFFFFF';
                            (t as HTMLElement).style.textShadow = '0 6px 15px rgba(0,0,0,0.9)';
                            (t as HTMLElement).style.opacity = '1';
                        });

                        // Hide the share icons from the screenshot itself as it looks meta/cluttered
                        const icons = el.querySelector('.social-share-group');
                        if (icons) (icons as HTMLElement).style.display = 'none';

                        // Add a title prefix if missing
                        const title = el.querySelector('h2');
                        if (title) title.innerText = "🚩 DIVINE BLESSING 🚩";
                    }
                }
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    isSharingRef.current = false;
                    return;
                }
                const file = new File([blob], 'HanumanBlessing.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: "Hanuman's Divine Flight Blessing",
                            text: `I just completed a divine journey with Hanuman ji! 🚩\nJourney Score: ${scoreRef.current} | ॐ Mantras: ${mantraCount} | 🌸 Blossoms: ${flowerCount}\nExperience the aura: ${window.location.origin}`
                        });
                    } catch (err) {
                        if ((err as Error).name !== 'AbortError') {
                            console.error('Sharing failed', err);
                        }
                    }
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'HanumanBlessing.png';
                    a.click();
                    URL.revokeObjectURL(url);
                    alert('Divine Blessing Card downloaded! Now you can share it manually. 🙏🚩');
                }
                isSharingRef.current = false;
            }, 'image/png', 1.0);
        } catch (err) {
            console.error('Screenshot failed', err);
            isSharingRef.current = false;
            alert("Failed to capture the blessing card. Please try again.");
        }
    };

    const gameRef = useRef({
        hanuman: {
            x: 80, y: 320, width: 110, height: 70,
            velocity: 0, gravity: 0.45, jump: -8.0, rotation: 0
        } as Hanuman,
        obstacles: [] as Obstacle[],
        lotuses: [] as Lotus[],
        fireParticles: [] as Particle[],
        clouds: [] as Cloud[],
        bgMountains: [] as BgMountain[],
        stars: [] as Star[],
        forestTrees: [] as ForestTree[],
        wildlife: [] as Wildlife[],
        envParticles: [] as EnvParticle[],
        groundSegments: [] as GroundSegment[],
        windLines: [] as WindLine[],
        foregroundLeaves: [] as ForegroundLeaf[],
        frameCount: 0,
        gap: 300,
        obstacleSpeed: 3,
        spawnRate: 110,
        obstacleWidth: 60,
        isGameOver: false,
        isGameStarted: false,
        isFlying: false,
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
                x: Math.random() * width, y: Math.random() * 300,
                width: 80 + Math.random() * 60, speed: 0.1 + Math.random() * 0.1
            });
        }
        gameRef.current.clouds = clouds;

        // Init Stars
        const stars: Star[] = [];
        for (let i = 0; i < 20; i++) {
            stars.push({
                x: Math.random() * width, y: Math.random() * height * 0.5,
                size: Math.random() * 1.5 + 0.5, twinkle: Math.random() * Math.PI * 2
            });
        }
        gameRef.current.stars = stars;

        // Init BG Mountains
        const mountains: BgMountain[] = [];
        for (let i = 0; i < 6; i++) {
            mountains.push({
                x: (width / 2) * i, y: height * 0.5, width: width * 0.8,
                height: height * 0.55, speed: 0.3, color: '#4A5D4E'
            });
        }
        for (let i = 0; i < 6; i++) {
            mountains.push({
                x: (width / 1.5) * i, y: height * 0.65, width: width * 0.65,
                height: height * 0.45, speed: 0.6, color: '#2D3A2F'
            });
        }
        gameRef.current.bgMountains = mountains;

        // Init Forest Trees
        const trees: ForestTree[] = [];
        for (let i = 0; i < 15; i++) {
            trees.push({
                x: Math.random() * width * 2, width: 40 + Math.random() * 60,
                height: 100 + Math.random() * 150, speed: 1.2 + Math.random() * 0.4
            });
        }
        gameRef.current.forestTrees = trees;

        // Init Ground (Fast Parallax)
        const groundSegs: GroundSegment[] = [];
        const segCount = 20; const segWidth = width / 10;
        const types: ('rock' | 'foliage' | 'slope')[] = ['rock', 'foliage', 'slope'];
        for (let i = 0; i < segCount; i++) {
            groundSegs.push({
                x: i * segWidth, y: height * 0.88, width: segWidth + 20,
                height: 30 + Math.random() * 50,
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
        gameRef.current.groundSegments = groundSegs;

        // Init Wind Lines
        const lines: WindLine[] = [];
        for (let i = 0; i < 15; i++) {
            lines.push({
                x: Math.random() * width, y: Math.random() * height,
                length: 20 + Math.random() * 80, speed: 15 + Math.random() * 10
            });
        }
        gameRef.current.windLines = lines;

        // Init Foreground Leaves (Very Fast)
        const leaves: ForegroundLeaf[] = [];
        for (let i = 0; i < 12; i++) {
            leaves.push({
                x: Math.random() * width, y: height - 20 - Math.random() * 100,
                size: 20 + Math.random() * 40, speed: 25 + Math.random() * 15,
                angle: Math.random() * Math.PI * 2
            });
        }
        gameRef.current.foregroundLeaves = leaves;

        // Init Wildlife
        const birds: Wildlife[] = [];
        for (let i = 0; i < 5; i++) {
            birds.push({
                x: Math.random() * width, y: 50 + Math.random() * 150,
                speed: 1 + Math.random() * 1.5, size: 3 + Math.random() * 3,
                wingPhase: Math.random() * Math.PI * 2
            });
        }
        gameRef.current.wildlife = birds;

        // Init Env Particles
        const envP: EnvParticle[] = [];
        for (let i = 0; i < 30; i++) {
            envP.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1, vy: (Math.random() - 0.5) * 1,
                size: 1 + Math.random() * 2, alpha: 0.2 + Math.random() * 0.5,
                pulse: Math.random() * Math.PI * 2
            });
        }
        gameRef.current.envParticles = envP;
    }, [dimensions]);

    const jump = useCallback(() => {
        if (gameRef.current.isGameStarted && !gameRef.current.isGameOver) {
            setIsFlying(true);
            gameRef.current.isFlying = true;
            gameRef.current.hanuman.velocity = gameRef.current.hanuman.jump;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') { e.preventDefault(); jump(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    const startGame = () => {
        setGameStarted(true); setGameOver(false); setScore(0); setIsFlying(false);
        setMantraCount(0); setFlowerCount(0);
        scoreRef.current = 0;
        gameRef.current = {
            ...gameRef.current,
            isGameStarted: true, isGameOver: false, isFlying: false,
            hanuman: {
                ...gameRef.current.hanuman, y: dimensions.height / 2, velocity: 0, rotation: 0
            },
            obstacles: [], lotuses: [], fireParticles: [], frameCount: 0,
            gap: 300, obstacleSpeed: 3, spawnRate: 110
        };
    };

    const endGame = useCallback(() => {
        gameRef.current.isGameOver = true;
        setGameOver(true);
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('hanumanHighScore', scoreRef.current.toString());
        }
    }, [highScore]);


    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        let animationFrameId: number;

        const createFireParticles = (x: number, topH: number, botY: number) => {
            const state = gameRef.current;
            for (let i = 0; i < 8; i++) {
                state.fireParticles.push({
                    x: x + Math.random() * state.obstacleWidth, y: topH - 5,
                    vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 4 - 2,
                    size: Math.random() * 8 + 4, life: 1, color: '#4ADE80'
                });
                state.fireParticles.push({
                    x: x + Math.random() * state.obstacleWidth, y: botY + 5,
                    vx: (Math.random() - 0.5) * 3, vy: Math.random() * 4 + 2,
                    size: Math.random() * 8 + 4, life: 1, color: '#FCD34D'
                });
            }
        };

        const loop = () => {
            update();
            draw(ctx);
            animationFrameId = requestAnimationFrame(loop);
        };

        const update = () => {
            const state = gameRef.current;
            const { width, height } = dimensions;
            state.frameCount++;
            state.sunPulse = Math.sin(state.frameCount * 0.04) * 6;
            const globalSpeed = state.isGameStarted && !state.isGameOver && state.isFlying ? state.obstacleSpeed : 1.5;

            state.windLines.forEach((w) => {
                w.x -= w.speed;
                if (w.x + w.length < 0) { w.x = width + 200; w.y = Math.random() * height; }
            });

            state.foregroundLeaves.forEach((l) => {
                l.x -= l.speed; l.angle += 0.05;
                if (l.x + l.size < 0) { l.x = width + 100; l.y = height - 20 - Math.random() * 100; }
            });

            state.wildlife.forEach((b) => {
                b.x -= b.speed + (globalSpeed * 0.2); b.wingPhase += 0.15;
                if (b.x + 100 < 0) { b.x = width + 100; b.y = 50 + Math.random() * 200; }
            });

            state.envParticles.forEach((p) => {
                p.x -= 0.5 + p.vx + (globalSpeed * 0.5); p.y += p.vy; p.pulse += 0.05;
                if (p.x < 0) p.x = width; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
            });

            state.groundSegments.forEach((seg) => {
                seg.x -= globalSpeed * 2.2;
                if (seg.x + seg.width < 0) {
                    seg.x = width; seg.height = 30 + Math.random() * 50;
                    seg.type = (['rock', 'foliage', 'slope'] as const)[Math.floor(Math.random() * 3)];
                }
            });

            if (!state.isGameStarted || state.isGameOver || !state.isFlying) return;

            state.stars.forEach((s) => { s.twinkle += 0.04; });
            state.bgMountains.forEach((m) => { m.x -= m.speed; if (m.x + m.width < 0) m.x = width; });
            state.forestTrees.forEach((t) => {
                t.x -= t.speed; if (t.x + t.width < 0) t.x = width + Math.random() * 100;
            });

            const currentScore = scoreRef.current;
            state.obstacleSpeed = 3.5 + (currentScore * 0.07);
            state.gap = Math.max(160, 220 - (currentScore * 0.7));

            state.hanuman.velocity += state.hanuman.gravity;
            state.hanuman.y += state.hanuman.velocity;
            state.hanuman.rotation = Math.min(Math.max(state.hanuman.velocity * 0.04, -0.4), 0.4);

            if (state.hanuman.y + state.hanuman.height > height * 0.95 || state.hanuman.y < 0) endGame();

            state.clouds.forEach((cloud) => {
                cloud.x -= cloud.speed + (globalSpeed * 0.1);
                if (cloud.x + cloud.width < 0) { cloud.x = width; cloud.y = Math.random() * 300; }
            });

            if (state.frameCount % state.spawnRate === 0) {
                const minH = 120; const maxH = height - state.gap - minH;
                const topH = minH + Math.random() * (maxH - minH);
                state.obstacles.push({ x: width, topHeight: topH, bottomY: topH + state.gap, scored: false });
                if (Math.random() > 0.4) {
                    const types = ['mantra_om', 'lotus', 'hibiscus', 'jasmine'] as const;
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    state.lotuses.push({
                        x: width + state.obstacleWidth / 2,
                        y: topH + state.gap / 2,
                        collected: false,
                        type: randomType
                    });
                }
            }

            state.obstacles.forEach((obs, index) => {
                obs.x -= state.obstacleSpeed;
                if (!obs.scored && obs.x + state.obstacleWidth < state.hanuman.x) {
                    scoreRef.current += 1; setScore(scoreRef.current);
                    obs.scored = true; obs.onFire = true;
                    createFireParticles(obs.x, obs.topHeight, obs.bottomY);
                }
                if (state.hanuman.x + state.hanuman.width - 12 > obs.x &&
                    state.hanuman.x + 12 < obs.x + state.obstacleWidth) {
                    if (state.hanuman.y + 12 < obs.topHeight ||
                        state.hanuman.y + state.hanuman.height - 12 > obs.bottomY) endGame();
                }
                if (obs.x + state.obstacleWidth < 0) state.obstacles.splice(index, 1);
            });

            state.fireParticles.forEach((p, index) => {
                p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.size *= 0.95;
                if (p.life <= 0) state.fireParticles.splice(index, 1);
            });

            state.lotuses.forEach((l, index) => {
                l.x -= state.obstacleSpeed;
                if (!l.collected &&
                    Math.abs(state.hanuman.x + state.hanuman.width / 2 - l.x) < 35 &&
                    Math.abs(state.hanuman.y + state.hanuman.height / 2 - l.y) < 35) {
                    l.collected = true;
                    scoreRef.current += 5; setScore(scoreRef.current);
                    if (l.type?.startsWith('mantra')) {
                        setMantraCount(prev => prev + 1); playBell(660);
                    } else {
                        setFlowerCount(prev => prev + 1); playBell(1100);
                    }
                }
                if (l.x < -100) state.lotuses.splice(index, 1);
            });
        };

        const draw = (ctx: CanvasRenderingContext2D) => {
            const state = gameRef.current;
            const { width, height } = dimensions;
            const waterHeight = height * 0.12;
            const waterY = height - waterHeight;

            ctx.clearRect(0, 0, width, height);

            const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
            skyGrad.addColorStop(0, '#1E1B4B'); skyGrad.addColorStop(0.3, '#312E81');
            skyGrad.addColorStop(0.6, '#4C1D95'); skyGrad.addColorStop(0.85, '#BE123C');
            skyGrad.addColorStop(1, '#F59E0B');
            ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = 'rgba(30, 58, 138, 0.3)'; ctx.fillRect(0, waterY, width, waterHeight);
            for (let i = 0; i < 5; i++) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
                const rippleY = waterY + (waterHeight / 6) * i;
                const rippleW = (width * 0.6) + Math.sin(state.frameCount * 0.02 + i) * 100;
                ctx.fillRect((width - rippleW) / 2, rippleY, rippleW, 2);
            }

            const sunY = height * 0.88; const sunX = width * 0.15; const sunSize = 60 + state.sunPulse;
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i + (state.frameCount * 0.001);
                const rayW = 40 + Math.sin(state.frameCount * 0.01 + i) * 20;
                ctx.save(); ctx.translate(sunX, sunY); ctx.rotate(angle);
                const rayGrad = ctx.createLinearGradient(0, 0, 0, 600);
                rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.2)'); rayGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = rayGrad; ctx.beginPath();
                ctx.moveTo(-rayW, 0); ctx.lineTo(rayW, 0); ctx.lineTo(rayW * 3, 600); ctx.lineTo(-rayW * 3, 600);
                ctx.fill(); ctx.restore();
            }

            const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunSize * 2);
            sunGrad.addColorStop(0, '#FFFBEB'); sunGrad.addColorStop(0.2, '#FEF3C7');
            sunGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.5)'); sunGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(sunX, sunY, sunSize * 2, 0, Math.PI * 2); ctx.fill();

            state.stars.forEach((s) => {
                ctx.fillStyle = '#FFF'; ctx.globalAlpha = (Math.sin(s.twinkle) + 1) / 2 * 0.35;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
            });

            state.bgMountains.forEach((m) => {
                ctx.fillStyle = m.color; ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.moveTo(m.x, waterY); ctx.lineTo(m.x + m.width / 2, m.y); ctx.lineTo(m.x + m.width, waterY); ctx.fill(); ctx.globalAlpha = 1;
            });

            state.wildlife.forEach((b) => {
                ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5;
                const wingY = Math.sin(b.wingPhase) * b.size; ctx.beginPath();
                ctx.moveTo(b.x - b.size, b.y + wingY); ctx.quadraticCurveTo(b.x, b.y - b.size, b.x + b.size, b.y + wingY); ctx.stroke();
            });

            state.clouds.forEach((c) => {
                ctx.fillStyle = 'rgba(255, 230, 255, 0.25)'; ctx.beginPath();
                ctx.arc(c.x, c.y, c.width / 3, 0, Math.PI * 2); ctx.fill();
            });

            state.forestTrees.forEach((t) => {
                ctx.fillStyle = 'rgba(10, 30, 10, 0.6)'; ctx.beginPath();
                ctx.moveTo(t.x, waterY); ctx.lineTo(t.x + t.width / 2, waterY - t.height); ctx.lineTo(t.x + t.width, waterY); ctx.fill();
            });

            state.windLines.forEach((w) => {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; ctx.lineWidth = 1; ctx.beginPath();
                ctx.moveTo(w.x, w.y); ctx.lineTo(w.x + w.length, w.y); ctx.stroke();
            });

            state.groundSegments.forEach((seg) => {
                const gGrad = ctx.createLinearGradient(seg.x, seg.y, seg.x, height);
                gGrad.addColorStop(0, seg.type === 'rock' ? '#111827' : '#064E3B');
                gGrad.addColorStop(1, '#022C22'); ctx.fillStyle = gGrad; ctx.beginPath();
                ctx.moveTo(seg.x, waterY);
                if (seg.type === 'slope') {
                    ctx.lineTo(seg.x + seg.width, waterY - seg.height);
                } else if (seg.type === 'rock') {
                    ctx.lineTo(seg.x + seg.width / 4, waterY - seg.height * 0.8);
                    ctx.lineTo(seg.x + seg.width / 2, waterY - seg.height);
                    ctx.lineTo(seg.x + (seg.width * 3) / 4, waterY - seg.height * 0.7);
                    ctx.lineTo(seg.x + seg.width, waterY);
                } else {
                    ctx.quadraticCurveTo(seg.x + seg.width / 2, waterY - seg.height, seg.x + seg.width, waterY);
                }
                ctx.lineTo(seg.x + seg.width, height); ctx.lineTo(seg.x, height); ctx.fill();

                if (seg.type === 'foliage') {
                    ctx.strokeStyle = 'rgba(6, 78, 59, 0.8)'; ctx.lineWidth = 2;
                    for (let j = 0; j < 3; j++) {
                        const vineX = seg.x + (seg.width / 4) * (j + 1);
                        ctx.beginPath(); ctx.moveTo(vineX, waterY - seg.height / 2);
                        ctx.bezierCurveTo(vineX - 20, waterY, vineX + 20, waterY + 40, vineX, waterY + 60);
                        ctx.stroke();
                    }
                }
            });

            state.foregroundLeaves.forEach((l) => {
                ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.angle);
                ctx.fillStyle = 'rgba(6, 78, 59, 0.4)'; ctx.filter = 'blur(4px)';
                ctx.beginPath(); ctx.ellipse(0, 0, l.size, l.size / 2.5, 0, 0, Math.PI * 2); ctx.fill();
                ctx.restore(); ctx.filter = 'none';
            });

            state.envParticles.forEach((p) => {
                const alpha = (Math.sin(p.pulse) + 1.2) / 2.2 * p.alpha;
                ctx.fillStyle = '#FBFA8A'; ctx.globalAlpha = alpha;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
            });

            // Simplified Stone Monoliths (Grounded & Clean)
            state.obstacles.forEach((obs) => {
                const w = state.obstacleWidth;
                const stoneColor = obs.onFire ? '#064E3B' : '#2D3A2F';
                const shadowColor = obs.onFire ? 'rgba(74, 222, 128, 0.3)' : 'rgba(0,0,0,0.3)';
                const highlightColor = 'rgba(255, 255, 255, 0.05)';

                // 1. Top Monolith (Hanging from ceiling)
                if (obs.topHeight > 0) {
                    ctx.save();
                    ctx.shadowBlur = 10; ctx.shadowColor = shadowColor;
                    ctx.fillStyle = stoneColor;
                    ctx.beginPath(); ctx.moveTo(obs.x - 2, 0); ctx.lineTo(obs.x + w + 2, 0);
                    ctx.lineTo(obs.x + w * 0.8, obs.topHeight);
                    ctx.lineTo(obs.x + w * 0.2, obs.topHeight);
                    ctx.closePath(); ctx.fill();

                    // Simple Highlight
                    ctx.strokeStyle = highlightColor; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(obs.x + w * 0.2, obs.topHeight);
                    ctx.lineTo(obs.x - 2, 0); ctx.stroke();
                    ctx.restore();
                }

                // 2. Bottom Monolith (Starting from Bottom of screen)
                if (obs.bottomY < height) {
                    ctx.save();
                    ctx.shadowBlur = 12; ctx.shadowColor = shadowColor;
                    ctx.fillStyle = stoneColor;
                    // Rise from absolute bottom
                    ctx.beginPath(); ctx.moveTo(obs.x - 5, height);
                    ctx.lineTo(obs.x + w + 5, height);
                    ctx.lineTo(obs.x + w * 0.7, obs.bottomY);
                    ctx.lineTo(obs.x + w * 0.3, obs.bottomY);
                    ctx.closePath(); ctx.fill();

                    // Simple Vertical Highlights
                    ctx.strokeStyle = highlightColor; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(obs.x + w * 0.3, obs.bottomY);
                    ctx.lineTo(obs.x - 5, height); ctx.stroke();
                    ctx.restore();
                }
            });

            state.fireParticles.forEach((p) => {
                ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
            });

            // Divine Blessings (Diverse Types)
            state.lotuses.forEach((l) => {
                if (l.collected) return;
                ctx.save(); ctx.translate(l.x, l.y);
                const pulse = (Math.sin(state.frameCount * 0.08) + 1) / 2;
                const type = l.type || 'om';

                // Blessing Aura with Type-Specific Color
                const auraColor = type.startsWith('mantra') ? 'rgba(251, 191, 36, 0.4)' :
                    type === 'hibiscus' ? 'rgba(239, 68, 68, 0.35)' :
                        type === 'jasmine' ? 'rgba(255, 255, 255, 0.4)' :
                            'rgba(244, 114, 182, 0.35)'; // Default Pink

                const bGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 32 + pulse * 12);
                bGrad.addColorStop(0, auraColor); bGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = bGrad; ctx.beginPath(); ctx.arc(0, 0, 32 + pulse * 12, 0, Math.PI * 2); ctx.fill();

                if (type.startsWith('mantra')) {
                    ctx.fillStyle = '#FFFBEB'; ctx.shadowBlur = 15; ctx.shadowColor = '#F59E0B';
                    ctx.font = 'bold 28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(type === 'mantra_ram' ? 'राम' : 'ॐ', 0, Math.sin(state.frameCount * 0.06) * 10);
                } else {
                    // Render Flowers
                    const color = type === 'hibiscus' ? '#EF4444' : type === 'jasmine' ? '#FEF3C7' : '#F472B6';
                    ctx.fillStyle = color; ctx.shadowBlur = 12; ctx.shadowColor = color;
                    for (let i = 0; i < (type === 'hibiscus' ? 5 : 8); i++) {
                        ctx.save(); ctx.rotate((Math.PI * 2 / (type === 'hibiscus' ? 5 : 8)) * i);
                        ctx.beginPath(); ctx.ellipse(0, -12, 8, type === 'jasmine' ? 18 : 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                    }
                    ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();
            });

            const h = state.hanuman;
            ctx.save();
            ctx.translate(h.x + h.width / 2, h.y + h.height / 2);
            ctx.rotate(h.rotation);

            if (hanumanImgRef.current) {
                // Drawing the high-quality flying asset
                ctx.drawImage(
                    hanumanImgRef.current,
                    -h.width / 2,
                    -h.height / 2,
                    h.width,
                    h.height
                );
            } else {
                // Fallback procedural drawing
                const s = h.width / 40;
                ctx.strokeStyle = '#3F2C23'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(15 * s, 0); ctx.quadraticCurveTo(32 * s, -16 * s, 36 * s, -6 * s); ctx.stroke();
                ctx.fillStyle = '#B45309'; ctx.beginPath(); ctx.ellipse(0, 5 * s, 14 * s, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.moveTo(-14 * s, 8 * s); ctx.lineTo(14 * s, 8 * s); ctx.lineTo(10 * s, 22 * s); ctx.lineTo(-10 * s, 22 * s); ctx.fill();
            }
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
                    <div className="collection-counters">
                        <div className="counter-item">ॐ {mantraCount}</div>
                        <div className="counter-item">🌸 {flowerCount}</div>
                    </div>
                    <div className="high-score-display">Best: {highScore}</div>
                    <button className="close-game-btn" onClick={() => {
                        gameRef.current.isGameStarted = false;
                        gameRef.current.isGameOver = true;
                        onClose();
                    }} title="Close Game">✕</button>
                </div>

                {gameStarted && !gameOver && !isFlying && (
                    <div className="tap-to-start-overlay">
                        <div className="tap-hint-box">
                            <span className="tap-icon">👆</span>
                            <p>TAP OR SPACE TO FLY</p>
                        </div>
                    </div>
                )}

                {!gameStarted && !gameOver && (
                    <div className="game-screen start-screen" style={{ pointerEvents: 'auto' }}>
                        <h1>🙏 DIVINE FLIGHT 🙏</h1>
                        <p className="subtitle">THE LEGEND OF BAL HANUMAN</p>
                        <div className="divider"></div>
                        <div className="story-box">
                            <p>When young Hanuman mistook the sun for a ripe mango, he flew towards it with divine speed!</p>
                            <p style={{ marginTop: '10px' }}>Guide him through the sacred mountains and collect lotuses for extra points.</p>
                        </div>
                        <button className="game-btn primary main-start-btn" onClick={startGame}>Begin Journey</button>
                        <button className="game-exit-link" onClick={onClose}>← Back to Aura</button>
                        <div className="controls-hint">
                            <span>🖱️ Click to Fly</span>
                            <span>⌨️ Space to Jump</span>
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div className="game-screen game-over-screen jayanti-end-screen" style={{ pointerEvents: 'auto' }}>
                        <div className="jayanti-clouds"></div>
                        <div className="jayanti-rays"></div>
                        <div className="jayanti-sparkles"></div>
                        <div className="jayanti-birds"></div>
                        <div className="jayanti-sun"></div>
                        <div className="guardian-mandir left"></div>
                        <div className="guardian-mandir right"></div>
                        <div className="jayanti-water"></div>

                        <div className="end-screen-content">
                            <img src={hanumanImg} alt="Hanumanji" className="game-over-hanuman-icon" />
                            <h1 className="jayanti-greeting">JAI HANUMAN 🙏</h1>

                            <div className="score-focus">
                                <span className="label">Journey Score</span>
                                <span className="value">{score}</span>
                            </div>

                            <div className="stats-text-only">
                                <span>ॐ Mantras: {mantraCount}</span>
                                <span>🌸 Flowers: {flowerCount}</span>
                                <span>🏆 Best: {highScore}</span>
                            </div>

                            <div className="end-screen-actions">
                                <div className="social-share-group">
                                    <WhatsappShareButton
                                        url={window.location.href}
                                        title={`I just completed a divine journey with Hanuman ji! 🚩\nScore: ${score} | ॐ Mantras: ${mantraCount} | 🌸 Blossoms: ${flowerCount}\n\nExperience the flight here: `}
                                        separator=" "
                                    >
                                        <WhatsappIcon size={40} round />
                                    </WhatsappShareButton>

                                    <TwitterShareButton
                                        url={window.location.href}
                                        title={`I just completed a divine journey with Hanuman ji! 🚩\nScore: ${score} | ॐ Mantras: ${mantraCount} | 🌸 Blossoms: ${flowerCount}\n\nExperience the flight #HanumanFlight #Divine`}
                                    >
                                        <TwitterIcon size={40} round />
                                    </TwitterShareButton>

                                    <FacebookShareButton
                                        url={window.location.href}
                                        hashtag="#HanumanFlight"
                                    >
                                        <FacebookIcon size={40} round />
                                    </FacebookShareButton>

                                    <EmailShareButton
                                        url={window.location.href}
                                        subject="Hanuman's Divine Flight - My High Score!"
                                        body={`I just completed a divine journey with Hanuman ji! 🚩\n\nMy Stats:\n- Journey Score: ${score}\n- ॐ Mantras: ${mantraCount}\n- 🌸 Blossoms: ${flowerCount}\n\nExperience the flight here: `}
                                    >
                                        <EmailIcon size={40} round />
                                    </EmailShareButton>

                                    <LinkedinShareButton
                                        url={window.location.href}
                                        title="Hanuman's Divine Flight - My High Score!"
                                        summary={`I just completed a divine journey with Hanuman ji! 🚩\nScore: ${score} | ॐ Mantras: ${mantraCount} | 🌸 Blossoms: ${flowerCount}`}
                                        source="Hanuman's Divine Flight"
                                    >
                                        <LinkedinIcon size={40} round />
                                    </LinkedinShareButton>

                                    <button className="share-screenshot-btn" onClick={handleShareImage} title="Download/Share Blessing Card">
                                        <span className="camera-icon">📸</span>
                                    </button>
                                </div>
                                <div className="button-group">
                                    <button className="game-btn primary" onClick={startGame}>Replay</button>
                                    <button className="game-btn secondary" onClick={() => {
                                        gameRef.current.isGameStarted = false;
                                        gameRef.current.isGameOver = true;
                                        onClose();
                                    }}>Exit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HanumanFlightGame;
