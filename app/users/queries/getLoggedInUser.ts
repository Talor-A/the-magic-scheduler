import { Ctx, resolver } from "blitz"
import db from "db"
import invariant from "tiny-invariant"

export default resolver.pipe(resolver.authorize(), async (_ = null, { session }) => {
  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })
  invariant(user, "User not found")

  return user
})
