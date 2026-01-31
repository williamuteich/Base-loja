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

export interface CategoryFormProps {
    category?: Category;
    onSave: (data: FormData) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export interface CategoryHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewCategory: () => void;
}

export interface CategoryCarouselWrapperProps {
    children: React.ReactNode;
    hasCategories: boolean;
}

export interface CategoryCarouselProps {
    categories: Category[];
    backendUrl: string;
}
