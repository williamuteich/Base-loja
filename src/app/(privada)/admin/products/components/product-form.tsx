"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/services/product";
import { ProductFormProps } from "@/types/product";

export default function ProductForm({ product, brands, categories }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const backendUrl = apiUrl.includes("localhost") ? "" : apiUrl;

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

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [brandId, setBrandId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [specs, setSpecs] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const [variants, setVariants] = useState<{ name: string; color: string; quantity: string }[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [keptImageUrls, setKeptImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (product) {
            setTitle(product.title);
            setDescription(product.description || "");
            setPrice(formatCurrency(product.price));
            setDiscountPrice(product.discountPrice ? formatCurrency(product.discountPrice) : "");
            setBrandId(product.brandId || "");
            setIsActive(product.isActive ?? true);

            setKeptImageUrls(product.images?.map(img => img.url) || []);
            setSelectedCategoryIds(product.categories?.map(c => c.id) || []);

            if (product.specs) {
                const specsStr = Object.entries(product.specs as Record<string, any>)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                setSpecs(specsStr);
            } else {
                setSpecs("");
            }

            if (product.variants?.length) {
                setVariants(product.variants.map(v => ({
                    name: v.name,
                    color: v.color,
                    quantity: v.quantity.toString()
                })));
            } else {
                setVariants([{ name: "Padrão", color: "#000000", quantity: "0" }]);
            }
        } else {
            setTitle("");
            setDescription("");
            setPrice("");
            setDiscountPrice("");
            setBrandId("");
            setIsActive(true);
            setSpecs("");
            setSelectedCategoryIds([]);
            setKeptImageUrls([]);
            setSelectedFiles([]);
            setPreviewUrls([]);
            setVariants([{ name: "Padrão", color: "#000000", quantity: "0" }]);
        }
    }, [product]);


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);

            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeFile = (index: number) => {
        const urlToRemove = previewUrls[index];
        URL.revokeObjectURL(urlToRemove);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url: string) => {
        setKeptImageUrls((prev) => prev.filter((u) => u !== url));
    };

    const addVariant = () => {
        setVariants([...variants, { name: "", color: "#000000", quantity: "0" }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            const rawPrice = parseCurrency(price);
            const rawDiscountPrice = discountPrice ? parseCurrency(discountPrice) : null;

            if (rawDiscountPrice && parseFloat(rawDiscountPrice) >= parseFloat(rawPrice)) {
                toast.error("O preço promocional deve ser menor que o preço de venda.");
                setIsSubmitting(false);
                return;
            }

            formData.append("price", rawPrice); // Send raw number
            if (rawDiscountPrice) formData.append("discountPrice", rawDiscountPrice);
            if (brandId) formData.append("brandId", brandId);
            formData.append("isActive", isActive.toString());
            if (specs) formData.append("specs", specs);

            formData.append("variants", JSON.stringify(variants));
            formData.append("categoryIds", JSON.stringify(selectedCategoryIds));

            if (product) {
                formData.append("keptImageUrls", JSON.stringify(keptImageUrls));
            }

            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            if (product) {
                await updateProduct(product.id, formData);
                toast.success("Produto atualizado com sucesso!");
            } else {
                await createProduct(formData);
                toast.success("Produto criado com sucesso!");
            }

            router.push("/admin/products");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erro ao salvar produto.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 px-6 md:px-12 max-w-7xl mx-auto pb-20">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8 transition-all hover:shadow-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-500/5 transition-colors"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-50 p-1 border border-slate-100 shadow-soft overflow-hidden group/img flex items-center justify-center">
                            {keptImageUrls.length > 0 ? (
                                <Image
                                    src={keptImageUrls[0].startsWith('http') ? keptImageUrls[0] : `${backendUrl}/${keptImageUrls[0]}`}
                                    alt="Preview"
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/img:scale-105"
                                    unoptimized
                                />
                            ) : previewUrls.length > 0 ? (
                                <Image
                                    src={previewUrls[0]}
                                    alt="New Preview"
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/img:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-slate-300">
                                    <Plus className="w-10 h-10" />
                                </div>
                            )}
                        </div>

                        <div className={`absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full border-4 border-white shadow-md transition-colors ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                            {product ? (
                                <>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-widest rounded-lg border border-slate-200">
                                        PRODUTO #{product.id.slice(0, 8)}
                                    </span>
                                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[10px] uppercase font-bold tracking-widest rounded-lg border border-blue-500/20">
                                        {brands.find(b => b.id === brandId)?.name || 'Sem Marca'}
                                    </span>
                                </>
                            ) : (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 text-[10px] uppercase font-bold tracking-widest rounded-lg border border-emerald-200">
                                    Modo de Criação
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            {title || 'Novo Produto'}
                        </h1>

                        <p className="text-slate-400 text-sm font-medium max-w-lg">
                            {product
                                ? 'Ajuste as informações, gerencie o estoque das variantes e organize as mídias para exibição na loja.'
                                : 'Preencha os dados abaixo para cadastrar um novo produto em sua loja.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all border border-slate-200 font-bold text-sm"
                        >
                            <X className="w-4 h-4" />
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Informações do Produto</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Título do Produto</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição Detalhada</label>
                                    <textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Preço de Venda</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                                            <input
                                                type="text"
                                                value={price}
                                                onChange={(e) => handleCurrencyChange(e.target.value, setPrice)}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Preço Promocional</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                                            <input
                                                type="text"
                                                value={discountPrice}
                                                onChange={(e) => handleCurrencyChange(e.target.value, setDiscountPrice)}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Cores e Variantes</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600 font-bold text-sm bg-blue-500/5 px-4 py-2 rounded-xl transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar
                                </button>
                            </div>

                            <div className="space-y-4">
                                {variants.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                                        <p className="font-medium">Nenhuma variante. Clique em adicionar para começar.</p>
                                    </div>
                                ) : (
                                    variants.map((v, i) => (
                                        <div key={i} className="flex flex-wrap items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all relative group">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Tom</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-soft group-hover:scale-105 transition-transform">
                                                        <input
                                                            type="color"
                                                            value={v.color}
                                                            onChange={(e) => updateVariant(i, "color", e.target.value)}
                                                            className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer border-none bg-transparent"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-100 italic">
                                                        {v.color}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-[200px]">
                                                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Nome da Cor</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Branco Gelo"
                                                    value={v.name}
                                                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>

                                            <div className="w-32">
                                                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Estoque</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    min="0"
                                                    value={v.quantity}
                                                    onChange={(e) => updateVariant(i, "quantity", e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(i)}
                                                    className="p-2.5 text-rose-400 cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-3.5 text-slate-600 cursor-pointer hover:bg-slate-100 rounded-2xl transition-all font-bold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-10 py-3.5 bg-slate-900 text-white cursor-pointer rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center gap-3 font-bold"
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? 'Sincronizando...' : (product ? 'Salvar Alterações' : 'Criar Produto')}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Classificação</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Marca</label>
                                <select
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                                >
                                    <option value="">Selecione uma marca</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Categorias</label>
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <div className="space-y-3">
                                        {categories.map((category) => {
                                            const isSelected = selectedCategoryIds.includes(category.id);
                                            return (
                                                <div
                                                    key={category.id}
                                                    onClick={() => toggleCategory(category.id)}
                                                    className="flex items-center gap-3 group cursor-pointer p-2 rounded-md hover:bg-slate-200"
                                                >
                                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all bg-white ${isSelected ? 'bg-green-600 border-green-600' : 'border-red-600'}`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                                                        {category.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Mídias</h3>
                                <span className="text-xs font-bold text-slate-400">
                                    {keptImageUrls.length + previewUrls.length} total
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {keptImageUrls.map((url, index) => (
                                    <div key={url} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm leading-none bg-slate-50">
                                        <Image
                                            src={url.startsWith('http') ? url : `${backendUrl}/${url}`}
                                            alt="Imagem do produto"
                                            fill
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />

                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg z-10">
                                                Principal
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(url)}
                                                className="p-2.5 bg-rose-500 text-white cursor-pointer rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-dashed border-blue-500/30 shadow-sm leading-none bg-blue-500/5">
                                        <Image
                                            src={url}
                                            alt="Nova imagem"
                                            fill
                                            className="w-full h-full object-cover"
                                        />

                                        {keptImageUrls.length === 0 && index === 0 && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg z-10">
                                                Principal
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="p-2.5 bg-rose-500 text-white cursor-pointer rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="relative group aspect-square">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                    />
                                    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 transition-all group-hover:border-slate-900 group-hover:bg-slate-100 leading-tight">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-slate-400 mb-2 group-hover:text-slate-900 transition-colors">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-700">Adicionar</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Visibilidade</h3>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">Online na Loja</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Disponibilidade</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner">
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Especificações Técnicas</label>
                                <textarea
                                    rows={3}
                                    value={specs}
                                    onChange={(e) => setSpecs(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                    placeholder="Ex: Voltagem: 110V, Potência: 1500W"
                                ></textarea>
                                <p className="mt-2 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                    Dica: Use o formato Chave: Valor, separado por vírgulas.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>
    );
}

