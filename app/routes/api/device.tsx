import { registerDeviceAction } from "~/features/device/server/register-device.server";
import type { Route } from "./+types/device";

export async function loader() {
    throw new Response("Method Not Allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
    return registerDeviceAction(request);
}
