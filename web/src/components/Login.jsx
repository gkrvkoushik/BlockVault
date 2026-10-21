import {
    Box,
    Button,
    Container,
    Flex,
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

function Login() {
    const toast = useToast({ position: "top" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code !== 200) {
                    toast({
                        title: "Login failed",
                        description: data.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("tokenExpiration", Date.now() + 3600000);
                    toast({
                        title: "Logged in",
                        description: "You have been successfully logged in.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    window.location.href = "/dash";
                }
            })
            .catch((error) => {
                toast({
                    title: "An error occurred",
                    description: error.message,
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
                                Welcome back
                            </Heading>
                            <Text color="gray.500" fontSize="sm">
                                Sign in to access your BlockVault dashboard.
                            </Text>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="email" isRequired>
                                    <FormLabel fontSize="sm" fontWeight="600">Username or Email</FormLabel>
                                    <Input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
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
                                <Button
                                    type="submit"
                                    colorScheme="brand"
                                    size="md"
                                    isLoading={isLoading}
                                    loadingText="Signing in…"
                                    mt={2}
                                    borderRadius="lg"
                                >
                                    Log In
                                </Button>
                            </Stack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="gray.500">
                            Don't have an account?{" "}
                            <Link color="brand.600" href="/signup" fontWeight="600">
                                Sign up
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;
