import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, SettingsIcon } from "@chakra-ui/icons";

import UploadDocument from "./UploadDocument";
import { Link } from "react-router-dom";

/* Map each action to an icon and a distinct button */
const ACTION_CONFIG = {
    upload: {
        Icon: AddIcon,
        buttonLabel: "Upload Document",
        buttonColorScheme: "brand",
        accentColor: "brand.500",
        accentBg: "brand.50",
    },
    view: {
        Icon: ViewIcon,
        buttonLabel: "View Documents",
        buttonColorScheme: "gray",
        accentColor: "teal.500",
        accentBg: "teal.50",
    },
    settings: {
        Icon: SettingsIcon,
        buttonLabel: "Open Settings",
        buttonColorScheme: "gray",
        accentColor: "orange.500",
        accentBg: "orange.50",
    },
};

function FunctionCard({ title, description, action = "upload" }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const config = ACTION_CONFIG[action] ?? ACTION_CONFIG.upload;

    const handleViewClick = () => {
        // Scroll to the document list section
        document.getElementById("document-list")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            p={5}
            _hover={{ borderColor: "gray.300", boxShadow: "sm" }}
            transition="all 0.15s"
        >
            <Flex
                w={10}
                h={10}
                bg={config.accentBg}
                borderRadius="lg"
                align="center"
                justify="center"
                mb={3}
            >
                <Box as={config.Icon} color={config.accentColor} boxSize={5} />
            </Flex>

            <Heading as="h3" size="sm" fontWeight="600" color="gray.800" mb={1}>
                {title}
            </Heading>
            <Text fontSize="xs" color="gray.500" mb={4} lineHeight="tall">
                {description}
            </Text>

            {action === "upload" && (
                <>
                    <Button
                        colorScheme={config.buttonColorScheme}
                        size="sm"
                        onClick={onOpen}
                        w="full"
                    >
                        {config.buttonLabel}
                    </Button>
                    <UploadDocument isOpen={isOpen} onClose={onClose} />
                </>
            )}

            {action === "view" && (
                <Button
                    colorScheme={config.buttonColorScheme}
                    variant="outline"
                    size="sm"
                    onClick={handleViewClick}
                    w="full"
                >
                    {config.buttonLabel}
                </Button>
            )}

            {action === "settings" && (
                <Button
                    colorScheme={config.buttonColorScheme}
                    variant="outline"
                    size="sm"
                    as={Link}
                    to="/login"
                    w="full"
                >
                    {config.buttonLabel}
                </Button>
            )}
        </Box>
    );
}

export default FunctionCard;
