import { ReactNode } from "react";
import Link from "next/link";
import Copyright from "./components/copyright";

interface FooterShellProps {
    brandSlot: ReactNode;
    socialSlot: ReactNode;
    contactSlot: ReactNode;
    whatsappSlot: ReactNode;
}

export default function FooterShell({ brandSlot, socialSlot, contactSlot, whatsappSlot }: FooterShellProps) {
    return (
        <footer className="border-t border-pink-100 bg-linear-to-b from-white to-pink-50/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100/30 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
                    <div className="flex flex-col items-center md:items-start h-full">
                        {brandSlot}
                        <div className="mt-auto pt-8">
                            {socialSlot}
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-semibold text-slate-900 mb-8 text-sm uppercase tracking-wider relative inline-block">
                            Navegação
                            <span className="absolute -bottom-2 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-1 bg-pink-500/30 rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/"><span className="w-1 h-3 bg-pink-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Início</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/produtos"><span className="w-1 h-3 bg-pink-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Produtos</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/categorias"><span className="w-1 h-3 bg-pink-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Categorias</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/contato"><span className="w-1 h-3 bg-pink-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Contato</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-semibold text-slate-900 mb-8 text-sm uppercase tracking-wider relative inline-block">
                            Legal
                            <span className="absolute -bottom-2 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-1 bg-pink-500/30 rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/privacidade"><span className="w-1 h-3 bg-slate-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Privacidade (LGPD)</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/cookies"><span className="w-1 h-3 bg-slate-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Cookies</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group" href="/termos"><span className="w-1 h-3 bg-slate-200 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></span>Termos e Condições</Link></li>
                        </ul>
                    </div>

                    <div className="h-full">
                        {contactSlot}
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-20 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
                            © <Copyright /> <span className="text-slate-300 px-2">|</span> Todos os direitos reservados.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <Link
                            target="_blank"
                            href="https://twservicos.com.br/"
                            className="text-[10px] text-slate-400 hover:text-pink-700 font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-3 group"
                        >
                            <span className="w-12 h-px bg-slate-100 group-hover:w-8 group-hover:bg-pink-100 transition-all"></span>
                            Plataforma por <span className="text-slate-900 group-hover:text-pink-700 transition-colors">TW Serviços Digitais</span>
                        </Link>
                    </div>
                </div>
            </div>

            {whatsappSlot}
        </footer>
    );
}
