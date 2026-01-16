import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Glamour",
  description: "ecommerce",
  metadataBase: new URL(process.env.API_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
  search,
}: Readonly<{
  children: React.ReactNode;
  search: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
          {search}
        </Providers>
      </body>
    </html>
  );
}
