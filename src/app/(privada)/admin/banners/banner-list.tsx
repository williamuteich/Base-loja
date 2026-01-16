"use client";

import { useState, useEffect, useCallback } from "react";
import { Banner, BannersResponse } from "@/types/banner";
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from "@/services/banner";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";

import SkeletonBanner from "./components/skeleton-banner";
import BannerForm from "./components/banner-form";
import BannerCard from "./components/banner-card";
import BannerHeader from "./components/banner-header";
import GenericPagination from "../../components/generic-pagination";

import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";

export default function BannerList() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const loadBanners = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: BannersResponse = await getAdminBanners(page, 10, debouncedSearch);
            setBanners(data.data);
            setTotalPages(data.meta.totalPages);
            setTotalItems(data.meta.total);
        } catch (err) {
            console.error("Failed to load banners:", err);
            setError("Erro ao carregar banners. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadBanners();
    }, [loadBanners]);

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        try {
            if (selectedBanner) {
                await updateBanner(selectedBanner.id, formData);
                toast.success("Banner atualizado com sucesso! ✨");
            } else {
                await createBanner(formData);
                toast.success("Novo banner criado com sucesso! 🎉");
            }
            setIsModalOpen(false);
            loadBanners();
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Erro ao salvar banner ❌");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedBanner) return;
        setIsDeleting(true);
        try {
            await deleteBanner(selectedBanner.id);
            toast.success("Banner excluído com sucesso! 👋");
            setIsDeleteModalOpen(false);
            loadBanners();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Erro ao excluir banner ❌");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 md:p-12">
            <BannerHeader
                search={search}
                onSearchChange={setSearch}
                onClearSearch={() => setSearch("")}
                onNewBanner={() => {
                    setSelectedBanner(undefined);
                    setIsModalOpen(true);
                }}
            />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <SkeletonBanner key={i} />)}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="bg-red-50 p-4 rounded-full mb-3">
                            <ImageIcon className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Erro ao carregar</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-4">{error}</p>
                        <button onClick={loadBanners} className="text-sm font-medium text-pink-600 hover:underline">
                            Tentar novamente
                        </button>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum banner encontrado</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                            {search ? "Tente buscar com outros termos." : "Comece criando um novo banner para sua loja."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {banners.map((banner, index) => (
                                <BannerCard
                                    key={banner.id}
                                    banner={banner}
                                    index={index}
                                    onEdit={(b) => {
                                        setSelectedBanner(b);
                                        setIsModalOpen(true);
                                    }}
                                    onDelete={(b) => {
                                        setSelectedBanner(b);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                        <GenericPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedBanner ? "Editar Banner" : "Novo Banner"}
            >
                <BannerForm
                    banner={selectedBanner}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    isSaving={isSaving}
                />
            </GenericModal>

            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Banner"
            >
                <DeleteConfirmation
                    title="Cuidado! Ação irreversível"
                    description={`Você tem certeza que deseja excluir o banner "${selectedBanner?.title}"? Esta ação não pode ser desfeita.`}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                />
            </GenericModal>
        </div>
    );
}
