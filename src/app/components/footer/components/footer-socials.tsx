import Link from "next/link";
import {
    Instagram,
    Facebook,
    X,
    Twitter,
    Youtube,
    Linkedin,
    MessageCircle,
    Music
} from "lucide-react";
import { getStoreConfig } from "@/services/store-config";

const socialIcons: Record<string, any> = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    x: X,
    youtube: Youtube,
    linkedin: Linkedin,
    tiktok: Music,
    whatsapp: MessageCircle,
};

export default async function FooterSocials() {
    "use cache";
    const config = await getStoreConfig();

    if (!config || !config.socialMedias || config.socialMedias.length === 0) return null;

    const getSocialIcon = (platform: string) => {
        const lowerPlatform = platform.toLowerCase();
        for (const key in socialIcons) {
            if (lowerPlatform.includes(key)) return socialIcons[key];
        }
        return null;
    };

    return (
        <div className="mt-8 flex flex-col items-center md:items-start">
            <p className="text-xs text-pink-700 font-semibold uppercase tracking-wider mb-4">Siga-nos</p>
            <div className="flex items-center gap-2">
                {config.socialMedias.map((social: any) => {
                    const Icon = getSocialIcon(social.platform);
                    return (
                        <Link
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white border border-pink-100 flex items-center justify-center rounded-xl text-pink-700 hover:bg-pink-700 hover:text-white hover:border-pink-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                            title={social.platform}
                        >
                            {Icon ? (
                                <Icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
