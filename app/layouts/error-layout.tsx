import { Provider } from "jotai";
import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { Header } from "~/components/header/header";

interface ErrorLayoutProps {
    children?: ReactNode;
}

export default function ErrorLayout({ children }: ErrorLayoutProps) {
    const noop = () => {};

    return (
        <Provider>
            <Header onLoginClick={noop} onLogout={noop} />
            {children ?? <Outlet />}
        </Provider>
    );
}
