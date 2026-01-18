import { useCallback, useEffect, useState } from "react";

export interface NetworkStatus {
    isOnline: boolean;
    isOffline: boolean;
}

/**
 * Hook to detect network status (online/offline)
 */
export function useNetworkStatus(): NetworkStatus {
    const [isOnline, setIsOnline] = useState(() => {
        if (typeof navigator === "undefined") return true;
        return navigator.onLine;
    });

    const handleOnline = useCallback(() => setIsOnline(true), []);
    const handleOffline = useCallback(() => setIsOnline(false), []);

    useEffect(() => {
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return {
        isOnline,
        isOffline: !isOnline,
    };
}

/**
 * Returns current network status (non-reactive)
 */
export function getNetworkStatus(): boolean {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
}
