"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Package, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { getAdminProducts, ProductsResponse } from "@/services/product";
import { Product } from "@/types/product";

export default function ProductsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ProductsResponse>({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

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

    return (
        <div className="p-6 md:p-12 w-full mx-auto space-y-8 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Produtos</h1>
                    <p className="text-slate-500">Gerencie o catálogo de produtos da sua loja</p>
                </div>
                <Link
                    href="/admin/products/create"
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Novo Produto
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar produtos por nome ou descrição..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
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
                                                            src={product.images[0].url.startsWith("http") ? product.images[0].url : `${process.env.NEXT_PUBLIC_API_URL || ""}/${product.images[0].url}`}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
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
                                                    <span key={c.categoryId} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                                                        {c.category?.name}
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
                                                <Link href={`/product/${product.id}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar na loja">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
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

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Mostrando {((data.meta.page - 1) * data.meta.limit) + 1} até {Math.min(data.meta.page * data.meta.limit, data.meta.total)} de {data.meta.total} resultados
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(data.meta.page - 1)}
                            disabled={data.meta.page === 1}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => handlePageChange(data.meta.page + 1)}
                            disabled={data.meta.page === data.meta.totalPages}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
