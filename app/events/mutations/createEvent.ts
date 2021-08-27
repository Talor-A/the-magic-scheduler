import { resolver } from "blitz"
import db, { zodEnum } from "db"
import invariant from "tiny-invariant"
import { z } from "zod"

export const CreateRepeats = z.union([
  z.object({
    type: z.literal("DAILY"),
    days: z
      .array(z.number())
      .optional()
      .transform((): number[] => []),
  }),
  z.object({
    type: z.literal("WEEKLY"),
    // TODO: refine
    days: z.array(z.number()).refine((arr) => arr.every((x) => x >= 0 && x <= 6)), // 0 = Sunday
  }),
])

export const monthsEnum = z.enum([
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
])
export const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const

export const CreateCalendarDate = z.object({
  day: z.number().refine((x) => x >= 1 && x <= 31),
  month: monthsEnum,
  year: z.number().refine((x) => x >= 1900 && x <= 2100),
})

export const CreateEvent = z.object({
  courseId: z.number(),
  instructorIds: z.array(z.number()).min(1),

  allDay: z.boolean().optional(),

  tz: z.string().optional(),

  repeats: CreateRepeats.optional(),

  start: CreateCalendarDate.optional(),
  end: CreateCalendarDate.optional(),
})

export default resolver.pipe(
  resolver.zod(CreateEvent),
  resolver.authorize(),
  async ({ courseId, instructorIds = [], allDay = true, repeats, start }, ctx) => {
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

        start: start
          ? {
              create: {
                day: start.day,
                month: months.indexOf(start.month),
                year: start.year,
              },
            }
          : undefined,

        repeats: repeats
          ? {
              create: {
                type: repeats.type,
                days: repeats.days,
              },
            }
          : undefined,
      },
    })

    return event
  }
)
