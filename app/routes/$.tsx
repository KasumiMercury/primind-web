import { useTranslation } from "react-i18next";
import { data } from "react-router";
import { ErrorPage } from "~/components/error-page";
import type { Route } from "./+types/$";

export function meta(): Route.MetaDescriptors {
    return [{ title: "404 | PriMind" }];
}

export function loader(): never {
    throw data(null, { status: 404, statusText: "Not Found" });
}

export function ErrorBoundary() {
    const { t } = useTranslation();

    return (
        <ErrorPage
            title={t("error.notFound")}
            description={t("error.pageNotFound")}
        />
    );
}
