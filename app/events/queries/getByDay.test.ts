import db from "db"
import { getUserAttributes } from "test/factories"
import invariant from "tiny-invariant"
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
  return [course, admin] as const
}

describe("getByDay", () => {
  it.todo("should return a list of events on the given day")

  it.todo("should exclude events that are not visible to the user")

  it.todo("should exclude events not on the given day")
})
