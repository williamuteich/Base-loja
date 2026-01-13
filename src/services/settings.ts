"use server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getSettings() {
    try {
        const res = await fetch(`${API_URL}/api/private/settings`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch settings");
        return await res.json();
    } catch (error) {
        console.error("[Service Settings] getSettings Error:", error);
        return null;
    }
}

export async function updateSettings(data: any) {
    try {
        const res = await fetch(`${API_URL}/api/private/settings`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
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
