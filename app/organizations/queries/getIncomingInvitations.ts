import getLoggedInUser from "app/users/queries/getLoggedInUser"
import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_ = null, ctx) => {
  const user = await getLoggedInUser(null, ctx)

  const invitations = db.membership.findMany({
    where: {
      invitedEmail: user.email,
    },
    include: {
      organization: true,
    },
  })
  return invitations
})
