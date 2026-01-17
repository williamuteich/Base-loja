"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useEffect, useCallback, useState } from "react";
import Autoplay from 'embla-carousel-autoplay'

interface RelatedProductsCarouselProps {
    products: Product[];
    backendUrl: string;
}

export function RelatedProductsCarousel({ products, backendUrl }: RelatedProductsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: true,
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    }, [Autoplay({ delay: 4000 })]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent mb-6">
                Produtos Relacionados
            </h2>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4 touch-pan-y">
                    {products.map((product) => (
                        <div key={product.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] pl-4">
                            <Link
                                href={`/produto/${product.id}`}
                                className="group block bg-white rounded-xl border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all h-full"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={`${backendUrl}/${product.images[0].url}`}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300 bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                                <circle cx="9" cy="9" r="2" />
                                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                            </svg>
                                        </div>
                                    )}
                                    {product.discountPrice && product.discountPrice < product.price && (
                                        <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    {product.categories && product.categories[0] && (
                                        <span className="text-[10px] font-semibold tracking-wider text-pink-600 uppercase bg-pink-50 px-2 py-1 rounded-full">
                                            {product.categories[0].name}
                                        </span>
                                    )}
                                    <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-pink-600 transition-colors">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2 pt-1">
                                        <span className="text-lg font-bold text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                                        </span>
                                        {product.discountPrice && product.discountPrice < product.price && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
