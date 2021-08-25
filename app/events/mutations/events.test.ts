import db from "db"
import { getUserAttributes } from "test/factories"
import { getTestSession } from "test/utils"
import invariant from "tiny-invariant"
import createEvent from "./createEvent"
import updateEvent from "./updateEvent"
import deleteEvent from "./updateEvent"

beforeAll(async () => {
  await db.$reset()
})

describe("createEvent", () => {
  test("admins can create an event", async () => {
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

    const event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        allDay: false,
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )

    expect(event.courseId).toBe(course.id)
    expect(event.allDay).toBe(false)
  })

  test("can create an all day event", async () => {
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
        organizationId: admin.memberships[0]!.organizationId,
      },
    })
    invariant(course, "course should exist")

    const event = await createEvent(
      {
        courseId: course.id,
        instructorIds: [admin.id],
        allDay: true,
      },
      getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
    )
    expect(event.allDay).toBe(true)
  })

  it("should throw an error if no instructor is provided", async () => {
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

    await expect(
      createEvent(
        {
          courseId: course.id,
          instructorIds: [],
        },
        getTestSession({ user: admin, orgId: admin.memberships[0]!.organizationId })
      )
    ).rejects.toThrow()
  })
})
