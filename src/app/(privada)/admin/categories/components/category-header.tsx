import { Plus, Search, X } from "lucide-react";

interface CategoryHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewCategory: () => void;
}

export default function CategoryHeader({ search, onSearchChange, onClearSearch, onNewCategory }: CategoryHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Categorias</h1>
                    <p className="text-slate-500 text-base mt-1">Organize seus produtos em departamentos</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar categorias..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                        />
                        {search && (
                            <button
                                onClick={onClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onNewCategory}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Categoria
                    </button>
                </div>
            </div>
        </div>
    );
}
