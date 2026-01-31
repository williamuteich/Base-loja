"use client";

import { Search, Plus, X } from "lucide-react";
import { SocialMediaHeaderProps } from "@/types/social-media";

export default function SocialMediaHeader({
    search,
    onSearchChange,
    onClearSearch,
    onNewSocialMedia
}: SocialMediaHeaderProps) {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Redes Sociais</h1>
                <p className="text-slate-500 text-base mt-2">Gerencie os links das redes sociais da sua loja</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 rounded-lg bg-slate-50 border border-slate-200 focus:border-slate-500 focus:bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 placeholder:text-slate-400"
                        placeholder="Buscar por plataforma ou URL..."
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    {search && (
                        <button
                            onClick={onClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={onNewSocialMedia}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 text-white shadow-soft hover:shadow-hover h-10 px-5 py-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nova Rede Social
                </button>
            </div>
        </>
    );
}
