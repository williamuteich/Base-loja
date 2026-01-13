import { prisma } from "./prisma";

export async function getOrCreateStoreConfig() {
    let config = await prisma.storeConfiguration.findFirst();

    if (!config) {
        config = await prisma.storeConfiguration.create({
            data: {
                storeName: "Minha Loja",
                contactEmail: "admin@example.com",
                cnpj: "00.000.000/0001-00",
            }
        });
    }

    return config;
}
