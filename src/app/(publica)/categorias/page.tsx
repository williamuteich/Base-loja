import { getPaginatedPublicCategories } from "@/services/category";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata: Metadata = {
    title: "Categorias | Joias Úteis",
    description: "Explore nossas coleções cuidadosamente organizadas.",
};

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function CategoriasPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || "1");
    const limit = 12;

    const response = await getPaginatedPublicCategories(currentPage, limit);
    const { data: categories, meta } = response;

    const fixImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        return `${API_URL}/${cleanUrl}`;
    };

    return (
        <main className="py-12 md:py-20 bg-linear-to-brrom-slate-50 via-white to-pink-50/30 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center justify-center mb-5">
                        <div className="w-12 h-px bg-linear-to-r from-transparent via-pink-600/40 to-transparent"></div>
                        <span className="mx-4 text-pink-600 text-[10px] font-bold tracking-[0.3em] uppercase">
                            Coleções
                        </span>
                        <div className="w-12 h-px bg-linear-to-r from-transparent via-pink-600/40 to-transparent"></div>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 bg-clip-text bg-linear-to-r from-slate-900 via-pink-900 to-slate-900">
                        Explore as <span className="text-pink-600">Categorias</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
                        Descubra a peça ideal em nossas seleções exclusivas, criadas para momentos inesquecíveis.
                    </p>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {categories.map((category, i) => (
                            <Link
                                key={category.id}
                                href={`/produtos?categoria=${encodeURIComponent(category.name)}`}
                                className="group relative aspect-3/4 overflow-hidden rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 animate-fade-in bg-white border border-slate-100"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                {category.imageUrl ? (
                                    <Image
                                        src={fixImageUrl(category.imageUrl)!}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-110"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        priority={i < 4}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Sem Imagem</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700"></div>

                                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col items-center text-center transform transition-transform duration-700 group-hover:translate-y-[-8px]">
                                    <div className="w-full">
                                        <h3 className="text-white font-bold text-base md:text-lg lg:text-xl capitalize tracking-tight mb-2 group-hover:text-pink-300 transition-colors duration-500">
                                            {category.name}
                                        </h3>

                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-pink-500/20 group-hover:border-pink-400/40 transition-all duration-500">
                                            <svg className="w-3.5 h-3.5 text-white/70 group-hover:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span className="text-white/80 text-xs font-semibold group-hover:text-pink-200 transition-colors">
                                                {category._count?.products || 0} {category._count?.products === 1 ? 'Item' : 'Itens'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-12 h-1 bg-linear-to-r from-transparent via-pink-500 to-transparent rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                                </div>

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-pink-50 to-slate-50 mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Coleção Vazia</h3>
                        <p className="text-slate-500 text-base max-w-md mx-auto">
                            Em breve disponibilizaremos novas categorias maravilhosas para você!
                        </p>
                    </div>
                )}

                {meta && meta.totalPages > 1 && (
                    <div className="mt-16 flex justify-center">
                        <div className="bg-white/60 backdrop-blur-lg p-3 rounded-2xl border border-white/80 shadow-lg">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={currentPage > 1 ? `/categorias?page=${currentPage - 1}` : "#"}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-pink-50 hover:text-pink-600 transition-colors"}
                                        />
                                    </PaginationItem>

                                    {[...Array(meta.totalPages)].map((_, i) => {
                                        const pageNumber = i + 1;
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === meta.totalPages ||
                                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                        ) {
                                            return (
                                                <PaginationItem key={pageNumber}>
                                                    <PaginationLink
                                                        href={`/categorias?page=${pageNumber}`}
                                                        isActive={pageNumber === currentPage}
                                                        className={pageNumber === currentPage ? "bg-pink-600 text-white border-pink-600 hover:bg-pink-700" : "hover:bg-pink-50 hover:text-pink-600 transition-colors font-medium"}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        }
                                        if (
                                            pageNumber === currentPage - 3 ||
                                            pageNumber === currentPage + 3
                                        ) {
                                            return (
                                                <PaginationItem key={pageNumber}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={currentPage < meta.totalPages ? `/categorias?page=${currentPage + 1}` : "#"}
                                            className={currentPage === meta.totalPages ? "pointer-events-none opacity-50" : "hover:bg-pink-50 hover:text-pink-600 transition-colors"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
