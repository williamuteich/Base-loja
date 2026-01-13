import Sidebar from "../components/sidebar"
import { Bell, Search, User } from "lucide-react"
import { Suspense } from "react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="flex min-h-screen flex-col">
                <header className="bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-sm">
                    <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Suspense fallback={<div className="w-10 h-10 bg-slate-700 animate-pulse rounded-xl" />}>
                                <Sidebar />
                            </Suspense>
                            <div>
                                <p className="text-lg font-medium">Painel Administrativo</p>
                                <p className="text-sm text-slate-300">Controle do Sistema</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-linear-to-b from-transparent to-slate-50/80 p-6 md:p-8">
                    <div className="mx-auto w-full max-w-[1800px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
