import { useAtom } from "jotai";
import { sessionInvalidModalOpenAtom } from "../store/session-invalid";
import { SessionInvalidDialogContent } from "./session-invalid-dialog-content";

export function SessionInvalidDialog() {
    const [isOpen, setIsOpen] = useAtom(sessionInvalidModalOpenAtom);

    const handleGoHome = () => {
        setIsOpen(false);
        window.location.href = "/";
    };

    return (
        <SessionInvalidDialogContent
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onGoHome={handleGoHome}
        />
    );
}
