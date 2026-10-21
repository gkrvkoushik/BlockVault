import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import checkLogin from "../lib/checkLogin";

/* ── Inline SVG icons (no new dependencies) ───────────────── */
function IconDoc({ boxSize = 8, color = "brand.500" }) {
    return (
        <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            boxSize={boxSize} color={color}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </Box>
    );
}
function IconChain({ boxSize = 8, color = "brand.500" }) {
    return (
        <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            boxSize={boxSize} color={color}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </Box>
    );
}
function IconShare({ boxSize = 8, color = "brand.500" }) {
    return (
        <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            boxSize={boxSize} color={color}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </Box>
    );
}
function IconHistory({ boxSize = 8, color = "brand.500" }) {
    return (
        <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            boxSize={boxSize} color={color}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            <polyline points="12 7 12 12 15 15" />
        </Box>
    );
}
function IconShield({ boxSize = 16, color = "brand.500" }) {
    return (
        <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            boxSize={boxSize} color={color}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
        </Box>
    );
}

/* ── Hero illustration — pure CSS/SVG, no external URLs ────── */
function HeroIllustration() {
    return (
        <Flex
            justify="center"
            align="center"
            w={{ base: "full", lg: "480px" }}
            h={{ base: "220px", md: "300px", lg: "360px" }}
            position="relative"
            flexShrink={0}
        >
            {/* Outer ring */}
            <Box
                position="absolute"
                w="340px"
                h="340px"
                borderRadius="full"
                border="1.5px dashed"
                borderColor="brand.200"
                opacity={0.6}
            />
            {/* Inner ring */}
            <Box
                position="absolute"
                w="240px"
                h="240px"
                borderRadius="full"
                border="1.5px dashed"
                borderColor="brand.200"
                opacity={0.4}
            />
            {/* Central shield */}
            <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                boxShadow="xl"
                zIndex={1}
            >
                <IconShield boxSize={20} color="brand.500" />
            </Box>
            {/* Floating doc card — top right */}
            <Box
                position="absolute"
                top={{ base: "8px", lg: "20px" }}
                right={{ base: "20px", lg: "0px" }}
                bg="white"
                p={3}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                zIndex={2}
            >
                <HStack spacing={2}>
                    <Box w={6} h={7} bg="brand.100" borderRadius="sm" />
                    <VStack align="start" spacing={0.5}>
                        <Box w={16} h={2} bg="gray.200" borderRadius="full" />
                        <Box w={10} h={2} bg="gray.100" borderRadius="full" />
                    </VStack>
                </HStack>
            </Box>
            {/* Floating verified badge — bottom left */}
            <Box
                position="absolute"
                bottom={{ base: "8px", lg: "20px" }}
                left={{ base: "20px", lg: "0px" }}
                bg="white"
                px={3}
                py={2}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                zIndex={2}
            >
                <HStack spacing={1.5}>
                    <Box w={3} h={3} borderRadius="full" bg="green.400" />
                    <Text fontSize="xs" fontWeight="600" color="gray.700">Verified on-chain</Text>
                </HStack>
            </Box>
        </Flex>
    );
}

/* ── Feature card ───────────────────────────────────────────── */
function FeatureCard({ icon, title, description }) {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            p={6}
            _hover={{ borderColor: "brand.200", boxShadow: "md" }}
            transition="all 0.2s"
        >
            <Box
                display="inline-flex"
                p={2.5}
                bg="brand.50"
                borderRadius="lg"
                mb={4}
            >
                {icon}
            </Box>
            <Heading as="h3" size="sm" mb={2} color="gray.800" fontWeight="600">
                {title}
            </Heading>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
                {description}
            </Text>
        </Box>
    );
}

