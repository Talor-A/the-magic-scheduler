import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_ = null, ctx) => {
  const orgId = ctx.session.orgId ?? null
  if (!orgId) return null

  const org = await db.organization.findFirst({
    where: {
      id: orgId,
    },
  })

  return org
})
