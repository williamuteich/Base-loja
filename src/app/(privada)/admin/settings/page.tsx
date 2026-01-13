"use client";

import { useState, useEffect } from "react";
import {
    Save, Store, Mail, MapPin, Search, Loader2
} from "lucide-react";
import { getSettings, updateSettings } from "@/services/settings";
import { toast } from "sonner";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({
        maintenanceMode: false,
        maintenanceMessage: "",
        storeName: "",
        cnpj: "",
        description: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        googleMapsEmbedUrl: "",
        businessHours: "",
        contactEmail: "",
        notifyNewOrders: false,
        automaticNewsletter: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        currency: "BRL",
        locale: "pt-BR"
    });

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await getSettings();
                if (data) {
                    setFormData({
                        ...data,
                        maintenanceMessage: data.maintenanceMessage || "",
                        description: data.description || "",
                        phone: data.phone || "",
                        whatsapp: data.whatsapp || "",
                        address: data.address || "",
                        city: data.city || "",
                        state: data.state || "",
                        zipCode: data.zipCode || "",
                        googleMapsEmbedUrl: data.googleMapsEmbedUrl || "",
                        businessHours: data.businessHours || "",
                        seoTitle: data.seoTitle || "",
                        seoDescription: data.seoDescription || "",
                        seoKeywords: data.seoKeywords || ""
                    });
                }
            } catch (error) {
                console.error("Error loading settings:", error);
                toast.error("Erro ao carregar configurações");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const maskCNPJ = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/(\d{3})(\d{1,4})$/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
            .substring(0, 18);
    };

    const maskCEP = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{5})(\d)/, "$1-$2")
            .substring(0, 9);
    };

    const maskPhone = (value: string) => {
        let v = value.replace(/\D/g, "");
        v = v.substring(0, 11);

        if (v.length > 2) {
            v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
        }
        if (v.length > 9) {
            v = `${v.substring(0, 10)}-${v.substring(10)}`;
        }

        v = value.replace(/\D/g, "");
        if (v.length <= 10) {
            v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else {
            v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
        }
        return v.substring(0, 15);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;

        if (name === "cnpj") maskedValue = maskCNPJ(value);
        if (name === "zipCode") maskedValue = maskCEP(value);
        if (name === "whatsapp" || name === "phone") {
            const digits = value.replace(/\D/g, "");
            if (digits.length <= 10) {
                maskedValue = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
            } else {
                maskedValue = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
            }
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: maskedValue
        }));
    };

    const toggleSwitch = (name: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const onSubmit = async () => {
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast.success("Configurações salvas com sucesso! ✨");
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error(error.message || "Erro ao salvar configurações");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-xl border border-slate-200">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium">Carregando configurações...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 w-full mx-auto space-y-8 pb-24">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
                    <p className="text-slate-500">Gerencie as informações e o comportamento da sua loja</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-900 text-white">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Informações da Loja</h2>
                        <p className="text-sm text-slate-400">Dados básicos e endereço</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nome da Loja</label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Telefone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Endereço</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">CEP</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Cidade</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Estado</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-900 text-white">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Configurações de Email</h2>
                        <p className="text-sm text-slate-400">Emails de notificação</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email de Contato</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1">Notificar novos pedidos</label>
                            <p className="text-sm text-slate-500">Receber email quando houver novo pedido</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => toggleSwitch('notifyNewOrders')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.notifyNewOrders ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <span className={`${formData.notifyNewOrders ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1">Newsletter automática</label>
                            <p className="text-sm text-slate-500">Enviar promoções automaticamente</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => toggleSwitch('automaticNewsletter')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.automaticNewsletter ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <span className={`${formData.automaticNewsletter ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-900 text-white">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Search className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">SEO</h2>
                        <p className="text-sm text-slate-400">Otimização para motores de busca</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Título SEO</label>
                        <input
                            type="text"
                            name="seoTitle"
                            value={formData.seoTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Descrição SEO</label>
                        <textarea
                            name="seoDescription"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Palavras-chave</label>
                        <input
                            type="text"
                            name="seoKeywords"
                            value={formData.seoKeywords}
                            onChange={handleChange}
                            placeholder="palavra1, palavra2, ..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-900 text-white">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Localização & Horários</h2>
                        <p className="text-sm text-slate-400">Maps e expediente</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Google Maps Embed URL</label>
                        <input
                            type="text"
                            name="googleMapsEmbedUrl"
                            value={formData.googleMapsEmbedUrl}
                            onChange={handleChange}
                            placeholder='https://www.google.com/maps/embed?...'
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Horário de Funcionamento</label>
                        <input
                            type="text"
                            name="businessHours"
                            value={formData.businessHours}
                            onChange={handleChange}
                            placeholder="Seg–Sex, 9h às 18h"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={onSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-12 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Salvando Alterações..." : "Salvar Todas as Configurações"}
                </button>
            </div>
        </div>
    );
}
