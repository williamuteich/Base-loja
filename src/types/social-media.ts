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

export interface SocialMediaCardProps {
    socialMedia: SocialMedia;
    onEdit: (socialMedia: SocialMedia) => void;
    onDelete: (socialMedia: SocialMedia) => void;
}

export interface SocialMediaFormProps {
    socialMedia?: SocialMedia;
    onSave: (data: { platform: string; url: string; isActive: boolean }) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export interface SocialMediaHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onNewSocialMedia: () => void;
}

export interface SocialMediaItemProps {
    social: SocialMedia;
    onDelete: (social: SocialMedia) => void;
    onUpdate: (social: SocialMedia, newUrl: string) => void;
    onToggle: (social: SocialMedia) => void;
}
