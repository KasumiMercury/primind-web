import { CheckCircle, LogIn, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, buttonVariants } from "~/components/ui/button";
import { LoginDialog } from "~/features/auth/components/login-dialog";

interface TaskNotFoundErrorPageProps {
    isAuthenticated: boolean;
}

export function TaskNotFoundErrorPage({
    isAuthenticated,
}: TaskNotFoundErrorPageProps) {
    const { t } = useTranslation();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    const reasons = [
        {
            id: "completed",
            icon: CheckCircle,
            text: t("error.taskNotFound.reasons.completed"),
        },
        {
            id: "deleted",
            icon: Trash2,
            text: t("error.taskNotFound.reasons.deleted"),
        },
    ];

    return (
        <main className="container mx-auto flex flex-col items-center p-4 pt-16">
            <h1 className="font-bold text-6xl">{t("error.notFound")}</h1>
            <p className="mt-4 text-muted-foreground text-xl">
                {t("error.taskNotFound.title")}
            </p>

            <div className="mt-8 w-full max-w-md">
                <p className="mb-4 text-muted-foreground text-sm">
                    {t("error.taskNotFound.subtitle")}
                </p>
                <ul className="space-y-3">
                    {reasons.map((reason) => (
                        <li
                            key={reason.id}
                            className="flex items-center gap-3 text-muted-foreground"
                        >
                            <reason.icon className="h-5 w-5 shrink-0" />
                            <span>{reason.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {!isAuthenticated && (
                <div className="mt-8 w-full max-w-md rounded-lg border bg-muted/50 p-4">
                    <p className="font-medium text-foreground">
                        {t("error.taskNotFound.loginPrompt.title")}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                        {t("error.taskNotFound.loginPrompt.description")}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onPress={() => setIsLoginDialogOpen(true)}
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        {t("auth.login")}
                    </Button>
                </div>
            )}

            <a href="/" className={buttonVariants({ className: "mt-8" })}>
                {t("error.goHome")}
            </a>

            <LoginDialog
                open={isLoginDialogOpen}
                onOpenChange={setIsLoginDialogOpen}
            />
        </main>
    );
}
