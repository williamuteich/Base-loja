"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getSettings() {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/settings`, {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString()
            }
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        return await res.json();
    } catch (error) {
        console.error("[Service Settings] getSettings Error:", error);
        return null;
    }
}

export async function updateSettings(data: any) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/settings`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update settings");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Settings] updateSettings Error:", error);
        throw new Error(error.message || "Failed to update settings");
    }
}
