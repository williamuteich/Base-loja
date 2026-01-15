export interface Brand {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
}

export interface BrandsResponse {
    data: Brand[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
