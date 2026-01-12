import { handleRPCRequest } from "~/orpc/handler.server";
import type { Route } from "./+types/rpc.$";

export async function loader({ request }: Route.LoaderArgs) {
    return handleRPCRequest(request);
}

export async function action({ request }: Route.ActionArgs) {
    return handleRPCRequest(request);
}
