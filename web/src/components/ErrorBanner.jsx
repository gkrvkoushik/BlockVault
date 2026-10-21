import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Container,
} from "@chakra-ui/react";

function ErrorBanner({ error }) {
    return (
        <Container maxW="container.xl" py={6}>
            <Alert
                status="error"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="red.200"
                bg="red.50"
            >
                <AlertIcon />
                <AlertTitle mr={2} fontSize="sm" fontWeight="700">
                    Error:
                </AlertTitle>
                <AlertDescription fontSize="sm">{error.message}</AlertDescription>
            </Alert>
        </Container>
    );
}

export default ErrorBanner;
