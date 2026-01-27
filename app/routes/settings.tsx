import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { redirect } from "react-router";
import { LinkButton } from "~/components/ui/link-button";
import { getUserSession } from "~/features/auth/server/session.server";
import { PeriodSettingsForm } from "~/features/settings/components/period-settings-form";
import type { Route } from "./+types/settings";

export function meta(_: Route.MetaArgs) {
    return [
        { title: "Settings | PriMind" },
        { name: "description", content: "Manage your PriMind settings" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const { sessionToken } = await getUserSession(request);

    if (!sessionToken) {
        throw redirect("/login");
    }

    return { isAuthenticated: true };
}

export default function SettingsRoute() {
    const { t } = useTranslation();

    return (
        <div className="w-full max-w-md space-y-6 py-4">
            <LinkButton href="/" variant="ghost" size="sm">
                <ArrowLeft className="size-4" />
                {t("settings.backToHome")}
            </LinkButton>
            <h1 className="font-semibold text-2xl">{t("settings.title")}</h1>
            <PeriodSettingsForm />
        </div>
    );
}
