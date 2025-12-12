const getPointOnLine = (
    corner: { x: number; y: number },
    target: { x: number; y: number },
    distance: number,
) => {
    const dx = target.x - corner.x;
    const dy = target.y - corner.y;
    const length = Math.hypot(dx, dy);
    const ratio = distance / length;
    return {
        x: corner.x + dx * ratio,
        y: corner.y + dy * ratio,
    };
};

export const generateRoundedPolygonPath = (
    points: { x: number; y: number }[],
    cornerRadius: number,
) => {
    const n = points.length;
    let d = "";

    for (let i = 0; i < n; i++) {
        const prev = points[(i - 1 + n) % n];
        const curr = points[i];
        const next = points[(i + 1) % n];

        const prevLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
        const nextLen = Math.hypot(next.x - curr.x, next.y - curr.y);
        const adjustedR = Math.min(cornerRadius, prevLen / 2, nextLen / 2);

        const start = getPointOnLine(curr, prev, adjustedR);
        const end = getPointOnLine(curr, next, adjustedR);

        d += i === 0 ? `M ${start.x} ${start.y}` : ` L ${start.x} ${start.y}`;
        d += ` Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
    }

    return `${d} Z`;
};

export const generateRoundedArrowPath = (
    anchors: { x: number; y: number }[],
    cornerRadius: number,
    lengthRatio: number,
) => {
    if (anchors.length !== 3) return "";

    const [start, mid, end] = anchors;

    const startToMidLength = Math.hypot(mid.x - start.x, mid.y - start.y);
    const endToMidLength = Math.hypot(end.x - mid.x, end.y - mid.y);

    const startPoint = getPointOnLine(
        mid,
        start,
        startToMidLength * lengthRatio,
    );
    const endPoint = getPointOnLine(mid, end, endToMidLength * lengthRatio);

    const adjustedR = Math.min(
        cornerRadius,
        Math.hypot(mid.x - startPoint.x, mid.y - startPoint.y),
        Math.hypot(mid.x - endPoint.x, mid.y - endPoint.y),
    );

    const roundedStart = getPointOnLine(mid, start, adjustedR);
    const roundedEnd = getPointOnLine(mid, end, adjustedR);

    let d = `M ${startPoint.x} ${startPoint.y}`;
    d += ` L ${roundedStart.x} ${roundedStart.y}`;
    d += ` Q ${mid.x} ${mid.y} ${roundedEnd.x} ${roundedEnd.y}`;
    d += ` L ${endPoint.x} ${endPoint.y}`;

    return d;
};
