import { Resvg } from "@resvg/resvg-js";
import type { Route } from "./+types/notification-icon.$taskType.$colorHex";

const VALID_TASK_TYPES = ["short", "near", "relaxed", "scheduled"] as const;
type TaskType = (typeof VALID_TASK_TYPES)[number];

// const CACHE_MAX_AGE = 31536000;
// 1h for easier testing
const CACHE_MAX_AGE = 3600;
const ICON_SIZE = 96;

const shapes: Record<TaskType, (color: string) => string> = {
    short: (color: string) =>
        `<polygon points="50,8 58.652476,23.370418 74.686981,16.021286 72.652476,33.542013 89.944374,37.021286 78,50 89.944374,62.978714 72.652476,66.457987 74.686981,83.978714 58.652476,76.629582 50,92 41.347524,76.629582 25.313019,83.978714 27.347524,66.457987 10.055626,62.978714 22,50 10.055626,37.021286 27.347524,33.542013 25.313019,16.021286 41.347524,23.370418" fill="${color}"/>`,
    near: (color: string) => `<circle cx="50" cy="50" r="42" fill="${color}"/>`,
    relaxed: (color: string) =>
        `<rect x="14" y="26" width="72" height="48" rx="24" ry="24" fill="${color}"/>`,
    scheduled: (color: string) =>
        `<rect x="12" y="26" width="76" height="48" rx="4" ry="4" fill="${color}"/>`,
};

// Validate hex color format (3 or 6 characters, A-F and 0-9)
function isValidHexColor(hex: string): boolean {
    return /^[A-Fa-f0-9]{3}$|^[A-Fa-f0-9]{6}$/.test(hex);
}

function generateSVG(taskType: TaskType, colorHex: string): string {
    const color = `#${colorHex}`;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${shapes[taskType](color)}</svg>`;
}

export async function loader({ params }: Route.LoaderArgs): Promise<Response> {
    const taskType = params.taskType?.toLowerCase();
    // Remove .png extension if present
    const colorHex = params.colorHex?.replace(/\.png$/, "");

    if (!taskType || !VALID_TASK_TYPES.includes(taskType as TaskType)) {
        return new Response("Invalid task type", { status: 400 });
    }

    if (!colorHex || !isValidHexColor(colorHex)) {
        return new Response("Invalid color format", { status: 400 });
    }

    const svg = generateSVG(taskType as TaskType, colorHex);

    const resvg = new Resvg(svg, {
        fitTo: { mode: "width", value: ICON_SIZE },
        background: "rgba(0, 0, 0, 0)",
    });
    const pngData = resvg.render().asPng();

    return new Response(new Uint8Array(pngData), {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        },
    });
}
