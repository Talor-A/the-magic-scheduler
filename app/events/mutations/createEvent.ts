import { resolver } from "blitz"
import db, { zodEnum } from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

export const CreateRepeats = z.union([
  z.object({
    until: z.date().optional(),

    type: z.literal("DAILY"),
    // for now, discard the days array.
    // TODO: in the future, enable "repeats every X days"
    days: z
      .array(z.number())
      .optional()
      .transform((): number[] => []),
  }),
  z.object({
    until: z.date().optional(),

    type: z.literal("WEEKLY"),
    // TODO: refine
    days: z.array(z.number()).refine((arr) => arr.every((x) => x >= 0 && x <= 6)), // 0 = Sunday
  }),
])

export const CreateEvent = z.object({
  courseId: z.number(),
  instructorIds: z.array(z.number()).min(1),

  allDay: z.boolean().optional(),

  tz: z.string().optional(),

  repeats: CreateRepeats.optional(),

  start: z.date(),
  end: z.date(),
})

export default resolver.pipe(
  resolver.zod(CreateEvent),
  resolver.authorize(),
  async ({ courseId, instructorIds = [], allDay = true, repeats, start, end }, ctx) => {
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

        startsAt: start,
        endsAt: end,

        repeats: repeats
          ? {
              create: {
                type: repeats.type,
                days: repeats.days,
                until: repeats.until,
              },
            }
          : undefined,
      },
    })

    return event
  }
)
