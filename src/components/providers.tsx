"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Suspense fallback={null}>
                {children}
            </Suspense>
            <Toaster richColors position="top-right" />
        </SessionProvider>
    );
}
