import { chakra } from "@chakra-ui/react"
import { useLoggedInUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import getInvitations from "app/organizations/queries/getInvitations"
import getTeam from "app/organizations/queries/getTeam"
import { BlitzPage, useMutation, useQuery } from "blitz"
import { Suspense } from "react"

const InvitationsList = () => {
  const user = useLoggedInUser()
  const [invitations] = useQuery(getInvitations, null)

  return (
    <>
      invitations:
      {invitations.map((invitation) => (
        <chakra.div key={invitation.id}>{invitation.role}</chakra.div>
      ))}
    </>
  )
}
const TeamList = () => {
  const [team] = useQuery(getTeam, null)

  return (
    <>
      My Team:
      {team.map((member) => (
        <chakra.div key={member.id}>
          {member.user.name} {member.user.email}
        </chakra.div>
      ))}
    </>
  )
}

const Dashboard: BlitzPage = () => {
  return (
    <Suspense fallback="loading...">
      <TeamList />
      <InvitationsList />
    </Suspense>
  )
}

Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Profile">{page}</Layout>
Dashboard.authenticate = {
  redirectTo: "/login",
}

export default Dashboard
