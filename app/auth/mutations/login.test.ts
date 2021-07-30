import db from "db"
import login, { authenticateUser } from "./login"
import seed from "db/seeds"
import invariant from "tiny-invariant"
import { getTestSession } from "test/utils"

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
})

describe("login", () => {
  it("should set orgId in session for user in an org", async () => {
    const initialUser = await db.user.findFirst({
      where: { email: "customer0@test.com" },
    })
    invariant(initialUser, "initial user not found")

    const session = getTestSession({
      user: initialUser,
    })

    const membership = await db.membership.findFirst({
      where: { userId: initialUser.id },
    })
    invariant(membership, "membership not found")

    const user = await login(
      {
        email: "customer0@test.com",
        password: "customer123",
      },
      session
    )

    expect(session.session.$create).toBeCalledWith({
      userId: user.id,
      roles: ["CUSTOMER", "OWNER"],
      orgId: membership.organizationId,
    })
  })
  it("should not set orgId in session for user not in an org", async () => {
    const initialUser = await db.user.findFirst({
      where: { email: "customer3@test.com" },
    })
    invariant(initialUser, "initial user not found")
    const session = getTestSession({
      user: initialUser,
    })
    const user = await login(
      {
        email: "customer3@test.com",
        password: "customer123",
      },
      session
    )
    expect(session.session.$create).toBeCalledWith({
      userId: user.id,
      roles: ["CUSTOMER"],
      orgId: null,
    })
  })
})
