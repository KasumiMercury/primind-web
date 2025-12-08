import { deleteTaskAction } from "~/task/delete-task.server";
import type { Route } from "./+types/task.delete";

export async function loader() {
    throw new Response("Method Not Allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
    return deleteTaskAction(request);
}
