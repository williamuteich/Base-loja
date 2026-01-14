"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import ProductCard from "./product-card";

interface CategoryProductsCarouselProps {
    title: string;
    description?: string | null;
    products: any[];
    categoryPath?: string;
    useAltBackground?: boolean;
    backendUrl: string;
}

export default function CategoryProductsCarousel({
    title,
    description,
    products,
    categoryPath = "/produtos",
    useAltBackground = false,
    backendUrl
}: CategoryProductsCarouselProps) {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const activeProducts = useMemo(() => {
        return products.filter(p => p.isActive);
    }, [products]);

    const smoothScrollTo = (element: HTMLElement, target: number, duration: number) => {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;

            if (elapsed < duration) {
                const t = elapsed / duration;
                const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                element.scrollLeft = start + change * ease;
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollLeft = target;
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainer.current) return;
        const container = scrollContainer.current;
        const scrollAmount = container.clientWidth * 0.5;
        const targetScrollLeft = direction === "left"
            ? Math.max(0, container.scrollLeft - scrollAmount)
            : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount);

        smoothScrollTo(container, targetScrollLeft, 600);
    };

    if (activeProducts.length === 0) return null;

    return (
        <section className={`py-16 overflow-hidden min-h-[500px] ${useAltBackground ? 'bg-pink-50/40' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        {description && (
                            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
                                <ShoppingBag className="w-3 h-3" />
                                {description}
                            </span>
                        )}
                        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
                            {title}
                        </h2>
                    </div>
                    <Link
                        href={categoryPath}
                        className="inline-flex items-center gap-2 text-rose-600 font-medium hover:gap-3 transition-all group"
                    >
                        Ver todos
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="relative px-2 md:px-0 group/container">
                    {activeProducts.length > 0 && (
                        <>
                            <button
                                onClick={() => scroll('left')}
                                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-md hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-md hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div
                        ref={scrollContainer}
                        className="flex overflow-x-auto gap-4 md:gap-6 pb-8 scroll-smooth no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {activeProducts.map((product) => (
                            <div key={product.id} className="w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%] snap-start shrink-0">
                                <ProductCard
                                    product={product}
                                    backendUrl={backendUrl}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
