'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"

import {
    Menu,
    LayoutGrid,
    Users,
    Folder,
    Tag,
    Settings,
    Mail,
    Image as ImageIcon,
    Home,
    ShoppingBag,
    ShieldCheck
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutDashboard } from "./logoutButton"

export default function Sidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutGrid, label: "Início", href: "/admin" },
        { icon: ShoppingBag, label: "Produtos", href: "/admin/products" },
        { icon: Folder, label: "Categorias", href: "/admin/categories" },
        { icon: Tag, label: "Marcas", href: "/admin/brands" },
        { icon: Users, label: "Clientes", href: "/admin/clients" },
        { icon: ShieldCheck, label: "Equipe", href: "/admin/team" },
        { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
        { icon: ImageIcon, label: "Banners", href: "/admin/banners" },
        { icon: Settings, label: "Configurações", href: "/admin/settings" },
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="p-2.5 rounded-xl hover:bg-slate-800/80 transition-all duration-300 border border-slate-700/50 group cursor-pointer"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-72 bg-slate-900 border-r border-slate-800 p-0 flex flex-col shadow-2xl"
            >
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />

                <SheetHeader className="p-8 border-b border-slate-800/80 relative">
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>

                    <Link href="/admin" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-linear-to-tr from-slate-800 to-slate-700 border border-slate-600/50 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:border-blue-500/50 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white tracking-tight">
                                Painel Admin
                            </span>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                                Sistema de Gestão
                            </span>
                        </div>
                    </Link>
                </SheetHeader>

                <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto relative custom-scrollbar">
                    <div className="pb-4">
                        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Principal
                        </p>
                    </div>

                    {menuItems.map((item, index) => {
                        const Icon = item.icon
                        const active = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${active
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                                    }`}
                            >
                                {active && (
                                    <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                )}
                                <Icon className={`w-5 h-5 transition-colors ${active ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                                <span className="font-semibold text-[15px]">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-md relative">
                    <Link
                        href="/"
                        className="flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all border border-transparent hover:border-slate-700"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Visualizar Loja</span>
                    </Link>

                    <LogoutDashboard />
                </div>
            </SheetContent>
        </Sheet>
    )
}

