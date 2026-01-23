import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import Banner from "./components/home/banner/banner";
import ProductCarousel from "./components/home/products/product-carousel";
import OfferProductsCarousel from "./components/home/products/offer-products-carousel";
import CategoryProductsCarousel from "./components/home/products/category-products-carousel";
import { getPublicProducts } from "@/services/product";
import { getPublicCategories } from "@/services/category";
import { connection } from "next/server";
import { Suspense } from "react";
import OfferProductsSkeleton from "./components/home/products/offer-products-skeleton";

const API_URL = process.env.API_URL || "http://localhost:3000";

export default async function Home() {
  await connection();
  const products = await getPublicProducts();
  const homeCategories = await getPublicCategories(true, true);

  return (
    <>
      <Header />
      <main className="pt-[116px] lg:pt-[116px]">
        <Banner />

        <Suspense fallback={<OfferProductsSkeleton />}>
          <OfferProductsCarousel backendUrl={API_URL} />
        </Suspense>

        <ProductCarousel products={products} backendUrl={API_URL} />

        {homeCategories.map((category, index) => (
          <CategoryProductsCarousel
            key={category.id}
            title={category.name}
            description={category.description}
            products={category.products?.map((p: any) => p.product) || []}
            useAltBackground={index % 2 !== 0}
            backendUrl={API_URL}
          />
        ))}

      </main>
      <Footer />
    </>
  );
}
