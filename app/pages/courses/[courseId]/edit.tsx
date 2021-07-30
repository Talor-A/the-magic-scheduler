import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCourse from "app/courses/queries/getCourse"
import updateCourse from "app/courses/mutations/updateCourse"
import { CourseForm, FORM_ERROR } from "app/courses/components/CourseForm"

export const EditCourse = () => {
  const router = useRouter()
  const courseId = useParam("courseId", "number")
  const [course, { setQueryData }] = useQuery(
    getCourse,
    { id: courseId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateCourseMutation] = useMutation(updateCourse)

  return (
    <>
      <Head>
        <title>Edit Course {course.id}</title>
      </Head>

      <div>
        <h1>Edit Course {course.id}</h1>
        <pre>{JSON.stringify(course)}</pre>

        <CourseForm
          submitText="Update Course"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateCourse}
          initialValues={course}
          onSubmit={async (values) => {
            try {
              const updated = await updateCourseMutation({
                id: course.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowCoursePage({ courseId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditCoursePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditCourse />
      </Suspense>

      <p>
        <Link href={Routes.CoursesPage()}>
          <a>Courses</a>
        </Link>
      </p>
    </div>
  )
}

EditCoursePage.authenticate = true
EditCoursePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditCoursePage
