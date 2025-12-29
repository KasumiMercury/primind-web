import { useEffect, useState } from "react";
import { type ToasterPosition, ToasterPositioned } from "./toaster-positioned";

export function AppToaster() {
    const [position, setPosition] = useState<ToasterPosition>("bottom-right");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        const updatePosition = (e: MediaQueryList | MediaQueryListEvent) => {
            setPosition(e.matches ? "bottom-right" : "top-center");
        };

        updatePosition(mediaQuery);
        mediaQuery.addEventListener("change", updatePosition);

        return () => {
            mediaQuery.removeEventListener("change", updatePosition);
        };
    }, []);

    return <ToasterPositioned position={position} />;
}
