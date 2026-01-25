import { Outlet, useLocation, useOutletContext } from "react-router";
import { useAppLayoutContext } from "~/layouts/app-layout";

export interface HomeShellContext {
    isModal: boolean;
    openLoginDialog: () => void;
}

export default function HomeShellLayout() {
    const location = useLocation();
    const { openLoginDialog } = useAppLayoutContext();

    const isModal = location.state?.modal === true;
    const outletContext: HomeShellContext = { isModal, openLoginDialog };

    return <Outlet context={outletContext} />;
}

export function useHomeShellContext() {
    return useOutletContext<HomeShellContext>();
}
