import { atom } from "jotai";
import type { Platform } from "../lib/pwa-detection";

export const platformAtom = atom<Platform>("other");

export const isStandaloneAtom = atom<boolean>(false);

export const installPromptAvailableAtom = atom<boolean>(false);
