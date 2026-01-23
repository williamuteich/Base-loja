"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OfferCarouselClientProps {
    children: ReactNode;
}

export default function OfferCarouselClient({ children }: OfferCarouselClientProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        checkScroll();

        const resizeObserver = new ResizeObserver(() => checkScroll());
        resizeObserver.observe(container);

        const timer = setTimeout(checkScroll, 500);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timer);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;

        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative group/carousel">
            <button
                onClick={() => scroll("left")}
                className={`absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 cursor-pointer ${showLeftArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
                aria-label="Anterior"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pt-2 px-1 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            <button
                onClick={() => scroll("right")}
                className={`absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 cursor-pointer ${showRightArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
                aria-label="Próximo"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        </div>
    );
}
