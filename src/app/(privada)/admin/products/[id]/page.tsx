
import { getAdminBrands } from "@/services/brand";
import { getAdminCategories } from "@/services/category";
import ProductForm from "../components/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const backendUrl = process.env.API_URL || "http://localhost:3000";

    const brandsData = await getAdminBrands(1, 100);
    const categoriesData = await getAdminCategories(1, 100);

    let product = null;
    try {
        const res = await fetch(`${backendUrl}/api/private/product/${id}`, { cache: "no-store" });
        if (res.ok) {
            product = await res.json();
        }
    } catch (e) {
        console.error("Error fetching product", e);
    }

    if (!product) {
        return notFound();
    }

    return (
        <ProductForm
            product={product}
            brands={brandsData.data}
            categories={categoriesData.data}
        />
    );
}
