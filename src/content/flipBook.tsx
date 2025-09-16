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
                disableFlipByClick: true

            });

            pageFlip.loadFromHTML(document.querySelectorAll(".page"));
            pageFlipRef.current = pageFlip;
            window.addEventListener("resize", () => {
                // pageFlip.upda({
                //     width: window.innerWidth / 2,
                //     height: window.innerHeight,
                // });
            });
        }

    }, []);



    return (
        <div className="relative flex flex-col items-center flip-book">
            <CloseIcon onClick={() => setIsBookOpen(false)}></CloseIcon>

            {/* Flipbook container */}
            <div ref={bookRef} className="flip-book shadow-xl">
                <div className="page bg-oldpaper p-8">
                    <h1 className="text-2xl font-serif text-red-800 text-center">
                        ॥ ॐ श्री हनुमते नमः ॥
                    </h1>
                    <p className="mt-6 text-lg leading-loose text-gray-900">
                        🌸 “A Home for Devotion, A Space for Peace” 🌸
                    </p>
                    <p className="mt-6 text-lg leading-loose text-gray-900">
                        🙏 Join us in building a sacred Mandir for our community
                    </p>
                    <p className="mt-6 text-lg leading-loose text-gray-900">
                        <button
                            style={{
                                padding: "12px 28px",
                                background: "var(--hm-safron-linear-bg)",
                                color: "white",
                                fontWeight: "600",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                cursor: "pointer",
                                fontSize: "18px",
                                border: "none",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                            }}
                            onClick={() => window.open("https://your-donation-link.com", "_blank")}
                        >
                            🙏 Donate Now
                        </button>
                    </p>
                </div>

                <div className="page bg-oldpaper p-8">
                    <h2 className="text-2xl font-serif text-red-700">Welcome</h2>
                    <p className="mt-4 text-gray-900 leading-loose">
                        Dear Devotees,
                        <p>With the blessings of the Almighty and the support of well-wishers like you, we are beginning a divine journey — to build a Mandir that will stand as a center of faith, peace, and community togetherness.
                        </p>
                    </p>
                </div>

                <div className="page bg-oldpaper p-8">
                    <h2 className="text-2xl font-serif text-red-700">Vision</h2>
                    <p className="mt-4 text-gray-900 leading-loose">
                        The Mandir will be:
                        <p>✨ A place of worship and spiritual growth
                        </p>
                        <p>✨ A space for bhajans, satsangs, and cultural activities
                        </p><p>✨ A center of community support, values, and teachings for generations to come
                        </p>
                    </p>
                </div>
                <div className="page bg-oldpaper p-8">
                    <h2 className="text-2xl font-serif text-red-700">Why This Mandir Matters</h2>
                    <p className="mt-4 text-gray-900 leading-loose">
                        <p>🪔 In today’s busy life, we all seek a place for peace and connection.
                        </p><p>🪔 The Mandir will not only be a spiritual center but also a cultural and moral anchor for our children and future generations.
                        </p>
                    </p>
                </div>
                <div className="page bg-oldpaper p-8">
                    <h2 className="text-2xl font-serif text-red-700">How You Can Help</h2>
                    <p className="mt-4 text-gray-900 leading-loose">
                        We invite your generous support 🙏
                        <p>💰 Donations (big or small, every bit counts)
                        </p><p>📦 Contributions in kind (materials, services, volunteering)
                        </p><p>💞 Spreading the word to others who may wish to contribute
                        </p>
                    </p>
                </div>
                <div className="page bg-oldpaper p-8">
                    <h2 className="text-2xl font-serif text-red-700">Gratitude</h2>
                    <p className="mt-4 text-gray-900 leading-loose">
                       <p> Every brick laid, every prayer offered, and every rupee donated will carry your blessings and devotion.
</p><p>
                        Together, let us create a sacred space where generations can find peace, devotion, and inspiration.
</p><p>
                        🙏 May the Divine bless you and your family with happiness, prosperity, and peace.
                   </p>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlipBook;
