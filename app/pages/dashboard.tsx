import { Alert, AlertIcon, Button, chakra, Stack } from "@chakra-ui/react"
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
        isLoading={isLoading}
        onClick={() => accept({ invitationId: invitation.id, orgId: invitation.organizationId })}
      >
        Accept?
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
    <>
      My Team:
      {team?.map((member) => (
        <chakra.div key={member.id}>
          {member.user.name} {member.user.email} {member.user.pending ? "Pending" : member.role}
        </chakra.div>
      ))}
    </>
  )
}

const Dashboard: BlitzPage = () => {
  const session = useSession()

  if (!session.orgId) {
    return (
      <>
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
  <Layout title="Profile">
    <Suspense fallback={<div>Loading...</div>}>{page}</Suspense>
  </Layout>
)
Dashboard.authenticate = {
  redirectTo: "/login",
}

export default Dashboard
