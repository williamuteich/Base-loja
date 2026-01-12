import { Phone, Mail } from "lucide-react";
import { getStoreConfig } from "@/services/store-config";

export default async function ContactInfo() {
    "use cache";
    const config = await getStoreConfig();

    if (!config) return null;

    return (
        <div className="flex items-center gap-4">
            {config.phone && (
                <span className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 cursor-default">
                    <Phone className="w-3.5 h-3.5" />
                    {config.phone}
                </span>
            )}
            <span className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 cursor-default">
                <Mail className="w-3.5 h-3.5" />
                {config.contactEmail}
            </span>
        </div>
    );
}
