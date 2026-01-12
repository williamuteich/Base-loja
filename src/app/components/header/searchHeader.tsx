"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchHeaderProps {
    className?: string;
    placeholder?: string;
    onSearch?: (term: string) => void;
}

export default function SearchHeader({
    className,
    placeholder = "O que você está procurando hoje?",
    onSearch
}: SearchHeaderProps) {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        if (onSearch) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch]);

    const handleClear = () => {
        setValue("");
    };

    return (
        <div className={cn("relative w-full group", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-pink-500" />
            <input
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={cn(
                    "w-full h-12 pl-12 pr-12 rounded-full bg-slate-50 border border-pink-100",
                    "focus:border-pink-500 focus:bg-white text-sm transition-all outline-none",
                    "focus:ring-4 focus:ring-pink-500/10",
                    "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
                    "[&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                )}
                placeholder={placeholder}
            />
            {value && (
                <button
                    onClick={handleClear}
                    type="button"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold transition-all shadow-md active:scale-95"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
