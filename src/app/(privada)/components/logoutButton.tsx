"use client"
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutDashboardProps {
    className?: string;
}

export function LogoutDashboard({ className = "" }: LogoutDashboardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true);
        signOut({ callbackUrl: "/login" });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            title="Sair do sistema"
            type="button"
            className="w-full cursor-pointer mt-2 flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10 group"
        >
            <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            <span className="font-semibold text-[15px]">Encerrar Sessão</span>
        </button>
    );
}