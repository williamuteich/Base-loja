import BrandList from "./brand-list";

export const metadata = {
    title: "Marcas | Dashboard Admin",
    description: "Gerencie as marcas e parceiros da sua loja.",
};

export default function BrandsPage() {
    return (
        <div className="space-y-6">
            <BrandList />
        </div>
    );
}
