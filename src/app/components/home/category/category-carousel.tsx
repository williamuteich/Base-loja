import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import CategoryCarouselWrapper from "./category-carousel-wrapper";

interface CategoryCarouselProps {
    categories: Category[];
    backendUrl: string;
}

export default function CategoryCarousel({ categories, backendUrl }: CategoryCarouselProps) {
    if (categories.length === 0) return null;

    return (
        <section id="categorias" className="py-12 md:py-20 bg-white min-h-[300px]">
            <div className="container mx-auto px-4 relative">
                <div className="mb-8 md:mb-12 text-center">
                    <span className="inline-block text-pink-600 text-sm font-medium tracking-wider uppercase mb-2">
                        Explore
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 font-display">
                        Nossas Categorias
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base">
                        Navegue por nossas coleções cuidadosamente selecionadas
                    </p>
                </div>

                <CategoryCarouselWrapper hasCategories={true}>
                    {categories.map((category, i) => (
                        <Link
                            key={category.id}
                            href={`/produtos?categoria=${category.name}`}
                            className="group/card relative flex-none w-32 md:w-44 lg:w-52 snap-start"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group-hover/card:shadow-lg transition-all duration-500 border border-slate-100 bg-white">
                                {category.imageUrl ? (
                                    <Image
                                        src={`${backendUrl}/${category.imageUrl}`}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 176px, 208px"
                                        className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                                        priority={i < 4}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
                                        <span className="text-[10px] uppercase font-medium text-center px-1">
                                            Sem imagem
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center group-hover/card:bg-black/40 group-hover/card:backdrop-blur-xs transition-all duration-500">
                                    <h3 className="text-white font-bold text-base md:text-xl lg:text-2xl mb-1 line-clamp-2 capitalize drop-shadow-xl transform group-hover/card:scale-105 transition-transform duration-500 px-2 leading-tight">
                                        {category.name}
                                    </h3>
                                    <span className="text-white/80 text-[10px] md:text-xs lg:text-sm uppercase tracking-widest font-bold block drop-shadow-md">
                                        {category._count.products || 0}{" "}
                                        {category._count.products === 1 ? "item" : "itens"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </CategoryCarouselWrapper>
            </div>
        </section>
    );
}
