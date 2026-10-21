import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";
import { ArrowForwardIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";

import EditDocument from "./EditDocument";
import ShareDocument from "./ShareDocument";
import { useDisclosure } from "@chakra-ui/react";

/* Small share icon inline */
function ShareIcon() {
    return (
        <Box
            as="svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            boxSize={3.5}
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </Box>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}

function DocumentCard({ docId, docType, contentHash, owner, creator, createdAt, updatedAt }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure();

    const downloadUrl = `http://localhost:3001/api/doc/file/${contentHash}?token=${localStorage.getItem("token")}`;

    return (
        <Box
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            _hover={{ borderColor: "brand.200", bg: "white" }}
            transition="all 0.15s"
        >
            <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Stack spacing={1.5} flex={1} minW={0}>
                    {/* Title row */}
                    <HStack spacing={2} align="center">
                        <Heading
                            as="a"
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            fontWeight="600"
                            color="gray.800"
                            noOfLines={1}
                            _hover={{ color: "brand.600", textDecoration: "underline" }}
                        >
                            {docType} — {docId}
                        </Heading>
                        {docType && (
                            <Badge
                                colorScheme="blue"
                                fontSize="2xs"
                                variant="subtle"
                                flexShrink={0}
                            >
                                {docType}
                            </Badge>
                        )}
                    </HStack>

                    {/* Creator → Owner */}
                    <HStack spacing={1.5} fontSize="xs" color="gray.500" flexWrap="wrap">
                        <Text fontWeight="500" color="gray.600">{creator || "—"}</Text>
                        <ArrowForwardIcon boxSize={3} />
                        <Text fontWeight="500" color="gray.600">{owner || "—"}</Text>
                    </HStack>

                    {/* Dates */}
                    <Text fontSize="2xs" color="gray.400">
                        Issued {formatDate(createdAt)}
                        {updatedAt && updatedAt !== createdAt
                            ? ` · Updated ${formatDate(updatedAt)}`
                            : ""}
                    </Text>
                </Stack>

                {/* Action buttons */}
                <HStack spacing={2} flexShrink={0}>
                    <Button
                        as="a"
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<DownloadIcon />}
                        title="Download document"
                    >
                        View
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<EditIcon />}
                        onClick={onOpen}
                    >
                        Edit
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<ShareIcon />}
                        onClick={onOpenShare}
                    >
                        Share
                    </Button>
                </HStack>
            </Flex>

            <EditDocument isOpen={isOpen} onClose={onClose} hash={contentHash} />
            <ShareDocument isOpen={isOpenShare} onClose={onCloseShare} hash={contentHash} />
        </Box>
    );
}

export default DocumentCard;
