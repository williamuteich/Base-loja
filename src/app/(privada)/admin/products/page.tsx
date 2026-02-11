"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Package, Eye, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { getAdminProducts, deleteProduct } from "@/services/product";
import GenericPagination from "@/app/(privada)/components/generic-pagination";
import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";
import { Product, ProductsResponse } from "@/types/product";

export default function ProductsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ProductsResponse>({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    async function loadProducts(page: number) {
        setIsLoading(true);
        try {
            const response = await getAdminProducts(page, 10, debouncedSearch);
            setData(response);
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error("Erro ao carregar produtos");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProducts(1);
    }, [debouncedSearch]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= data.meta.totalPages) {
            loadProducts(newPage);
        }
    };

    const confirmDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            await deleteProduct(selectedProduct.id);
            toast.success("Produto excluído com sucesso! 👋");
            setIsDeleteModalOpen(false);
            loadProducts(data.meta.page);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Erro ao excluir produto ❌");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 md:p-12 w-full mx-auto space-y-8 pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Produtos</h1>
                <p className="text-slate-500 text-base mt-2">Gerencie o catálogo de produtos da sua loja</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 rounded-lg bg-slate-50 border border-slate-200 focus:border-slate-500 focus:bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 placeholder:text-slate-400"
                        placeholder="Buscar produtos por nome ou descrição..."
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <Link
                    href="/admin/products/create"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 text-white shadow-soft hover:shadow-hover h-10 px-5 py-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Novo Produto
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <p>Carregando produtos...</p>
                    </div>
                ) : data.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Nenhum produto encontrado</p>
                        <p className="text-sm">Tente buscar por outro termo ou adicione um novo produto</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Produto</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Categoria</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Marca</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Preço</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 shrink-0">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0].url.startsWith("http") ? product.images[0].url : `${process.env.API_URL || "http://localhost:3000"}/${product.images[0].url}`}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-slate-300">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-slate-400 font-mono">ID: {product.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.categories?.map((c) => (
                                                    <span key={c.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {product.brand?.name || "-"}
                                        </td>
                                        <td className="p-4 font-medium text-slate-900">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                                {product.isActive ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/produto/${product.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Visualizar na loja">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/admin/products/${product.id}`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" title="Editar">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(product)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center">
                    <GenericPagination
                        page={data.meta.page}
                        totalPages={data.meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Produto"
            >
                <DeleteConfirmation
                    title="Cuidado! Ação irreversível"
                    description={`Você tem certeza que deseja excluir o produto "${selectedProduct?.title}"? Esta ação não pode ser desfeita.`}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                />
            </GenericModal>
        </div>

    );
}
