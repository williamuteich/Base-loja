"use client";

import { Plus, Search, X } from "lucide-react";

interface BrandHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewBrand: () => void;
}

export default function BrandHeader({ search, onSearchChange, onClearSearch, onNewBrand }: BrandHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marcas</h1>
                <p className="text-slate-500 text-base mt-1">Gerencie as marcas e parceiros da loja</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar marcas..."
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-slate-200 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 text-sm transition-all outline-none shadow-sm"
                    />
                    {search && (
                        <button
                            onClick={onClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <button
                    onClick={onNewBrand}
                    className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all cursor-pointer whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Nova Marca
                </button>
            </div>
        </div>
    );
}
