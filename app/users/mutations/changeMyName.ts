import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateMyName = z.object({
  name: z.string(),
})
export default resolver.pipe(
  resolver.zod(UpdateMyName),
  resolver.authorize(),
  async ({ name }, ctx) => {
    await db.user.update({
      where: {
        id: ctx.session.userId,
      },
      data: {
        name,
      },
    })
  }
)
