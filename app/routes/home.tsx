import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
    return [
        { title: "PriMind" },
        { name: "description", content: "One-touch reminder app" },
    ];
}

export default function Home() {
    return null;
}
