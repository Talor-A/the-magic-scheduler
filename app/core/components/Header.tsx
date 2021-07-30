import { ChevronRightIcon, SearchIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
  chakra,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  ButtonGroup,
} from "@chakra-ui/react"
// import { useSyncStatus } from "../contexts/replicache.provider"
import { Link, Routes, RouteUrlObject, useMutation, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser, useLoggedInUser } from "../hooks/useCurrentUser"
import { Suspense } from "react"
import { useCurrentOrg } from "../hooks/useOrganization"
import { CalendarIcon } from "@chakra-ui/icons"

type IBreadCrumb = {
  to: RouteUrlObject
  name: string
  active?: boolean
}
type HeaderProps = {
  breadcrumbs?: IBreadCrumb[]
}

const UserMenu = () => {
  const [logoutMutation] = useMutation(logout)
  const user = useLoggedInUser()
  const org = useCurrentOrg()

  return (
    <Menu>
      <Avatar size="sm" name={user.name || user.email} as={MenuButton}></Avatar>
      <MenuList>
        <MenuItem>
          {org ? (
            <>
              {"Organization: "}
              <chakra.strong>{org.name}</chakra.strong>
            </>
          ) : (
            "No Organization set"
          )}
        </MenuItem>
        <Link href={Routes.Profile()} passHref>
          <MenuItem as={"a"}>Profile</MenuItem>
        </Link>
        <MenuItem
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export const Header = ({ breadcrumbs }: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode()

  const bg = useColorModeValue("gray.50", "gray.800")
  const underline = useColorModeValue("gray.100", "gray.900")

  return (
    <chakra.header
      w="full"
      px={{ base: 2, sm: 4 }}
      py={3}
      bg={bg}
      borderBottomColor={underline}
      borderBottomWidth={"1px"}
      borderBottomStyle="solid"
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack ml={4}>
          <CalendarIcon color="green.600" />

          {breadcrumbs ? (
            <Breadcrumb separator={<ChevronRightIcon />}>
              {breadcrumbs.map(({ to, name, active }) => (
                <BreadcrumbItem key={to.toString()}>
                  <Link href={to} passHref>
                    <BreadcrumbLink fontWeight={active ? "bold" : undefined}>{name}</BreadcrumbLink>
                  </Link>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          ) : (
            <div />
          )}
        </HStack>

        <HStack spacing={3} alignItems="center">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input variant="filled" type="tel" placeholder="Search..." />
          </InputGroup>

          <ButtonGroup spacing={0}>
            <IconButton bg={"transparent"} aria-label="Switch Theme" onClick={toggleColorMode}>
              {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </ButtonGroup>

          <Suspense fallback={<Avatar size="sm" />}>
            <UserMenu />
          </Suspense>
        </HStack>
      </Flex>
    </chakra.header>
  )
}
