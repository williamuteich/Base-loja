import { getPaginatedPublicProducts } from "@/services/product";
import { getPublicCategories } from "@/services/category";
import ProductsClient from "../produtos/products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Promoções Imperdíveis | Joias Úteis",
    description: "Confira nossas melhores ofertas e produtos em promoção.",
};

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function PromocoesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; categoria?: string; search?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1");
    const category = resolvedSearchParams.categoria;
    const search = resolvedSearchParams.search;
    const limit = 12;

    const [productsData, categories] = await Promise.all([
        getPaginatedPublicProducts(page, limit, category, search, true),
        getPublicCategories(false, false),
    ]);

    return (
        <main className="py-12 md:py-20 bg-linear-to-br from-slate-50 via-white to-pink-50/20 min-h-screen">
            <div className="container mx-auto px-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                    <a href="/" className="hover:text-pink-600 transition-colors">Início</a>
                    <span>/</span>
                    <span className="text-slate-600 font-medium">Promoções</span>
                </div>
            </div>

            <ProductsClient
                initialProducts={productsData.data}
                categories={categories}
                meta={productsData.meta}
                backendUrl={API_URL}
                title={
                    <>
                        Promoções <span className="text-pink-600">Imperdíveis</span>
                    </>
                }
                subtitle="Confira nossas melhores ofertas e produtos em promoção com preços especiais."
            />
        </main>
    );
}
