import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

function UploadDocument({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [docId, setDocId] = useState("");
    const [docType, setDocType] = useState("");
    const [owner, setOwner] = useState("");
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0] || null);
    };

    const handleDocIdChange = (event) => setDocId(event.target.value);
    const handleDocTypeChange = (event) => setDocType(event.target.value);
    const handleOwnerChange = (event) => setOwner(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData();
        form.append("file", file);
        form.append("doc_id", docId);
        form.append("doc_type", docType);
        owner && form.append("owner", owner);

        setIsLoading(true);

        fetch("http://localhost:3001/api/doc/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: form,
        })
            .then(async (response) => {
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Upload failed');
                }
                toast({
                    title: "Document uploaded",
                    description: "Your document has been uploaded successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                // Reset fields and close
                setFile(null);
                setDocId("");
                setDocType("");
                setOwner("");
                onClose();
            })
            .catch((error) => {
                toast({
                    title: "Upload failed",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "top",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
            <ModalContent
                borderRadius="xl"
                boxShadow="2xl"
                bg="white"
                color="gray.800"
            >
                <ModalHeader
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    pb={4}
                    bg="white"
                    borderTopRadius="xl"
                >
                    <Heading as="h2" size="md" fontWeight="700" color="gray.900">
                        Upload Document
                    </Heading>
                    <Text fontSize="sm" color="gray.500" fontWeight="400" mt={0.5}>
                        Fill in the details and select a file to upload.
                    </Text>
                </ModalHeader>
                <ModalCloseButton top={4} right={4} color="gray.500" />
                <ModalBody py={5} bg="white">
                    <form id="upload-form" onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            {/* File picker */}
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                                    File
                                </FormLabel>
                                <Box
                                    borderWidth="2px"
                                    borderStyle="dashed"
                                    borderColor={file ? "brand.400" : "gray.300"}
                                    borderRadius="lg"
                                    p={4}
                                    textAlign="center"
                                    bg={file ? "brand.50" : "gray.50"}
                                    cursor="pointer"
                                    transition="all 0.15s"
                                    position="relative"
                                    _hover={{ borderColor: "brand.400", bg: "brand.50" }}
                                >
                                    <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        w="full"
                                        h="full"
                                        opacity={0}
                                        cursor="pointer"
                                        zIndex={1}
                                    />
                                    <Stack spacing={1} align="center" pointerEvents="none">
                                        <AttachmentIcon
                                            color={file ? "brand.500" : "gray.400"}
                                            boxSize={6}
                                        />
                                        <Text
                                            fontSize="sm"
                                            fontWeight={file ? "600" : "400"}
                                            color={file ? "brand.600" : "gray.500"}
                                        >
                                            {file ? file.name : "Click to select a file"}
                                        </Text>
                                        {!file && (
                                            <Text fontSize="xs" color="gray.400">
                                                Max size: 10 MB
                                            </Text>
                                        )}
                                    </Stack>
                                </Box>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                                    Document ID
                                </FormLabel>
                                <Input
                                    placeholder="e.g. DOC-2024-001"
                                    value={docId}
                                    onChange={handleDocIdChange}
                                    borderRadius="lg"
                                    bg="white"
                                    color="gray.800"
                                    borderColor="gray.300"
                                    _placeholder={{ color: "gray.400" }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                                    Document Type
                                </FormLabel>
                                <Input
                                    placeholder="e.g. Contract, Affidavit"
                                    value={docType}
                                    onChange={handleDocTypeChange}
                                    borderRadius="lg"
                                    bg="white"
                                    color="gray.800"
                                    borderColor="gray.300"
                                    _placeholder={{ color: "gray.400" }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                                    Assign To (optional)
                                </FormLabel>
                                <Input
                                    placeholder="Username of the owner"
                                    value={owner}
                                    onChange={handleOwnerChange}
                                    borderRadius="lg"
                                    bg="white"
                                    color="gray.800"
                                    borderColor="gray.300"
                                    _placeholder={{ color: "gray.400" }}
                                />
                                <FormHelperText fontSize="xs" color="gray.500">
                                    Leave blank to keep the document assigned to yourself.
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                    </form>
                </ModalBody>
                <ModalFooter
                    borderTopWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                    borderBottomRadius="xl"
                    gap={2}
                >
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Uploading…"
                        isDisabled={!file || !docId || !docType}
                    >
                        Upload Document
                    </Button>
                    <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default UploadDocument;
