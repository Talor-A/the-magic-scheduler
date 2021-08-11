import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"

export const Event = () => {
  const router = useRouter()
  const eventId = useParam("eventId", "number")!
  const courseId = useParam("courseId", "number")!
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [event] = useQuery(getEvent, { id: eventId })

  return (
    <>
      <Head>
        <title>Event {event.id}</title>
      </Head>

      <div>
        <h1>Event {event.id}</h1>
        <pre>{JSON.stringify(event, null, 2)}</pre>
        {/*
        <Link href={Routes.EditEventPage({ eventId: event.id })}>
          <a>Edit</a>
        </Link> */}

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteEventMutation({ id: event.id })
              router.push(Routes.ShowCoursePage({ courseId }))
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

const ShowEventPage: BlitzPage = () => {
  const courseId = useParam("courseId", "number")!

  return (
    <div>
      <p>
        <Link href={Routes.ShowCoursePage({ courseId })}>
          <a>Events</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Event />
      </Suspense>
    </div>
  )
}

ShowEventPage.authenticate = true
ShowEventPage.getLayout = (page) => <Layout>{page}</Layout>
ShowEventPage.suppressFirstRenderFlicker = true

export default ShowEventPage
