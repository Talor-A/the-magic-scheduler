import { add } from "date-fns"
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

describe("getByDay", () => {
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

  // TODO: get to green
  it.skip("should include repeating events", async () => {
    const [course, admin, orgId] = await setup()
    const _event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        start: new Date(2020, 7, 7),
        end: add(new Date(2020, 7, 7), { hours: 1 }),
        repeats: {
          type: "WEEKLY",
          days: [1, 2, 3, 4, 5],
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

  it.todo("should exclude events that are not visible to the user")

  it.todo("should exclude events not on the given day")
})
