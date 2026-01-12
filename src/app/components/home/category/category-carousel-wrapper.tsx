"use client";

import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryCarouselWrapperProps {
    children: ReactNode;
    hasCategories: boolean;
}

export default function CategoryCarouselWrapper({ children, hasCategories }: CategoryCarouselWrapperProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.5;
        const targetScrollLeft =
            direction === "left"
                ? Math.max(0, container.scrollLeft - scrollAmount)
                : Math.min(
                    container.scrollWidth - container.clientWidth,
                    container.scrollLeft + scrollAmount
                );

        container.scrollTo({
            left: targetScrollLeft,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative group/carousel">
            {hasCategories && (
                <>
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth"
            >
                {children}
            </div>
        </div>
    );
}
