import { add } from "date-fns"
import db from "db"
import { getUserAttributes } from "test/factories"
import { getTestSession } from "test/utils"
import invariant from "tiny-invariant"
import createEvent from "./createEvent"

beforeAll(async () => {
  await db.$reset()
})

const setup = async () => {
  const admin = await db.user.create({
    data: {
      ...getUserAttributes(),
      memberships: {
        create: {
          role: "ADMIN",
          organization: {
            create: {
              name: "Test Organization",
              Course: {
                create: {
                  name: "Test Course",
                },
              },
            },
          },
        },
      },
    },
    include: {
      memberships: true,
    },
  })
  const course = await db.course.findFirst({
    where: {
      name: "Test Course",
      organizationId: admin.memberships[0]!.organizationId,
    },
  })
  invariant(course, "course should exist")
  return [course, admin] as const
}

const getEvent = async (id: number) => {
  const event = await db.event.findFirst({
    where: { id },
    include: {
      repeats: true,
    },
  })
  invariant(event, `event ${id} should exist`)
  return event
}

describe("createEvent", () => {
  test("admins can create an event", async () => {
    const [course, admin] = await setup()

    const event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        allDay: false,

        start: new Date(),
        end: add(new Date(), { hours: 1 }),
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )

    expect(event.courseId).toBe(course.id)
    expect(event.allDay).toBe(false)
  })

  test("can create an all day event", async () => {
    const [course, admin] = await setup()

    const event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        allDay: true,
        start: new Date(),
        end: add(new Date(), { days: 1 }),
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )
    expect(event.allDay).toBe(true)
  })

  it("should throw an error if no instructor is provided", async () => {
    const [course, admin] = await setup()

    await expect(
      createEvent(
        {
          courseId: course.id,
          instructorIds: [],
          start: new Date(),
          end: add(new Date(), { hours: 1 }),
        },
        getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
      )
    ).rejects.toThrow()
  })

  it("can create a daily reoccuring event", async () => {
    const [course, admin] = await setup()
    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        repeats: {
          type: "DAILY",

          // purposely invalid
          days: [1, 2, 3, 4, 5],
        },

        start: new Date(),
        end: add(new Date(), { hours: 1 }),
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )
    const event = await getEvent(_event.id)

    invariant(event.repeats, "event should have a repeats object")

    expect(event.repeats.type).toBe("DAILY")
    expect(event.repeats.days).toEqual([])
  })
  it("can create a weekly repeating event", async () => {
    const [course, admin] = await setup()

    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        allDay: true,
        repeats: {
          type: "WEEKLY",
          days: [1, 2, 3, 4, 5],
        },
        start: new Date(),
        end: add(new Date(), { days: 1 }),
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )
    const event = await getEvent(_event.id)
    invariant(event.repeats, "event should have a repeats object")

    expect(event.repeats.type).toBe("WEEKLY")
    expect(event.repeats.days).toEqual([1, 2, 3, 4, 5])
  })

  it("can create an event with a start, end date", async () => {
    const [course, admin] = await setup()

    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        start: new Date(2020, 7, 7),
        end: add(new Date(2020, 7, 7), { hours: 1 }),
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )
    const event = await getEvent(_event.id)

    expect(event.startsAt.toISOString()).toBe(new Date(2020, 7, 7).toISOString())

    expect(event.endsAt.toISOString()).toBe(add(new Date(2020, 7, 7), { hours: 1 }).toISOString())
  })
})
