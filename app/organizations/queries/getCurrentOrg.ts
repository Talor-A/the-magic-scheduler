import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (input, ctx) => {
  const orgId = ctx.session.orgId

  const org = await db.organization.findFirst({
    where: {
      id: orgId,
    },
  })

  if (!org) {
    throw new Error("Organization not found")
  }

  return org
})
