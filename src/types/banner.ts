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
