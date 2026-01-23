export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 h-full animate-pulse">
            <div className="relative aspect-square bg-slate-100" />

            <div className="p-4 md:p-6 pb-16 relative">
                <div className="h-3 md:h-4 bg-slate-100 rounded-full w-1/3 mb-2" />
                <div className="h-4 md:h-6 bg-slate-200 rounded-full w-3/4 mb-2" />
                <div className="space-y-1.5 md:space-y-2 mb-3">
                    <div className="h-2 md:h-3 bg-slate-100 rounded-full w-full" />
                    <div className="h-2 md:h-3 bg-slate-100 rounded-full w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 md:h-8 bg-slate-200 rounded-full w-1/2" />
                    <div className="h-3 md:h-4 bg-slate-100 rounded-full w-1/4" />
                </div>
            </div>
        </div>
    );
}
