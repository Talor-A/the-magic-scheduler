import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCoursesInput
  extends Pick<Prisma.CourseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCoursesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: courses,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.course.count({ where }),
      query: (paginateArgs) => db.course.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      courses,
      nextPage,
      hasMore,
      count,
    }
  }
)
