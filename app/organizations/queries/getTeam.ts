import { resolver } from "blitz"
import db, { MembershipRole } from "db"
import invariant from "tiny-invariant"

export const friendlyRoleName = (role: MembershipRole) => {
  switch (role) {
    case MembershipRole.ADMIN:
      return "Admin" as const
    case MembershipRole.OWNER:
      return "Owner" as const
    case MembershipRole.USER:
      return "User" as const
    default:
      invariant(false, "Unrecognized role")
  }
}

export default resolver.pipe(resolver.authorize(), async (_ = null, ctx) => {
  invariant(ctx.session.orgId, "must belong to an organization")

  const members = await db.membership.findMany({
    where: {
      organizationId: ctx.session.orgId,
    },
    include: {
      user: true,
    },
  })

  // TODO: test ! assertion filters out null users
  return members.map((m) => ({
    id: m.id,
    role: friendlyRoleName(m.role),
    user: m.user
      ? { name: m.user.name, email: m.user.email, pending: false }
      : { name: m.invitedName, email: m.invitedEmail, pending: true },
  }))
})
