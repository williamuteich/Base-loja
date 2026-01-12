import { getStoreConfig } from "@/services/store-config";

export default async function FooterContact() {
    "use cache";
    const config = await getStoreConfig();

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contato</h4>
            <ul className="space-y-4 text-sm text-slate-600">
                {config?.address && (
                    <li className="flex flex-col items-center md:items-start gap-1">
                        <div className="text-sm">
                            <p className="font-bold text-slate-800">{config.address}</p>
                            <p className="opacity-90">{config.city} - {config.state}</p>
                            {config.zipCode && <p className="opacity-70 text-xs mt-0.5">CEP: {config.zipCode}</p>}
                        </div>
                    </li>
                )}
                {config?.contactEmail && (
                    <li className="flex items-center gap-2 hover:text-pink-700 transition-colors">
                        <span className="text-xs break-all">{config.contactEmail}</span>
                    </li>
                )}
                {config?.phone && (
                    <li className="flex items-center gap-2 hover:text-pink-700 transition-colors">
                        <span className="text-xs font-semibold">{config.phone}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
