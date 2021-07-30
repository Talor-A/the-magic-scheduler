import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteSection = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSection),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const section = await db.section.deleteMany({
      where: { id, course: { organizationId: ctx.session.orgId } },
    })

    return section
  }
)
