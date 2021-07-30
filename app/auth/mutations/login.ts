import { resolver, SecurePassword, AuthenticationError, PublicData } from "blitz"
import db from "db"
import { Login } from "../validations"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.toLowerCase().trim()
  const password = rawPassword.trim()
  const user = await db.user.findFirst({
    where: { email },
  })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  const memberships = await db.membership.findMany({
    where: { userId: user.id },
  })

  const roles = memberships[0]?.role ? [user.role, memberships[0].role] : [user.role]

  const data: PublicData = {
    userId: user.id,
    roles,
    orgId: memberships[0]?.organizationId ?? null,
  }
  console.log(data)
  await ctx.session.$create(data)

  return user
})
