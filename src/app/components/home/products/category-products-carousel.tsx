"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import ProductCard from "./product-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryProductsCarouselProps } from "@/types/product";

export default function CategoryProductsCarousel({
    title,
    description,
    products,
    categoryPath = "/produtos",
    useAltBackground = false,
    backendUrl
}: CategoryProductsCarouselProps) {
    const activeProducts = useMemo(() => {
        return products.filter(p => p.isActive);
    }, [products]);

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
                    <Carousel
                        opts={{
                            align: "start",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 md:-ml-6 pb-8">
                            {activeProducts.map((product) => (
                                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]">
                                    <ProductCard
                                        product={product}
                                        backendUrl={backendUrl}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="hidden md:block">
                            <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-md hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                            <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-md hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
