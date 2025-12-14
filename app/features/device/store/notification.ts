import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const notificationModalOpenAtom = atom<boolean>(false);

export const notificationDismissedAtom = atomWithStorage<boolean>(
    "primind:notification-dismissed",
    false,
);
