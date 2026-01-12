import { getPublicBanners } from "@/services/banner";
import BannerCarousel from "./banner-carousel";
import TrustInfo from "./trust-info";

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function Banner() {
    "use cache";
    const banners = await getPublicBanners();

    return (
        <section className="w-full">
            <BannerCarousel banners={banners} backendUrl={API_URL} />
            <TrustInfo />
        </section>
    );
}
