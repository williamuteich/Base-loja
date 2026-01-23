"use client";

import { ReactNode } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCarouselWrapperProps {
    children: ReactNode;
    hasProducts: boolean;
}

export default function ProductCarouselWrapper({ children, hasProducts }: ProductCarouselWrapperProps) {
    if (!hasProducts) return null;

    return (
        <div className="relative group/carousel">
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 md:-ml-6 pb-8 pt-2 px-1">
                    {children}
                </CarouselContent>

                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-rose-600 hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer disabled:opacity-0" />
                    <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-rose-600 hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer disabled:opacity-0" />
                </div>
            </Carousel>
        </div>
    );
}
