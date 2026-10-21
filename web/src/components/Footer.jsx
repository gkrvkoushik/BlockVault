import { Box, Container, Flex, Link, Stack, Text } from "@chakra-ui/react";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            as="footer"
            bg="white"
            borderTopWidth="1px"
            borderColor="gray.200"
            py={6}
            px={{ base: "4", md: "8" }}
        >
            <Container maxW="container.xl">
                <Flex
                    justify={{ base: "center", md: "space-between" }}
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                >
                    <Text fontSize="sm" color="gray.400">
                        © {currentYear}{" "}
                        <Text as="span" fontWeight="600" color="gray.600">
                            BlockVault
                        </Text>
                        . All rights reserved.
                    </Text>
                    <Stack direction="row" spacing={5} align="center">
                        <Link fontSize="sm" color="gray.500" href="#" _hover={{ color: "brand.600" }}>
                            Privacy Policy
                        </Link>
                        <Link fontSize="sm" color="gray.500" href="#" _hover={{ color: "brand.600" }}>
                            Terms of Service
                        </Link>
                        <Link fontSize="sm" color="gray.500" href="#" _hover={{ color: "brand.600" }}>
                            Contact
                        </Link>
                    </Stack>
                </Flex>
            </Container>
        </Box>
    );
}

export default Footer;
