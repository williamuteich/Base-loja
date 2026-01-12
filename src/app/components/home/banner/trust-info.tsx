import { ShieldCheck, Store, MessageSquare, Sparkles } from "lucide-react";

export default function TrustInfo() {
    const items = [
        {
            icon: MessageSquare,
            title: "Atendimento VIP",
            subtitle: "Direto via WhatsApp"
        },
        {
            icon: Store,
            title: "Loja Física",
            subtitle: "Visite nosso showroom"
        },
        {
            icon: Sparkles,
            title: "Peças Curadas",
            subtitle: "Seleção exclusiva"
        },
        {
            icon: ShieldCheck,
            title: "Garantia e Qualidade",
            subtitle: "Certificado de autenticidade"
        }
    ];

    return (
        <div className="bg-white border-b border-slate-100 hidden lg:block">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-4 gap-8">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 group-hover:text-pink-700 transition-colors uppercase tracking-tight">
                                    {item.title}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {item.subtitle}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
