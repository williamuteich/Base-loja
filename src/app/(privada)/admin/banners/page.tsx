import { Suspense } from "react";
import BannerList from "./banner-list";

export default function AdminBannersPage() {
    return (
        <div className="w-full">
            <Suspense fallback={<div>Carregando...</div>}>
                <BannerList />
            </Suspense>
        </div>
    );
}
