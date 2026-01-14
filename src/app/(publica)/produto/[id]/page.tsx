
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getPublicProduct, getRelatedProducts } from "@/services/product";
import { getStoreConfig } from "@/services/store-config";
import { ProductDetail } from "@/components/product/product-detail";
import { RelatedProductsCarousel } from "@/components/product/related-products-carousel";
import { ChevronRight, Home } from "lucide-react";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getPublicProduct(id);

    if (!product) {
        return {
            title: "Produto não encontrado",
            description: "O produto que você procura não está disponível.",
        };
    }

    return {
        title: `${product.title} | Loja Oficial`,
        description: product.description || `Confira ${product.title} na nossa loja!`,
        openGraph: {
            title: product.title,
            description: product.description || `Confira ${product.title} na nossa loja!`,
            images: product.images && product.images.length > 0 ? [product.images[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const [product, relatedProducts, storeConfig] = await Promise.all([
        getPublicProduct(id),
        getRelatedProducts(id),
        getStoreConfig()
    ]);

    if (!product) {
        return notFound();
    }

    return (
        <main className="flex-1 bg-white">
            <div className="container mx-auto px-4 md:px-6 py-6">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/" className="text-gray-600 hover:text-pink-700 transition-colors flex items-center gap-1">
                        <Home size={14} />
                        Home
                    </Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <Link href="/produtos" className="text-gray-600 hover:text-pink-700 transition-colors">
                        Produtos
                    </Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-black font-medium truncate max-w-[200px] sm:max-w-none">
                        {product.title}
                    </span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 pb-20">
                <ProductDetail
                    product={product}
                    storeConfig={storeConfig}
                    backendUrl={process.env.API_URL || "http://localhost:3000"}
                />
            </div>
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 md:px-6 py-16">
                        <RelatedProductsCarousel
                            products={relatedProducts}
                            backendUrl={process.env.API_URL || "http://localhost:3000"}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
