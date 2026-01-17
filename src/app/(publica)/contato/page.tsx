import { getPublicSettings } from "@/services/settings";
import { Suspense } from "react";

async function ContactContent() {
    const config = await getPublicSettings();

    if (!config) {
        return (
            <section className="py-12 md:py-14 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto">
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 md:p-7 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-base md:text-lg font-semibold text-red-900 mb-1.5">
                                Erro ao carregar
                            </h3>
                            <p className="text-sm text-red-700">Não foi possível carregar as configurações da loja.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-14 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-10 h-0.5 bg-pink-600 rounded-full"></div>
                            <span className="mx-3 px-4 py-1.5 bg-pink-600 text-white text-[11px] font-semibold tracking-[0.18em] uppercase rounded-full">
                                Contato
                            </span>
                            <div className="w-10 h-0.5 bg-pink-600 rounded-full"></div>
                        </div>
                        <h1 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                            Fale com a nossa equipe
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
                            Tire suas dúvidas, faça pedidos ou combine a retirada dos seus produtos diretamente na loja.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 items-stretch">
                        <div className="space-y-6 md:space-y-7 h-full">
                            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 h-full">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-pink-600/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Informações de contato</h2>
                                        <p className="text-gray-500 text-xs md:text-sm">Use o canal que preferir</p>
                                    </div>
                                </div>

                                <div className="space-y-3.5">
                                    {config.address && (
                                        <div className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">Endereço</h3>
                                                <p className="text-gray-700 mb-0.5 text-sm">{config.address}</p>
                                                <p className="text-gray-600 text-xs md:text-sm">{config.city} - {config.state}</p>
                                                {config.zipCode && <p className="text-xs text-gray-500 mt-0.5">CEP: {config.zipCode}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {config.phone && (
                                        <div className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">Telefone</h3>
                                                <p className="text-gray-700 text-sm">{config.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {config.whatsapp && (
                                        <div className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">WhatsApp</h3>
                                                <p className="text-gray-700 text-sm">{config.whatsapp}</p>
                                            </div>
                                        </div>
                                    )}

                                    {config.contactEmail && (
                                        <div className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">E-mail</h3>
                                                <p className="text-gray-700 text-sm">{config.contactEmail}</p>
                                            </div>
                                        </div>
                                    )}

                                    {config.businessHours && (
                                        <div className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">Horário de funcionamento</h3>
                                                <p className="text-gray-700 whitespace-pre-line text-sm">{config.businessHours}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-5 h-full">
                            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-pink-600/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Nossa localização</h2>
                                        <p className="text-gray-500 text-xs md:text-sm">Venha nos visitar</p>
                                    </div>
                                </div>

                                {config.googleMapsEmbedUrl ? (
                                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-1 min-h-[400px]">
                                        <div className="w-full h-full responsive-iframe">
                                            <div
                                                className="w-full h-full"
                                                dangerouslySetInnerHTML={{ __html: config.googleMapsEmbedUrl }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-gray-200 h-60 md:h-64 flex flex-col items-center justify-center text-gray-400 p-5 flex-1">
                                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Mapa não configurado</p>
                                        <p className="text-xs text-gray-400 text-center max-w-md">Adicione um link do Google Maps Embed nas configurações para exibir a localização aqui.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LoadingFallback() {
    return (
        <section className="py-12 md:py-14 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-10 h-0.5 bg-pink-600 rounded-full animate-pulse"></div>
                            <span className="mx-3 px-4 py-1.5 bg-pink-600 text-white text-[11px] font-semibold tracking-[0.18em] uppercase rounded-full">
                                Contato
                            </span>
                            <div className="w-10 h-0.5 bg-pink-600 rounded-full animate-pulse"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
                        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const metadata = {
    title: "Contato | Joias Úteis",
    description: "Fale com a nossa equipe. Tire suas dúvidas, faça pedidos ou combine a retirada dos seus produtos.",
};

export default function ContatoPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ContactContent />
        </Suspense>
    );
}
