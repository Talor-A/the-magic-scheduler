import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import invariant from "tiny-invariant"
export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, organizationName }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: {
        role: "CUSTOMER",
        email,
        hashedPassword,
        memberships: {
          create: {
            role: "OWNER",
            organization: {
              create: {
                name: organizationName,
              },
            },
          },
        },
      },
      include: {
        memberships: true,
      },
    })

    invariant(user.memberships[0] !== undefined, "user.memberships[0] is undefined")

    await ctx.session.$create({
      userId: user.id,
      roles: [user.role, user.memberships[0].role],
      orgId: user.memberships[0].organizationId,
    })
    return user
  }
)
