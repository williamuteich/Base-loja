export default function SkeletonBrand() {
    return (
        <tr className="border-t border-slate-100 animate-pulse">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200" />
                    <div className="h-4 bg-slate-200 rounded w-24" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-slate-100 rounded w-20" />
            </td>
            <td className="px-6 py-4">
                <div className="w-16 h-6 rounded-full bg-slate-100" />
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                    <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                </div>
            </td>
        </tr>
    );
}
