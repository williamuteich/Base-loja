export default function SkeletonSocialMedia() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
            <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0 border border-slate-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-6 w-16 bg-slate-100 rounded-full" />
                    <div className="flex gap-1">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                        <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
