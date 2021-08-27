import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const GetByDay = z.object({
  date: z.date(),
})

export default resolver.pipe(resolver.zod(GetByDay), resolver.authorize(), async (data, ctx) => {
  invariant(ctx.session.orgId, "orgId is required for this query")

  const event = await db.event.findMany({
    where: {
      start: {
        day: data.date.getDate(),
        month: data.date.getMonth(),
        year: data.date.getFullYear(),
      },

      course: {
        organizationId: ctx.session.orgId,
      },
    },
  })

  return event
})
