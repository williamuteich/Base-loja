"use client";

import { useState } from "react";
import { TeamMember, TeamRole } from "@/types/team";
import { Loader2, Save, User, Mail, Shield, Lock } from "lucide-react";

interface TeamFormProps {
    member?: TeamMember;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export default function TeamForm({ member, onSave, onCancel, isSaving }: TeamFormProps) {
    const [name, setName] = useState(member?.name || "");
    const [lastName, setLastName] = useState(member?.lastName || "");
    const [email, setEmail] = useState(member?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<TeamRole>(member?.role || "COLLABORATOR");
    const [isActive, setIsActive] = useState(member?.isActive ?? true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim()) {
            return;
        }

        const data: any = {
            name,
            lastName,
            email,
            role,
            isActive
        };

        if (password) {
            data.password = password;
        }

        await onSave(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Nome
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Sobrenome
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ex: Silva"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        E-mail de Acesso
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="joao.silva@empresa.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" />
                        {member ? "Nova Senha (Opcional)" : "Senha"}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={member ? "Deixe em branco para manter" : "••••••••"}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        required={!member}
                        minLength={6}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        Nível de Acesso
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as TeamRole)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                    >
                        <option value="COLLABORATOR">Colaborador</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <span
                            className={`${isActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">Membro Ativo</span>
                        <span className="text-xs text-slate-500">
                            {isActive ? 'Pode acessar o painel administrativo.' : 'Acesso bloqueado temporariamente.'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    disabled={isSaving}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Salvar Membro
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
