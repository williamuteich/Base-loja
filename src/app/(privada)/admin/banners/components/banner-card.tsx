"use client";

import Image from "next/image";
import { BannerCardProps } from "@/types/banner";
import { SquarePen, Trash2, ImageIcon } from "lucide-react";

export default function BannerCard({ banner, index, onEdit, onDelete }: BannerCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 p-4">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    {banner.imageDesktop ? (
                        <Image
                            src={`${process.env.API_URL || "http://localhost:3000"}/${banner.imageDesktop}`}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{banner.title}</h3>
                    {banner.subtitle && (
                        <p className="text-sm text-slate-500 truncate">{banner.subtitle}</p>
                    )}
                    {banner.linkUrl && (
                        <a
                            href={banner.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate block mt-0.5"
                        >
                            {banner.linkUrl}
                        </a>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {banner.isActive ? (
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
                            onClick={() => onEdit(banner)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(banner)}
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
