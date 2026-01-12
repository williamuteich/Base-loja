export interface Banner {
    id: string;
    title: string;
    description?: string;
    imageDesktop?: string;
    imageMobile?: string;
    linkUrl?: string;
    isActive: boolean;
    order?: number;
}
