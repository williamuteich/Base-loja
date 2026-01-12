"use client";

import { Plus, Search } from "lucide-react";

interface TeamHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
}

export default function TeamHeader({ search, onSearchChange, onAddClick }: TeamHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Equipe</h1>
                <p className="text-slate-500">Gerencie os membros e permissões da sua equipe.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full sm:w-64 md:w-80 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    />
                </div>

                <button
                    onClick={onAddClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all cursor-pointer whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Novo Membro
                </button>
            </div>
        </div>
    );
}
