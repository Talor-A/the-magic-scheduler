import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourse from "app/courses/queries/getCourse"
import deleteCourse from "app/courses/mutations/deleteCourse"
import SidebarWithHeader from "app/core/components/Sidebar"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"

export const Course = () => {
  const router = useRouter()
  const courseId = useParam("courseId", "number")
  const [deleteCourseMutation] = useMutation(deleteCourse)
  const [course] = useQuery(getCourse, { id: courseId })

  return (
    <>
      <Head>
        <title>Course {course.id}</title>
      </Head>

      <Box>
        <HStack>
          <Heading flex={1}>{course.name}</Heading>
          <Link href={Routes.EditCoursePage({ courseId: course.id })}>Edit</Link>
          <Button
            colorScheme="red"
            type="button"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteCourseMutation({ id: course.id })
                router.push(Routes.CoursesPage())
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Delete
          </Button>
        </HStack>

        <Link passHref href={Routes.NewEventPage()}>
          <Button as="a" colorScheme="green">
            Schedule
          </Button>
        </Link>
      </Box>
    </>
  )
}

const ShowCoursePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CoursesPage()}>
          <a>Courses</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Course />
      </Suspense>
    </div>
  )
}

ShowCoursePage.authenticate = true
ShowCoursePage.getLayout = (page) => (
  <Layout>
    <SidebarWithHeader>{page}</SidebarWithHeader>
  </Layout>
)

export default ShowCoursePage
