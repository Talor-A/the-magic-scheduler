import db from "db"
import login, { authenticateUser } from "./login"
import seed from "db/seeds"
import invariant from "tiny-invariant"
import { getTestSession } from "test/utils"
import { AuthenticationError } from "blitz"

beforeAll(async () => {
  await seed()
})

describe("authenticateUser", () => {
  it("should return a user", async () => {
    const user = await authenticateUser("customer3@test.com", "customer123")

    expect(user).toBeDefined()
    expect(user.email).toBe("customer3@test.com")
    expect(user.role).toBe("CUSTOMER")
  })

  it("should throw if user is not found", async () => {
    const initialUser = await db.user.findFirst({
      where: { email: "customer0@test.com" },
    })
    invariant(initialUser, "initial user not found")

    expect(() => authenticateUser("notfounduser@test.com", "customer123")).rejects.toThrow(
      AuthenticationError
    )
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
