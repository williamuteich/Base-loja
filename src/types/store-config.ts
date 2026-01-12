export interface SocialMedia {
    id: string;
    platform: string;
    url: string;
    isActive: boolean;
    storeConfigId: string;
    createdAt: string;
    updatedAt: string;
}

export interface StoreConfig {
    id: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    storeName: string;
    cnpj: string;
    description: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    googleMapsEmbedUrl: string;
    businessHours: string;
    contactEmail: string;
    notifyNewOrders: boolean;
    automaticNewsletter: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    currency: string;
    locale: string;
    logoUrl?: string | null;
    socialMedias: SocialMedia[];
    createdAt: string;
    updatedAt: string;
}