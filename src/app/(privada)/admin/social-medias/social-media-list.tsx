"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SocialMedia, SocialMediaResponse } from "@/types/social-media";
import { getAdminSocialMedias, createSocialMedia, updateSocialMedia, deleteSocialMedia } from "@/services/social-media";
import { Plus, Save, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";

import SkeletonSocialMedia from "./components/skeleton-social-media";
import SocialMediaItem from "./components/social-media-item";
import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";

export default function SocialMediaList() {
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
    const [localSocials, setLocalSocials] = useState<SocialMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [socialToDelete, setSocialToDelete] = useState<SocialMedia | null>(null);
    const [newSocial, setNewSocial] = useState({ platform: "", url: "" });

    const platforms = useMemo(() => [
        { id: "instagram", label: "Instagram" },
        { id: "facebook", label: "Facebook" },
        { id: "whatsapp", label: "WhatsApp" },
        { id: "twitter", label: "Twitter / X" },
        { id: "youtube", label: "YouTube" },
        { id: "linkedin", label: "LinkedIn" },
        { id: "tiktok", label: "TikTok" },
        { id: "pinterest", label: "Pinterest" }
    ], []);

    const loadSocialMedias = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: SocialMediaResponse = await getAdminSocialMedias(1, 50); // Get all for this simple list
            setSocialMedias(data.data);
            setLocalSocials(JSON.parse(JSON.stringify(data.data)));
        } catch (err) {
            console.error("Failed to load social medias:", err);
            toast.error("Erro ao carregar redes sociais");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSocialMedias();
    }, [loadSocialMedias]);

    const handleUpdateLocal = (social: SocialMedia, newUrl: string) => {
        setLocalSocials(prev => prev.map(s => s.id === social.id ? { ...s, url: newUrl } : s));
    };

    const handleToggleLocal = (social: SocialMedia) => {
        setLocalSocials(prev => prev.map(s => s.id === social.id ? { ...s, isActive: !s.isActive } : s));
    };

    const handleCreate = async () => {
        if (!newSocial.platform || !newSocial.url) return;
        setIsSaving(true);
        try {
            await createSocialMedia({
                platform: newSocial.platform,
                url: newSocial.url,
                isActive: true
            });
            toast.success("Rede social adicionada! 🎉");
            setIsAddModalOpen(false);
            setNewSocial({ platform: "", url: "" });
            loadSocialMedias();
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!socialToDelete) return;
        setIsDeleting(true);
        try {
            await deleteSocialMedia(socialToDelete.id);
            toast.success("Removido com sucesso");
            setIsDeleteModalOpen(false);
            loadSocialMedias();
        } catch (error) {
            toast.error("Erro ao remover");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveAll = async () => {
        const changes = localSocials.filter(local => {
            const original = socialMedias.find(o => o.id === local.id);
            return original && (original.url !== local.url || original.isActive !== local.isActive);
        });

        if (changes.length === 0) {
            toast.info("Nenhuma alteração para salvar");
            return;
        }

        setIsSaving(true);
        try {
            await Promise.all(changes.map(s => updateSocialMedia(s.id, {
                url: s.url,
                isActive: s.isActive
            })));
            toast.success("Todas as alterações foram salvas! ✨");
            loadSocialMedias();
        } catch (error) {
            toast.error("Erro ao salvar algumas alterações");
        } finally {
            setIsSaving(false);
        }
    };

    const availablePlatforms = useMemo(() => {
        const used = localSocials.map(s => s.platform.toLowerCase());
        return platforms.filter(p => !used.includes(p.id));
    }, [localSocials, platforms]);

    return (
        <div className="p-6 md:p-12 w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-900 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Links das Redes Sociais</h2>
                        <p className="text-sm text-slate-400 mt-1">Configure os links que aparecerão no rodapé da loja</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-all shadow-md cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <SkeletonSocialMedia key={i} />)}
                        </div>
                    ) : localSocials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                            <Globe className="w-12 h-12 text-slate-200 mb-4" />
                            <p className="text-slate-500">Nenhuma rede social cadastrada</p>
                        </div>
                    ) : (
                        localSocials.map(social => (
                            <SocialMediaItem
                                key={social.id}
                                social={social}
                                onDelete={(s) => {
                                    setSocialToDelete(s);
                                    setIsDeleteModalOpen(true);
                                }}
                                onUpdate={handleUpdateLocal}
                                onToggle={handleToggleLocal}
                            />
                        ))
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center">
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving || isLoading}
                        className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar Redes Sociais
                    </button>
                </div>
            </div>

            <GenericModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Adicionar Rede Social"
            >
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Plataforma</label>
                        <select
                            value={newSocial.platform}
                            onChange={(e) => setNewSocial(prev => ({ ...prev, platform: e.target.value }))}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none transition-all text-sm"
                        >
                            <option value="">Selecione uma plataforma</option>
                            {availablePlatforms.map(p => (
                                <option key={p.id} value={p.label}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">URL do Perfil</label>
                        <input
                            type="url"
                            value={newSocial.url}
                            onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="https://..."
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 h-11 px-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isSaving || !newSocial.platform || !newSocial.url}
                            className="flex-1 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            </GenericModal>

            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Link"
            >
                <DeleteConfirmation
                    title="Remover rede social?"
                    description={`Você tem certeza que deseja remover o link do ${socialToDelete?.platform}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                />
            </GenericModal>
        </div>
    );
}
