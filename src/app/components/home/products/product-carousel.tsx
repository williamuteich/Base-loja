"use client";

import ProductCard from "./product-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCarouselProps } from "@/types/product";

export default function ProductCarousel({ products, backendUrl }: ProductCarouselProps) {
    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
                            Nossos produtos
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
                            Conheça mais opções do bazar
                        </h2>
                        <p className="text-slate-500 mt-2 max-w-md">Uma seleção variada de produtos para o dia a dia.</p>
                    </div>
                </div>

                <div className="relative group/container">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 md:-ml-6 pb-8 pt-2 px-1">
                            {products.map((product) => (
                                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]">
                                    <ProductCard
                                        product={product}
                                        backendUrl={backendUrl}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="hidden md:block">
                            <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-md border-2 border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                            <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-md border-2 border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
