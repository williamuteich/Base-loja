import { getStoreConfig } from "@/services/store-config";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default async function FooterContact() {
    "use cache";
    const config = await getStoreConfig();

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-slate-900 mb-8 text-sm uppercase tracking-wider relative inline-block">
                Contato
                <span className="absolute -bottom-2 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-1 bg-pink-500/30 rounded-full"></span>
            </h4>

            <ul className="space-y-6 text-sm">
                {config?.address && (
                    <li className="flex flex-col md:flex-row items-center md:items-start gap-4 group">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 group-hover:text-pink-700 transition-all duration-300">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold text-slate-800 leading-tight mb-0.5">{config.address}</p>
                            <p className="text-slate-500 font-medium">{config.city}, {config.state}</p>
                            {config.zipCode && <p className="text-slate-400 text-xs mt-1 tabular-nums">CEP: {config.zipCode}</p>}
                        </div>
                    </li>
                )}

                {(config?.contactEmail || config?.phone) && (
                    <div className="space-y-4 pt-2">
                        {config?.contactEmail && (
                            <li className="flex items-center gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 group-hover:text-pink-700 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <a href={`mailto:${config.contactEmail}`} className="text-slate-600 font-medium hover:text-pink-700 transition-colors break-all">
                                    {config.contactEmail}
                                </a>
                            </li>
                        )}

                        {config?.phone && (
                            <li className="flex items-center gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 group-hover:text-pink-700 transition-all duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <a href={`tel:${config.phone.replace(/\D/g, '')}`} className="text-slate-600 font-bold hover:text-pink-700 transition-colors tabular-nums">
                                    {config.phone}
                                </a>
                            </li>
                        )}

                        {config?.businessHours && (
                            <li className="flex items-center gap-4 group pt-2">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-all duration-300">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Horário de Atendimento</span>
                                    <span className="text-slate-600 font-medium text-xs">{config.businessHours}</span>
                                </div>
                            </li>
                        )}
                    </div>
                )}
            </ul>
        </div>
    );
}
