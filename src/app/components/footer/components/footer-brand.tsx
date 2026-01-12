import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";
import { getStoreConfig } from "@/services/store-config";

export default async function FooterBrand() {
    "use cache";
    const config = await getStoreConfig();

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link className="inline-flex items-center gap-3 group mb-4" href="/">
                <div className="w-11 h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {config?.logoUrl && config.logoUrl !== "null" ? (
                        <Image src={config.logoUrl} width={44} height={36} alt="Logo" className="rounded-full object-contain" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-500 to-pink-700 rounded-xl text-white shadow-md">
                            <Store className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <span className="font-display text-xl font-bold text-slate-900">
                    {config?.storeName || 'Elegance'}
                </span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                {config?.description || 'Transformando beleza em joias únicas para momentos inesquecíveis.'}
            </p>
        </div>
    );
}
