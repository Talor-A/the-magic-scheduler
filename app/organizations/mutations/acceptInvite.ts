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

    const invitation = await db.membership.findFirst({
      where: {
        organizationId: orgId,
        invitedEmail: user.email,
      },
    })

    invariant(invitation, "Invitation not found")
    invariant(invitationId === invitation.id, "Invitation ID does not match")

    const membership = await db.membership.update({
      data: {
        invitedEmail: null,
        invitedName: null,
        userId: user.id,
      },
      where: { id: invitation.id },
    })

    await ctx.session.$create({
      orgId: orgId,
      roles: [user.role, membership.role],
      userId: user.id,
    })

    return membership
  }
)
