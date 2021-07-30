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
    <Alert status="info">
      <AlertIcon />
      You have been invited to {invitation.organization.name} as role: {invitation.role}.
      <Button
        ml="auto"
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

  return (
    <Stack m={10} spacing={4}>
      invitations:
      {invitations.map((invitation) => (
        <Invite {...invitation} key={invitation.id} />
      ))}
      {!invitations.length && <chakra.div>No invitations</chakra.div>}
    </Stack>
  )
}
const TeamList = () => {
  const [team] = useQuery(getTeam, null)

  return (
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
      </Tbody>
    </Table>
  )
}

const Welcome = () => (
  <Stack alignItems="center" justifyContent="center" bg="green.900" p={8} rounded="xl">
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
      <TeamList />
      <InvitationsList />
    </>
  )
}

Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => (
  <Layout title="Dashboard">
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <Flex minH={"100vh"} p={8} align="stretch">
        <Stack spacing={8}>{page}</Stack>
      </Flex>
    </Suspense>
  </Layout>
)
Dashboard.authenticate = {
  redirectTo: "/login",
}

export default Dashboard
