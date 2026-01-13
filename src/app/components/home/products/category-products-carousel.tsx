"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye } from "lucide-react";

interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    discountPrice: number | null;
    images?: { url: string }[];
    isActive: boolean;
}

interface CategoryProductsCarouselProps {
    title: string;
    description?: string | null;
    products: Product[];
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

    const resolveUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const backend = backendUrl.replace(/\/$/, "");
        const cleanUrl = url.replace(/^\//, "");
        return `${backend}/${cleanUrl}`;
    };

    const calculateDiscountPercentage = (price: number, discountPrice: number | null) => {
        if (!price || !discountPrice || price <= discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

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
                            <div key={product.id} className="min-w-[46%] md:min-w-[40%] lg:min-w-[28%] xl:min-w-[22%] shrink-0">
                                <Link
                                    href={`/product/${product.id}`}
                                    className="group block bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 transition-all duration-500 h-full hover:shadow-lg"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        {product.images && product.images.length > 0 ? (
                                            <>
                                                <Image
                                                    src={resolveUrl(product.images[0].url)}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    unoptimized
                                                />
                                                {product.images.length > 1 && (
                                                    <Image
                                                        src={resolveUrl(product.images[1].url)}
                                                        alt={product.title}
                                                        fill
                                                        className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                                                        unoptimized
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                        )}

                                        {product.discountPrice && product.discountPrice < product.price && (
                                            <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-linear-to-r from-rose-500 to-pink-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                                                -{calculateDiscountPercentage(product.price, product.discountPrice)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 md:p-6 pb-20 relative">
                                        <span className="text-rose-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            {title}
                                        </span>
                                        <h3 className="font-semibold text-slate-800 text-sm md:text-lg group-hover:text-rose-600 transition-colors line-clamp-1 mb-2 md:mb-3">
                                            {product.title}
                                        </h3>

                                        <div className="flex items-center gap-2 md:gap-3">
                                            <span className="text-rose-600 font-black text-lg md:text-2xl">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                                            </span>
                                            {product.discountPrice && product.discountPrice < product.price && (
                                                <span className="text-xs md:text-sm text-slate-400 line-through decoration-rose-300">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="w-full bg-slate-900 text-white text-center py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                                                <span>Ver Detalhes</span>
                                                <Eye className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
