import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

const CreateEvent = z.object({
  courseId: z.number(),
  instructorIds: z.array(z.number()).optional(),
})

export default resolver.pipe(
  resolver.zod(CreateEvent),
  resolver.authorize(),
  async ({ courseId, instructorIds = [] }, ctx) => {
    const { orgId: organizationId } = ctx.session
    invariant(organizationId, "orgId is required for createCourse")

    const course = await db.course.findFirst({
      where: {
        organizationId,
        id: courseId,
      },
    })

    invariant(course, "course not found")

    const instructors = await db.user.findMany({
      where: {
        OR: instructorIds.map((id) => ({
          id,
          memberships: { some: { organizationId } },
        })),
      },
    })

    const event = await db.event.create({
      data: {
        course: {
          connect: course,
        },
        instructors: {
          connect: instructors,
        },
      },
    })

    return event
  }
)