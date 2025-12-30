import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";
import React from "react";
import { Toaster } from "sonner";

import "../app/app.css";
import { toastOptions } from "../app/components/ui/toaster-positioned";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        withThemeByClassName<ReactRenderer>({
            themes: {
                light: "",
                dark: "dark",
            },
            defaultTheme: "light",
        }),
        (Story) =>
            React.createElement(
                React.Fragment,
                null,
                React.createElement(Story),
                React.createElement(Toaster, {
                    position: "bottom-right",
                    toastOptions,
                }),
            ),
    ],
};

export default preview;
