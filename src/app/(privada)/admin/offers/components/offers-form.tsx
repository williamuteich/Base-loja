"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Search, Calendar, Tag, DollarSign, Save, Percent, Check, AlertCircle, Loader2, Package, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getAdminProducts, updateProduct } from "@/services/product";
import { useDebounce } from "@/hooks/use-debounce";
import GenericPagination from "@/app/(privada)/components/generic-pagination";

export default function OffersForm() {
    const backendUrl = process.env.API_URL || "http://localhost:3000";

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<"offers" | "new">("offers");

    const [currentPrice, setCurrentPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const response = await getAdminProducts(page, itemsPerPage, debouncedSearch, viewMode === "offers" ? true : undefined);
                setSearchResults(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Erro ao buscar produtos");
                setSearchResults([]);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [debouncedSearch, page, viewMode]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, viewMode]);

    const formatCurrency = (value: string | number) => {
        if (!value) return "";
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return "";
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const parseCurrency = (value: string) => {
        return value.replace(/\./g, '').replace(',', '.');
    };

    const handleCurrencyChange = (value: string, setter: (val: string) => void) => {
        const numericValue = value.replace(/\D/g, "");
        const floatValue = parseFloat(numericValue) / 100;

        if (isNaN(floatValue)) {
            setter("");
            return;
        }

        setter(new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(floatValue));
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setCurrentPrice(formatCurrency(product.price));
        if (product.discountPrice) {
            setDiscountPrice(formatCurrency(product.discountPrice));
        } else {
            setDiscountPrice("");
        }
        toast.success(`Produto "${product.title}" selecionado!`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleRemoveDiscount = async (product: Product) => {
        try {
            const formData = new FormData();
            formData.append("discountPrice", "");

            const result = await updateProduct(product.id, formData);
            if (result) {
                toast.success(`Oferta removida de "${product.title}"`);
                const response = await getAdminProducts(page, itemsPerPage, debouncedSearch, viewMode === "offers" ? true : undefined);
                setSearchResults(response.data);
                if (selectedProduct?.id === product.id) {
                    setSelectedProduct(null);
                    setDiscountPrice("");
                    setCurrentPrice("");
                }
            }
        } catch (error) {
            toast.error("Erro ao remover oferta.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProduct) {
            toast.error("Por favor, selecione um produto.");
            return;
        }

        if (!discountPrice) {
            toast.error("Por favor, defina um preço promocional.");
            return;
        }

        const priceNum = parseFloat(parseCurrency(currentPrice));
        const discountPriceNum = parseFloat(parseCurrency(discountPrice));

        if (discountPriceNum >= priceNum) {
            toast.error("O preço promocional deve ser menor que o preço de venda.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("price", parseCurrency(currentPrice));
            formData.append("discountPrice", parseCurrency(discountPrice));

            const result = await updateProduct(selectedProduct.id, formData);

            if (result) {
                toast.success("Promoção aplicada com sucesso!");
                const response = await getAdminProducts(page, itemsPerPage, debouncedSearch, viewMode === "offers" ? true : undefined);
                setSearchResults(response.data);
                setSelectedProduct(null);
                setDiscountPrice("");
                if (viewMode === "new") {
                    setViewMode("offers");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao aplicar promoção.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Gerenciar Ofertas</h2>
                                <p className="text-sm text-slate-400 font-medium">Aplique ou remova descontos dos produtos</p>
                            </div>
                        </div>

                        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-fit">
                            <button
                                type="button"
                                onClick={() => setViewMode("offers")}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${viewMode === "offers"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Em Oferta
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("new")}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${viewMode === "new"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Adicionar
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Digite o nome do produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:font-normal"
                            />
                            {isLoadingProducts && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Produto</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Categoria</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Preço</th>
                                            {viewMode === "offers" && <th className="p-4 font-semibold text-slate-600 text-sm">Promoção</th>}
                                            <th className="p-4 font-semibold text-slate-600 text-sm text-center">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingProducts && searchResults.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                                    Carregando...
                                                </td>
                                            </tr>
                                        ) : searchResults.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                                    Nenhum produto encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            searchResults.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    onClick={() => handleProductSelect(product)}
                                                    className={`border-b border-slate-100 last:border-0 transition-colors cursor-pointer ${selectedProduct?.id === product.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 shrink-0">
                                                                {product.images && product.images.length > 0 ? (
                                                                    <Image
                                                                        src={product.images[0].url.startsWith('http') ? product.images[0].url : `${backendUrl}/${product.images[0].url}`}
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
                                                                <p className={`font-medium line-clamp-1 ${selectedProduct?.id === product.id ? 'text-blue-700' : 'text-slate-900'}`}>
                                                                    {product.title}
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-mono">ID: {product.id.substring(0, 8)}...</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {product.categories?.slice(0, 1).map((c) => (
                                                                <span key={c.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md whitespace-nowrap">
                                                                    {c.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                                                        R$ {formatCurrency(product.price)}
                                                    </td>
                                                    {viewMode === "offers" && (
                                                        <td className="p-4 font-bold text-emerald-600 whitespace-nowrap">
                                                            R$ {formatCurrency(product.discountPrice || 0)}
                                                        </td>
                                                    )}
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {viewMode === "offers" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveDiscount(product);
                                                                    }}
                                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="Remover Desconto"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedProduct?.id === product.id
                                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                                : 'bg-slate-100 text-slate-300'
                                                                }`}>
                                                                <Check className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center">
                                    <GenericPagination
                                        page={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>

                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 sticky top-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <Percent className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Configuração</h2>
                                <p className="text-sm text-slate-400 font-medium">Defina o preço promocional</p>
                            </div>
                        </div>

                        {!selectedProduct ? (
                            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-300">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">Selecione um produto ao lado para configurar a oferta.</p>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                                <Image
                                                    src={selectedProduct.images[0].url.startsWith('http') ? selectedProduct.images[0].url : `${backendUrl}/${selectedProduct.images[0].url}`}
                                                    alt={selectedProduct.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{selectedProduct.title}</p>
                                            <p className="text-xs text-slate-500">R$ {formatCurrency(selectedProduct.price)}</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 my-2"></div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">Valores</label>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preço Atual</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                                                    <input
                                                        type="text"
                                                        value={currentPrice}
                                                        onChange={(e) => handleCurrencyChange(e.target.value, setCurrentPrice)}
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
                                                        placeholder="0,00"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preço com Desconto</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">R$</span>
                                                    <input
                                                        type="text"
                                                        value={discountPrice}
                                                        onChange={(e) => handleCurrencyChange(e.target.value, setDiscountPrice)}
                                                        className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-emerald-700 placeholder:text-emerald-300"
                                                        placeholder="0,00"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <DollarSign className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-sm tracking-wide active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            "Salvando..."
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Salvar
                                            </>
                                        )}
                                    </button>

                                    {selectedProduct.discountPrice && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDiscount(selectedProduct)}
                                            className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer"
                                            title="Remover Promoção"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </form>
    );
}
