import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ShoppingBag,
    Users,
    Package,
    Plus,
    ArrowRight,
    ArrowUpRight,
    Image as ImageIcon,
    Tag,
    Settings,
    Folder
} from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

const quickActions = [
    {
        title: "Novo Produto",
        description: "Cadastre um novo item no catálogo",
        href: "/admin/products/create",
        icon: Plus,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Gerenciar Banners",
        description: "Destaques na página inicial",
        href: "/admin/banners",
        icon: ImageIcon,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Categorias",
        description: "Organize seus produtos",
        href: "/admin/categories",
        icon: Folder,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Configurações",
        description: "Ajuste dados da loja",
        href: "/admin/settings",
        icon: Settings,
        color: "text-slate-600",
        bg: "bg-slate-50"
    },
    {
        title: "Gerenciar Equipe",
        description: "Administradores do sistema",
        href: "/admin/team",
        icon: Users,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    }
]

export default async function AdminPage() {
    const [productsCount, bannersCount, brandsCount, categoriesCount] = await Promise.all([
        prisma.product.count(),
        prisma.banner.count({ where: { isActive: true } }),
        prisma.brand.count({ where: { isActive: true } }),
        prisma.category.count({ where: { isActive: true } }),
    ]);

    const stats = [
        {
            title: "Total de Produtos",
            value: productsCount.toString(),
            description: "Catálogo completo",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Banners Ativos",
            value: bannersCount.toString(),
            description: "Em destaque na home",
            icon: ImageIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Categorias",
            value: categoriesCount.toString(),
            description: "Coleções organizadas",
            icon: Folder,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Marcas",
            value: brandsCount.toString(),
            description: "Parceiras cadastradas",
            icon: Tag,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/10">
                <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -m-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Painel de Controle</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Vitrine <span className="text-blue-400">Digital</span> Elegante.
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Bem-vindo ao centro de gestão da sua vitrine digital. Organize seu catálogo, destaque seus melhores produtos e encante seus visitantes com facilidade.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 shadow-xl shadow-blue-600/20">
                                <Link href="/admin/products">
                                    Gerenciar Catálogo <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="w-48 h-48 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center rotate-3 transform hover:rotate-0 transition-transform duration-500">
                            <ShoppingBag className="w-20 h-20 text-blue-400 opacity-80" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border-slate-200/60 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                    <p className="text-[11px] font-medium text-slate-400 mt-2">{stat.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200/60 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div>
                                <CardTitle className="text-lg font-bold">Estado do Catálogo</CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">Visão geral da sua vitrine</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-slate-700">Resumo da Vitrine</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-sm text-slate-600 font-medium">Produtos</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{productsCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-sm text-slate-600 font-medium">Banners</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{bannersCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                                            <span className="text-sm text-slate-600 font-medium">Categorias</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{categoriesCount}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed text-center pt-2">
                                    Mantenha sua vitrine sempre atualizada para oferecer a melhor experiência aos seus clientes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Ações Rápidas</h3>
                    <div className="grid gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <Link key={action.title} href={action.href} className="group">
                                    <div className="bg-white border border-slate-200/60 p-4 rounded-2xl group-hover:border-blue-400/40 group-hover:shadow-lg group-hover:shadow-blue-500/5 transition-all duration-300 flex items-center gap-4">
                                        <div className={`w-10 h-10 ${action.bg} ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{action.title}</h4>
                                            <p className="text-[10px] text-slate-400 line-clamp-1">{action.description}</p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
