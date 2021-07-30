import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCoursesInput
  extends Pick<Prisma.CourseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCoursesInput, ctx) => {
    const currentOrgWhere: Prisma.CourseFindManyArgs["where"] = {
      organizationId: ctx.session.orgId,
    }

    const {
      items: courses,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.course.count({ where: { ...where, ...currentOrgWhere } }),
      query: (paginateArgs) =>
        db.course.findMany({
          ...paginateArgs,
          where: {
            ...where,
            ...currentOrgWhere,
          },

          orderBy,
        }),
    })

    return {
      courses,
      nextPage,
      hasMore,
      count,
    }
  }
)
