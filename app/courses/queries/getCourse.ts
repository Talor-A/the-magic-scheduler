import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetCourse = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCourse), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const course = await db.course.findFirst({ where: { id } })

  if (!course) throw new NotFoundError()

  return course
})
