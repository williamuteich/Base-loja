import { prisma } from "@/lib/prisma";
import { StoreConfig } from "@/types/store-config";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getStoreConfig(): Promise<StoreConfig | null> {
    "use cache";
    cacheTag("store-config");
    cacheLife("hours");

    try {
        const configRaw = await prisma.storeConfiguration.findFirst({
            include: {
                socialMedias: {
                    where: { isActive: true }
                }
            }
        });

        if (!configRaw) return null;

        return {
            ...configRaw,
            createdAt: configRaw.createdAt.toISOString(),
            updatedAt: configRaw.updatedAt.toISOString(),
            socialMedias: configRaw.socialMedias.map(sm => ({
                ...sm,
                createdAt: sm.createdAt.toISOString(),
                updatedAt: sm.updatedAt.toISOString(),
            }))
        } as any;
    } catch (error) {
        console.error("Error fetching store config:", error);
        return null;
    }
}
