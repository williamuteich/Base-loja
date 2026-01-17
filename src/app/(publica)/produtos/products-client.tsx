"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid3x3, LayoutList, ShoppingBag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductsClientProps {
    initialProducts: Product[];
    categories: Category[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    backendUrl: string;
}

export default function ProductsClient({
    initialProducts,
    categories,
    meta,
    backendUrl,
}: ProductsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const currentCategory = searchParams.get("categoria");
    const currentPage = parseInt(searchParams.get("page") || "1");

    const onCategorySelect = (categoryName: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryName) {
            params.set("categoria", categoryName);
        } else {
            params.delete("categoria");
        }
        params.set("page", "1");
        router.push(`/produtos?${params.toString()}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const calculateDiscount = (price: number, discountPrice: number) => {
        return Math.round(((price - discountPrice) / price) * 100);
    };

    const fixImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
        return `${backendUrl}/${cleanUrl}`;
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-10 text-center md:text-left">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                    Nossos <span className="text-pink-600">Produtos</span>
                </h1>
                <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl">
                    Descubra nossa coleção completa de produtos especiais, selecionados para você.
                </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 sticky top-24 z-30 bg-white/80 backdrop-blur-md p-4 -mx-4 md:static md:bg-transparent md:p-0 rounded-2xl border border-slate-100 md:border-none shadow-sm md:shadow-none">
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <button
                        onClick={() => onCategorySelect(null)}
                        className={cn(
                            "cursor-pointer px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-xs whitespace-nowrap border",
                            !currentCategory
                                ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-200"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-200"
                        )}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category.name)}
                            className={cn(
                                "cursor-pointer px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-xs whitespace-nowrap capitalize border",
                                currentCategory === category.name
                                    ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-200"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-200"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-end md:self-auto shadow-inner">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "cursor-pointer inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-500",
                            viewMode === "grid"
                                ? "bg-white text-pink-600 shadow-sm border border-slate-100"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "cursor-pointer inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-500",
                            viewMode === "list"
                                ? "bg-white text-pink-600 shadow-sm border border-slate-100"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <LayoutList className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {initialProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-50 mb-6 text-pink-500 border border-pink-100">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                        Nenhum produto encontrado
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Tente selecionar outra categoria ou navegue por todas as nossas opções.
                    </p>
                    <button
                        onClick={() => onCategorySelect(null)}
                        className="cursor-pointer px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-pink-600 transition-all shadow-lg shadow-slate-200 transform hover:-translate-y-1"
                    >
                        Ver todos os produtos
                    </button>
                </div>
            ) : (
                <>
                    <div
                        className={cn(
                            "grid gap-6 md:gap-8",
                            viewMode === "grid"
                                ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
                        )}
                    >
                        {initialProducts.map((product, i) => (
                            <Link
                                key={product.id}
                                href={`/produto/${product.slug}`}
                                className={cn(
                                    "group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 transition-all duration-500 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-100/50 flex animate-fade-in",
                                    viewMode === "grid" ? "flex-col" : "flex-row md:items-center"
                                )}
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div
                                    className={cn(
                                        "relative overflow-hidden bg-slate-50 shrink-0",
                                        viewMode === "grid"
                                            ? "aspect-square w-full"
                                            : "w-32 h-32 md:w-64 md:h-64"
                                    )}
                                >
                                    {product.images?.[0] ? (
                                        <>
                                            <Image
                                                src={fixImageUrl(product.images[0].url)!}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-1200 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                unoptimized
                                            />
                                            {product.images?.[1] && (
                                                <Image
                                                    src={fixImageUrl(product.images[1].url)!}
                                                    alt={product.title}
                                                    fill
                                                    className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    unoptimized
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ShoppingBag className="w-10 h-10 opacity-20" />
                                        </div>
                                    )}

                                    {product.discountPrice && product.discountPrice < product.price && (
                                        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100 z-10">
                                            <span className="text-[8px] md:text-[10px] font-medium text-gray-500 uppercase">Off</span>
                                            <span className="text-sm md:text-base font-bold text-rose-600 leading-none">
                                                {calculateDiscount(product.price, product.discountPrice)}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 md:p-6 pb-16 relative flex flex-col justify-between flex-1 overflow-hidden">
                                    <div>
                                        <span className="text-rose-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1.5 block truncate">
                                            {product.categories?.[0]?.name || "Produto"}
                                        </span>
                                        <h3
                                            className={cn(
                                                "font-semibold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1",
                                                viewMode === "grid"
                                                    ? "text-sm md:text-lg"
                                                    : "text-lg md:text-2xl"
                                            )}
                                        >
                                            {product.title}
                                        </h3>
                                        {product.description && (
                                            <p className={cn(
                                                "text-slate-500 text-[10px] md:text-xs line-clamp-2 leading-relaxed mb-2 md:mb-3",
                                                viewMode === "list" ? "mt-3 hidden md:block max-w-xl" : ""
                                            )}>
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="text-rose-600 font-black text-lg md:text-2xl">
                                            {formatPrice(product.discountPrice || product.price)}
                                        </span>
                                        {product.discountPrice && product.discountPrice < product.price && (
                                            <span className="text-xs md:text-sm text-slate-400 line-through decoration-rose-300">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="w-full bg-slate-900 text-white text-center py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                                            <span>Ver Detalhes</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {meta.totalPages > 1 && (
                        <div className="mt-20 flex justify-center">
                            <div className="bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-slate-100 shadow-sm">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={
                                                    currentPage > 1
                                                        ? `/produtos?${new URLSearchParams({
                                                            ...Object.fromEntries(searchParams),
                                                            page: (currentPage - 1).toString(),
                                                        }).toString()}`
                                                        : "#"
                                                }
                                                className={
                                                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                                }
                                            />
                                        </PaginationItem>

                                        {[...Array(meta.totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            if (
                                                pageNum === 1 ||
                                                pageNum === meta.totalPages ||
                                                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            href={`/produtos?${new URLSearchParams({
                                                                ...Object.fromEntries(searchParams),
                                                                page: pageNum.toString(),
                                                            }).toString()}`}
                                                            isActive={pageNum === currentPage}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                            if (
                                                pageNum === currentPage - 3 ||
                                                pageNum === currentPage + 3
                                            ) {
                                                return <PaginationEllipsis key={pageNum} />;
                                            }
                                            return null;
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                href={
                                                    currentPage < meta.totalPages
                                                        ? `/produtos?${new URLSearchParams({
                                                            ...Object.fromEntries(searchParams),
                                                            page: (currentPage + 1).toString(),
                                                        }).toString()}`
                                                        : "#"
                                                }
                                                className={
                                                    currentPage === meta.totalPages
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
