import { useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router";

interface UseGuestInitialLoadOptions {
    isAuthenticated: boolean;
    shouldRevalidate?: boolean;
}

interface UseGuestInitialLoadReturn {
    isLoading: boolean;
}

export function useGuestInitialLoad({
    isAuthenticated,
    shouldRevalidate = true,
}: UseGuestInitialLoadOptions): UseGuestInitialLoadReturn {
    const { revalidate } = useRevalidator();
    const revalidateRef = useRef(revalidate);
    revalidateRef.current = revalidate;

    const [isInitialLoad, setIsInitialLoad] = useState(
        !isAuthenticated && shouldRevalidate,
    );

    useEffect(() => {
        if (!isAuthenticated && shouldRevalidate && isInitialLoad) {
            revalidateRef.current().then(() => setIsInitialLoad(false));
        }
    }, [isAuthenticated, shouldRevalidate, isInitialLoad]);

    const isLoading = isInitialLoad;

    return { isLoading };
}
