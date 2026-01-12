"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Banner } from "@/types/banner";
import { getAdminBanners, BannersResponse } from "@/actions/banner";
import { Plus, SquarePen, Trash2, Search, X, Loader2, ImageIcon } from "lucide-react";
import SkeletonBanner from "./skeleton-banner";

export default function BannerList() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const loadBanners = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: BannersResponse = await getAdminBanners(page, 10, debouncedSearch);
            setBanners(data.data);
            setTotalPages(data.meta.totalPages);
            setTotalItems(data.meta.total);
        } catch (err) {
            console.error("Failed to load banners:", err);
            setError("Erro ao carregar banners. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadBanners();
    }, [loadBanners]);

    const handleClearSearch = () => {
        setSearch("");
    };

    return (
        <div className="p-6 md:p-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Banners</h1>
                <p className="text-slate-500 text-base mt-2">Controle os destaques visuais da página inicial</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 rounded-lg bg-slate-50 border border-slate-200 focus:border-slate-500 focus:bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 placeholder:text-slate-400"
                        placeholder="Buscar banners por título ou subtítulo..."
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    {search && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 text-white shadow-soft hover:shadow-hover h-10 px-5 py-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Novo Banner
                </button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonBanner key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="bg-red-50 p-4 rounded-full mb-3">
                            <ImageIcon className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Erro ao carregar</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-4">{error}</p>
                        <button onClick={loadBanners} className="text-sm font-medium text-pink-600 hover:underline">
                            Tentar novamente
                        </button>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum banner encontrado</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                            {search ? "Tente buscar com outros termos." : "Comece criando um novo banner para sua loja."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {banners.map((banner, index) => (
                                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                            {banner.imageDesktop ? (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/${banner.imageDesktop}`}
                                                    alt={banner.title}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate">{banner.title}</h3>
                                            {banner.subtitle && (
                                                <p className="text-sm text-slate-500 truncate">{banner.subtitle}</p>
                                            )}
                                            {banner.linkUrl && (
                                                <a
                                                    href={banner.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline truncate block mt-0.5"
                                                >
                                                    {banner.linkUrl}
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {banner.isActive ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">
                                                    Ativo
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 whitespace-nowrap">
                                                    Inativo
                                                </span>
                                            )}

                                            <div className="flex items-center gap-1">
                                                <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                                                    <SquarePen className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-slate-500">
                                    Página {page} de {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
