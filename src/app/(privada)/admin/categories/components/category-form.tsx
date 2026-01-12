"use client";

import { useState, useRef } from "react";
import { Category } from "@/types/category";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface CategoryFormProps {
    category?: Category;
    onSave: (data: FormData) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export default function CategoryForm({ category, onSave, onCancel, isSaving }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [isActive, setIsActive] = useState(category?.isActive !== false);
    const [isHome, setIsHome] = useState(category?.isHome || false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(category?.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL || ""}/${category.imageUrl}` : null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("isActive", String(isActive));
        formData.append("isHome", String(isHome));
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5Caps">Nome da Categoria</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        placeholder="Ex: Anéis, Brincos, Relógios..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Descrição (Opcional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                        placeholder="Breve descrição da categoria..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                        <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">Status Ativo</label>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <input
                            type="checkbox"
                            id="isHome"
                            checked={isHome}
                            onChange={(e) => setIsHome(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                        <label htmlFor="isHome" className="text-sm font-semibold text-slate-700 cursor-pointer">Mostrar na Home</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Imagem da Categoria</label>
                    <div
                        onClick={() => !previewUrl && fileInputRef.current?.click()}
                        className={`relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden
                            ${previewUrl
                                ? 'border-transparent bg-slate-100'
                                : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer group'}`}
                    >
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className="p-2 bg-white rounded-full text-slate-700 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                        <Upload className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        className="p-2 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm transition-colors">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-700">Clique para fazer upload</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP (Max 5MB)</p>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSaving || !name}
                    className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
                >
                    {isSaving ? "Salvando..." : (category ? "Salvar Alterações" : "Criar Categoria")}
                </button>
            </div>
        </form>
    );
}
