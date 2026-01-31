"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ProductVariant, ProductDetailProps } from "@/types/product";
import { cn } from "@/lib/utils";
import { Minus, Plus, MessageCircle, Truck, Store, Heart, Share2, Sparkles, Star, Package, ChevronRight } from "lucide-react";

export function ProductDetail({ product, storeConfig, backendUrl }: ProductDetailProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [showAllSpecs, setShowAllSpecs] = useState(false);

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
        if (!product.specs || typeof product.specs !== 'object' || Array.isArray(product.specs)) return [];
        return Object.entries(product.specs).map(([key, value]) => ({
            key,
            value: String(value)
        }));
    }, [product.specs]);

    const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 2);

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
        parts.push(`✨ Olá, amei este produto: *${product.title}* ✨`);
        if (selectedVariant) {
            parts.push(`💎 Opção: ${selectedVariant.color || selectedVariant.name || ''}`.trim());
        }
        parts.push(`📦 Quantidade: ${quantity}`);

        const urlProduct = `${backendUrl}/produto/${product.slug}`;
        parts.push(`🔗 Link: ${urlProduct}`);

        const message = encodeURIComponent(parts.join('\n'));

        const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
        const waUrl = `${waBase}?text=${message}`;

        window.open(waUrl, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: `Confira este lindo produto: ${product.title}`,
                url: window.location.href,
            });
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
            <div className="lg:col-span-6 space-y-6">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-linear-to-br from-white to-rose-50/30 border-2 border-rose-100 shadow-2xl shadow-rose-100/30">
                    {images.length > 0 ? (
                        <Image
                            src={`${backendUrl}/${images[selectedImageIndex].url}`}
                            alt={product.title}
                            fill
                            priority
                            quality={95}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-200">
                            <Sparkles size={72} strokeWidth={1} />
                        </div>
                    )}

                    {product.discountPrice && product.discountPrice < product.price && (
                        <div className="absolute top-6 left-6 flex flex-col items-center justify-center w-14 h-14 bg-rose-600 text-white rounded-full shadow-xl border-2 border-white z-20">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Off</span>
                            <span className="text-base font-black leading-none">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                            </span>
                        </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImageIndex(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    i === selectedImageIndex
                                        ? "w-8 bg-rose-400"
                                        : "w-2 bg-rose-200 hover:bg-rose-300"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
                        {images.map((image, i) => (
                            <button
                                key={image.url}
                                type="button"
                                onClick={() => setSelectedImageIndex(i)}
                                className={cn(
                                    "relative w-28 h-28 rounded-3xl overflow-hidden border-4 transition-all duration-300 shrink-0 group",
                                    i === selectedImageIndex
                                        ? "border-rose-400 shadow-xl shadow-rose-200/50"
                                        : "border-white hover:border-rose-100 shadow-lg shadow-slate-100"
                                )}
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-white/50 to-transparent z-10" />
                                <Image
                                    src={`${backendUrl}/${image.url}`}
                                    alt={`Visualização ${i + 1}`}
                                    fill
                                    quality={60}
                                    sizes="120px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:col-span-6 flex flex-col">
                <div className="sticky top-8 p-8 lg:p-10 bg-linear-to-b from-white to-rose-50/30 border-2 border-rose-50 shadow-2xl shadow-rose-100/30 rounded-[2.5rem] space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {(product.brand || (product.categories && product.categories.length > 0)) && (
                                <div className="flex items-center gap-3 text-sm font-semibold text-rose-500/90 uppercase tracking-[0.15em]">
                                    {product.brand && (
                                        <span className="px-4 py-1.5 bg-rose-50 rounded-full">{product.brand.name}</span>
                                    )}
                                    {product.categories?.[0] && (
                                        <>
                                            <Sparkles size={12} className="text-rose-300" />
                                            <span className="px-4 py-1.5 bg-rose-50 rounded-full">{product.categories[0].name}</span>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-slate-800 leading-tight tracking-tight">
                                    {product.title}
                                </h1>
                                <button
                                    onClick={handleShare}
                                    className="w-12 h-12 flex items-center justify-center bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-100 transition-all hover:scale-105 shrink-0"
                                >
                                    <Share2 size={20} className="text-rose-500" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-rose-600 tracking-tight">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                                    </span>
                                    {product.discountPrice && product.discountPrice < product.price && (
                                        <span className="text-xl text-slate-400 line-through font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </span>
                                    )}
                                </div>

                                {totalQuantity > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50/50 rounded-full border border-rose-100/50">
                                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                                        <span className="text-[13px] font-medium text-rose-900/80">
                                            {totalQuantity} unidades disponíveis
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-rose-200/50 to-transparent" />

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-8 bg-linear-to-b from-rose-400 to-pink-400 rounded-full" />
                                <h3 className="text-lg font-semibold text-slate-800">Descrição</h3>
                            </div>
                            <div className="prose prose-slate prose-lg text-slate-600 font-light leading-relaxed whitespace-pre-line pl-4 text-sm">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {specs.length > 0 && (
                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-8 bg-linear-to-b from-rose-400 to-pink-400 rounded-full" />
                                    <h3 className="text-lg font-semibold text-slate-800">Detalhes</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 transition-all duration-300">
                                    {visibleSpecs.map((spec) => (
                                        <div key={spec.key} className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-rose-100">
                                            <div className="w-8 h-8 flex items-center justify-center bg-rose-100 rounded-lg">
                                                <Package size={16} className="text-rose-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{spec.key}</div>
                                                <div className="text-sm text-slate-700 font-medium">{String(spec.value)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {specs.length > 2 && (
                                    <div className="pl-4">
                                        <button
                                            onClick={() => setShowAllSpecs(!showAllSpecs)}
                                            className="text-rose-500 text-sm font-bold flex items-center gap-1 hover:text-rose-600 transition-colors uppercase tracking-widest mt-2 cursor-pointer"
                                        >
                                            {showAllSpecs ? "Ver menos" : "Mais detalhes"}
                                            <ChevronRight className={cn("w-4 h-4 transition-transform", showAllSpecs ? "rotate-270" : "rotate-90")} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-rose-200/50 to-transparent" />

                    {variants.length > 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-8 bg-linear-to-b from-rose-400 to-pink-400 rounded-full" />
                                <span className="text-lg font-semibold text-slate-800">
                                    Escolha a cor
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3 pl-4">
                                {variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleVariantSelect(variant)}
                                        className={cn(
                                            "group relative cursor-pointer flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300 min-w-[100px]",
                                            selectedVariant?.id === variant.id
                                                ? "border-rose-400 bg-rose-50 shadow-lg shadow-rose-200/30"
                                                : "border-rose-100 bg-white hover:border-rose-200 hover:shadow-md"
                                        )}
                                    >
                                        {variant.color && variant.color.startsWith('#') && (
                                            <div className="relative">
                                                <span
                                                    className="w-10 h-10 rounded-2xl border-2 border-white shadow-lg"
                                                    style={{ backgroundColor: variant.color }}
                                                />
                                                {selectedVariant?.id === variant.id && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center leading-none gap-1">
                                            <span className="text-sm font-semibold text-slate-800 capitalize">{variant.name}</span>
                                            <span className="text-xs text-slate-500">
                                                {variant.quantity} disponíveis
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 pt-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center border-2 border-rose-100 rounded-full p-2 bg-white w-full shadow-inner h-16 sm:h-12">
                                <button
                                    onClick={decreaseQuantity}
                                    className={cn(
                                        "w-12 h-12 sm:w-8 sm:h-8 flex cursor-pointer items-center justify-center rounded-full hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all",
                                        quantity <= 1 && "opacity-30 cursor-not-allowed"
                                    )}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="flex-1 sm:w-10 text-center font-bold text-lg sm:text-base text-slate-800">{quantity}</span>
                                <button
                                    onClick={increaseQuantity}
                                    className={cn(
                                        "w-12 h-12 sm:w-8 sm:h-8 flex cursor-pointer items-center justify-center rounded-full hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all",
                                        (!selectedVariant || quantity >= selectedVariant.quantity) && "opacity-30 cursor-not-allowed"
                                    )}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={contactViaWhatsApp}
                                disabled={!selectedVariant || selectedVariant.quantity === 0}
                                className="w-full cursor-pointer py-4 px-4 sm:h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-base sm:text-sm tracking-[0.2em] uppercase shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                <span>Solicitar via WhatsApp</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                        {[
                            { icon: Store, title: "Loja Física", desc: "Visite nossa vitrine" },
                            { icon: Sparkles, title: "Peças Exclusivas", desc: "Curadoria especial" },
                            { icon: MessageCircle, title: "Atendimento", desc: "Consultoria pessoal" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-[2rem] bg-white border border-rose-100/40 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/20 transition-all duration-500 group">
                                <div className="w-10 h-10 flex items-center justify-center bg-rose-50 rounded-full mb-1 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="w-5 h-5 text-rose-400" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{item.title}</span>
                                <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
