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
