import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStoreConfig } from "@/lib/store-config";

export async function GET() {
    try {
        const config = await getOrCreateStoreConfig();
        return NextResponse.json(config);
    } catch (error) {
        console.error("[API Private Settings] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const config = await getOrCreateStoreConfig();

        const updatedConfig = await prisma.storeConfiguration.update({
            where: { id: config.id },
            data: {
                storeName: body.name || body.storeName,
                cnpj: body.cnpj,
                description: body.description,
                phone: body.phone,
                whatsapp: body.whatsapp,
                address: body.address,
                city: body.city,
                state: body.state,
                zipCode: body.zipCode,
                maintenanceMode: body.maintenanceMode,
                maintenanceMessage: body.maintenanceMessage,
                businessHours: body.businessHours,
                googleMapsEmbedUrl: body.googleMapsEmbedUrl,
                contactEmail: body.email || body.contactEmail,
                notifyNewOrders: body.notifyNewOrders,
                automaticNewsletter: body.automaticNewsletter,
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
                seoKeywords: body.seoKeywords,
            },
        });

        return NextResponse.json(updatedConfig);
    } catch (error) {
        console.error("[API Private Settings] PATCH Error:", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
