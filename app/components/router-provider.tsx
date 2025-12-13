import { RouterProvider as AriaRouterProvider } from "react-aria-components";
import { useHref, useNavigate } from "react-router";

interface RouterProviderProps {
    children: React.ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
    const navigate = useNavigate();

    return (
        <AriaRouterProvider navigate={navigate} useHref={useHref}>
            {children}
        </AriaRouterProvider>
    );
}
