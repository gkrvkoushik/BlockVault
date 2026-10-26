import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import Documents from "./Documents";
import FunctionCard from "./FunctionCard";
import UploadDocument from "./UploadDocument";
import checkLogin from "../lib/checkLogin";
import { useDisclosure } from "@chakra-ui/react";
import fetcher from "../lib/fetcher";
import useSWR from "swr";

function StatCard({ label, value }) {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            px={5}
            py={4}
        >
            <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={1}>
                {label}
            </Text>
            <Heading as="p" size="xl" fontWeight="700" color="gray.900">
                {value}
            </Heading>
        </Box>
    );
}

function Dashboard() {
    const isLoggedIn = checkLogin();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!isLoggedIn) {
        window.location.href = "/login";
        return null;
    }

    // Reuse the same doc list to derive stats
    const { data } = useSWR("http://localhost:3001/api/doc/list", fetcher, { refreshInterval: 3000 });
    const totalDocs = data
        ? (data.issued_docs?.length ?? 0) + (data.uploaded_docs?.length ?? 0)
        : null;
    const issuedCount = data ? (data.issued_docs?.length ?? 0) : null;
    const uploadedCount = data ? (data.uploaded_docs?.length ?? 0) : null;

    return (
        <Box bg="gray.50" minH="100vh">
            {/* ── Dashboard header ─────────────────────────── */}
            <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" py={6}>
                <Container maxW="container.xl">
                    <Flex
                        direction={{ base: "column", sm: "row" }}
                        align={{ base: "flex-start", sm: "center" }}
                        justify="space-between"
                        gap={4}
                    >
                        <Stack spacing={0.5}>
                            <Heading as="h1" size="lg" fontWeight="700" color="gray.900">
                                Document Dashboard
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                Manage your legal records in one place.
                            </Text>
                        </Stack>
                        <Button
                            leftIcon={<AddIcon />}
                            colorScheme="brand"
                            size="md"
                            onClick={onOpen}
                            flexShrink={0}
                        >
                            Upload Document
                        </Button>
                        <UploadDocument isOpen={isOpen} onClose={onClose} />
                    </Flex>
                </Container>
            </Box>

            <Container maxW="container.xl" py={8}>
                <Stack spacing={8}>
                    {/* ── Stats row ──────────────────────────── */}
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
                        <StatCard
                            label="Total Documents"
                            value={totalDocs !== null ? totalDocs : "—"}
                        />
                        <StatCard
                            label="Issued Documents"
                            value={issuedCount !== null ? issuedCount : "—"}
                        />
                        <StatCard
                            label="Uploaded Documents"
                            value={uploadedCount !== null ? uploadedCount : "—"}
                        />
                    </SimpleGrid>

                    {/* ── Quick actions ──────────────────────── */}
                    <Box>
                        <Heading as="h2" size="sm" fontWeight="600" color="gray.700" mb={3}>
                            Quick Actions
                        </Heading>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                            <FunctionCard
                                title="Upload Document"
                                description="Add a new legal document to the vault."
                                action="upload"
                            />
                            <FunctionCard
                                title="View Documents"
                                description="Browse your issued and uploaded records."
                                action="view"
                            />
                            <FunctionCard
                                title="Settings"
                                description="Manage your account preferences."
                                action="settings"
                            />
                        </SimpleGrid>
                    </Box>
                </Stack>
            </Container>

            {/* ── Document lists ───────────────────────────── */}
            <Documents />
        </Box>
    );
}

export default Dashboard;
