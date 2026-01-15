export interface Banner {
    id: string;
    title: string;
    subtitle?: string | null;
    linkUrl?: string | null;
    imageDesktop?: string | null;
    imageMobile?: string | null;
    resolutionDesktop?: string | null;
    resolutionMobile?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BannersResponse {
    data: Banner[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
