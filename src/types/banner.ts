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

export interface BannerCardProps {
    banner: Banner;
    index: number;
    onEdit: (banner: Banner) => void;
    onDelete: (banner: Banner) => void;
}

export interface BannerFormProps {
    banner?: Banner;
    onSave: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export interface BannerHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewBanner: () => void;
}

export interface BannerPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface BannerCarouselProps {
    banners: Banner[];
    backendUrl: string;
}
