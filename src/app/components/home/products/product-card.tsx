import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
    backendUrl: string;
}

export default function ProductCard({ product, backendUrl }: ProductCardProps) {
    const mainImage = product.images[0]?.url;
    const secondaryImage = product.images[1]?.url;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const calculateDiscountPercentage = (price: number, discountPrice: number) => {
        if (!price || !discountPrice || price <= discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    return (
        <Link
            href={`/produto/${product.id}`}
            className="group block bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 transition-all duration-500 h-full"
        >
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                {mainImage ? (
                    <>
                        <Image
                            src={`${backendUrl}/${mainImage}`}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized
                        />
                        {secondaryImage && (
                            <Image
                                src={`${backendUrl}/${secondaryImage}`}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                                unoptimized
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                            <circle cx="9" cy="9" r="2"></circle>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                    </div>
                )}

                {hasDiscount && (
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100 z-10">
                        <span className="text-[8px] md:text-[10px] font-medium text-gray-500 uppercase">Off</span>
                        <span className="text-sm md:text-base font-bold text-rose-600 leading-none">
                            {calculateDiscountPercentage(product.price, product.discountPrice!)}%
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 md:p-6 pb-16 relative">
                <span className="text-rose-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1.5 block truncate">
                    {product.categories?.[0]?.name || 'Produto'}
                </span>

                <h3 className="font-semibold text-slate-800 text-sm md:text-lg group-hover:text-rose-600 transition-colors line-clamp-1 mb-1">
                    {product.title}
                </h3>

                {product.description && (
                    <p className="text-slate-500 text-[10px] md:text-xs line-clamp-2 mb-2 md:mb-3 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-rose-600 font-black text-lg md:text-2xl">
                        {formatPrice(product.discountPrice || product.price)}
                    </span>

                    {hasDiscount && (
                        <span className="text-xs md:text-sm text-slate-400 line-through decoration-rose-300">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-full bg-slate-900 text-white text-center py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                        <span>Ver Detalhes</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
