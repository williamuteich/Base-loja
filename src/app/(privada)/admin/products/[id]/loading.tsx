export default function Loading() {
    return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Carregando...</p>
            </div>
        </div>
    );
}
