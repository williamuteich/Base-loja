export default function SkeletonTeam() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
            <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />

                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-16 h-6 rounded-full bg-slate-100" />
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-lg bg-slate-100" />
                        <div className="w-8 h-8 rounded-lg bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
