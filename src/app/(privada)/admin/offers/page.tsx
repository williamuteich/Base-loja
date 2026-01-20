import OffersForm from "./components/offers-form";
import { connection } from "next/server";

export const metadata = {
    title: "Gerenciar Ofertas | Admin",
    description: "Crie e agende promoções para seus produtos"
};

export default async function OffersPage() {
    await connection();

    return (
        <div className="w-full mx-auto">
            <div className="max-w-4xl mx-auto mb-8 px-6 md:px-0">
                <h1 className="text-3xl font-bold text-slate-800">Gerenciar Ofertas</h1>
                <p className="text-slate-500 mt-1">Selecione um produto e configure o período e valor da promoção</p>
            </div>

            <div className="px-6 md:px-0">
                <OffersForm />
            </div>
        </div>
    );
}
