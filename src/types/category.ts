export interface Category {
    products: any;
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    isHome: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        products: number;
    };
}

export interface CategoriesResponse {
    data: Category[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
