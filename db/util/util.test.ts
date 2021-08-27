import { parseCalendarDate } from "./index"
import { CalendarDate } from "@prisma/client"

describe("parseCalendarDate", () => {
  it("should parse a CalendarDate object into a Date object", () => {
    const date: CalendarDate = {
      year: 2020,
      month: 7,
      day: 7,
      eventEndId: -1,
      eventStartId: -1,
      id: -1,
    }
    const expectedDate = new Date(2020, 7, 7)
    expect(parseCalendarDate(date)).toEqual(expectedDate)
  })
})
