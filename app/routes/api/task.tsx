import { createTaskAction } from "~/features/task/server/create-task.server";
import type { Route } from "./+types/task";

export async function loader() {
    throw new Response("Method Not Allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
    return createTaskAction(request);
}
