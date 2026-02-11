import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";
import { getStoreConfig } from "@/services/store-config";

export default async function FooterBrand() {
    "use cache";
    const config = await getStoreConfig();

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left h-full">
            <Link className="inline-flex items-center gap-4 group mb-6" href="/">
                <div className="relative">
                    <div className="absolute -inset-2 bg-pink-100/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-14 h-14 flex items-center justify-center bg-white border border-pink-100 rounded-2xl shadow-sm group-hover:border-pink-200 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                        {config?.logoUrl && config.logoUrl !== "null" ? (
                            <Image
                                src={config.logoUrl}
                                width={56}
                                height={46}
                                alt="Logo"
                                unoptimized
                                className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-500 to-pink-700 text-white shadow-inner">
                                <Store className="w-7 h-7" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-display text-2xl font-bold text-slate-900 tracking-tight group-hover:text-pink-700 transition-colors duration-300">
                        {config?.storeName || 'Elegance'}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-600/60 mt-0.5">Premium Joias</span>
                </div>
            </Link>
            <div className="relative pl-0 md:pl-2">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-pink-100 hidden md:block"></div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs italic font-serif">
                    "{config?.description || 'Transformando beleza em joias únicas para momentos inesquecíveis.'}"
                </p>
            </div>
        </div>
    );
}
