import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCourse = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateCourse),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const course = await db.course.update({ where: { id }, data })

    return course
  }
)
