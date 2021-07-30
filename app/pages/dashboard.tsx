import {
  Alert,
  AlertIcon,
  Button,
  chakra,
  Stack,
  Table,
  Tr,
  Th,
  Thead,
  Tbody,
  Td,
  Flex,
  Box,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react"
import { Header } from "app/core/components/Header"
import { useLoggedInUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import acceptInvite from "app/organizations/mutations/acceptInvite"
import getInvitations from "app/organizations/queries/getIncomingInvitations"
import getTeam from "app/organizations/queries/getTeam"
import { BlitzPage, useMutation, useQuery, useSession } from "blitz"
import { Membership, Organization } from "db"
import React, { Suspense } from "react"

const Invite = (invitation: Membership & { organization: Organization }) => {
  const [accept, { isLoading }] = useMutation(acceptInvite)

  return (
    <Alert status="info" rounded="md">
      <AlertIcon />
      You have been invited to {invitation.organization.name} as role: {invitation.role}.
      <Button
        ml="auto"
        colorScheme="blue"
        isLoading={isLoading}
        onClick={() => accept({ invitationId: invitation.id, orgId: invitation.organizationId })}
      >
        Accept
      </Button>
    </Alert>
  )
}

const InvitationsList = () => {
  const user = useLoggedInUser()
  const [invitations] = useQuery(getInvitations, null)

  if (!invitations.length) return <></>
  return (
    <Stack spacing={4}>
      invitations:
      {invitations.map((invitation) => (
        <Invite {...invitation} key={invitation.id} />
      ))}
    </Stack>
  )
}
const TeamList = () => {
  const [team] = useQuery(getTeam, null)

  return (
    <Box rounded="lg" border="1px solid" borderColor="gray.200" p={4} shadow="md">
      <Heading ml={5}>My Team</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {team?.map((member) => (
            <Tr key={member.id}>
              <Td>{member.user.name}</Td>
              <Td>{member.user.email}</Td>
              <Td>{member.user.pending ? "Invited" : member.role}</Td>
            </Tr>
          ))}
          <Tr>
            <Td colSpan={2}>
              <Button colorScheme="green" onClick={() => {}}>
                Invite Members
              </Button>
            </Td>
            <Td>
              <Button variant="link" ml="auto">
                {"Manage Team >"}
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}

const Welcome = () => (
  <Stack
    alignItems="center"
    justifyContent="center"
    bg={useColorModeValue("green.100", "green.900")}
    p={8}
    rounded="xl"
  >
    <Heading fontSize={"xxx-large"}>🐰🎩</Heading>
    <Heading>Welcome to Magic Scheduler!</Heading>
    <p>
      You are not a member of any organizations.
      <br />
      {"If you're an instructor, you'll need an administrator to invite you to your organization."}
      Or,
      <b>
        <a href="/organizations/new">Create your first organization</a>
      </b>
      to get started.
    </p>
  </Stack>
)

const Dashboard: BlitzPage = () => {
  const session = useSession()

  if (!session.orgId) {
    return (
      <>
        <Welcome />
        <InvitationsList />
      </>
    )
  }
  return (
    <>
      <InvitationsList />
      <TeamList />
    </>
  )
}

Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => (
  <Layout title="Dashboard">
    <Suspense fallback={<div>Loading...</div>}>
      <Flex flexDir="column" minH={"100vh"} align="stretch">
        <Header />
        <Stack spacing={8} p={8}>
          {page}
        </Stack>
      </Flex>
    </Suspense>
  </Layout>
)
Dashboard.authenticate = {
  redirectTo: "/login",
}

export default Dashboard
