import { resolver } from "blitz"
import db, { MembershipRole } from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

export const InviteUser = z.object({
  invitedUserName: z.string(),
  invitedUserEmail: z.string().email(),
  organizationId: z.number(),
  asRole: z.enum([MembershipRole.USER]),
})

export default resolver.pipe(resolver.zod(InviteUser), resolver.authorize(), async (input, ctx) => {
  invariant(ctx.session.orgId, "Must be logged in to invite users")

  const userRole = await db.membership.findFirst({
    where: {
      organizationId: ctx.session.orgId,
      userId: ctx.session.userId,
    },
  })
  invariant(userRole, "User must be a member of the organization")
  invariant(userRole.role !== "USER", "user must be admin or owner")

  const membershipInvite = await db.membership.create({
    data: {
      role: "USER",
      invitedEmail: input.invitedUserEmail,
      invitedName: input.invitedUserName,
      organizationId: ctx.session.orgId,
    },
  })

  return membershipInvite
})
