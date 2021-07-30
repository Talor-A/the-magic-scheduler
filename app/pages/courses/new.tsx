import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createCourse from "app/courses/mutations/createCourse"
import { CourseForm, FORM_ERROR } from "app/courses/components/CourseForm"

const NewCoursePage: BlitzPage = () => {
  const router = useRouter()
  const [createCourseMutation] = useMutation(createCourse)

  return (
    <div>
      <h1>Create New Course</h1>

      <CourseForm
        submitText="Create Course"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateCourse}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const course = await createCourseMutation(values)
            router.push(Routes.ShowCoursePage({ courseId: course.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.CoursesPage()}>
          <a>Courses</a>
        </Link>
      </p>
    </div>
  )
}

NewCoursePage.authenticate = true
NewCoursePage.getLayout = (page) => <Layout title={"Create New Course"}>{page}</Layout>

export default NewCoursePage
