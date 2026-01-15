"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types/product";
import { StoreConfig } from "@/types/store-config";
import { cn } from "@/lib/utils";
import { Minus, Plus, MessageCircle, Truck, Store, Heart, Share2 } from "lucide-react";

interface ProductDetailProps {
    product: Product;
    storeConfig: StoreConfig | null;
    backendUrl: string;
}

export function ProductDetail({ product, storeConfig, backendUrl }: ProductDetailProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
        if (product.images && product.images.length > 0) {
            setSelectedImageIndex(0);
        }
    }, [product]);

    const images = useMemo(() => product.images || [], [product.images]);
    const variants = useMemo(() => product.variants || [], [product.variants]);

    const specs = useMemo(() => {
        if (!product.specs) return [];
        return Object.entries(product.specs).map(([key, value]) => ({ key, value }));
    }, [product.specs]);

    const totalQuantity = useMemo(() => {
        return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    }, [variants]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        const max = variant.quantity || 0;

        if (max <= 0) {
            setQuantity(0);
        } else if (quantity > max) {
            setQuantity(max);
        } else if (quantity < 1) {
            setQuantity(1);
        }
    };

    const increaseQuantity = () => {
        if (selectedVariant && quantity < selectedVariant.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const contactViaWhatsApp = () => {
        if (!product || !storeConfig) return;

        const phoneRaw = storeConfig.whatsapp || storeConfig.phone || '';
        const phone = phoneRaw.replace(/\D/g, '');

        const parts: string[] = [];
        parts.push(`Olá, amei este produto: *${product.title}*`);
        if (selectedVariant) {
            parts.push(`Opção: ${selectedVariant.color || selectedVariant.name || ''}`.trim());
        }
        parts.push(`Quantidade: ${quantity}`);

        const urlProduct = `${backendUrl}/produto/${product.id}`;
        parts.push(`Link: ${urlProduct}`);

        const message = encodeURIComponent(parts.join('\n'));

        const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
        const waUrl = `${waBase}?text=${message}`;

        window.open(waUrl, '_blank');
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 pt-4">
            <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white/50 border border-slate-100 shadow-sm">
                    {images.length > 0 ? (
                        <Image
                            src={`${backendUrl}/${images[selectedImageIndex].url}`}
                            alt={product.title}
                            fill
                            priority
                            className="object-contain"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-300">
                            <Store size={64} strokeWidth={1} />
                        </div>
                    )}

                    {product.discountPrice && product.discountPrice < product.price && (
                        <div className="absolute top-6 left-6 flex flex-col items-center justify-center w-16 h-16 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100">
                            <span className="text-xs font-medium text-gray-500 uppercase">Off</span>
                            <span className="text-lg font-bold text-rose-600">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                            </span>
                        </div>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        {images.map((image, i) => (
                            <button
                                key={image.url}
                                type="button"
                                onClick={() => setSelectedImageIndex(i)}
                                className={cn(
                                    "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                                    i === selectedImageIndex
                                        ? "border-rose-400 shadow-lg shadow-rose-200"
                                        : "border-transparent hover:border-rose-200"
                                )}
                            >
                                <Image
                                    src={`${backendUrl}/${image.url}`}
                                    alt={`Visualização ${i + 1}`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:col-span-6 flex flex-col">
                <div className="sticky top-8 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-baseline gap-4">
                            <span className="text-3xl font-light text-rose-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                            </span>
                            {product.discountPrice && product.discountPrice < product.price && (
                                <span className="text-xl text-rose-300 line-through font-light">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            {product.brand && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-serif text-rose-900">Marca:</span>
                                    <span className="text-gray-600 font-light">{product.brand.name}</span>
                                </div>
                            )}

                            {product.categories && product.categories.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-serif text-rose-900">Categoria:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.categories.map((cat) => (
                                            <span
                                                key={cat.categoryId}
                                                className="px-2.5 py-0.5 rounded-full border border-rose-100 text-xs font-medium text-rose-600 bg-rose-50"
                                            >
                                                {cat.category?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-rose-100/50" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-serif text-gray-900">Detalhes</h3>
                        <div className="prose prose-rose prose-sm text-gray-600 font-light leading-relaxed whitespace-pre-line">
                            <p>{product.description}</p>
                        </div>

                        {specs.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {specs.map((spec) => (
                                    <div key={spec.key} className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
                                        <span className="font-medium text-gray-700 capitalize">{spec.key}</span>
                                        <span className="text-gray-500">{String(spec.value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-rose-100/50" />

                    {variants.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                                    Escolha o modelo
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleVariantSelect(variant)}
                                        className={cn(
                                            "group relative cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300",
                                            selectedVariant?.id === variant.id
                                                ? "border-rose-400 bg-rose-50 text-rose-900 shadow-sm"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200"
                                        )}
                                    >
                                        {variant.color && variant.color.startsWith('#') && (
                                            <span
                                                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                                style={{ backgroundColor: variant.color }}
                                            />
                                        )}
                                        <div className="flex flex-col items-start leading-none gap-1">
                                            <span className="text-sm font-medium">{variant.name}</span>
                                            <span className="text-[10px] text-gray-500 font-medium">Restam {variant.quantity}</span>
                                        </div>
                                        {selectedVariant?.id === variant.id && (
                                            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] uppercase font-bold rounded-full shadow-sm">
                                                Leva
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white shadow-sm">
                                <button
                                    onClick={decreaseQuantity}
                                    className={cn(
                                        "w-10 h-10 flex cursor-pointer items-center justify-center rounded-full hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors",
                                        quantity <= 1 && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-medium text-lg text-gray-900">{quantity}</span>
                                <button
                                    onClick={increaseQuantity}
                                    className={cn(
                                        "w-10 h-10 flex cursor-pointer items-center justify-center rounded-full hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors",
                                        (!selectedVariant || quantity >= selectedVariant.quantity) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                {totalQuantity > 0 ? (
                                    <span className="flex items-center gap-2 text-emerald-600 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Disponível
                                    </span>
                                ) : (
                                    <span className="text-rose-500 font-medium">Indisponível</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={contactViaWhatsApp}
                                disabled={!selectedVariant || selectedVariant.quantity === 0}
                                className="flex-1 cursor-pointer h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-medium text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span>Eu quero!</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6">
                        {[
                            { icon: Store, title: "Loja Física", desc: "Visite-nos" },
                            { icon: Truck, title: "Entrega", desc: "Para todo Brasil" },
                            { icon: Share2, title: "Compartilhe", desc: "Com amigas" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-rose-50/50 transition-colors">
                                <item.icon className="w-6 h-6 text-rose-400" />
                                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{item.title}</span>
                                <span className="text-[10px] text-gray-500">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
