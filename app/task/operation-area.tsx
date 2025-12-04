import { OperationButtons } from "~/task/operation-buttons";
import { calculateDimensions, OperationShape } from "~/task/operation-shape";

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
}

const buttonsConfig = {
    top: {
        label: "Button 1",
        onClick: () => console.log("Button 1 clicked"),
    },
    bottomLeft: {
        label: "Button A",
        onClick: () => console.log("Button A clicked"),
    },
    bottomCenter: {
        label: "Button B",
        onClick: () => console.log("Button B clicked"),
    },
    bottomRight: {
        label: "Button C",
        onClick: () => console.log("Button C clicked"),
    },
};

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
}: OperationAreaProps) {
    const dimensions = calculateDimensions(width);

    return (
        <OperationShape
            dimensions={dimensions}
            radius={radius}
            className={className}
        >
            <OperationButtons
                dimensions={dimensions}
                topButton={buttonsConfig.top}
                bottomButtons={{
                    left: buttonsConfig.bottomLeft,
                    center: buttonsConfig.bottomCenter,
                    right: buttonsConfig.bottomRight,
                }}
            />
        </OperationShape>
    );
}
