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
        start: {
          month: "AUG",
          day: 7,
          year: 2020,
        },
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

    const event = events[0]!

    expect(event.id).toBe(_event.id)
  })

  it.todo("should include repeating events")

  it.todo("should exclude events that are not visible to the user")

  it.todo("should exclude events not on the given day")
})
