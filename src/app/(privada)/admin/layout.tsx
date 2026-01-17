import { auth as authOptions } from "@/lib/auth-config"
import Sidebar from "../components/sidebar"
import { Suspense } from "react"
import { getServerSession } from "next-auth"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);
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
                        {session?.user && (
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-slate-400">Bem vindo(a),</span>
                                    <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                    <span className="text-xs text-slate-300 capitalize">{session.user.role}</span>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shrink-0">
                                    <span className="text-sm font-semibold text-white">
                                        {(() => {
                                            const name = session.user.name || "";
                                            const parts = name.trim().split(" ");
                                            if (parts.length === 0) return "U";
                                            if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                                            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                        })()}
                                    </span>
                                </div>
                            </div>
                        )}
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
