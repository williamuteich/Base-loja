"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SearchHeader from "./searchHeader";

interface HeaderShellProps {
    contactSlot: ReactNode;
    seoSlot: ReactNode;
    socialSlot: ReactNode;
    brandSlot: ReactNode;
}

export default function HeaderDesk({ contactSlot, seoSlot, socialSlot, brandSlot }: HeaderShellProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (term: string) => {
        console.log("Searching for:", term);
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full transition-all duration-400 bg-white hidden lg:block">
            <div
                className={cn(
                    "overflow-hidden transition-all duration-400 h-9 opacity-100",
                    isScrolled && "h-0 opacity-0 pointer-events-none"
                )}
            >
                <div className="bg-pink-700 text-white py-2">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between text-xs font-light tracking-wide">
                            {contactSlot}
                            {seoSlot}
                            {socialSlot}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm relative z-40 overflow-hidden">
                <div className="container mx-auto px-4 h-20 relative">
                    <div className="flex items-center justify-between h-full gap-6 transition-all duration-300">
                        {brandSlot}

                        <div className="flex-1 max-w-2xl px-4">
                            <SearchHeader onSearch={handleSearch} />
                        </div>

                        <nav className="flex items-center gap-1 shrink-0">
                            {[
                                { label: "Início", href: "/" },
                                { label: "Produtos", href: "/produtos" },
                                { label: "Categorias", href: "/categorias" },
                                { label: "Contato", href: "/contato" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 text-muted-foreground hover:text-pink-700 hover:bg-pink-50 rounded-full transition-all text-sm font-semibold",
                                        pathname === item.href && "text-pink-700 bg-pink-50"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
