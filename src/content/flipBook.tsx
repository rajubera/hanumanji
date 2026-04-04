import { useEffect, useRef } from "react";
import { PageFlip, SizeType } from "page-flip";

const CloseIcon = (props: any) => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="book-close-icon" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    </>
}

interface FlipBookProps { setIsBookOpen: (f: boolean) => void }

const FlipBook = ({ setIsBookOpen }: FlipBookProps) => {
    const bookRef = useRef<HTMLDivElement>(null);
    const pageFlipRef = useRef<PageFlip | null>(null);

    useEffect(() => {
        if (bookRef.current) {
            const pageFlip = new PageFlip(bookRef.current, {
                width: window.innerWidth / 2,   // each page = half screen
                height: window.innerHeight,     // full height
                size: 'stretch' as SizeType,              // stretch to parent container

                drawShadow: false,
                flippingTime: 1000,             // smooth flip
                useMouseEvents: true,
                showCover: false,
                autoSize: true,
                maxShadowOpacity: 0,
                disableFlipByClick: true,
                showPageCorners: true,
                usePortrait: true,
                startZIndex: 2
            });

            pageFlip.loadFromHTML(bookRef.current.querySelectorAll(".page"));
            pageFlipRef.current = pageFlip;
            (window as any)['pageFlip'] = pageFlip;

            // Debug state
            console.log("FlipBook initialized:", pageFlip);
            pageFlip.on('flip', (e) => {
                console.log("Current page:", e, e.data);
            });
            window.addEventListener("resize", () => {
                pageFlip.update();
            });
        }

    }, []);



    const handleNext = () => {
        const pf = pageFlipRef.current;
        if (pf) pf.flipNext();
    };

    const handlePrev = () => {
        const pf = pageFlipRef.current;
        if (pf) pf.flipPrev();
    };

    return (
        <div className="book-narrative-overlay">
            <button className="book-close-btn" onClick={() => setIsBookOpen(false)} aria-label="Close Book">
                <CloseIcon />
            </button>

            {/* Navigation Buttons */}
            <button
                className="book-nav-btn prev-btn"
                onClick={handlePrev}
                aria-label="Previous Page"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
                className="book-nav-btn next-btn"
                onClick={handleNext}
                aria-label="Next Page"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>

            {/* Flipbook container */}
            <div ref={bookRef} className="flip-book-container shadow-xl">
                <div className="page bg-oldpaper p-8">
                    <h1 className="text-2xl font-serif text-red-800 text-center">
                        ॥ ॐ श्री हनुमते नमः ॥
                    </h1>
                    <p className="mt-6 text-lg leading-loose text-gray-900 italic text-center">
                        🌸 “A Home for Devotion, A Space for Peace” 🌸
                    </p>
                    <div className="mt-8 text-gray-900 leading-relaxed text-sm">
                        <p className="mb-4">
                            Welcome to a sanctuary where ancient wisdom meets modern experience. At <strong>Aponiar</strong>, we believe that technology can be a bridge to the divine.
                        </p>
                        <p className="mb-4">
                            Our mission is to craft immersive digital journeys—like <strong>DIVINE FLIGHT</strong>—that inspire, uplift, and bring the stories of our heritage to life for a new generation.
                        </p>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            style={{
                                padding: "10px 24px",
                                background: "var(--hm-safron-linear-bg)",
                                color: "white",
                                fontWeight: "700",
                                borderRadius: "30px",
                                boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
                                cursor: "pointer",
                                fontSize: "14px",
                                border: "none",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                            className="hm-btn"
                            onClick={() => window.open("https://aponiar.com", "_blank")}
                        >
                            🚀 Visit Aponiar
                        </button>
                    </div>
                </div>

                {/* Page 2: The Infinite Leap */}
                <div className="page bg-oldpaper p-8">
                    <h2 className="text-xl font-serif text-red-700 mb-4 border-b border-red-200 pb-2">I. The Infinite Leap</h2>
                    <div className="text-gray-900 leading-relaxed text-sm">
                        <p className="mb-3">
                            Long ago, as the sun rose over the groves of Kishkindha, the young Hanuman looked up and saw a brilliant, glowing fruit in the sky.
                        </p>
                        <p className="mb-3">
                            With a roar that startled the gods, he took a mighty leap—not of mere physical strength, but of pure, innocent devotion.
                        </p>
                        <p>
                            Mistaking the blazing Sun God for a divine fruit, he flew through the celestial spheres, demonstrating the limitless potential of a soul guided by courage.
                        </p>
                    </div>
                </div>

                {/* Page 3: The Mountain Lifter */}
                <div className="page bg-oldpaper p-8 text-sm">
                    <h2 className="text-xl font-serif text-red-700 mb-4 border-b border-red-200 pb-2">II. The Mountain Lifter</h2>
                    <div className="text-gray-900 leading-relaxed">
                        <p className="mb-3">
                            When Lakshmana lay wounded on the battlefield, only the <strong>Sanjeevani</strong> herb from the Dronagiri mountain could save him.
                        </p>
                        <p className="mb-3">
                            Hanuman flew across the horizon to find it, but the mountain was covered in identical-looking plants. Faced with doubt, Hanuman chose the path of total resolution.
                        </p>
                        <p>
                            He lifted the entire mountain on his palm and brought it to Sri Rama, teaching us that when we cannot find the way, we must carry the solution with us.
                        </p>
                    </div>
                </div>

                {/* Page 4: The Burning of Lanka */}
                <div className="page bg-oldpaper p-8 text-sm">
                    <h2 className="text-xl font-serif text-red-700 mb-4 border-b border-red-200 pb-2">III. The Burning of Lanka</h2>
                    <div className="text-gray-900 leading-relaxed">
                        <p className="mb-3 italic text-xs">"Strength is not for destruction, but for the protection of truth."</p>
                        <p className="mb-3">
                            Captured in the golden city of Lanka, Hanuman's tail was set on fire by the arrogant Ravana. But the blaze did not burn him; it became his greatest weapon of liberation.
                        </p>
                        <p>
                            With a mighty roar, he leaped from rooftop to rooftop, turning the city of pride into a city of ash. He showed the world that no fortress is safe from the fire of a pure heart.
                        </p>
                    </div>
                </div>

                {/* Page 5: Divine Devotion (Renumbered) */}
                <div className="page bg-oldpaper p-8 text-sm">
                    <h2 className="text-xl font-serif text-red-700 mb-4 border-b border-red-200 pb-2">IV. The Soul of Devotion</h2>
                    <div className="text-gray-900 leading-relaxed">
                        <p className="mb-3">
                            When asked where Sri Rama resided, Hanuman did not point to a temple or a book. Instead, he tore open his chest with his claws.
                        </p>
                        <p className="mb-3">
                            There, etched into his very heart, were the images of Rama and Sita.
                        </p>
                        <p>
                            This act revealed the true nature of <strong>Bhakti</strong>: that the divine is not found in the external world, but is the very fabric of our being when we surrender in love.
                        </p>
                    </div>
                </div>

                {/* Page 6: The Eternal Protector (Renumbered) */}
                <div className="page bg-oldpaper p-8 text-sm">
                    <h2 className="text-xl font-serif text-red-700 mb-4 border-b border-red-200 pb-2">V. The Eternal Protector</h2>
                    <div className="text-gray-900 leading-relaxed">
                        <p className="mb-3">
                            Blessed as a <strong>Chiranjeevi</strong> (Immortal), Hanuman resides among us even today. He is the guardian of the threshold, the dissipater of fear.
                        </p>
                        <p className="mb-3">
                            Wherever the name of Rama is chanted, Hanuman is present—the first to arrive and the last to leave.
                        </p>
                        <p className="italic font-bold text-red-800 text-center mt-4">
                            "Where there is devotion, there is Hanuman. Where there is Hanuman, there is victory."
                        </p>
                    </div>
                </div>

                {/* Page 6: Gratitude */}
                <div className="page bg-oldpaper p-8 text-center flex flex-col justify-center">
                    <h2 className="text-2xl font-serif text-red-700 mb-6 italic">Gratitude</h2>
                    <p className="text-gray-900 leading-loose text-sm italic">
                        "Jai Shri Ram"
                    </p>
                    <p className="mt-6 text-gray-900 text-xs">
                        Aponiar © 2024
                    </p>
                    <p className="mt-8 text-gray-400 text-xs tracking-widest uppercase">
                        Exploring the Infinite
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlipBook;