/* ── Home page ──────────────────────────────────────────────── */
function Home() {
    const isLoggedIn = checkLogin();

    return (
        <Box bg="gray.50" minH="100vh">
            {/* ── Hero ─────────────────────────────────────── */}
            <Box bg="white" borderBottomWidth="1px" borderColor="gray.200">
                <Container maxW="container.xl" py={{ base: 14, md: 20 }}>
                    <Flex
                        direction={{ base: "column", lg: "row" }}
                        align="center"
                        justify="space-between"
                        gap={{ base: 10, lg: 8 }}
                    >
                        {/* Text side */}
                        <Stack
                            spacing={6}
                            maxW={{ lg: "520px" }}
                            textAlign={{ base: "center", lg: "left" }}
                            align={{ base: "center", lg: "flex-start" }}
                        >
                            <Box
                                display="inline-flex"
                                px={3}
                                py={1}
                                bg="brand.50"
                                borderWidth="1px"
                                borderColor="brand.200"
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="600"
                                color="brand.600"
                                letterSpacing="wide"
                            >
                                BLOCKCHAIN-BACKED LEGAL RECORDS
                            </Box>

                            <Heading
                                as="h1"
                                size={{ base: "xl", md: "2xl" }}
                                fontWeight="800"
                                color="gray.900"
                                lineHeight="shorter"
                                letterSpacing="-0.5px"
                            >
                                Secure Your Legal Documents with Blockchain
                            </Heading>

                            <Text
                                fontSize={{ base: "md", md: "lg" }}
                                color="gray.600"
                                lineHeight="tall"
                            >
                                Manage, organize, and share important legal records with
                                blockchain-backed document tracking. Every change is
                                recorded immutably on-chain.
                            </Text>

                            <HStack spacing={3} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
                                <Button
                                    as={Link}
                                    to={isLoggedIn ? "/dash" : "/login"}
                                    size="md"
                                    colorScheme="brand"
                                    px={6}
                                >
                                    Open Dashboard
                                </Button>
                                <Button
                                    as="a"
                                    href="#features"
                                    size="md"
                                    variant="outline"
                                    colorScheme="gray"
                                    px={6}
                                >
                                    Explore Features
                                </Button>
                            </HStack>
                        </Stack>

                        {/* Illustration side */}
                        <HeroIllustration />
                    </Flex>
                </Container>
            </Box>

            {/* ── Features ─────────────────────────────────── */}
            <Container maxW="container.xl" py={{ base: 14, md: 20 }} id="features">
                <Stack spacing={10}>
                    <VStack spacing={3} textAlign="center">
                        <Heading
                            as="h2"
                            size="lg"
                            fontWeight="700"
                            color="gray.900"
                        >
                            Everything you need to manage legal records
                        </Heading>
                        <Text color="gray.500" fontSize="md" maxW="560px">
                            Built on blockchain technology for tamper-evident record keeping.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
                        <FeatureCard
                            icon={<IconDoc />}
                            title="Document Management"
                            description="Upload, organize, and retrieve legal documents with structured metadata like document ID, type, and ownership."
                        />
                        <FeatureCard
                            icon={<IconChain />}
                            title="Blockchain-Backed Records"
                            description="Each document's hash is recorded on a smart contract, creating an immutable audit trail for every upload and update."
                        />
                        <FeatureCard
                            icon={<IconShare />}
                            title="Controlled Sharing"
                            description="Share documents with specific users by username. Access is controlled and tracked, keeping your records private."
                        />
                        <FeatureCard
                            icon={<IconHistory />}
                            title="Document History"
                            description="Track issued and uploaded documents separately. View creator, owner, and timestamps for a complete record history."
                        />
                    </SimpleGrid>
                </Stack>
            </Container>

            {/* ── CTA banner ───────────────────────────────── */}
            <Box bg="brand.500" py={{ base: 10, md: 14 }}>
                <Container maxW="container.xl">
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        justify="space-between"
                        gap={6}
                        textAlign={{ base: "center", md: "left" }}
                    >
                        <Stack spacing={1}>
                            <Heading as="h2" size="md" color="white" fontWeight="700">
                                Ready to secure your legal records?
                            </Heading>
                            <Text color="brand.100" fontSize="sm">
                                Create an account to get started — it takes less than a minute.
                            </Text>
                        </Stack>
                        <HStack spacing={3} flexShrink={0}>
                            {isLoggedIn ? (
                                <Button
                                    as={Link}
                                    to="/dash"
                                    size="md"
                                    bg="white"
                                    color="brand.600"
                                    _hover={{ bg: "brand.50" }}
                                >
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        as={Link}
                                        to="/signup"
                                        size="md"
                                        bg="white"
                                        color="brand.600"
                                        _hover={{ bg: "brand.50" }}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/login"
                                        size="md"
                                        variant="outline"
                                        borderColor="brand.300"
                                        color="white"
                                        _hover={{ bg: "brand.600" }}
                                    >
                                        Log In
                                    </Button>
                                </>
                            )}
                        </HStack>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
}

export default Home;
