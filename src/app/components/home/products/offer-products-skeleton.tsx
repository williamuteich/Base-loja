import ProductCardSkeleton from "./product-card-skeleton";

export default function OfferProductsSkeleton() {
    return (
        <section className="py-16 bg-rose-50/30 overflow-hidden border-y border-rose-100/40 mt-6 mb-6 animate-pulse">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div className="space-y-3">
                        <div className="h-6 w-32 bg-rose-500/10 rounded-full" />
                        <div className="h-10 w-64 md:w-96 bg-slate-200 rounded-lg" />
                        <div className="h-5 w-full md:w-80 bg-slate-100 rounded-lg" />
                    </div>
                </div>

                <div className="flex gap-4 md:gap-6 overflow-hidden pt-2 px-1 pb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div key={i} className="w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%] shrink-0">
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
