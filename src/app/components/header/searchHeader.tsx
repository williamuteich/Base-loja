"use client";

import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchHeader({
    className,
    placeholder = "O que você está procurando hoje?",
}: { className?: string; placeholder?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") || "");

    const handleSearch = () => {
        if (!value.trim()) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("search", value);
        params.delete("page");

        router.push(`/produtos?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleClear = () => {
        setValue("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        router.push(`/produtos?${params.toString()}`);
    };

    return (
        <div className={cn("relative w-full group", className)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-pink-500 transition-colors">
                <Search className="w-full h-full" />
            </div>
            <input
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full h-12 pl-12 pr-24 rounded-full bg-slate-50 border border-pink-100",
                    "focus:border-pink-500 focus:bg-white text-sm transition-all outline-none",
                    "focus:ring-4 focus:ring-pink-500/10",
                    "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
                    "[&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                )}
                placeholder={placeholder}
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {value && (
                    <button
                        onClick={handleClear}
                        type="button"
                        className="bg-slate-200 cursor-pointer text-slate-600 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={handleSearch}
                    type="button"
                    className="bg-pink-600 cursor-pointer text-white hover:bg-pink-700 rounded-full w-9 h-9 flex items-center justify-center transition-all shadow-md active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!value.trim()}
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
