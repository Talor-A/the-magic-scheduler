import { resolver } from "blitz"
import { add, getDay, startOfDay } from "date-fns"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const GetByDay = z.object({
  date: z.date(),
})

export default resolver.pipe(resolver.zod(GetByDay), resolver.authorize(), async (data, ctx) => {
  invariant(ctx.session.orgId, "orgId is required for this query")

  const start = startOfDay(data.date)
  const end = add(start, { days: 1 })

  const events = await db.event.findMany({
    where: {
      OR: [
        // is not a recurring event
        // and is on the same day as the query
        {
          startsAt: {
            lte: end,
          },
          endsAt: {
            gte: start,
          },

          course: {
            organizationId: ctx.session.orgId,
          },
          repeats: {
            is: null,
          },
        },
        // is a recurring event
        {
          startsAt: {
            // as long as it starts before the end of our window
            // (i.e. it overlaps with our window)
            // include it
            lte: end,
          },

          repeats: {
            // repeats for longer than the end date
            until: {
              gte: end,
            },
          },
          course: {
            organizationId: ctx.session.orgId,
          },

          OR: [
            // is a weekly event
            {
              repeats: {
                type: "WEEKLY",
                days: {
                  hasSome: getDay(start),
                },
              },
            },
            // is a daily event
            {
              repeats: {
                type: "DAILY",
              },
            },
          ],
        },
      ],
    },
  })

  return events
})
