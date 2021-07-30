import getLoggedInUser from "app/users/queries/getLoggedInUser"
import { resolver } from "blitz"
import db, { MembershipRole } from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

export const AcceptInvite = z.object({
  invitationId: z.number(),
  orgId: z.number(),
})

export default resolver.pipe(
  resolver.zod(AcceptInvite),
  resolver.authorize(),
  async ({ invitationId, orgId }, ctx) => {
    const user = await getLoggedInUser(null, ctx)

    const membership = await db.membership.update({
      data: {
        invitedEmail: null,
        invitedName: null,
        userId: user.id,
      },
      where: {
        id: invitationId,
        organizationId_invitedEmail: {
          organizationId: orgId,
          invitedEmail: user.email,
        },
      },
    })

    return membership
  }
)
