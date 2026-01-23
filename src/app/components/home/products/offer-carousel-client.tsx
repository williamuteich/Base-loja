"use client";

import { ReactNode } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface OfferCarouselClientProps {
    children: ReactNode;
}

export default function OfferCarouselClient({ children }: OfferCarouselClientProps) {
    return (
        <div className="relative group/carousel">
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 md:-ml-6 pt-2 px-1 pb-4">
                    {children}
                </CarouselContent>

                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 cursor-pointer disabled:opacity-0" />
                    <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 cursor-pointer disabled:opacity-0" />
                </div>
            </Carousel>
        </div>
    );
}
