import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Platform } from "../lib/pwa-detection";

export const pwaInstallModalOpenAtom = atom<boolean>(false);

export const pwaInstallDismissedAtom = atomWithStorage<boolean>(
    "primind:pwa-install-dismissed",
    false,
);

export const platformAtom = atom<Platform>("other");

export const isStandaloneAtom = atom<boolean>(false);

export const installPromptAvailableAtom = atom<boolean>(false);
