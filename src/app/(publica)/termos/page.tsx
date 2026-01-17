import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

export default function TermosPage() {
    return (
        <>
            <Header />
            <main>
                <section className="pt-4 pb-10 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <header className="mb-8 md:mb-10 text-center md:text-left">
                                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-600 mb-2">Termos</p>
                                <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-2">Termos e Condições de Uso</h1>
                                <p className="text-slate-600 text-sm md:text-base">Entenda como o site funciona e quais são as responsabilidades de cada parte.</p>
                            </header>

                            <div className="space-y-6 text-sm md:text-[15px] leading-relaxed text-slate-700">
                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">1. Objetivo do site</h2>
                                <p>
                                    Este site tem como objetivo apresentar produtos do bazar e facilitar o contato entre você e a loja. Não se
                                    trata de um e-commerce completo: os pedidos, valores finais, formas de pagamento e entregas são combinados
                                    diretamente pelos canais de atendimento (principalmente WhatsApp).
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">2. Informações sobre produtos</h2>
                                <p>
                                    As fotos, descrições e valores exibidos no site são atualizados com cuidado, mas podem sofrer alterações sem
                                    aviso prévio. Produtos podem esgotar ou ter variações de preço conforme promoções ou disponibilidade em
                                    loja.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">3. Contato e fechamento de pedidos</h2>
                                <p>
                                    O fechamento de pedidos, reservas ou encomendas acontece diretamente com a equipe da loja, normalmente via
                                    WhatsApp. Todas as condições finais (preço, forma de pagamento, entrega/retirada) são confirmadas na
                                    conversa.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">4. Responsabilidades do usuário</h2>
                                <p>
                                    Ao utilizar o site, você se compromete a:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Fornecer informações verdadeiras ao entrar em contato;</li>
                                    <li>Respeitar a equipe da loja e outros clientes;</li>
                                    <li>Não utilizar o site para fins ilegais ou para tentativa de fraude.</li>
                                </ul>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">5. Responsabilidades da loja</h2>
                                <p>
                                    A loja se compromete a:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Prestar informações claras sobre produtos, preços e condições;</li>
                                    <li>Tratar seus dados de contato with sigilo e respeito, conforme a Política de Privacidade;</li>
                                    <li>Atender às normas de defesa do consumidor aplicáveis.</li>
                                </ul>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">6. Dados pessoais e privacidade</h2>
                                <p>
                                    Como explicado na Política de Privacidade, o site não realiza cadastros complexos de usuários. O principal
                                    dado pessoal utilizado é o número de telefone/WhatsApp, quando você escolhe falar com a loja. Esse dado é
                                    usado apenas para comunicação e atendimento.
                                </p>

                                <h2 className="font-semibold text-slate-900 text-base md:text-lg">7. Alterações nestes termos</h2>
                                <p>
                                    Estes termos podem ser atualizados a qualquer momento para acompanhar melhorias do site ou mudanças na forma
                                    de atendimento. A versão mais recente estará sempre disponível nesta página.
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
