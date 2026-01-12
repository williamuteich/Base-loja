import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

export default function PrivacidadePage() {
    return (
        <>
            <Header />
            <main className="pt-[116px]">
                <section className="py-12 md:py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <header className="mb-8 md:mb-10 text-center md:text-left">
                                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-600 mb-2">LGPD</p>
                                <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-2">Política de Privacidade</h1>
                                <p className="text-slate-600 text-sm md:text-base">Transparência sobre como tratamos os seus dados.</p>
                            </header>

                            <div className="space-y-6 text-sm md:text-[15px] leading-relaxed text-slate-700">
                                <p>
                                    Este site foi desenvolvido para apresentação de produtos do bazar e não tem como objetivo coletar ou
                                    armazenar grandes quantidades de dados pessoais dos visitantes.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">1. Quais dados são coletados?</h2>
                                <p>
                                    Navegando pelo site, nós <strong>não coletamos cadastros, senhas ou documentos</strong>. O único dado pessoal
                                    que pode ser associado a você é o número de telefone/WhatsApp, quando você decide entrar em contato
                                    voluntariamente pelos botões de WhatsApp.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">2. WhatsApp e histórico de conversa</h2>
                                <p>
                                    Ao clicar para falar conosco no WhatsApp, você é redirecionado para o aplicativo/site oficial do WhatsApp,
                                    que possui sua própria política de privacidade. A partir desse momento, a conversa acontece diretamente no
                                    WhatsApp, e o histórico fica salvo no nosso número, como em qualquer contato normal entre duas pessoas.
                                </p>
                                <p>
                                    Nós utilizamos esse histórico apenas para atendimento, tirar dúvidas e, quando solicitado, para acertar
                                    detalhes de pedidos ou entregas.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">3. Formulários e cadastros</h2>
                                <p>
                                    No momento, este site <strong>não possui formulários de cadastro, login ou área do cliente</strong>. Portanto,
                                    não armazenamos senhas ou perfis de usuários.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">4. Compartilhamento de dados</h2>
                                <p>
                                    Não vendemos, alugamos ou compartilhamos suas informações de contato com terceiros para fins comerciais.
                                    Seus dados só podem ser compartilhados quando necessário para cumprir alguma obrigação legal ou solicitação
                                    sua (por exemplo, dados para entrega).
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">5. Direitos do titular de dados</h2>
                                <p>
                                    Se você já conversou conosco pelo WhatsApp e deseja que determinado histórico seja apagado ou deixe de ser
                                    utilizado, você pode solicitar diretamente pelo próprio WhatsApp ou pelos demais canais de contato
                                    informados no site.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">6. Atualizações desta política</h2>
                                <p>
                                    Esta política pode ser ajustada a qualquer momento para refletir melhorias do site ou novas funcionalidades
                                    que envolvam dados pessoais. Quando houver mudanças importantes, a data de atualização será revisada nesta
                                    página.
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
