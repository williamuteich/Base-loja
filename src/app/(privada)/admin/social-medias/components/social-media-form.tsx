"use client";

import { useState } from "react";
import { SocialMedia } from "@/types/social-media";
import { Loader2, Save } from "lucide-react";

interface SocialMediaFormProps {
    socialMedia?: SocialMedia;
    onSave: (data: { platform: string; url: string; isActive: boolean }) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export default function SocialMediaForm({ socialMedia, onSave, onCancel, isSaving }: SocialMediaFormProps) {
    const [platform, setPlatform] = useState(socialMedia?.platform || "");
    const [url, setUrl] = useState(socialMedia?.url || "");
    const [isActive, setIsActive] = useState(socialMedia?.isActive ?? true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!platform.trim()) {
            alert("A plataforma é obrigatória!");
            return;
        }

        if (!url.trim()) {
            alert("A URL é obrigatória!");
            return;
        }

        await onSave({ platform, url, isActive });
    };

    const suggestedPlatforms = [
        "Instagram",
        "Facebook",
        "WhatsApp",
        "X (Twitter)",
        "LinkedIn",
        "YouTube",
        "TikTok",
        "Pinterest"
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Plataforma</label>
                    <input
                        type="text"
                        list="platforms"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        placeholder="Ex: Instagram"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        required
                    />
                    <datalist id="platforms">
                        {suggestedPlatforms.map(p => (
                            <option key={p} value={p} />
                        ))}
                    </datalist>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">URL do Perfil</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://instagram.com/sualoja"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
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
                        <span className="text-sm font-semibold text-slate-700">Ativo</span>
                        <span className="text-xs text-slate-500">
                            {isActive ? 'O link será exibido no site.' : 'O link ficará oculto para os clientes.'}
                        </span>
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
                            Salvar Rede Social
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
