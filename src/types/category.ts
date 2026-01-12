export interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    isHome: boolean;
    _count: {
        products: number;
    };
}
