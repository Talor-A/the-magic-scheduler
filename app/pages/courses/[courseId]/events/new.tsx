import { Link, useRouter, useMutation, BlitzPage, Routes, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEvent from "app/events/mutations/createEvent"
import { EventForm } from "app/events/components/EventForm"
import invariant from "tiny-invariant"

const NewEventPage: BlitzPage = () => {
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
NewEventPage.getLayout = (page) => <Layout title={"Create New Event"}>{page}</Layout>

export default NewEventPage
