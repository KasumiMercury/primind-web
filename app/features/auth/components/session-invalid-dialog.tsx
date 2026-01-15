import { useAtom } from "jotai";
import { useState } from "react";
import { orpc } from "~/orpc/client";
import { sessionInvalidModalOpenAtom } from "../store/session-invalid";
import { SessionInvalidDialogContent } from "./session-invalid-dialog-content";

export function SessionInvalidDialog() {
    const [isOpen, setIsOpen] = useAtom(sessionInvalidModalOpenAtom);
    const [isPending, setIsPending] = useState(false);

    const handleGoHome = async () => {
        setIsPending(true);
        try {
            // Clear session cookie before redirecting
            await orpc.auth.logout();
        } catch {
            // Session already invalid, ignore error
        }
        setIsOpen(false);
        window.location.href = "/";
    };

    return (
        <SessionInvalidDialogContent
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onGoHome={handleGoHome}
            isPending={isPending}
        />
    );
}
