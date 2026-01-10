export const TASK_COLORS = [
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#14B8A6", // teal
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#EC4899", // pink
] as const;

export function getRandomTaskColor(): string {
    const index = Math.floor(Math.random() * TASK_COLORS.length);
    return TASK_COLORS[index];
}

export function getRandomTaskColorExcluding(
    excludeColors: Set<string>,
): string {
    const availableColors = TASK_COLORS.filter(
        (color) => !excludeColors.has(color),
    );

    if (availableColors.length === 0) {
        return getRandomTaskColor();
    }

    const index = Math.floor(Math.random() * availableColors.length);
    return availableColors[index];
}
