import { Link, useRouter, useMutation, BlitzPage, Routes, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEvent from "app/events/mutations/createEvent"
import SidebarWithHeader from "app/core/components/Sidebar"

import { EventForm } from "app/events/components/EventForm"

type Params = {
  courseId: string
}

const NewEventPage: BlitzPage<Params> = () => {
  const router = useRouter()

  const courseId = useParam("courseId", "number")!

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
        <Link href={Routes.EventsPage({ courseId })}>
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
