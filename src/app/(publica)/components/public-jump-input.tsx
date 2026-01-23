"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function PublicJumpInput({ totalPages }: { totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [jumpPage, setJumpPage] = useState("");

    const handleJumpSubmit = () => {
        const pageNum = parseInt(jumpPage);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageNum.toString());
            router.push(`${pathname}?${params.toString()}`);
            setJumpPage("");
        }
    };

    return (
        <div className="flex items-center gap-2 text-sm text-slate-500 pr-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 w-full md:w-auto justify-center">
            <span className="whitespace-nowrap">Ir para:</span>
            <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleJumpSubmit();
                    }
                }}
                className="w-16 h-9 px-2 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-center transition-all"
                placeholder="Pg"
            />
            <button
                onClick={handleJumpSubmit}
                disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
                className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
