import { getPaginatedPublicProducts } from "@/services/product";
import { getPublicCategories } from "@/services/category";
import ProductsClient from "./products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nossos Produtos | Joias Úteis",
    description: "Explore nossa seleção exclusiva de joias e produtos especiais.",
};

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function ProdutosPage({
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
        getPaginatedPublicProducts(page, limit, category, search),
        getPublicCategories(false, false),
    ]);

    return (
        <main className="py-12 md:py-20 bg-linear-to-br from-slate-50 via-white to-pink-50/20 min-h-screen">
            <ProductsClient
                initialProducts={productsData.data}
                categories={categories}
                meta={productsData.meta}
                backendUrl={API_URL}
            />
        </main>
    );
}
