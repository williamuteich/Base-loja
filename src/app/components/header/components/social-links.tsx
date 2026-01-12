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
import { cn } from "@/lib/utils";

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

export default async function SocialLinks({ variant = "minimal" }: { variant?: "minimal" | "featured" }) {
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

    const containerClasses = cn(
        "flex items-center",
        variant === "minimal" ? "gap-3" : "justify-center gap-6"
    );

    const iconBoxClasses = cn(
        "transition-all duration-300",
        variant === "minimal"
            ? "opacity-60 hover:opacity-100"
            : "text-slate-400 hover:text-pink-700 hover:scale-110 active:scale-95"
    );

    const iconSizeClasses = variant === "minimal" ? "w-4 h-4" : "w-5 h-5";

    return (
        <div className={containerClasses}>
            {config.socialMedias.map((social: any) => {
                const Icon = getSocialIcon(social.platform);
                return (
                    <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={iconBoxClasses}
                    >
                        {Icon ? (
                            <Icon className={iconSizeClasses} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconSizeClasses}>
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        )}
                    </a>
                );
            })}
        </div>
    );
}
