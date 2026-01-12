import CategoryList from "./category-list";

export const metadata = {
    title: "Categorias | Dashboard Admin",
    description: "Gerencie os departamentos e organização da sua loja.",
};

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <CategoryList />
        </div>
    );
}
