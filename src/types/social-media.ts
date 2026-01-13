export interface SocialMedia {
    id: string;
    platform: string;
    url: string;
    isActive: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    storeConfigId: string;
}

export interface SocialMediaResponse {
    data: SocialMedia[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
