export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    discountPrice: number | null;
    specs: any;
    createdAt: string;
    isActive: boolean;
    images: ProductImage[];
    categories: ProductCategory[];
    brand?: Brand;
    brandId?: string;
}

export interface ProductImage {
    id: string;
    url: string;
    productId: string;
}

export interface ProductCategory {
    productId: string;
    categoryId: string;
    category: {
        name: string;
    };
}

export interface Brand {
    id: string;
    name: string;
}
