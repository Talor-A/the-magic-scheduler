import { resolver, NotFoundError } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const GetEvent = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetEvent), resolver.authorize(), async ({ id }, ctx) => {
  invariant(ctx.session.orgId, "orgId is required for createCourse")

  const event = await db.event.findFirst({
    where: {
      AND: [
        { id },
        {
          course: {
            organizationId: ctx.session.orgId,
          },
        },
      ],
    },
  })

  if (!event) throw new NotFoundError()

  return event
})
