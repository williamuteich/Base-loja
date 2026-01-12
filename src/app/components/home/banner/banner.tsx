import { getPublicBanners } from "@/services/banner";
import { getPublicCategories } from "@/services/category";
import BannerCarousel from "./banner-carousel";
import TrustInfo from "./trust-info";
import CategoryCarousel from "../category/category-carousel";

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function Banner() {
    "use cache";
    const [banners, categories] = await Promise.all([
        getPublicBanners(),
        getPublicCategories()
    ]);

    return (
        <section className="w-full">
            <BannerCarousel banners={banners} backendUrl={API_URL} />
            <TrustInfo />
            <CategoryCarousel categories={categories} backendUrl={API_URL} />
        </section>
    );
}
