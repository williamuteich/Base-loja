import { Category } from "./category";

export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    discountPrice: number | null;
    specs: any;
    createdAt: string;
    isActive: boolean;
    images: ProductImage[];
    categories: Category[];
    brand?: Brand;
    brandId?: string;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    id: string;
    name: string;
    color: string;
    quantity: number;
    productId: string;
}

export interface ProductImage {
    id: string;
    url: string;
    productId: string;
}

export interface Brand {
    id: string;
    name: string;
}

export interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
