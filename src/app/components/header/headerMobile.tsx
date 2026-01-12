"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
    Menu,
    X,
    Home,
    Layers,
    Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchHeader from "./searchHeader";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";

interface HeaderShellProps {
    brandSlot: ReactNode;
    menuBrandSlot: ReactNode;
    socialSlot: ReactNode;
}

export default function HeaderMobile({ brandSlot, menuBrandSlot, socialSlot }: HeaderShellProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
    };

    const handleSearch = (term: string) => {
        console.log("Searching for:", term);
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full transition-all duration-400 bg-white lg:hidden">
            <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm relative z-40 overflow-hidden">
                <div className="container mx-auto px-4 h-20 relative">
                    <div className={cn(
                        "flex items-center justify-between h-full gap-6 transition-all duration-300",
                        isMobileSearchOpen && "opacity-0 pointer-events-none"
                    )}>
                        {brandSlot}

                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleMobileSearch}
                                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-all">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 border-none w-[320px] max-w-[85vw]">
                                    <SheetTitle className="sr-only text-white">Menu de Navegação</SheetTitle>
                                    <SheetDescription className="sr-only text-white/80">Acesso rápido para produtos, categorias e contato</SheetDescription>
                                    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
                                        <div className="flex items-center justify-between p-6 bg-linear-to-r from-pink-600 to-pink-700 text-white shadow-lg sticky top-0 z-10">
                                            {menuBrandSlot}
                                            <SheetClose className="absolute right-4 top-6 p-2.5 bg-white/10 hover:bg-white/20 active:scale-90 rounded-xl transition-all border-none outline-none">
                                                <X className="w-6 h-6 text-white" />
                                            </SheetClose>
                                        </div>

                                        <nav className="flex-1 px-4 py-8 flex flex-col gap-3">
                                            {[
                                                { label: "Produtos", href: "/", icon: Home },
                                                { label: "Categorias", href: "/categorias", icon: Layers },
                                                { label: "Contato", href: "/contato", icon: Phone },
                                            ].map((item) => (
                                                <SheetClose asChild key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-4 px-6 py-4 text-slate-600 hover:text-pink-700 hover:bg-white rounded-3xl transition-all font-bold border border-transparent",
                                                            pathname === item.href && "text-pink-700 bg-white shadow-md border-pink-100"
                                                        )}
                                                    >
                                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-pink-700">
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </nav>

                                        {socialSlot}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className={cn(
                        "absolute inset-0 bg-white z-50 flex items-center px-4 transition-all duration-300 ease-in-out lg:hidden",
                        !isMobileSearchOpen ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
                    )}>
                        <div className="relative w-full flex items-center gap-2">
                            <SearchHeader onSearch={handleSearch} className="flex-1" />
                            <button
                                onClick={toggleMobileSearch}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-all shrink-0"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
