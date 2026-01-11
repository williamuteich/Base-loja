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
    User,
    Package,
    Folder,
    Tag,
    Share2,
    Settings,
    Mail,
    Image,
    Home,
    LogOut
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Clientes", href: "/dashboard/clients" },
        { icon: User, label: "Equipe", href: "/dashboard/team" },
        { icon: Package, label: "Produtos", href: "/dashboard/products" },
        { icon: Folder, label: "Categorias", href: "/dashboard/categories" },
        { icon: Tag, label: "Marcas", href: "/dashboard/brands" },
        { icon: Share2, label: "Redes Sociais", href: "/dashboard/socials" },
        { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
        { icon: Mail, label: "Newsletter", href: "/dashboard/newsletter" },
        { icon: Image, label: "Banners", href: "/dashboard/banners" },
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-6 h-6 text-slate-300" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-64 bg-slate-900 border-r border-slate-700/50 p-0 flex flex-col"
            >
                <SheetHeader className="p-6 border-b border-slate-700/50">
                    <SheetTitle className="sr-only">Menu</SheetTitle>

                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white">
                            <Home className="w-5 h-5" />
                        </div>

                        <div>
                            <span className="block text-lg font-semibold text-white">
                                Admin
                            </span>
                            <span className="block text-xs text-slate-400">
                                Painel de Controle
                            </span>
                        </div>
                    </Link>
                </SheetHeader>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map(item => {
                        const Icon = item.icon
                        const active = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${active
                                        ? "bg-slate-800 text-white shadow-lg"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700/50 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Ver Loja</span>
                    </Link>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
