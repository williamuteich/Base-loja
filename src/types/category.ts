export interface Category {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
    isHome: boolean;
    createdAt: string;
    updatedAt: string;
}
