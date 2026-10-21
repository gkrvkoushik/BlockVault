import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

function Signup() {
    const toast = useToast({ position: "top" });
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, email, password, confirmPassword }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code !== 200) {
                    toast({
                        title: "Registration failed",
                        description: data.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Account created",
                        description: "Your account has been created. Please log in.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    window.location.href = "/login";
                }
            })
            .catch(() => {
                toast({
                    title: "An error occurred",
                    description: "Unable to create your account. Please try again.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Container maxW="md" py={{ base: 12, md: 20 }}>
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="2xl"
                    p={{ base: 6, md: 10 }}
                    boxShadow="lg"
                >
                    <Stack spacing={6}>
                        <Stack spacing={1} textAlign="center">
                            <Heading size="lg" fontWeight="700" color="gray.900">
                                Create your account
                            </Heading>
                            <Text color="gray.500" fontSize="sm">
                                Join BlockVault to manage your legal documents securely.
                            </Text>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="name" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Full Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        borderRadius="lg"
                                    />
                                </FormControl>
                                <FormControl id="username" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Username</FormLabel>
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="janedoe"
                                        borderRadius="lg"
                                    />
                                </FormControl>
                                <FormControl id="email" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Email Address</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        borderRadius="lg"
                                    />
                                </FormControl>
                                <FormControl id="password" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        borderRadius="lg"
                                    />
                                </FormControl>
                                <FormControl id="confirmPassword" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Confirm Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        borderRadius="lg"
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    colorScheme="brand"
                                    size="md"
                                    isLoading={isLoading}
                                    loadingText="Creating account…"
                                    mt={2}
                                    borderRadius="lg"
                                >
                                    Create Account
                                </Button>
                            </Stack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="gray.500">
                            Already have an account?{" "}
                            <Link color="brand.600" href="/login" fontWeight="600">
                                Log in
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Signup;
