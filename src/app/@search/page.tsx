import { getPaginatedPublicProducts } from "@/services/product";
import ProductCard from "@/app/components/home/products/product-card";
import { Search } from "lucide-react";
import SearchOverlayClient from "./SearchOverlayClient";
import Link from "next/link";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : "";

    if (!query) return null;

    const { data: products } = await getPaginatedPublicProducts(1, 12, undefined, query);

    const backendUrl = process.env.API_URL || "http://localhost:3000";

    return (
        <SearchOverlayClient query={query}>
            {products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    {products.map((product) => (
                        <div key={product.id} className="group transition-transform duration-500 hover:-translate-y-2">
                            <ProductCard
                                product={product as any}
                                backendUrl={backendUrl}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
                    <div className="relative mb-10">
                        <div className="w-32 h-32 bg-pink-50 rounded-[2.5rem] flex items-center justify-center text-pink-200 shadow-inner rotate-3 transition-transform hover:rotate-6 duration-500">
                            <Search className="w-16 h-16" strokeWidth={1} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-pink-500 text-2xl font-bold border border-pink-50 animate-bounce">
                            ?
                        </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">
                        Ops! Não encontramos nada...
                    </h3>

                    <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed mb-10">
                        Não encontramos nenhum produto que corresponda à sua busca por <span className="font-extrabold text-pink-600 underline underline-offset-4 decoration-pink-200">"{query}"</span>.
                        Tente usar termos diferentes ou confira nossas categorias principais.
                    </p>

                    <Link
                        href="/"
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-xl hover:shadow-pink-500/25 active:scale-95 flex items-center gap-3 group"
                    >
                        Voltar ao Início
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>
            )}
        </SearchOverlayClient>
    );
}
