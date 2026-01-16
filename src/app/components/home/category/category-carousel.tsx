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
                            <div className="relative aspect-3/4 md:aspect-square rounded-[2rem] overflow-hidden shadow-sm group-hover/card:shadow-2xl transition-all duration-700 border border-slate-100/50 bg-slate-50">
                                {category.imageUrl ? (
                                    <Image
                                        src={`${backendUrl}/${category.imageUrl}`}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 140px, (max-width: 1024px) 190px, 220px"
                                        className="object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out"
                                        priority={i < 4}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-300">
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-2">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider">
                                                Sem imagem
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-500" />

                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-center group-hover/card:translate-y-[-4px] transition-transform duration-500">
                                    <h3 className="text-white font-black text-lg md:text-2xl mb-2 line-clamp-2 capitalize leading-none tracking-tight">
                                        {category.name}
                                    </h3>

                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">
                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">
                                            {category._count?.products || 0} modelos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </CategoryCarouselWrapper>
            </div>
        </section>
    );
}
