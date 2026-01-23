import { Flame } from "lucide-react";
import ProductCard from "./product-card";
import OfferCarouselClient from "./offer-carousel-client";
import { getPublicProducts } from "@/services/product";
import { CarouselItem } from "@/components/ui/carousel";

interface OfferProductsCarouselProps {
    backendUrl: string;
}

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

                <OfferCarouselClient>
                    {offerProducts.map((product) => (
                        <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]">
                            <ProductCard
                                product={product}
                                backendUrl={backendUrl}
                            />
                        </CarouselItem>
                    ))}
                </OfferCarouselClient>
            </div>
        </section>
    );
}
