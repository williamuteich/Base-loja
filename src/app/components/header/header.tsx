import HeaderDesk from "./headerDesk";
import HeaderMobile from "./headerMobile";
import { getStoreConfig } from "@/services/store-config";

export default async function Header() {
    const config = await getStoreConfig();

    return (
        <>
            <HeaderDesk config={config} />
            <HeaderMobile config={config} />
        </>
    );
}
