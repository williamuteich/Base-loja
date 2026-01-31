"use client";

import { useState, useRef } from "react";
import { BannerFormProps } from "@/types/banner";
import { ImagePlus, Loader2, Save } from "lucide-react";
import Image from "next/image";

export default function BannerForm({ banner, onSave, onCancel, isSaving }: BannerFormProps) {
    const [title, setTitle] = useState(banner?.title || "");
    const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
    const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || "");
    const [resDesktop, setResDesktop] = useState(banner?.resolutionDesktop || "");
    const [resMobile, setResMobile] = useState(banner?.resolutionMobile || "");
    const [isActive, setIsActive] = useState(banner?.isActive ?? true);

    const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
    const [mobilePreview, setMobilePreview] = useState<string | null>(null);
    const [selectedDesktopFile, setSelectedDesktopFile] = useState<File | null>(null);
    const [selectedMobileFile, setSelectedMobileFile] = useState<File | null>(null);

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'desktop') {
                    setDesktopPreview(reader.result as string);
                    setSelectedDesktopFile(file);
                } else {
                    setMobilePreview(reader.result as string);
                    setSelectedMobileFile(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("O título é obrigatório!");
            return;
        }

        if (!banner && !selectedDesktopFile) {
            alert("A imagem desktop é obrigatória para um novo banner!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subtitle", subtitle || "");
        formData.append("linkUrl", linkUrl || "");
        formData.append("resolutionDesktop", resDesktop || "");
        formData.append("resolutionMobile", resMobile || "");
        formData.append("isActive", String(isActive));

        if (selectedDesktopFile) {
            formData.append("desktopImage", selectedDesktopFile);
        }
        if (selectedMobileFile) {
            formData.append("mobileImage", selectedMobileFile);
        }

        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Coleção de Verão 2024"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        required
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Subtítulo (Opcional)</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Ex: Até 50% de desconto em itens selecionados"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Link URL (Opcional)</label>
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://sualoja.com/categoria"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Resolução Desktop</label>
                    <input
                        type="text"
                        value={resDesktop}
                        onChange={(e) => setResDesktop(e.target.value)}
                        placeholder="Ex: 1920x1080"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Resolução Mobile</label>
                    <input
                        type="text"
                        value={resMobile}
                        onChange={(e) => setResMobile(e.target.value)}
                        placeholder="Ex: 600x600"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                        <span className="text-sm font-semibold text-slate-700">Banner Ativo</span>
                        <span className="text-xs text-slate-500">
                            {isActive ? 'O banner será exibido na página inicial.' : 'O banner ficará oculto para os clientes.'}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 block">Imagem Desktop (Principal)</label>
                    <div
                        onClick={() => desktopInputRef.current?.click()}
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                    >
                        {desktopPreview || (banner?.imageDesktop && !selectedDesktopFile) ? (
                            <Image
                                src={desktopPreview || (banner?.imageDesktop ? `/${banner.imageDesktop}` : "")}
                                alt="Desktop preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <>
                                <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                <span className="text-xs text-slate-500 font-medium">Clique para selecionar</span>
                            </>
                        )}
                        <input
                            ref={desktopInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'desktop')}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 block">Imagem Mobile (Opcional)</label>
                    <div
                        onClick={() => mobileInputRef.current?.click()}
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                    >
                        {mobilePreview || (banner?.imageMobile && !selectedMobileFile) ? (
                            <Image
                                src={mobilePreview || (banner?.imageMobile ? `/${banner.imageMobile}` : "")}
                                alt="Mobile preview"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        ) : (
                            <>
                                <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                <span className="text-xs text-slate-500 font-medium">Clique para selecionar</span>
                            </>
                        )}
                        <input
                            ref={mobileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'mobile')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                            Salvar Banner
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
