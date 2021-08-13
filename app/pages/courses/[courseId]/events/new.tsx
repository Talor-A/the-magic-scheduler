import { Link, useRouter, useMutation, BlitzPage, Routes, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEvent from "app/events/mutations/createEvent"
import SidebarWithHeader from "app/core/components/Sidebar"

import { EventForm } from "app/events/components/EventForm"
import { Heading, Stack } from "@chakra-ui/react"

type Params = {
  courseId: string
}

const NewEventPage: BlitzPage<Params> = () => {
  const router = useRouter()

  const courseId = useParam("courseId", "number")!

  return (
    <Stack>
      <Heading>Create New Event</Heading>

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
    </Stack>
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
