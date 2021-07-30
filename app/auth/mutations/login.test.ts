import db from "db"
import { authenticateUser } from "./login"
import seed from "db/seeds"
import invariant from "tiny-invariant"

beforeAll(async () => {
  await seed()
})

test("invariant", () => {
  invariant(true, "test")
  expect(() => invariant(false, "test")).toThrow("test")
})

describe("authenticateUser", () => {
  it("should return a user", async () => {
    const user = await authenticateUser("customer3@test.com", "customer123")

    expect(user).toBeDefined()
    expect(user.email).toBe("customer3@test.com")
    expect(user.role).toBe("CUSTOMER")
  })

  it("should return user memberships if they exist", async () => {
    const user = await authenticateUser("customer0@test.com", "customer123")

    invariant(user.memberships[0], "user.memberships should exist")

    expect(user.memberships[0].role).toBe("OWNER")
    expect(user.memberships[0].userId).toBe(user.id)
  })

  it("should not return memberships the user has not accepted", async () => {
    const user = await authenticateUser("customer1@test.com", "customer123")

    expect(user.memberships).toHaveLength(0)

    const invite = await db.membership.findFirst({
      where: {
        invitedEmail: user.email,
      },
    })
    invariant(invite, "invite should exist")
  })
})
