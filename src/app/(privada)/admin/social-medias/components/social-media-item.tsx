"use client";

import { useState, useEffect } from "react";
import {
    Instagram, Facebook, Twitter, Youtube,
    Linkedin, MessageCircle, Music2, Pin,
    Globe, Trash2
} from "lucide-react";
import { SocialMediaItemProps } from "@/types/social-media";

const getPlatformMeta = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("instagram")) return { icon: Instagram, color: "from-pink-500 to-purple-600", label: "Instagram" };
    if (p.includes("facebook")) return { icon: Facebook, color: "from-blue-600 to-blue-700", label: "Facebook" };
    if (p.includes("twitter") || p.includes("x")) return { icon: Twitter, color: "from-slate-700 to-slate-900", label: "Twitter / X" };
    if (p.includes("youtube")) return { icon: Youtube, color: "from-red-500 to-red-600", label: "YouTube" };
    if (p.includes("linkedin")) return { icon: Linkedin, color: "from-blue-500 to-blue-700", label: "LinkedIn" };
    if (p.includes("tiktok")) return { icon: Music2, color: "from-black to-slate-800", label: "TikTok" };
    if (p.includes("whatsapp")) return { icon: MessageCircle, color: "from-emerald-500 to-emerald-600", label: "WhatsApp" };
    if (p.includes("pinterest")) return { icon: Pin, color: "from-red-600 to-red-700", label: "Pinterest" };
    return { icon: Globe, color: "from-slate-400 to-slate-500", label: platform };
};

export default function SocialMediaItem({ social, onDelete, onUpdate, onToggle }: SocialMediaItemProps) {
    const meta = getPlatformMeta(social.platform);
    const Icon = meta.icon;
    const [localUrl, setLocalUrl] = useState(social.url);

    useEffect(() => {
        setLocalUrl(social.url);
    }, [social.url]);

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 group relative">
            <button
                onClick={() => onDelete(social)}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 transition-all duration-200 cursor-pointer"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${meta.color} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-base font-medium text-slate-700">
                        {meta.label}
                    </label>
                </div>

                <input
                    type="url"
                    value={localUrl}
                    onChange={(e) => setLocalUrl(e.target.value)}
                    onBlur={() => onUpdate(social, localUrl)}
                    onKeyDown={(e) => e.key === 'Enter' && onUpdate(social, localUrl)}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                    placeholder={`URL do ${meta.label}`}
                />

                <div className="flex items-center justify-end pt-1">
                    <button
                        type="button"
                        onClick={() => onToggle(social)}
                        className={`peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${social.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${social.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
