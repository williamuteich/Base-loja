"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ShieldCheck,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/admin",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-white">
            <div className="hidden lg:flex lg:w-1/2 relative bg-pink-900 text-white overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-pink-800 via-pink-700 to-pink-900 z-0"></div>
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_40%)] z-0"
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.2),transparent_40%)] z-0"
                ></div>

                <div className="relative z-10 p-12 max-w-lg text-center">
                    <div
                        className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/20"
                    >
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 tracking-tight">Painel Administrativo</h1>
                    <p className="text-pink-100/80 text-lg leading-relaxed mb-8">
                        Gerencie sua loja, produtos e equipe com facilidade e segurança.
                        Acesse todas as ferramentas que você precisa em um só lugar.
                    </p>
                    <div
                        className="flex items-center justify-center gap-4 text-xs font-medium text-pink-200/60 uppercase tracking-widest"
                    >
                        <span>Segurança</span>
                        <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                        <span>Performance</span>
                        <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                        <span>Controle</span>
                    </div>
                </div>

                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                <Link
                    href="/"
                    className="absolute top-8 left-8 lg:left-12 inline-flex items-center gap-2 text-gray-400 hover:text-pink-700 transition-all duration-300 hover:gap-3 group font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para a loja</span>
                </Link>

                <div className="w-full max-w-[400px]">
                    <div className="text-center lg:text-left mb-10">
                        <div
                            className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-pink-50 rounded-2xl mb-6 text-pink-700"
                        >
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Bem-vindo de volta</h2>
                        <p className="text-gray-500">
                            Por favor, insira suas credenciais para acessar o painel.
                        </p>
                    </div>

                    {errorParam && (
                        <div
                            className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 flex items-start gap-4 animate-in fade-in slide-in-from-top-2"
                        >
                            <div className="bg-red-100 rounded-full p-1 shrink-0 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" x2="12" y1="8" y2="12"></line>
                                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                </svg>
                            </div>
                            <div className="text-sm text-red-800">
                                <span className="font-bold block mb-0.5">Falha na autenticação</span>
                                {(() => {
                                    switch (errorParam) {
                                        case "CredentialsSignin":
                                        case "invalid_credentials":
                                            return "Credenciais inválidas";
                                        case "SessionRequired":
                                            return "Acesso negado. Por favor, faça login.";
                                        default:
                                            return "Ocorreu um erro ao tentar entrar.";
                                    }
                                })()}
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">E-mail</label>
                            <div className="relative group">
                                <div
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-600 transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nome@exemplo.com"
                                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
                            <div className="relative group">
                                <div
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-600 transition-colors"
                                >
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-pink-600 hover:bg-pink-700 cursor-pointer text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Entrar no Painel</span>
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-12">
                        &copy; {new Date().getFullYear()} Bazar Elegance. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
