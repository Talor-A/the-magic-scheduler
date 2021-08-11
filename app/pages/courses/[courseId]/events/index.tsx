import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvents from "app/events/queries/getEvents"

const ITEMS_PER_PAGE = 100

export const EventsList = () => {
  const router = useRouter()
  const courseId = useParam("courseId", "number")!

  const page = Number(router.query.page) || 0
  const [{ events, hasMore }] = usePaginatedQuery(getEvents, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link href={Routes.ShowEventPage({ eventId: event.id, courseId })}>
              <a>id: {event.id}</a>
            </Link>
            {JSON.stringify(event)}
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const EventsPage: BlitzPage = () => {
  const courseId = useParam("courseId", "number")!

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewEventPage({ courseId })}>
            <a>Create Event</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <EventsList />
        </Suspense>
      </div>
    </>
  )
}

EventsPage.authenticate = true
EventsPage.getLayout = (page) => <Layout>{page}</Layout>
EventsPage.suppressFirstRenderFlicker = true

export default EventsPage
