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
    const limit = 16; // Increased limit for smaller cards

    const response = await getPaginatedPublicCategories(currentPage, limit);
    const { data: categories, meta } = response;

    const fixImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        return `${API_URL}/${cleanUrl}`;
    };

    return (
        <main className="py-12 md:py-20 bg-linear-to-br from-slate-50 via-white to-pink-50/20 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center justify-center mb-5">
                        <div className="w-8 h-px bg-pink-600/30"></div>
                        <span className="mx-4 text-pink-600 text-[10px] font-bold tracking-[0.3em] uppercase">
                            Coleções
                        </span>
                        <div className="w-8 h-px bg-pink-600/30"></div>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-6">
                        Explore as <span className="text-pink-600 capitalize">Categorias</span>
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
                        Descubra a peça ideal em nossas seleções exclusivas, criadas para momentos inesquecíveis.
                    </p>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
                        {categories.map((category, i) => (
                            <Link
                                key={category.id}
                                href={`/produtos?categoria=${encodeURIComponent(category.name)}`}
                                className="group relative aspect-3/4 overflow-hidden rounded-xl shadow-sm hover:shadow-2xl transition-all duration-700 animate-fade-in border border-slate-50 bg-white"
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                {category.imageUrl ? (
                                    <Image
                                        src={fixImageUrl(category.imageUrl)!}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-1200 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12.5vw"
                                        priority={i < 8}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[8px] uppercase font-bold tracking-widest">Sem Foto</span>
                                        </div>
                                    </div>
                                )}

                                {/* Subtle Luxury Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

                                <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col items-center text-center">
                                    <div className="w-full pb-1">
                                        <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base capitalize tracking-tight group-hover:text-pink-300 transition-colors duration-500">
                                            {category.name}
                                        </h3>
                                        <div className="overflow-hidden h-0 group-hover:h-4 transition-all duration-500 opacity-0 group-hover:opacity-100">
                                            <p className="text-white/60 text-[9px] uppercase tracking-widest font-bold">
                                                {category._count?.products || 0} Itens
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-0.5 bg-pink-500/0 group-hover:bg-pink-500 rounded-full transition-all duration-700 transform scale-x-0 group-hover:scale-x-100"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-6">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Coleção Vazia</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            Em breve disponibilizaremos novas categorias maravilhosas para você!
                        </p>
                    </div>
                )}

                {meta && meta.totalPages > 1 && (
                    <div className="mt-16 flex justify-center">
                        <div className="bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
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
