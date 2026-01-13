import { getAdminBrands } from "@/services/brand";
import { getAdminCategories } from "@/services/category";
import ProductForm from "../components/product-form";

export default async function CreateProductPage() {
    const brandsData = await getAdminBrands(1, 100);
    const categoriesData = await getAdminCategories(1, 100);

    return (
        <div className="w-full mx-auto">
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Novo Produto</h1>
                <p className="text-slate-500">Adicione um novo produto ao catálogo</p>
            </div>
            <ProductForm
                brands={brandsData.data}
                categories={categoriesData.data}
            />
        </div>
    );
}
