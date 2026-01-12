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
        <footer className="border-t border-pink-100 bg-linear-to-br from-white via-pink-50/20 to-white relative">
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left h-full">
                        {brandSlot}
                        {socialSlot}
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-semibold text-slate-900 mb-6 text-sm uppercase tracking-wider">Navegação</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/">Início</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/produtos">Produtos</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/categorias">Categorias</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/contato">Contato</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-semibold text-slate-900 mb-6 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/privacidade">Privacidade (LGPD)</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/cookies">Cookies</Link></li>
                            <li><Link className="text-slate-600 hover:text-pink-700 transition-colors duration-300 font-medium" href="/termos">Termos e Condições</Link></li>
                        </ul>
                    </div>

                    <div className="h-full">
                        {contactSlot}
                    </div>
                </div>

                <div className="border-t border-pink-100 mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                            © <Copyright /> Todos os direitos reservados.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <Link
                            target="_blank"
                            href="https://twservicos.com.br/"
                            className="text-[10px] text-slate-400 hover:text-pink-700 font-bold tracking-widest uppercase transition-colors duration-300 group"
                        >
                            Plataforma desenvolvida por <span className="group-hover:underline">TW Serviços Digitais</span>
                        </Link>
                    </div>
                </div>
            </div>

            {whatsappSlot}
        </footer>
    );
}
