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

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getStoreConfig(): Promise<StoreConfig | null> {
    try {
        const res = await fetch(`${API_URL}/store-configuration/public`, {
            next: {
                revalidate: 3600,
                tags: ["store-config"],
            },
        });

        if (!res.ok) {
            console.warn(`Fetch to ${API_URL}/store-configuration/public returned status: ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching store config:", error);
        return null;
    }
}
