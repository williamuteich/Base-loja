"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types/product";
import { StoreConfig } from "@/types/store-config";
import { cn } from "@/lib/utils";
import { Minus, Plus, MessageCircle, Truck, Store, MapPin } from "lucide-react";

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
        parts.push(`Olá, tenho interesse no produto: ${product.title}`);
        if (selectedVariant) {
            parts.push(`Formato/variante: ${selectedVariant.color || selectedVariant.name || ''}`.trim());
        }
        parts.push(`Quantidade: ${quantity}`);

        const urlProduct = `${backendUrl}/produto/${product.id}`;
        parts.push(`Link do produto: ${urlProduct}`);

        const message = encodeURIComponent(parts.join('\n'));

        const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
        const waUrl = `${waBase}?text=${message}`;

        window.open(waUrl, '_blank');
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    {images.length > 0 ? (
                        <Image
                            src={`${backendUrl}/${images[selectedImageIndex].url}`}
                            alt={product.title}
                            fill
                            priority
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                        </div>
                    )}

                    {product.discountPrice && product.discountPrice < product.price && (
                        <span className="absolute top-4 left-4 bg-pink-700 text-white text-sm font-bold px-4 py-2 rounded-full">
                            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((image, i) => (
                            <button
                                key={image.url}
                                type="button"
                                onClick={() => setSelectedImageIndex(i)}
                                className={cn(
                                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                                    i === selectedImageIndex
                                        ? "border-pink-700 shadow-pink-700/30"
                                        : "border-gray-200 hover:border-pink-700/50"
                                )}
                            >
                                <Image
                                    src={`${backendUrl}/${image.url}`}
                                    alt="Miniatura do produto"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:py-4">
                <div className="flex items-center flex-wrap gap-2 mb-4">
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.categories.map((cat) => (
                                <span key={cat.categoryId} className="bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                    {cat.category?.name}
                                </span>
                            ))}
                        </div>
                    )}
                    {product.brand && (
                        <span className="bg-gray-100 text-gray-700 text-xs md:text-sm px-3 py-1.5 rounded-full">
                            {product.brand.name}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                    {product.title}
                </h1>

                {product.description && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {product.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                    {specs.map((spec) => (
                        <span key={spec.key} className="inline-flex items-center gap-1.5 bg-pink-50 text-gray-800 text-sm px-3 py-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="text-pink-700">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span className="font-medium capitalize">{spec.key}:</span>
                            <span>{String(spec.value)}</span>
                        </span>
                    ))}
                </div>

                <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-3xl font-bold text-black">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice && product.discountPrice < product.price && (
                        <span className="text-xl text-gray-500 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                    )}
                </div>

                {variants.length > 0 && (
                    <div className="mb-6">
                        <span className="text-black font-medium mb-3 block">Formatos disponíveis:</span>
                        <div className="flex flex-wrap gap-2">
                            {variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => handleVariantSelect(variant)}
                                    className={cn(
                                        "inline-flex items-center cursor-pointer gap-2 px-4 py-3 rounded-xl border-2 text-sm transition-all",
                                        selectedVariant?.id === variant.id
                                            ? "border-pink-700 bg-pink-50 text-pink-700"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-pink-700/50"
                                    )}
                                >
                                    <span className="font-medium flex items-center gap-2">
                                        {variant.color && variant.color.startsWith('#') && (
                                            <span
                                                className="block w-6 h-6 rounded-full border border-gray-200 shadow-sm shrink-0"
                                                style={{ backgroundColor: variant.color }}
                                            />
                                        )}
                                        <span>{variant.name}</span>
                                    </span>
                                    <span className="text-xs text-gray-500">({variant.quantity} un.)</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {totalQuantity >= 0 && (
                    <div className="text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-black font-medium">Disponibilidade:</span>
                            {totalQuantity > 0 ? (
                                <span className="text-green-600 font-medium">Em estoque ({totalQuantity} unidades)</span>
                            ) : (
                                <span className="text-red-600 font-medium">Esgotado</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-6 mb-8">
                    <span className="text-black font-medium">Quantidade:</span>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                        <button
                            onClick={decreaseQuantity}
                            className={cn(
                                "w-12 h-12 flex cursor-pointer items-center justify-center hover:bg-gray-100 transition-colors",
                                quantity <= 1 && "opacity-50"
                            )}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-14 text-center font-medium text-lg">{quantity}</span>
                        <button
                            onClick={increaseQuantity}
                            className={cn(
                                "w-12 h-12 flex cursor-pointer items-center justify-center hover:bg-gray-100 transition-colors",
                                (!selectedVariant || quantity >= selectedVariant.quantity) && "opacity-50"
                            )}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <button
                        onClick={contactViaWhatsApp}
                        disabled={!selectedVariant || selectedVariant.quantity === 0}
                        className="inline-flex items-center justify-center w-full sm:w-auto whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-green-600 bg-green-500 h-14 md:h-12 rounded-xl px-6 md:px-8 text-sm md:text-base flex-1 gap-2.5 shadow-lg shadow-green-500/40 disabled:shadow-none"
                    >
                        <MessageCircle size={20} />
                        Falar no WhatsApp
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-pink-50/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Store className="w-5 h-5 text-pink-700" />
                        </div>
                        <div className="leading-none flex flex-col gap-3">
                            <span className="text-sm font-medium text-black block leading-none">Qualidade garantida</span>
                            <span className="text-[11px] text-gray-600 leading-[1.3] -mt-0.5 block">Produtos selecionados com cuidado</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-pink-700" />
                        </div>
                        <div className="leading-none flex flex-col gap-3">
                            <span className="text-sm font-medium text-black block leading-none">Retire na loja</span>
                            <span className="text-[11px] text-gray-600 leading-[1.3] -mt-0.5 block">Facilidade e proximidade</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-pink-700" />
                        </div>
                        <div className="leading-none flex flex-col gap-3">
                            <span className="text-sm font-medium text-black block leading-none">Atendimento próximo</span>
                            <span className="text-[11px] text-gray-600 leading-[1.3] -mt-0.5 block">Fale direto com o comerciante</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
