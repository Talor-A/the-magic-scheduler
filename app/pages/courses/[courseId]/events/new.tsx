import {
  Link,
  useRouter,
  useMutation,
  BlitzPage,
  Routes,
  useParam,
  GetServerSideProps,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import createEvent from "app/events/mutations/createEvent"
import SidebarWithHeader from "app/core/components/Sidebar"

import { EventForm } from "app/events/components/EventForm"
import invariant from "tiny-invariant"
type Params = {
  courseId: string
}

const NewEventPage: BlitzPage<Params> = () => {
  const router = useRouter()

  const courseId = useParam("courseId", "number")

  invariant(courseId !== undefined, "courseId is required")

  const [createEventMutation] = useMutation(createEvent)

  return (
    <div>
      <h1>Create New Event</h1>

      <EventForm
        courseId={courseId}
        onSuccess={() =>
          router.push(
            Routes.ShowCoursePage({
              courseId,
            })
          )
        }
      />

      <p>
        <Link href={Routes.EventsPage()}>
          <a>Events</a>
        </Link>
      </p>
    </div>
  )
}

NewEventPage.authenticate = true
NewEventPage.getLayout = (page) => (
  <Layout>
    <SidebarWithHeader>{page}</SidebarWithHeader>
  </Layout>
)
NewEventPage.suppressFirstRenderFlicker = true

export default NewEventPage
