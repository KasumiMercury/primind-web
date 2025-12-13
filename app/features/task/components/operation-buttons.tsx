import type { PressEvent } from "react-aria-components";
import { Button } from "~/components/ui/button";
import type { Dimensions } from "./operation-shape";

export interface ButtonConfig {
    onPress: (event: PressEvent) => void;
}

interface OperationButtonsProps {
    dimensions: Dimensions;
    buttonsConfig: {
        left: ButtonConfig;
        center: ButtonConfig;
        right: ButtonConfig;
    };
    className?: string;
}

export function OperationButtons({
    dimensions,
    buttonsConfig,
    className = "bg-popover",
}: OperationButtonsProps) {
    const { width, height, sideButtonWidth, centerButtonWidth } = dimensions;

    return (
        <div
            className={className}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Button
                variant="ghost"
                className="cursor-pointer rounded-none bg-transparent from-primary/15 to-transparent data-focus-visible:bg-linear-to-r data-hovered:bg-primary/10"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onPress={buttonsConfig.left.onPress}
            />

            <Button
                variant="ghost"
                type="button"
                className="cursor-pointer rounded-none bg-transparent from-primary/15 to-transparent data-focus-visible:bg-radial data-hovered:bg-primary/10"
                style={{
                    width: `${centerButtonWidth}px`,
                    height: "100%",
                }}
                onPress={buttonsConfig.center.onPress}
            />

            <Button
                variant="ghost"
                className="cursor-pointer rounded-none bg-transparent from-primary/15 to-transparent data-focus-visible:bg-linear-to-l data-hovered:bg-primary/10"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onPress={buttonsConfig.right.onPress}
            />
        </div>
    );
}
