import { Suspense, Fragment } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourses from "app/courses/queries/getCourses"
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import { Header } from "app/core/components/Header"
import SidebarWithHeader from "app/core/components/Sidebar"

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
      <Box>
        <Table my={4} rounded="xl" border="1px" borderColor="gray.500" spacing={4} p={4}>
          {courses.map((course) => (
            <Tr key={course.id}>
              <Td>
                <Link href={Routes.ShowCoursePage({ courseId: course.id })}>
                  <a>{course.name}</a>
                </Link>
              </Td>
            </Tr>
          ))}
        </Table>

        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </Box>
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
            <Button as="a" colorScheme="green">
              Create Course
            </Button>
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
CoursesPage.getLayout = (page) => (
  <Layout>
    <SidebarWithHeader>{page}</SidebarWithHeader>
  </Layout>
)

export default CoursesPage
