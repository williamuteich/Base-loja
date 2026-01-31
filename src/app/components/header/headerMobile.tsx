"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Home,
    Layers,
    Phone,
    Tag
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
import { HeaderShellProps } from "@/types/header";

export default function HeaderMobile({ brandSlot, menuBrandSlot, socialSlot }: HeaderShellProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
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
                                    <div className="flex flex-col h-full bg-white overflow-y-auto">
                                        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                                            {menuBrandSlot}
                                            <SheetClose className="p-2 hover:bg-slate-50 active:scale-95 rounded-full transition-all border-none outline-none">
                                                <X className="w-5 h-5 text-slate-400" />
                                            </SheetClose>
                                        </div>

                                        <nav className="flex-1 px-4 py-6 flex flex-col">
                                            {[
                                                { label: "Início", href: "/", icon: Home },
                                                { label: "Promoções", href: "/promocoes", icon: Tag },
                                                { label: "Produtos", href: "/produtos", icon: Layers },
                                                { label: "Categorias", href: "/categorias", icon: Layers },
                                                { label: "Contato", href: "/contato", icon: Phone },
                                            ].map((item) => (
                                                <SheetClose asChild key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center justify-between px-4 py-4 text-slate-600 hover:text-pink-700 hover:bg-pink-50/50 rounded-xl transition-all font-medium group",
                                                            pathname === item.href && "text-pink-700 bg-pink-50/50"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={cn(
                                                                "w-4 h-4 transition-colors",
                                                                pathname === item.href ? "text-pink-700" : "text-slate-400 group-hover:text-pink-700"
                                                            )} />
                                                            <span className="text-sm">{item.label}</span>
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </nav>

                                        <div className="p-8 border-t border-slate-50 mt-auto">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mb-6 text-center">
                                                Redes Sociais
                                            </p>
                                            <div className="flex justify-center">
                                                {socialSlot}
                                            </div>
                                        </div>
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
                            <SearchHeader className="flex-1" />
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
