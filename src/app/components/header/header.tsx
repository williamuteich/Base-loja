import HeaderDesk from "./headerDesk";
import HeaderMobile from "./headerMobile";

export default function Header() {
    const config = {
        storeName: "Bazar Elegance",
        phone: "(55) 99999-9999",
        contactEmail: "contato@bazarelegance.com.br",
        seoTitle: "Beleza que existe em você",
        logoUrl: null,
        socialMedias: [
            { id: "1", platform: "instagram", url: "https://instagram.com" },
            { id: "2", platform: "facebook", url: "https://facebook.com" },
            { id: "3", platform: "whatsapp", url: "https://wa.me/55999999999" },
        ],
    };

    return (
        <>
            <HeaderDesk config={config} />
            <HeaderMobile config={config} />
        </>
    );
}
