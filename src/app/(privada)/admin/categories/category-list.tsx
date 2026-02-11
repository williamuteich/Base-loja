"use client";

import { useState, useEffect, useCallback } from "react";
import { Category, CategoriesResponse } from "@/types/category";
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from "@/services/category";
import { toast } from "sonner";
import { FolderTree, SquarePen, Trash2, Home, Package } from "lucide-react";
import Image from "next/image";
import CategoryHeader from "./components/category-header";
import SkeletonCategory from "./components/skeleton-category";
import CategoryForm from "./components/category-form";
import GenericPagination from "../../components/generic-pagination";
import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const loadCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: CategoriesResponse = await getAdminCategories(page, 9, debouncedSearch);
            setCategories(data.data);
            setTotalPages(data.meta.totalPages);
        } catch (err) {
            console.error("Failed to load categories:", err);
            setError("Erro ao carregar categorias. Tente novamente.");
            toast.error("Erro ao carregar categorias");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, formData);
                toast.success("Categoria atualizada com sucesso! ✨");
            } else {
                await createCategory(formData);
                toast.success("Nova categoria criada com sucesso! 📁");
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar categoria");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            await deleteCategory(categoryToDelete.id);
            toast.success("Categoria removida com sucesso! 👋");
            setIsDeleteModalOpen(false);
            loadCategories();
        } catch (error: any) {
            toast.error(error.message || "Erro ao remover categoria");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <CategoryHeader
                search={search}
                onSearchChange={setSearch}
                onClearSearch={() => setSearch("")}
                onNewCategory={() => {
                    setSelectedCategory(undefined);
                    setIsModalOpen(true);
                }}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCategory key={i} />)}
                </div>
            ) : error ? (
                <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center">
                    <p className="text-rose-600 font-medium">{error}</p>
                    <button onClick={loadCategories} className="mt-4 text-sm font-bold text-slate-900 hover:underline cursor-pointer">
                        Tentar novamente
                    </button>
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white border border-slate-200 p-24 rounded-3xl text-center">
                    <FolderTree className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Nenhuma categoria encontrada.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                                <div className="relative h-40 bg-slate-100">
                                    {category.imageUrl ? (
                                        <Image
                                            src={`${process.env.API_URL || ""}/${category.imageUrl}`}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FolderTree className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{category.name}</h3>
                                    </div>

                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {category.isHome && (
                                            <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-lg flex items-center gap-1">
                                                <Home className="w-3 h-3" /> Home
                                            </span>
                                        )}
                                        {category.isActive ? (
                                            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-lg">Ativo</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-lg">Inativo</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <Package className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-semibold">{category._count?.products || 0} produtos</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                                            title="Editar Categoria"
                                        >
                                            <SquarePen className="w-4.5 h-4.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCategoryToDelete(category);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                            title="Excluir Categoria"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center rounded-2xl">
                        <GenericPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
            >
                <CategoryForm
                    category={selectedCategory}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    isSaving={isSaving}
                />
            </GenericModal>

            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Categoria"
            >
                <DeleteConfirmation
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                    title="Ação Irreversível"
                    description={
                        categoryToDelete?._count?.products && categoryToDelete._count.products > 0
                            ? `Não é possível excluir esta categoria porque existem ${categoryToDelete._count.products} produtos vinculados a ela. Remova os produtos antes de tentar excluir.`
                            : `Você tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"? Esta ação removerá a organização destes produtos, mas não excluirá os produtos em si.`
                    }
                />
            </GenericModal>
        </div>
    );
}
