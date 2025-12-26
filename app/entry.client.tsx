import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import { initI18next } from "~/lib/i18n/i18next.client";

async function main() {
    const i18n = await initI18next();

    startTransition(() => {
        hydrateRoot(
            document,
            <I18nextProvider i18n={i18n}>
                <StrictMode>
                    <HydratedRouter />
                </StrictMode>
            </I18nextProvider>,
        );
    });
}

main().catch((error) => console.error("Failed to hydrate:", error));
