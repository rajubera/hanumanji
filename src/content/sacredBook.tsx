// import { useRef, useState } from "react";
// import { gsap } from "gsap";
const oldPaper = "/textures/book/parchment.jpg";
const border = "/textures/book/book-border.jpg";

// export default function SacredBook() {
//   const leftPageRef = useRef(null);
//   const rightPageRef = useRef(null);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [opened, setOpened] = useState(false);

//   const pages = [
//     { title: "About", content: "This is about section of the sacred book." },
//     { title: "Hanuman Chalisa", content: "श्रीगुरु चरन सरोज रज..." },
//     { title: "Resources", content: "List of resources will go here." },
//   ];
//  const openBook = () => {
//     if (opened) return;
//     setOpened(true);

//     // Animate left half (opens outward to the left)
//     gsap.to(leftPageRef.current, {
//       rotateY: -180,
//       transformOrigin: "right center",
//       duration: 1.2,
//       ease: "power3.inOut",
//     });

//     // Animate right half (opens outward to the right)
//     gsap.to(rightPageRef.current, {
//       rotateY: 180,
//       transformOrigin: "left center",
//       duration: 1.2,
//       ease: "power3.inOut",
//     });
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-transparent pointer-events-auto">
//       {/* Book container */}
//       <div className="relative w-[90%] h-[90%] flex perspective-[2500px]">
//         {/* Left Page */}
//         <div
//           ref={leftPageRef}
//           className="absolute left-0 w-1/2 h-full bg-cover bg-center shadow-2xl p-10"
//           style={{
//             backgroundImage: `url(${oldPaper}), url(${border})`,
//             backgroundBlendMode: "multiply",
//             backfaceVisibility: "hidden",
//           }}
//         >
//           <h1 className="text-3xl font-serif mb-4">{pages[0].title}</h1>
//           <p className="text-lg leading-relaxed">{pages[0].content}</p>
//         </div>

//         {/* Right Page */}
//         <div
//           ref={rightPageRef}
//           className="absolute right-0 w-1/2 h-full bg-cover bg-center shadow-2xl p-10"
//           style={{
//             backgroundImage: `url(${oldPaper}), url(${border})`,
//             backgroundBlendMode: "multiply",
//             backfaceVisibility: "hidden",
//           }}
//         >
//           <h1 className="text-3xl font-serif mb-4">{pages[1].title}</h1>
//           <p className="text-lg leading-relaxed">{pages[1].content}</p>
//         </div>
//       </div>

//       {/* Open Button */}
//       {!opened && (
//         <button
//           onClick={openBook}
//           className="absolute bottom-10 px-6 py-3 bg-amber-800 text-white rounded shadow-lg hover:bg-amber-700"
//         >
//           Open Sacred Book
//         </button>
//       )}
//     </div>
//   );
// }



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
