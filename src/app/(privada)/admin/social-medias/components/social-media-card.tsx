"use client";

import { SocialMedia } from "@/types/social-media";
import { SquarePen, Trash2, Globe, Instagram, Facebook as FacebookIcon, Youtube, MessageCircle, Twitter, Linkedin, Music2, Pin } from "lucide-react";

interface SocialMediaCardProps {
    socialMedia: SocialMedia;
    onEdit: (socialMedia: SocialMedia) => void;
    onDelete: (socialMedia: SocialMedia) => void;
}

const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("instagram")) return Instagram;
    if (p.includes("facebook")) return FacebookIcon;
    if (p.includes("youtube")) return Youtube;
    if (p.includes("whatsapp")) return MessageCircle;
    if (p.includes("twitter") || p.includes("x")) return Twitter;
    if (p.includes("linkedin")) return Linkedin;
    if (p.includes("tiktok")) return Music2;
    if (p.includes("pinterest")) return Pin;
    return Globe;
};

export default function SocialMediaCard({ socialMedia, onEdit, onDelete }: SocialMediaCardProps) {
    const Icon = getPlatformIcon(socialMedia.platform);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 shrink-0 border border-slate-200">
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{socialMedia.platform}</h3>
                    <a
                        href={socialMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block mt-0.5 font-medium"
                    >
                        {socialMedia.url}
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    {socialMedia.isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">
                            Ativo
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 whitespace-nowrap">
                            Inativo
                        </span>
                    )}

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(socialMedia)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(socialMedia)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
