import Footer from "./components/footer/footer";
import Header from "./components/header/header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="pt-24 container mx-auto px-4">
          <h1 className="text-4xl font-bold text-pink-700">Bem-vindo ao Bazar Elegance</h1>
          <p className="mt-4 text-slate-600">Sua loja de beleza favorita.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
