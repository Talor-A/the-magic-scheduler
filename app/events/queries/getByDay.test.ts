import { add, nextMonday, sub } from "date-fns"
import db from "db"
import { getUserAttributes } from "test/factories"
import { getTestSession } from "test/utils"
import invariant from "tiny-invariant"
import createEvent from "../mutations/createEvent"
import getByDay from "./getByDay.q"

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
  return [course, admin, admin.memberships[0]!.organizationId] as const
}

describe("basic functionality", () => {
  it("should return a list of events on the given day", async () => {
    const [course, admin, orgId] = await setup()
    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        start: new Date(2020, 7, 7),
        end: add(new Date(2020, 7, 7), { hours: 1 }),
      },
      getTestSession({ user: admin, orgId })
    )

    const events = await getByDay(
      {
        date: new Date(2020, 7, 7),
      },
      getTestSession({ user: admin, orgId })
    )

    expect(events).toHaveLength(1)

    expect(events[0]!.id).toBe(_event.id)
  })
})
describe("when the events are repeating", () => {
  describe("every day", () => {
    it("should include daily repeating events", async () => {
      const [course, admin, orgId] = await setup()
      const _event = await createEvent(
        {
          courseId: course.id,
          instructorIds: [admin.id],
          start: new Date(2020, 7, 7),
          end: add(new Date(2020, 7, 7), { hours: 1 }),
          repeats: {
            type: "DAILY",
            days: [],
            until: add(new Date(2020, 7, 7), { days: 7 }),
          },
        },
        getTestSession({ user: admin, orgId })
      )

      const events = await getByDay(
        {
          date: new Date(2020, 7, 10),
        },
        getTestSession({ user: admin, orgId })
      )

      expect(events.find((e) => e.id === _event.id)).toBeDefined()
    })
  })

  it.todo("should handle events without an end date")

  it("should include weekly repeating events", async () => {
    const [course, admin, orgId] = await setup()
    // friday
    const start = new Date(2020, 7, 7, 10, 0, 0)
    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        start,
        end: add(start, { hours: 1 }),
        repeats: {
          type: "WEEKLY",
          // repeats on mon, tues, wed, thurs, fri
          days: [1, 2, 3, 4, 5],
          until: add(new Date(2020, 7, 7), { days: 30 }),
        },
      },
      getTestSession({ user: admin, orgId })
    )

    expect(
      await getByDay(
        {
          date: new Date(2020, 7, 7),
        },
        getTestSession({ user: admin, orgId })
      )
    ).toHaveLength(1)

    // should find matching event on monday
    expect(
      (
        await getByDay(
          {
            // monday
            date: nextMonday(start),
          },
          getTestSession({ user: admin, orgId })
        )
      )[0]!.id
    ).toBe(_event.id)

    // should not find matching event on saturday
    expect(
      (
        await getByDay(
          {
            // saturday
            date: new Date(2020, 7, 8),
          },
          getTestSession({ user: admin, orgId })
        )
      )[0]
    ).toBeUndefined()

    expect(
      (
        await getByDay(
          {
            date: sub(new Date(2020, 7, 7), { days: 1 }),
          },
          getTestSession({ user: admin, orgId })
        )
      )[0]
    ).toBe(undefined)
  })
})
