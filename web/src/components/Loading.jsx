import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

function Loading() {
    return (
        <Flex justifyContent="center" alignItems="center" minH="200px" direction="column" gap={3}>
            <Spinner size="lg" color="brand.500" thickness="3px" />
            <Text fontSize="sm" color="gray.500">Loading documents…</Text>
        </Flex>
    );
}

export default Loading;
