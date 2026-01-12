"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Home,
    Layers,
    Phone,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Linkedin,
    MessageCircle,
    Music
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

interface HeaderProps {
    config: any;
}

export default function HeaderMobile({ config }: HeaderProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
    };

    const handleSearch = (term: string) => {
        console.log("Searching for:", term);
    };

    const socialIcons: Record<string, any> = {
        instagram: Instagram,
        facebook: Facebook,
        twitter: Twitter,
        x: X,
        youtube: Youtube,
        linkedin: Linkedin,
        tiktok: Music,
        whatsapp: MessageCircle,
    };

    const getSocialIcon = (platform: string) => {
        const lowerPlatform = platform.toLowerCase();
        for (const key in socialIcons) {
            if (lowerPlatform.includes(key)) return socialIcons[key];
        }
        return null;
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full transition-all duration-400 bg-white lg:hidden">
            <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm relative z-40 overflow-hidden">
                <div className="container mx-auto px-4 h-20 relative">
                    <div className={cn(
                        "flex items-center justify-between h-full gap-6 transition-all duration-300",
                        isMobileSearchOpen && "opacity-0 pointer-events-none"
                    )}>
                        <Link href="/" className="flex items-center gap-3 shrink-0 group">
                            <div className="w-13 h-13 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                {config?.logoUrl ? (
                                    <Image src={config.logoUrl} width={52} height={43} alt="Logo" priority className="rounded-full object-contain" />
                                ) : (
                                    <Image src="/logoBazar.png" width={52} height={43} alt="Logo" priority className="rounded-full object-contain" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-pink-700 leading-tight">
                                    {config?.storeName || 'Elegance'}
                                </span>
                                <div className="flex items-center gap-2 -mt-0.5">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider line-clamp-1 opacity-80">
                                        Barra do Quarai
                                    </span>
                                </div>
                            </div>
                        </Link>

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
                                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                                    <SheetDescription className="sr-only">Acesso rápido para produtos, categorias e contato</SheetDescription>
                                    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
                                        <div className="flex items-center justify-between p-6 bg-linear-to-r from-pink-600 to-pink-700 text-white shadow-lg sticky top-0 z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl overflow-hidden">
                                                    {config?.logoUrl ? (
                                                        <Image src={config.logoUrl} width={42} height={34} alt="Logo" className="rounded-lg object-contain brightness-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-white/10">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 opacity-60">
                                                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold uppercase tracking-widest text-sm leading-tight">
                                                        {config?.storeName || 'Bazar Elegance'}
                                                    </span>
                                                    <span className="text-[10px] text-pink-100 font-medium opacity-80 uppercase tracking-tighter">
                                                        Menu de Navegação
                                                    </span>
                                                </div>
                                            </div>
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

                                        {config?.socialMedias?.length > 0 && (
                                            <div className="p-8 border-t border-slate-200 mt-auto bg-white/80 backdrop-blur-sm">
                                                <p className="text-[10px] text-pink-700/60 uppercase tracking-widest font-bold mb-6 text-center">
                                                    Conecte-se conosco
                                                </p>
                                                <div className="flex items-center justify-center gap-5">
                                                    {config.socialMedias.map((social: any) => {
                                                        const Icon = getSocialIcon(social.platform);
                                                        return Icon && (
                                                            <a
                                                                key={social.id}
                                                                href={social.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-14 h-14 bg-pink-50 text-pink-700 flex items-center justify-center rounded-2xl shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all border border-pink-100"
                                                            >
                                                                <Icon className="w-6 h-6" />
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
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