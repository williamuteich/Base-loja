"use client";

import { useState, useEffect, useCallback } from "react";
import { Brand } from "@/types/brand";
import { getAdminBrands, createBrand, updateBrand, deleteBrand, BrandsResponse } from "@/services/brand";
import { toast } from "sonner";
import { Package, SquarePen, Trash2 } from "lucide-react";
import BrandHeader from "./components/brand-header";
import SkeletonBrand from "./components/skeleton-brand";
import BrandForm from "./components/brand-form";
import GenericPagination from "../../components/generic-pagination";
import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";

export default function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const loadBrands = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: BrandsResponse = await getAdminBrands(page, 10, debouncedSearch);
            setBrands(data.data);
            setTotalPages(data.meta.totalPages);
        } catch (err) {
            console.error("Failed to load brands:", err);
            setError("Erro ao carregar marcas. Tente novamente.");
            toast.error("Erro ao carregar marcas");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    const handleSave = async (data: { name: string; isActive: boolean }) => {
        setIsSaving(true);
        try {
            if (selectedBrand) {
                await updateBrand(selectedBrand.id, data);
                toast.success("Marca atualizada com sucesso! ✨");
            } else {
                await createBrand(data);
                toast.success("Nova marca criada com sucesso! 🎉");
            }
            setIsModalOpen(false);
            loadBrands();
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar marca");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!brandToDelete) return;
        setIsDeleting(true);
        try {
            await deleteBrand(brandToDelete.id);
            toast.success("Marca removida com sucesso! 👋");
            setIsDeleteModalOpen(false);
            loadBrands();
        } catch (error: any) {
            toast.error(error.message || "Erro ao remover marca");
        } finally {
            setIsDeleting(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="p-4 md:p-8">
            <BrandHeader
                search={search}
                onSearchChange={setSearch}
                onClearSearch={() => setSearch("")}
                onNewBrand={() => {
                    setSelectedBrand(undefined);
                    setIsModalOpen(true);
                }}
            />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Marca</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Produtos</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold text-white">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => <SkeletonBrand key={i} />)}
                            </tbody>
                        </table>
                    </div>
                ) : error ? (
                    <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center">
                        <p className="text-rose-600 font-medium">{error}</p>
                        <button onClick={loadBrands} className="mt-4 text-sm font-bold text-slate-900 hover:underline cursor-pointer">
                            Tentar novamente
                        </button>
                    </div>
                ) : brands.length === 0 ? (
                    <div className="bg-white border border-slate-200 p-16 rounded-2xl text-center">
                        <p className="text-slate-500">Nenhuma marca encontrada.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-900">
                                    <tr className="text-white">
                                        <th className="px-6 py-4 text-left font-semibold">Marca</th>
                                        <th className="px-6 py-4 text-left font-semibold">Produtos</th>
                                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                                        <th className="px-6 py-4 text-right font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.map((brand) => (
                                        <tr key={brand.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 shadow-sm">
                                                        {getInitials(brand.name)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{brand.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                    {brand._count?.products || 0} produtos
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {brand.isActive ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                        Ativo
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                                                        Inativo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBrand(brand);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <SquarePen className="w-4.5 h-4.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setBrandToDelete(brand);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                title={selectedBrand ? "Editar Marca" : "Nova Marca"}
            >
                <BrandForm
                    brand={selectedBrand}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    isSaving={isSaving}
                />
            </GenericModal>

            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Marca"
            >
                <DeleteConfirmation
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                    title="Cuidado! Ação irreversível"
                    description={
                        brandToDelete?._count?.products && brandToDelete._count.products > 0
                            ? `Não é possível excluir esta marca pois existem ${brandToDelete._count.products} produtos vinculados a ela. Remova ou altere os produtos antes de excluir.`
                            : `Você tem certeza que deseja excluir a marca "${brandToDelete?.name}"? Esta ação não pode ser desfeita.`
                    }
                />
            </GenericModal>
        </div>
    );
}
