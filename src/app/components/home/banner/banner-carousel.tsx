"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { type CarouselApi } from "@/components/ui/carousel";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Banner, BannerCarouselProps } from "@/types/banner";
import { cn } from "@/lib/utils";

export default function BannerCarousel({ banners, backendUrl }: BannerCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    if (!banners.length) {
        return (
            <div className="w-full aspect-video lg:aspect-4/1 bg-slate-100 animate-pulse flex items-center justify-center rounded-2xl overflow-hidden mt-6">
                <div className="text-slate-300">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group w-full mt-0 overflow-hidden">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="ml-0">
                    {banners.map((banner, index) => (
                        <CarouselItem key={banner.id} className="pl-0">
                            <div className="relative w-full aspect-video lg:aspect-4/1 overflow-hidden">
                                {banner.linkUrl ? (
                                    <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                                        <BannerImage banner={banner} backendUrl={backendUrl} priority={index === 0} />
                                    </a>
                                ) : (
                                    <div className="w-full h-full relative">
                                        <BannerImage banner={banner} backendUrl={backendUrl} priority={index === 0} />
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {banners.length > 1 && (
                    <>
                        <CarouselPrevious className="hidden lg:flex cursor-pointer left-8 w-11 h-11 bg-white/20 backdrop-blur-md border-none text-white hover:bg-pink-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300" />
                        <CarouselNext className="hidden lg:flex cursor-pointer right-8 w-11 h-11 bg-white/20 backdrop-blur-md border-none text-white hover:bg-pink-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300" />
                    </>
                )}
            </Carousel>

            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "h-2.5 rounded-full transition-all duration-300",
                                current === i ? "bg-white w-8 shadow-sm" : "bg-white/40 hover:bg-white/60 w-2.5"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function BannerImage({ banner, backendUrl, priority }: { banner: Banner; backendUrl: string; priority: boolean }) {
    const safeBackendUrl = backendUrl?.includes("localhost") ? "" : backendUrl;
    const imageUrl = `${safeBackendUrl}/${banner.imageDesktop || banner.imageMobile}`;
    const mobileImageUrl = `${safeBackendUrl}/${banner.imageMobile || banner.imageDesktop}`;

    return (
        <>
            <Image
                src={imageUrl}
                alt={banner.title || "Banner"}
                fill
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                unoptimized
                className="hidden lg:block object-cover"
                sizes="100vw"
            />
            <Image
                src={mobileImageUrl}
                alt={banner.title || "Banner"}
                fill
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                unoptimized
                className="lg:hidden object-cover"
                sizes="100vw"
            />
        </>
    );
}
