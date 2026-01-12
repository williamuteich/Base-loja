import { Product } from "@/types/product";
import ProductCard from "./product-card";

interface ProductGridProps {
    products: Product[];
    backendUrl: string;
}

export default function ProductGrid({ products, backendUrl }: ProductGridProps) {
    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-white">
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            backendUrl={backendUrl}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
