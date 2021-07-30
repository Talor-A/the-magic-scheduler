import { Suspense, Fragment } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourses from "app/courses/queries/getCourses"
import {
  ButtonGroup,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"

const ITEMS_PER_PAGE = 100

export const CoursesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ courses, hasMore }] = usePaginatedQuery(getCourses, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <div>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <Link href={Routes.ShowCoursePage({ courseId: course.id })}>
                <a>{course.name}</a>
              </Link>
            </li>
          ))}
        </ul>

        <button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </button>
        <button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </>
  )
}

const CoursesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Courses</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewCoursePage()}>
            <a>Create Course</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <CoursesList />
        </Suspense>
      </div>
    </>
  )
}

CoursesPage.authenticate = true
CoursesPage.getLayout = (page) => <Layout>{page}</Layout>

export default CoursesPage
