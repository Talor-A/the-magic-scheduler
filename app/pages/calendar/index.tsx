import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import RenderCalendar from "app/events/components/Calendar"
import SidebarWithHeader from "app/core/components/Sidebar"

const CalendarPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Calendar</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <RenderCalendar />
      </Suspense>
    </>
  )
}

CalendarPage.authenticate = true
CalendarPage.getLayout = (page) => (
  <Layout>
    <SidebarWithHeader>{page}</SidebarWithHeader>
  </Layout>
)

export default CalendarPage
