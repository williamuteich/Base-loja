export default function SkeletonCategory() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
            <div className="h-32 bg-slate-100" />
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-slate-100 rounded w-2/3" />
                    <div className="h-6 bg-slate-50 rounded-full w-16" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-50 rounded w-1/3" />
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-slate-50 rounded-lg" />
                        <div className="h-8 w-8 bg-slate-50 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
