import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import Banner from "./components/home/banner/banner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[116px] lg:pt-[116px]">
        <Banner />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Novidades para você</h1>
          <p className="mt-4 text-slate-500 max-w-2xl leading-relaxed">
            Descubra nossa coleção exclusiva de joias e acessórios, selecionados com carinho para realçar sua essência e brilho natural.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
