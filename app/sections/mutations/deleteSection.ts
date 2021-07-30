import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const DeleteSection = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSection),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const { orgId } = ctx.session
    invariant(orgId, "orgId is required")

    const section = await db.section.deleteMany({
      where: { id, course: { organizationId: orgId } },
    })

    return section
  }
)
