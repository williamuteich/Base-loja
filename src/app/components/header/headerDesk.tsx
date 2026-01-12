"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Phone,
    Instagram,
    Facebook,
    X,
    Twitter,
    Youtube,
    Linkedin,
    MessageCircle,
    Music,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchHeader from "./searchHeader";

interface HeaderProps {
    config: any;
}

export default function HeaderDesk({ config }: HeaderProps) {
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
                            <div className="flex items-center gap-4">
                                {config?.phone && (
                                    <span className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 cursor-default">
                                        <Phone className="w-3.5 h-3.5" />
                                        {config.phone}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 cursor-default">
                                    <Mail className="w-3.5 h-3.5" />
                                    {config?.contactEmail}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-center px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-pink-200">
                                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                </svg>
                                <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                    {config?.seoTitle || 'Beleza que existe em você'}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {config?.socialMedias?.map((social: any) => {
                                    const Icon = getSocialIcon(social.platform);
                                    return Icon ? (
                                        <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                            </svg>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm relative z-40 overflow-hidden">
                <div className="container mx-auto px-4 h-20 relative">
                    <div className="flex items-center justify-between h-full gap-6 transition-all duration-300">
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