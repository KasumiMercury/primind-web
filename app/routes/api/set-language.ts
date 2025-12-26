import { data } from "react-router";
import { supportedLanguages } from "~/lib/i18n/config";
import { localeCookie } from "~/lib/i18n/i18next.server";
import type { Route } from "./+types/set-language";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const language = formData.get("language");

    if (
        typeof language !== "string" ||
        !supportedLanguages.includes(
            language as (typeof supportedLanguages)[number],
        )
    ) {
        return data({ error: "Invalid language" }, { status: 400 });
    }

    return data(
        { success: true },
        { headers: { "Set-Cookie": await localeCookie.serialize(language) } },
    );
}
