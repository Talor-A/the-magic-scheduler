import React, { ReactNode, Suspense } from "react"
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react"
import { FiHome, FiSettings, FiMenu, FiBell, FiChevronDown, FiCalendar } from "react-icons/fi"
import { IconType } from "react-icons"
import { ReactText } from "react"
import { Routes, RouteUrlObject, Link, useRouter, useSession } from "blitz"
import { useIsActive } from "../hooks/useIsActive"
import { useCurrentOrg } from "app/organizations/hooks/useOrganization"
import { useLoggedInUser } from "app/users/hooks/useCurrentUser"

interface LinkItemProps {
  name: string
  icon: IconType
  route: RouteUrlObject
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiHome, route: Routes.Dashboard() },
  { name: "Profile", icon: FiSettings, route: Routes.Profile() },
  { name: "Courses", icon: FiCalendar, route: Routes.CoursesPage() },
  { name: "Calendar", icon: FiCalendar, route: Routes.CalendarPage() },
]

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={onClose} display={{ base: "none", md: "block" }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <TopHeader onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} height="100%" p="4">
        <Suspense
          fallback={
            <Flex height="100%" width="100%" justifyContent="center">
              <Spinner />
            </Flex>
          }
        >
          {children}
        </Suspense>
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="width 3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          🐰🎩
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} route={link.route}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  route: RouteUrlObject
  children: ReactText
}
const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  const isActive = useIsActive(route.pathname)

  const hoverStyles = {
    bg: useColorModeValue("green.100", "green.700"),
    color: useColorModeValue("black", "white"),
  }

  const activeStyles = { bg: "green.400", color: "white" }
  return (
    <Link href={route}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={hoverStyles}
        {...(isActive ? { ...activeStyles, ...rest } : { ...rest })}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

const HeaderMenu = () => {
  const org = useCurrentOrg()
  const orgName = org ? org.name : "No Org"

  const { name } = useLoggedInUser()

  return (
    <Menu>
      <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
        <HStack>
          <Avatar name={name ?? undefined} size={"sm"} />
          <VStack
            display={{ base: "none", md: "flex" }}
            alignItems="flex-start"
            spacing="1px"
            ml="2"
          >
            <Text fontSize="sm">{name}</Text>
            <Text fontSize="xs" color="gray.600">
              {orgName}
            </Text>
          </VStack>
          <Box display={{ base: "none", md: "flex" }}>
            <FiChevronDown />
          </Box>
        </HStack>
      </MenuButton>
      <MenuList
        bg={useColorModeValue("white", "gray.900")}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Billing</MenuItem>
        <MenuDivider />
        <MenuItem>Sign out</MenuItem>
      </MenuList>
    </Menu>
  )
}
const TopHeader = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      as="header"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={"center"}>
          <Suspense fallback="FIXME">
            <HeaderMenu />
          </Suspense>
        </Flex>
      </HStack>
    </Flex>
  )
}
