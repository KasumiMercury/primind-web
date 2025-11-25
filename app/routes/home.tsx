import { Button } from "~/components/ui/button";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return (
        <>
            <Welcome />
            <div className="mt-8 flex justify-center">
                <form method="POST" action="/login/google">
                    <Button type="submit">Login with Google</Button>
                </form>
            </div>
        </>
    );
}
