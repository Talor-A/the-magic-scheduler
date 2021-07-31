import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const DeleteEvent = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteEvent),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const { orgId } = ctx.session
    invariant(orgId, "orgId is required")

    const event = await db.event.deleteMany({
      where: { id, course: { organizationId: orgId } },
    })

    return event
  }
)
