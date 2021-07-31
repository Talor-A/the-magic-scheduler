import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteEvent = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteEvent),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const event = await db.event.update({ where: { id }, data: {} })

    return event
  }
)
