import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { createInstance, type i18n } from "i18next";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import en from "~/locales/en";
import ja from "~/locales/ja";
import { fallbackLanguage, supportedLanguages } from "./lib/i18n/config";
import { getLocale } from "./lib/i18n/i18next.server";

export const streamTimeout = 5_000;

const resources = {
    en: { translation: en },
    ja: { translation: ja },
};

async function createI18nInstance(locale: string): Promise<i18n> {
    const instance = createInstance();
    await instance.use(initReactI18next).init({
        resources,
        lng: locale,
        fallbackLng: fallbackLanguage,
        supportedLngs: [...supportedLanguages],
        interpolation: {
            escapeValue: false,
        },
    });
    return instance;
}

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    entryContext: EntryContext,
) {
    const locale = await getLocale(request);
    const i18nInstance = await createI18nInstance(locale);

    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        const readyOption: keyof RenderToPipeableStreamOptions =
            (userAgent && isbot(userAgent)) || entryContext.isSpaMode
                ? "onAllReady"
                : "onShellReady";

        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={i18nInstance}>
                <ServerRouter context={entryContext} url={request.url} />
            </I18nextProvider>,
            {
                [readyOption]() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    if (shellRendered) console.error(error);
                },
            },
        );

        setTimeout(abort, streamTimeout + 1000);
    });
}
