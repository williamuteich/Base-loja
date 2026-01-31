import { Flame } from "lucide-react";
import ProductCard from "./product-card";
import { getPublicProducts } from "@/services/product";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { OfferProductsCarouselProps } from "@/types/product";

export default async function OfferProductsCarousel({ backendUrl }: OfferProductsCarouselProps) {
    const products = await getPublicProducts(true, 1000);
    const offerProducts = products.filter(p => p.isActive && p.discountPrice && p.discountPrice < p.price);

    if (offerProducts.length === 0) return null;

    return (
        <section className="py-16 bg-rose-50/30 overflow-hidden border-y border-rose-100/40 mt-6 mb-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-600 text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                            <Flame className="w-3.5 h-3.5 fill-rose-600/10" />
                            Ofertas Especiais
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
                            Aproveite nossas promoções
                        </h2>
                        <p className="text-slate-500 mt-2 max-w-md">Seleção exclusiva de produtos com preços reduzidos por tempo limitado.</p>
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
                        <CarouselContent className="-ml-4 md:-ml-6 pt-2 px-1 pb-4">
                            {offerProducts.map((product) => (
                                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]">
                                    <ProductCard
                                        product={product}
                                        backendUrl={backendUrl}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="hidden md:block">
                            <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                            <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 opacity-0 group-hover/container:opacity-100 cursor-pointer disabled:opacity-0" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
