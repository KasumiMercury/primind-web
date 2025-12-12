import { updateTaskAction } from "~/features/task/server/update-task.server";
import type { Route } from "./+types/task.update";

export async function loader() {
    throw new Response("Method Not Allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
    return updateTaskAction(request);
}
