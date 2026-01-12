import { Product } from "@/types/product";
import ProductCard from "./product-card";
import ProductCarouselWrapper from "./product-carousel-wrapper";

interface ProductCarouselProps {
    products: Product[];
    backendUrl: string;
}

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

                <ProductCarouselWrapper hasProducts={products.length > 0}>
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[75%] md:min-w-[45%] lg:min-w-[30%] xl:min-w-[23%] snap-start">
                            <ProductCard
                                product={product}
                                backendUrl={backendUrl}
                            />
                        </div>
                    ))}
                </ProductCarouselWrapper>
            </div>
        </section>
    );
}
