import { createInstance, type i18n } from "i18next";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
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
    if (request.method.toUpperCase() === "HEAD") {
        return new Response(null, {
            status: responseStatusCode,
            headers: responseHeaders,
        });
    }

    const locale = await getLocale(request);
    const i18nInstance = await createI18nInstance(locale);

    let responseStatus = responseStatusCode;
    const userAgent = request.headers.get("user-agent");
    const waitForAllReady =
        (userAgent && isbot(userAgent)) || entryContext.isSpaMode;

    const abortController = new AbortController();
    const timeoutId = setTimeout(
        () => abortController.abort(),
        streamTimeout + 1000,
    );

    try {
        const stream = await renderToReadableStream(
            <I18nextProvider i18n={i18nInstance}>
                <ServerRouter context={entryContext} url={request.url} />
            </I18nextProvider>,
            {
                signal: abortController.signal,
                onError(error: unknown) {
                    responseStatus = 500;
                    console.error(error);
                },
            },
        );

        if (waitForAllReady) {
            await (stream as ReadableStream & { allReady?: Promise<void> })
                .allReady;
        }

        responseHeaders.set("Content-Type", "text/html");

        return new Response(stream, {
            headers: responseHeaders,
            status: responseStatus,
        });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    } finally {
        clearTimeout(timeoutId);
    }
}
