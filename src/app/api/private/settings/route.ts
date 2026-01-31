import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStoreConfig } from "@/lib/store-config";
import { revalidateTag } from "next/cache";

export async function GET() {
    try {
        const config = await getOrCreateStoreConfig();
        return NextResponse.json(config);
    } catch (error) {
        console.error("[API Private Settings] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const formData = await request.formData();
        const config = await getOrCreateStoreConfig();

        const updatedConfig = await prisma.storeConfiguration.update({
            where: { id: config.id },
            data: {
                storeName: (formData.get("storeName") as string) || (formData.get("name") as string),
                cnpj: formData.get("cnpj") as string,
                description: formData.get("description") as string,
                phone: formData.get("phone") as string,
                whatsapp: formData.get("whatsapp") as string,
                address: formData.get("address") as string,
                city: formData.get("city") as string,
                state: formData.get("state") as string,
                zipCode: formData.get("zipCode") as string,
                maintenanceMode: formData.get("maintenanceMode") === "true",
                maintenanceMessage: formData.get("maintenanceMessage") as string,
                businessHours: formData.get("businessHours") as string,
                googleMapsEmbedUrl: formData.get("googleMapsEmbedUrl") as string,
                contactEmail: (formData.get("contactEmail") as string) || (formData.get("email") as string),
                notifyNewOrders: formData.get("notifyNewOrders") === "true",
                automaticNewsletter: formData.get("automaticNewsletter") === "true",
                seoTitle: formData.get("seoTitle") as string,
                seoDescription: formData.get("seoDescription") as string,
                seoKeywords: formData.get("seoKeywords") as string,
            },
        });

        revalidateTag("store-config", { expire: 10 });

        return NextResponse.json(updatedConfig);
    } catch (error) {
        console.error("[API Private Settings] PATCH Error:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar configurações" },
            { status: 500 }
        );
    }
}
