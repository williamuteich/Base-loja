import { Suspense } from "react";
import HeaderDesk from "./headerDesk";
import HeaderMobile from "./headerMobile";
import StoreBrand from "./components/store-brand";
import ContactInfo from "./components/contact-info";
import SocialLinks from "./components/social-links";
import SeoMessage from "./components/seo-message";

export default function Header() {
    return (
        <Suspense fallback={<div className="h-[116px] w-full bg-white border-b border-slate-100 animate-pulse" />}>
            <HeaderDesk
                brandSlot={
                    <Suspense fallback={<div className="w-48 h-10 bg-slate-100 animate-pulse rounded-lg" />}>
                        <StoreBrand />
                    </Suspense>
                }
                contactSlot={
                    <Suspense fallback={<div className="w-32 h-4 bg-pink-100/20 animate-pulse rounded" />}>
                        <ContactInfo />
                    </Suspense>
                }
                seoSlot={
                    <Suspense fallback={<div className="w-40 h-4 bg-pink-100/20 animate-pulse rounded mx-auto" />}>
                        <SeoMessage />
                    </Suspense>
                }
                socialSlot={
                    <Suspense fallback={<div className="w-24 h-4 bg-pink-100/20 animate-pulse rounded" />}>
                        <SocialLinks />
                    </Suspense>
                }
            />

            <HeaderMobile
                brandSlot={
                    <Suspense fallback={<div className="w-32 h-8 bg-slate-100 animate-pulse rounded" />}>
                        <StoreBrand mobile />
                    </Suspense>
                }
                menuBrandSlot={
                    <Suspense fallback={<div className="w-32 h-8 bg-slate-100 animate-pulse rounded" />}>
                        <StoreBrand mobile />
                    </Suspense>
                }
                socialSlot={
                    <Suspense fallback={<div className="w-full h-20 bg-slate-100 animate-pulse rounded-xl mt-4" />}>
                        <SocialLinks variant="featured" />
                    </Suspense>
                }
            />
        </Suspense>
    );
}
