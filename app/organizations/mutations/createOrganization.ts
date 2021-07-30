import getLoggedInUser from "app/users/queries/getLoggedInUser"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateOrganization = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateOrganization),
  resolver.authorize(),
  async ({ name }, ctx) => {
    const user = await getLoggedInUser(null, ctx)

    const organization = await db.organization.create({
      data: {
        name,
        membership: {
          create: {
            role: "OWNER",
            user: {
              connect: {
                id: ctx.session.userId,
              },
            },
          },
        },
      },
    })

    await ctx.session.$create({
      userId: ctx.session.userId,
      roles: [user.role, "OWNER"],
      orgId: organization.id,
    })

    return organization
  }
)
