import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, name }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      role: "CUSTOMER",
      email,
      name,
      hashedPassword,
    },
    include: {
      memberships: true,
    },
  })

  const roles = user.memberships[0]?.role ? [user.role, user.memberships[0].role] : [user.role]

  await ctx.session.$create({
    userId: user.id,
    roles,
    orgId: user.memberships[0]?.organizationId ?? null,
  })

  return user
})
