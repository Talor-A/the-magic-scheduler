import React from "react"
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import { DummyEvents } from "../events.dummy"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import { Box, chakra, Heading, Table } from "@chakra-ui/react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function Event({ event }) {
  return (
    <chakra.span>
      <chakra.strong>{event.title}</chakra.strong>
      {event.desc && ":  " + event.desc}
    </chakra.span>
  )
}

const RenderCalendar = () => (
  <>
    <Calendar
      events={DummyEvents}
      localizer={localizer}
      defaultDate={new Date(2015, 3, 1)}
      defaultView={Views.MONTH}
    />
    <style jsx global>{`
      .rbc-month-row {
        min-height: 120px;
      }
    `}</style>
  </>
)

export default RenderCalendar
