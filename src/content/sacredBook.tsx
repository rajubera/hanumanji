

import { useEffect, useState } from "react";
import gsap from "gsap";

type Page = {
  title: string;
  content: string;
};

const pages: Page[] = [
  {
    title: "About",
    content: "This sacred book introduces the glory of Lord Hanuman..."
  },
  {
    title: "Hanuman Chalisa",
    content: "श्री गुरु चरण सरोज रज, निज मनु मुकुरु सुधारि..."
  },
  {
    title: "Resources",
    content: "Find helpful resources, chants, and scriptures here..."
  },
  {
    title: "Contact",
    content: "Reach out to us for more spiritual guidance..."
  }
];

export default function BookOverlay() {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Animate both pages when overlay first opens
    gsap.fromTo(
      ".page-left",
      { rotateY: -90, opacity: 0 },
      { rotateY: 0, opacity: 1, duration: 1.5, ease: "power4.out" }
    );
    gsap.fromTo(
      ".page-right",
      { rotateY: 90, opacity: 0 },
      { rotateY: 0, opacity: 1, duration: 1.5, ease: "power4.out" }
    );
  }, []);

  const flipPage = (dir: "next" | "prev") => {
    const newIndex =
      dir === "next"
        ? (currentPage + 1) % pages.length
        : (currentPage - 1 + pages.length) % pages.length;

    // Animate page flip
    gsap.to(".page-right", {
      rotateY: dir === "next" ? -180 : 180,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentPage(newIndex);
        gsap.fromTo(
          ".page-right",
          { rotateY: dir === "next" ? 180 : -180, opacity: 0 },
          { rotateY: 0, opacity: 1, duration: 0.6, ease: "power2.inOut" }
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 w-full h-full">
      <div className="relative w-full max-w-6xl h-[90vh] flex book-container h-full">
        {/* Left Page (Static Intro or Previous Content) */}
        <div className="w-1/2 h-full page-left bg-[url('/textures/book/parchment.jpg')] bg-cover bg-center shadow-xl border-r-4 border-amber-800 origin-right p-8">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Sacred Book</h2>
          <p className="text-lg leading-relaxed text-amber-950">
            Explore chants, stories, and teachings.
          </p>
        </div>

        {/* Right Page (Dynamic Content) */}
        <div className="w-1/2 h-full page-right bg-[url('/textures/book/parchment.jpg')] bg-cover bg-center shadow-xl border-l-4 border-amber-800 origin-left p-8">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">
            {pages[currentPage].title}
          </h2>
          <p className="text-lg leading-relaxed text-amber-950 whitespace-pre-line">
            {pages[currentPage].content}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 right-8 flex gap-4">
          <button
            onClick={() => flipPage("prev")}
            className="px-4 py-2 bg-amber-800 text-white rounded shadow-lg hover:bg-amber-700"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => flipPage("next")}
            className="px-4 py-2 bg-amber-800 text-white rounded shadow-lg hover:bg-amber-700"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
