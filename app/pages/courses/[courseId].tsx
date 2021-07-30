import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourse from "app/courses/queries/getCourse"
import deleteCourse from "app/courses/mutations/deleteCourse"

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

      <div>
        <h1>Course {course.id}</h1>
        <pre>{JSON.stringify(course, null, 2)}</pre>

        <Link href={Routes.EditCoursePage({ courseId: course.id })}>
          <a>Edit</a>
        </Link>

        <button
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
        </button>
      </div>
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
ShowCoursePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCoursePage
