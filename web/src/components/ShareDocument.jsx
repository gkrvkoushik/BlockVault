import {
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
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

function ShareDocument({ isOpen, onClose, hash }) {
    const [username, setUsername] = useState("");
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleUsernameChange = (event) => setUsername(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData();
        form.append("username", username);

        setIsLoading(true);

        fetch("http://localhost:3001/api/doc/share/" + hash, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: form,
        })
            .then((response) => {
                toast({
                    title: "Document shared",
                    description: `Document shared with ${username} successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                setUsername("");
                onClose();
            })
            .catch((error) => {
                toast({
                    title: "Share failed",
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
        <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
            <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl" bg="white" color="gray.800">
                <ModalHeader borderBottomWidth="1px" borderColor="gray.200" pb={4} bg="white" borderTopRadius="xl">
                    <Heading as="h2" size="md" fontWeight="700" color="gray.900">
                        Share Document
                    </Heading>
                    <Text fontSize="sm" color="gray.500" fontWeight="400" mt={0.5}>
                        Enter the username of the person you want to share with.
                    </Text>
                </ModalHeader>
                <ModalCloseButton top={4} right={4} color="gray.500" />
                <ModalBody py={5} bg="white">
                    <form id="share-form" onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                                    Recipient Username
                                </FormLabel>
                                <Input
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    borderRadius="lg"
                                    bg="white"
                                    color="gray.800"
                                    borderColor="gray.300"
                                    _placeholder={{ color: "gray.400" }}
                                />
                                <FormHelperText fontSize="xs" color="gray.500">
                                    The recipient must have a registered account.
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                    </form>
                </ModalBody>
                <ModalFooter borderTopWidth="1px" borderColor="gray.200" bg="white" borderBottomRadius="xl" gap={2}>
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Sharing…"
                        isDisabled={!username.trim()}
                    >
                        Share Document
                    </Button>
                    <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ShareDocument;
