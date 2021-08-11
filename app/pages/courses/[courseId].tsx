import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  GetServerSideProps,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourse from "app/courses/queries/getCourse"
import deleteCourse from "app/courses/mutations/deleteCourse"
import SidebarWithHeader from "app/core/components/Sidebar"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"

export interface CourseProps {
  courseId: number
}
export const Course = (props: CourseProps) => {
  const router = useRouter()
  const courseId = useParam("courseId", "number") || props.courseId
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

        <Link
          passHref
          href={Routes.NewEventPage({
            courseId,
          })}
        >
          <Button as="a" colorScheme="green">
            Schedule
          </Button>
        </Link>
      </Box>
    </>
  )
}

const ShowCoursePage: BlitzPage<CourseProps> = (props) => {
  return (
    <div>
      <p>
        <Link href={Routes.CoursesPage()}>
          <a>Courses</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Course {...props} />
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
// next.js server side function to parse params.courseId from undefined,string,or array safely
// and return it as a number
export const getServerSideProps: GetServerSideProps<CourseProps> = async ({ params, req, res }) => {
  if (!params || typeof params.courseId !== "string")
    return {
      redirect: {
        destination: Routes.CoursesPage().pathname,
        permanent: true,
      },
    }
  const courseId = parseInt(params.courseId, 10)

  if (!Number.isSafeInteger(courseId))
    return {
      redirect: {
        destination: Routes.CoursesPage().pathname,
        permanent: true,
      },
    }

  return {
    props: {
      courseId,
    },
  }
}

export default ShowCoursePage
