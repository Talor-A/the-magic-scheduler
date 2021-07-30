import { resolver, NotFoundError, AuthorizationError } from "blitz"
import db from "db"
import { z } from "zod"

const GetCourse = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCourse), resolver.authorize(), async ({ id }, ctx) => {
  if (!ctx.session.orgId) throw new AuthorizationError("No orgId in session")

  const course = await db.course.findFirst({
    where: { id, organizationId: ctx.session.orgId },
    include: {
      Section: {
        include: {
          instructors: true,
        },
      },
    },
  })

  if (!course) throw new NotFoundError()

  return course
})
