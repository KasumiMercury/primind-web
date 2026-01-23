import { useTranslation } from "react-i18next";
import { buttonVariants } from "~/components/ui/button";

interface ErrorPageProps {
    title: string;
    description: string;
    stack?: string;
}

export function ErrorPage({ title, description, stack }: ErrorPageProps) {
    const { t } = useTranslation();

    return (
        <main className="container mx-auto flex flex-col items-center p-4 pt-16">
            <h1 className="font-bold text-6xl">{title}</h1>
            <p className="mt-4 text-muted-foreground">{description}</p>
            <a href="/" className={buttonVariants({ className: "mt-8" })}>
                {t("error.goHome")}
            </a>
            {stack && (
                <pre className="mt-8 w-full overflow-x-auto p-4">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
