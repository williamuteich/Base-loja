import { getPaginatedPublicProducts } from "@/services/product";
import { getPublicCategories } from "@/services/category";
import ProductsClient from "./products-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Nossos Produtos | Joias Úteis",
    description: "Explore nossa seleção exclusiva de joias e produtos especiais.",
};

const API_URL = process.env.API_URL || "http://localhost:3000";

async function ProductsContent({
    page,
    category,
    search,
}: {
    page: number;
    category?: string;
    search?: string;
}) {
    const limit = 12;

    const [productsData, categories] = await Promise.all([
        getPaginatedPublicProducts(page, limit, category, search),
        getPublicCategories(false, false),
    ]);

    return (
        <ProductsClient
            initialProducts={productsData.data}
            categories={categories}
            meta={productsData.meta}
            backendUrl={API_URL}
        />
    );
}

function ProductsSkeleton() {
    return (
        <div className="container mx-auto px-4">
            <div className="mb-10 text-center md:text-left animate-pulse">
                <div className="h-12 bg-slate-200 w-64 md:w-96 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 w-48 md:w-80 rounded-lg"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-10 w-24 md:w-28 bg-slate-200 rounded-full shrink-0 animate-pulse"
                        ></div>
                    ))}
                </div>
                <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse self-end md:self-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                        key={i}
                        className="aspect-3/4 bg-slate-200 rounded-2xl md:rounded-3xl animate-pulse"
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default async function ProdutosPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; categoria?: string; search?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1");
    const category = resolvedSearchParams.categoria;
    const search = resolvedSearchParams.search;

    return (
        <main className="py-12 md:py-20 bg-linear-to-br from-slate-50 via-white to-pink-50/20 min-h-screen">
            <Suspense fallback={<ProductsSkeleton />}>
                <ProductsContent page={page} category={category} search={search} />
            </Suspense>
        </main>
    );
}
