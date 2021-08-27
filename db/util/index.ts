import { CalendarDate } from "@prisma/client"

export const parseCalendarDate = ({ day, month, year }: CalendarDate): Date => {
  return new Date(year, month, day)
}
