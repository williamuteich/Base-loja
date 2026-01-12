"use client"

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

export default function CookiesPage() {
    return (
        <>
            <Header />
            <main className="pt-[116px]">
                <section className="py-12 md:py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <header className="mb-8 md:mb-10 text-center md:text-left">
                                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-600 mb-2">Cookies</p>
                                <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-2">Política de Cookies</h1>
                                <p className="text-slate-600 text-sm md:text-base">Explicamos como (não) utilizamos cookies neste site.</p>
                            </header>

                            <div className="space-y-6 text-sm md:text-[15px] leading-relaxed text-slate-700">
                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">1. O que são cookies?</h2>
                                <p>
                                    Cookies são pequenos arquivos de texto armazenados no seu navegador quando você acessa um site. Eles podem
                                    servir para lembrar preferências, manter sessões de login ou medir estatísticas de acesso.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">2. Uso de cookies neste site</h2>
                                <p>
                                    Este site <strong>não utiliza cookies para fins de rastreamento, publicidade comportamental ou criação de
                                        perfis detalhados</strong> dos visitantes.
                                </p>
                                <p>
                                    Eventuais cookies técnicos podem ser utilizados apenas para o funcionamento básico da aplicação (por
                                    exemplo, componentes do próprio navegador ou do provedor de hospedagem), sem identificação direta do
                                    usuário.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">3. Cookies de terceiros</h2>
                                <p>
                                    Ao interagir com serviços externos, como o <strong>Google Maps</strong> (embed da localização) ou ao clicar
                                    em links para o <strong>WhatsApp</strong>, esses serviços podem utilizar cookies próprios, seguindo as
                                    políticas deles.
                                </p>
                                <p>
                                    Nós não temos controle direto sobre esses cookies, mas o uso é limitado à exibição do mapa e ao
                                    redirecionamento para o WhatsApp. Recomendamos consultar as políticas de privacidade e cookies desses
                                    serviços para mais detalhes.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">4. Como controlar cookies</h2>
                                <p>
                                    Você pode gerenciar ou desativar cookies diretamente nas configurações do seu navegador. Isso pode afetar o
                                    funcionamento de alguns sites, mas, no caso deste site, o impacto tende a ser mínimo, já que não há áreas de
                                    login ou funcionalidades complexas vinculadas a cookies.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
