import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

import DocumentCard from "./DocumentCard";
import ErrorBanner from "./ErrorBanner";
import Loading from "./Loading";
import fetcher from "../lib/fetcher";
import useSWRImmutable from "swr/immutable";
import { useDisclosure } from "@chakra-ui/react";
import UploadDocument from "./UploadDocument";

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyState({ label, onUpload }) {
    return (
        <VStack
            spacing={3}
            py={10}
            px={6}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            borderStyle="dashed"
            bg="gray.50"
            color="gray.400"
        >
            {/* Document icon */}
            <Box
                as="svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                boxSize={10}
                color="gray.300"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </Box>
            <Text fontSize="sm" fontWeight="500" color="gray.500">
                No documents yet
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center">
                {label}
            </Text>
            {onUpload && (
                <Button size="xs" colorScheme="brand" variant="outline" onClick={onUpload}>
                    Upload Document
                </Button>
            )}
        </VStack>
    );
}

/* ── Section ─────────────────────────────────────────────────── */
function DocSection({ title, docs, onUpload }) {
    return (
        <Box>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h2" size="sm" fontWeight="600" color="gray.700">
                    {title}
                    <Box
                        as="span"
                        ml={2}
                        px={2}
                        py={0.5}
                        bg="gray.100"
                        borderRadius="full"
                        fontSize="xs"
                        color="gray.500"
                    >
                        {docs.length}
                    </Box>
                </Heading>
            </Flex>

            {docs.length === 0 ? (
                <EmptyState
                    label={title === "Issued Documents"
                        ? "Documents you issue to others will appear here."
                        : "Documents you upload will appear here."}
                    onUpload={title === "Uploaded Documents" ? onUpload : undefined}
                />
            ) : (
                <Stack spacing={3}>
                    {docs.map((doc) => (
                        <DocumentCard key={doc.hash} {...doc} />
                    ))}
                </Stack>
            )}
        </Box>
    );
}

/* ── Documents ───────────────────────────────────────────────── */
function Documents() {
    const { data, error } = useSWRImmutable("http://localhost:3001/api/doc/list", fetcher);
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (error) {
        return (
            <Container maxW="container.xl" pb={10}>
                <ErrorBanner error={error} />
            </Container>
        );
    }
    if (!data) {
        return <Loading />;
    }

    const issuedDocs = data.issued_docs ?? [];
    const uploadedDocs = data.uploaded_docs ?? [];

    return (
        <Box id="document-list">
            <Container maxW="container.xl" pb={12}>
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={{ base: 5, md: 8 }}
                >
                    <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                        <Box flex={1}>
                            <DocSection
                                title="Issued Documents"
                                docs={issuedDocs}
                            />
                        </Box>
                        <Box
                            display={{ base: "block", lg: "block" }}
                            w={{ base: "full", lg: "1px" }}
                            h={{ base: "1px", lg: "auto" }}
                            bg="gray.200"
                            flexShrink={0}
                        />
                        <Box flex={1}>
                            <DocSection
                                title="Uploaded Documents"
                                docs={uploadedDocs}
                                onUpload={onOpen}
                            />
                        </Box>
                    </Flex>
                </Box>
            </Container>
            <UploadDocument isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}

export default Documents;
