import { handleOpenAPIRequest } from "~/orpc/openapi-handler.server";
import type { Route } from "./+types/openapi.$";

export async function loader({ request }: Route.LoaderArgs) {
    return handleOpenAPIRequest(request);
}

export async function action({ request }: Route.ActionArgs) {
    return handleOpenAPIRequest(request);
}
