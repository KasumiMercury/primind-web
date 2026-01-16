import { useTranslation } from "react-i18next";
import {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { RouterProvider } from "./components/router-provider";
import { ThemeColorMeta } from "./components/theme-color-meta";
import { ThemeProvider } from "./components/theme-provider";
import { AppToaster } from "./components/ui/app-toaster";
import { getLocale, localeCookie } from "./lib/i18n/i18next.server";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
    },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "shortcut icon", href: "/favicon.ico" },
    {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
];

export async function loader({ request }: Route.LoaderArgs) {
    const locale = await getLocale(request);
    return data(
        { locale },
        { headers: { "Set-Cookie": await localeCookie.serialize(locale) } },
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();

    return (
        <html lang={i18n.language} dir={i18n.dir()} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="apple-mobile-web-app-title" content="PriMind" />
                <meta name="theme-color" content="#f2f1f7" />
                <Meta />
                <Links />
            </head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ThemeColorMeta />
                    {children}
                </ThemeProvider>
                <AppToaster />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <RouterProvider>
            <Outlet />
        </RouterProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const { t } = useTranslation();

    let message: string = t("error.oops");
    let details: string = t("error.unexpected");
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? t("error.notFound") : t("auth.error");
        details =
            error.status === 404
                ? t("error.pageNotFound")
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="container mx-auto p-4 pt-16">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full overflow-x-auto p-4">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
