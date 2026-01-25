import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Dialog open state
export const notificationSetupDialogOpenAtom = atom<boolean>(false);

// Unified "don't show again" preference
export const notificationSetupDismissedAtom = atomWithStorage<boolean>(
    "primind:notification-setup-dismissed",
    false,
);

// Current step in the setup flow
export type NotificationSetupStep = "intro" | "pwa-install" | "notification";
export const notificationSetupStepAtom = atom<NotificationSetupStep>("intro");
