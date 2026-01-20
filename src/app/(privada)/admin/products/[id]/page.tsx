
import { getAdminBrands } from "@/services/brand";
import { getAdminCategories } from "@/services/category";
import ProductForm from "../components/product-form";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await connection();
    const { id } = await params;

    const brandsData = await getAdminBrands(1, 100);
    const categoriesData = await getAdminCategories(1, 100);

    const productData = await prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
            variants: true,
            categories: true,
            brand: true,
        },
    });

    if (!productData) {
        return notFound();
    }

    const product = {
        ...productData,
        createdAt: productData.createdAt.toISOString(),
        updatedAt: productData.updatedAt.toISOString(),
        brand: productData.brand ? {
            ...productData.brand,
            createdAt: productData.brand.createdAt.toISOString(),
            updatedAt: productData.brand.updatedAt.toISOString(),
        } : undefined,
        variants: productData.variants.map(v => ({
            ...v,
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        })),
        images: productData.images.map(i => ({
            ...i,
            createdAt: i.createdAt.toISOString(),
            updatedAt: i.updatedAt.toISOString(),
        })),
        categories: productData.categories.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
        }))
    } as any;

    return (
        <ProductForm
            product={product}
            brands={brandsData.data}
            categories={categoriesData.data}
        />
    );
}
