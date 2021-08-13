import { SessionContext } from "blitz"
import db, { Session } from "db"
import { getUserAttributes } from "test/factories"
import { getTestSession } from "test/utils"
import inviteUser from "./inviteUser"

beforeAll(async () => {
  await db.$reset()
})

describe("Mutation: inviteUser", () => {
  it("creates a new invitation", async () => {
    const inviter = await db.user.create({
      data: {
        ...getUserAttributes(),
        memberships: {
          create: {
            role: "ADMIN",
            organization: {
              create: {
                name: "Test Organization",
              },
            },
          },
        },
      },
      include: {
        memberships: true,
      },
    })

    const orgId = inviter.memberships?.[0]?.organizationId

    expect(orgId).toBeDefined()

    await inviteUser(
      {
        asRole: "USER",
        invitedUserEmail: "inviteduseremail@test.com",
        invitedUserName: "Invited User",
      },
      getTestSession({ user: inviter, orgId })
    )

    const invitation = await db.membership.findFirst({
      where: {
        invitedEmail: "inviteduseremail@test.com",
      },
    })

    expect(invitation).toBeDefined()

    expect(invitation?.organizationId).toBeDefined()
    expect(invitation?.organizationId).toBe(orgId)
  })

  it("throws an error if the user is not in any organization", async () => {
    const inviter = await db.user.create({
      data: {
        ...getUserAttributes(),
        memberships: {
          create: {
            role: "ADMIN",
            organization: {
              create: {
                name: "Test Organization",
              },
            },
          },
        },
      },
      include: {
        memberships: true,
      },
    })

    expect(async () =>
      inviteUser(
        {
          asRole: "USER",
          invitedUserEmail: "inviteduseremail@test.com",
          invitedUserName: "Invited User",
        },
        getTestSession({ user: inviter })
      )
    ).rejects.toThrow("User is not logged into any organization")
  })

  it("throws an error if the user is not an admin", async () => {
    const inviter = await db.user.create({
      data: {
        ...getUserAttributes(),
        memberships: {
          create: {
            role: "USER",
            organization: {
              create: {
                name: "Test Organization",
              },
            },
          },
        },
      },
      include: {
        memberships: true,
      },
    })

    const orgId = inviter.memberships?.[0]?.organizationId
    expect(orgId).toBeDefined()

    expect(async () =>
      inviteUser(
        {
          asRole: "USER",
          invitedUserEmail: "testinviteduser@test.com",
          invitedUserName: "Invited User",
        },
        getTestSession({ user: inviter, orgId })
      )
    ).rejects.toThrow("user must be admin or owner")
  })
})
