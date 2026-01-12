import { Suspense } from "react";
import FooterShell from "./footerShell";
import FooterBrand from "./components/footer-brand";
import FooterSocials from "./components/footer-socials";
import FooterContact from "./components/footer-contact";
import WhatsAppButton from "./components/whatsapp-button";

export default function Footer() {
    return (
        <FooterShell
            brandSlot={
                <Suspense fallback={<div className="w-64 h-32 bg-slate-100 animate-pulse rounded-2xl" />}>
                    <FooterBrand />
                </Suspense>
            }
            socialSlot={
                <Suspense fallback={<div className="w-48 h-10 bg-slate-100 animate-pulse rounded-xl mt-6" />}>
                    <FooterSocials />
                </Suspense>
            }
            contactSlot={
                <Suspense fallback={<div className="w-64 h-40 bg-slate-100 animate-pulse rounded-2xl" />}>
                    <FooterContact />
                </Suspense>
            }
            whatsappSlot={
                <Suspense fallback={null}>
                    <WhatsAppButton />
                </Suspense>
            }
        />
    );
}
