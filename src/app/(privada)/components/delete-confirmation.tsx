"use client";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationProps {
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    isDeleting: boolean;
}

export default function DeleteConfirmation({
    title,
    description,
    onConfirm,
    onCancel,
    isDeleting
}: DeleteConfirmationProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 max-w-sm">{description}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                    disabled={isDeleting}
                >
                    Não, cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 shadow-md shadow-rose-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Excluindo...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Sim, excluir permanentemente
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
