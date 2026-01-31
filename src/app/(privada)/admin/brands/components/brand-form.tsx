"use client";

import { useState } from "react";
import { BrandFormProps } from "@/types/brand";
import { Loader2, Save, Tag } from "lucide-react";

export default function BrandForm({ brand, onSave, onCancel, isSaving }: BrandFormProps) {
    const [name, setName] = useState(brand?.name || "");
    const [isActive, setIsActive] = useState(brand?.isActive ?? true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSave({ name, isActive });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        Nome da Marca
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Samsung, Apple, Nike..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 outline-none transition-all"
                        required
                    />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <span
                            className={`${isActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">Marca Ativa</span>
                        <span className="text-xs text-slate-500">
                            {isActive ? 'A marca será exibida nos filtros da loja.' : 'A marca ficará oculta para os clientes.'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    disabled={isSaving}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Salvar Marca
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
