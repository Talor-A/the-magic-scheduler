import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"

export default resolver.pipe(resolver.authorize(), async (_ = null, ctx) => {
  invariant(ctx.session.orgId, "must belong to an organization")

  const members = await db.membership.findMany({
    where: {
      organizationId: ctx.session.orgId,
      NOT: [
        {
          user: null,
        },
      ],
    },
    include: {
      user: true,
    },
  })

  // TODO: test ! assertion filters out null users
  return members.map((m) => ({
    id: m.id,
    role: m.role,
    user: { name: m.user!.name, email: m.user!.email },
  }))
})
