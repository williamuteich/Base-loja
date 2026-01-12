import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import Banner from "./components/home/banner/banner";
import ProductCarousel from "./components/home/products/product-carousel";
import { getPublicProducts } from "@/services/product";

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <>
      <Header />
      <main className="pt-[116px] lg:pt-[116px]">
        <Banner />

        <ProductCarousel products={products} backendUrl={API_URL} />
      </main>
      <Footer />
    </>
  );
}
