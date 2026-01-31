import { Category } from "./category";
import { Brand } from "./brand";
import { StoreConfig } from "./store-config";

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

export interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ProductFormProps {
    product?: Product | null;
    brands: Brand[];
    categories: Category[];
}

export interface ProductCardProps {
    product: Product;
    backendUrl: string;
}

export interface CategoryProductsCarouselProps {
    title: string;
    description?: string | null;
    products: any[];
    categoryPath?: string;
    useAltBackground?: boolean;
    backendUrl: string;
}

export interface OfferProductsCarouselProps {
    backendUrl: string;
}

export interface ProductGridProps {
    products: Product[];
    backendUrl: string;
}

export interface RelatedProductsCarouselProps {
    products: Product[];
    backendUrl: string;
}

export interface ProductDetailProps {
    product: Product;
    storeConfig: StoreConfig | null;
    backendUrl: string;
}

export interface ProductCarouselProps {
    products: Product[];
    backendUrl: string;
}
