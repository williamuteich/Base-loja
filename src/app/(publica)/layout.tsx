
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="pt-[140px] flex-1 flex flex-col">
                {children}
            </div>
            <Footer />
        </div>
    );
}
