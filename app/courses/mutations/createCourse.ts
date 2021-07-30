import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const CreateCourse = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateCourse),
  resolver.authorize(),
  async ({ name }, ctx) => {
    invariant(ctx.session.orgId, "orgId is required for createCourse")

    const course = await db.course.create({
      data: {
        name,
        organizationId: ctx.session.orgId,
      },
    })

    return course
  }
)
