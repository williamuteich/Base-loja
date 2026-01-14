import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = [
    { path: "/", type: "next" },
    { path: "/login", type: "redirect" },
    { path: "/reset-password", type: "redirect" },
    { path: "/sobre", type: "next" },
    { path: "/termos", type: "next" },
    { path: "/cookies", type: "next" },
    { path: "/privacidade", type: "next" },
    { path: "/produtos", type: "next" },
    { path: "/categorias", type: "next" },
    { path: "/contato", type: "next" },
] as const;

const dynamicPublicRoutes = [
    { base: "/produto", type: "next" },
    { base: "/categorias", type: "next" },
] as const;

export async function proxy(request: NextRequest) {
    const authToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const path = request.nextUrl.pathname;

    if (path.startsWith("/api/private")) {
        if (!authToken) {
            return NextResponse.json(
                { error: "Unauthorized", message: "Autenticação necessária para acessar este recurso." },
                { status: 401 }
            );
        }
        return NextResponse.next();
    }

    const staticRoute = publicRoutes.find(r => r.path === path);
    const dynamicRoute = dynamicPublicRoutes.find(r => path.startsWith(r.base));
    const publicRoute = staticRoute || dynamicRoute;

    if (publicRoute?.type === "next") {
        return NextResponse.next();
    }

    if (!authToken) {
        if (publicRoute?.type === "redirect")
            return NextResponse.next();

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
    }

    if (publicRoute?.type === "redirect") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin";
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};