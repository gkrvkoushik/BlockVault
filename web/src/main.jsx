import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { extendTheme } from "@chakra-ui/react";

// Force-clear any previously cached dark-mode preference so the app
// always starts in light mode regardless of what was stored before.
try {
    localStorage.removeItem("chakra-ui-color-mode");
} catch (e) {
    // localStorage may be unavailable in some environments — safe to ignore.
}

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
        disableTransitionOnChange: false,
    },
    colors: {
        brand: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            500: "#4f46e5",
            600: "#4338ca",
            700: "#3730a3",
        },
    },
    fonts: {
        heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
        body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
    },
    styles: {
        global: {
            body: {
                bg: "gray.50",
                color: "gray.800",
            },
        },
    },
    semanticTokens: {
        colors: {
            // Override every semantic color that Chakra maps to dark variants
            "chakra-body-bg": { default: "gray.50" },
            "chakra-body-text": { default: "gray.800" },
            "chakra-border-color": { default: "gray.200" },
            "chakra-placeholder-color": { default: "gray.400" },
            "chakra-subtle-bg": { default: "gray.100" },
            "chakra-inverse-text": { default: "white" },
        },
    },
    components: {
        // Force all Modal/Drawer surfaces to white
        Modal: {
            baseStyle: {
                dialog: {
                    bg: "white",
                    color: "gray.800",
                },
                overlay: {
                    bg: "blackAlpha.400",
                },
                header: {
                    color: "gray.900",
                },
                body: {
                    color: "gray.800",
                },
            },
        },
        // Force inputs to use light-mode colours
        Input: {
            baseStyle: {
                field: {
                    bg: "white",
                    color: "gray.800",
                    borderColor: "gray.300",
                    _placeholder: { color: "gray.400" },
                    _focus: {
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px #4f46e5",
                    },
                },
            },
        },
        FormLabel: {
            baseStyle: {
                color: "gray.700",
            },
        },
        Button: {
            defaultProps: {
                colorScheme: "brand",
            },
        },
    },
});

const root = document.getElementById("root");

createRoot(root).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
