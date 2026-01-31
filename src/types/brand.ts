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

export interface BrandFormProps {
    brand?: Brand;
    onSave: (data: { name: string; isActive: boolean }) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export interface BrandHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewBrand: () => void;
}
