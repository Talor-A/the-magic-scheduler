import { resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

export const CreateEvent = z.object({
  courseId: z.number(),
  instructorIds: z.array(z.number()).min(1),

  allDay: z.boolean().optional(),
})

export type CreateEventArgs = z.input<typeof CreateEvent>

export default resolver.pipe(
  resolver.zod(CreateEvent),
  resolver.authorize(),
  async ({ courseId, instructorIds = [], allDay = false }, ctx) => {
    const { orgId: organizationId } = ctx.session
    invariant(organizationId, "orgId is required for createEvent")

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
          connect: {
            id: course.id,
          },
        },
        instructors: {
          connect: instructors.map((instructor) => ({
            id: instructor.id,
          })),
        },
        allDay,
      },
    })

    return event
  }
)
