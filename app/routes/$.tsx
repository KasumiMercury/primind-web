import { Provider } from "jotai";
import { useTranslation } from "react-i18next";
import { data } from "react-router";

import type { Route } from "./+types/$";
import { ErrorPage } from "~/components/error-page";
import { Header } from "~/components/header/header";

export function meta(): Route.MetaDescriptors {
    return [{ title: "404 | PriMind" }];
}

export function loader(): never {
    throw data(null, { status: 404, statusText: "Not Found" });
}

export function ErrorBoundary() {
    const { t } = useTranslation();

    // No-op handlers for error page - login/logout not functional here
    const noop = () => {};

    return (
        <Provider>
            <Header onLoginClick={noop} onLogout={noop} />
            <ErrorPage
                title={t("error.notFound")}
                description={t("error.pageNotFound")}
            />
        </Provider>
    );
}
