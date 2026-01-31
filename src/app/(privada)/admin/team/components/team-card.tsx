"use client";

import { TeamCardProps } from "@/types/team";
import { SquarePen, Trash2, User, ShieldCheck } from "lucide-react";

export default function TeamCard({ member, onEdit, onDelete }: TeamCardProps) {
    const isOwner = member.role === "ADMIN";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    {isOwner ? (
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                    ) : (
                        <User className="w-6 h-6 text-slate-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {member.name} {member.lastName}
                        </h3>
                        {isOwner ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider border border-blue-100">
                                Admin
                            </span>
                        ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-600 uppercase tracking-wider border border-slate-200">
                                Colaborador
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{member.email}</p>
                </div>

                <div className="flex items-center gap-3">
                    {member.isActive ? (
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
                            onClick={() => onEdit(member)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(member)}
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
