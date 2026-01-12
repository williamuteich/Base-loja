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
    messenger: MessageCircle,
    telegram: MessageCircle,
};

export default async function SocialLinks() {
    "use cache";
    const config = await getStoreConfig();

    if (!config || !config.socialMedias) return null;

    const getSocialIcon = (platform: string) => {
        const lowerPlatform = platform.toLowerCase();
        for (const key in socialIcons) {
            if (lowerPlatform.includes(key)) return socialIcons[key];
        }
        return null;
    };

    return (
        <div className="flex items-center gap-3">
            {config.socialMedias.map((social: any) => {
                const Icon = getSocialIcon(social.platform);
                return Icon ? (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                        <Icon className="w-4 h-4" />
                    </a>
                ) : (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </a>
                );
            })}
        </div>
    );
}
