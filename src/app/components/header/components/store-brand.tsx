import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";
import { getStoreConfig } from "@/services/store-config";
import { cn } from "@/lib/utils";

export default async function StoreBrand({ mobile = false, onPink = false }: { mobile?: boolean, onPink?: boolean }) {
    "use cache";
    const config = await getStoreConfig();

    const logo = (
        <div className="w-13 h-13 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {config?.logoUrl && config.logoUrl !== "null" ? (
                <Image src={config.logoUrl} width={52} height={43} alt="Logo" priority className="rounded-full object-contain" />
            ) : (
                <div className={cn(
                    "w-full h-full flex items-center justify-center rounded-full shadow-inner",
                    onPink ? "bg-white/20 text-white" : "bg-pink-100 text-pink-700"
                )}>
                    <Store className="w-7 h-7" />
                </div>
            )}
        </div>
    );

    const nameClasses = cn(
        "text-2xl font-bold leading-tight",
        onPink ? "text-white" : "text-pink-700"
    );

    const subClasses = cn(
        "text-[10px] uppercase tracking-wider line-clamp-1 opacity-80",
        onPink ? "text-pink-100" : "text-muted-foreground"
    );

    return (
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {logo}
            <div className="flex flex-col">
                <span className={nameClasses}>
                    {config?.storeName || 'Elegance'}
                </span>
                <div className="flex items-center gap-2 -mt-0.5">
                    <span className={subClasses}>
                        {config?.description || 'Joias Exclusivas'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
