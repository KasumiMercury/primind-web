import { atom } from "jotai";

export interface User {
    id: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

export const authStateAtom = atom<AuthState>({
    isAuthenticated: false,
    user: null,
});

export const isAuthenticatedAtom = atom(
    (get) => get(authStateAtom).isAuthenticated,
);

export const userAtom = atom((get) => get(authStateAtom).user);
