import {
    Box,
    Button,
    Collapse,
    Flex,
    HStack,
    Heading,
    IconButton,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

import { Link } from "react-router-dom";
import checkLogin from "../lib/checkLogin";

function ShieldIcon() {
    return (
        <Box
            as="svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            boxSize="6"
            color="brand.500"
            mr={2}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Box>
    );
}

function NavLink({ to, children }) {
    return (
        <Box
            as={Link}
            to={to}
            px={3}
            py={1.5}
            rounded="md"
            fontSize="sm"
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "brand.600", bg: "brand.50" }}
            transition="all 0.15s"
        >
            {children}
        </Box>
    );
}

function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const isLoggedIn = checkLogin();

    const LogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        window.location.reload();
    };

    return (
        <Box
            bg="white"
            borderBottomWidth="1px"
            borderColor="gray.200"
            px={4}
            position="sticky"
            top={0}
            zIndex={100}
            boxShadow="sm"
        >
            <Flex h={14} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
                {/* Left: Brand + nav links */}
                <HStack spacing={6} alignItems="center">
                    <Flex as={Link} to="/" alignItems="center" _hover={{ textDecoration: "none" }}>
                        <ShieldIcon />
                        <Heading
                            as="span"
                            size="md"
                            fontWeight="700"
                            letterSpacing="-0.5px"
                            color="gray.800"
                        >
                            BlockVault
                        </Heading>
                    </Flex>

                    {/* Desktop nav links — always visible */}
                    <HStack as="nav" spacing={1} display={{ base: "none", md: "flex" }}>
                        <NavLink to="/">Home</NavLink>
                        {isLoggedIn && <NavLink to="/dash">Dashboard</NavLink>}
                    </HStack>
                </HStack>

                {/* Right: Auth actions */}
                <HStack spacing={2}>
                    {isLoggedIn ? (
                        <>
                            <Button
                                as={Link}
                                to="/dash"
                                size="sm"
                                colorScheme="brand"
                                display={{ base: "none", md: "inline-flex" }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                onClick={LogOut}
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                            >
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                as={Link}
                                to="/login"
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                            >
                                Log in
                            </Button>
                            <Button
                                as={Link}
                                to="/signup"
                                size="sm"
                                colorScheme="brand"
                            >
                                Sign up
                            </Button>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    <IconButton
                        variant="ghost"
                        size="sm"
                        icon={isOpen ? <CloseIcon fontSize={10} /> : <HamburgerIcon fontSize={20} />}
                        aria-label="Toggle menu"
                        display={{ base: "flex", md: "none" }}
                        onClick={onToggle}
                        colorScheme="gray"
                    />
                </HStack>
            </Flex>

            {/* Mobile menu */}
            <Collapse in={isOpen} animateOpacity>
                <Box pb={4} pt={2} display={{ md: "none" }} borderTopWidth="1px" borderColor="gray.100">
                    <Stack as="nav" spacing={1}>
                        <Box
                            as={Link}
                            to="/"
                            px={3}
                            py={2}
                            rounded="md"
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.700"
                            _hover={{ bg: "brand.50", color: "brand.600" }}
                            onClick={onToggle}
                        >
                            Home
                        </Box>
                        {isLoggedIn && (
                            <Box
                                as={Link}
                                to="/dash"
                                px={3}
                                py={2}
                                rounded="md"
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.700"
                                _hover={{ bg: "brand.50", color: "brand.600" }}
                                onClick={onToggle}
                            >
                                Dashboard
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
}

export default Navbar;
