"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchOverlayClient({
    query,
    children
}: {
    query: string;
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        if (query) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [query]);

    if (!query) return null;

    return (
        <div className="fixed inset-0 z-40 flex flex-col pt-20 lg:pt-[116px]">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
                onClick={handleClose}
            />

            <div className="relative flex-1 bg-white overflow-y-auto custom-scrollbar pointer-events-auto shadow-2xl overflow-hidden">
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-pink-600 font-bold tracking-widest uppercase text-xs mb-2 block">Explorando Resultados</span>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                Você pesquisou por: <span className="text-pink-600">"{query}"</span>
                            </h1>
                        </div>
                        <div className="text-slate-400 font-medium text-sm">
                            Encontramos os melhores itens para você
                        </div>
                    </div>

                    <div onClick={(e) => {
                        if ((e.target as HTMLElement).closest('a')) {
                            handleClose();
                        }
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
