import { useMutation, useQuery } from "blitz"
import { LabeledTextField } from "app/core/components/form/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/form/Form"
import createEvent, { CreateEvent } from "app/events/mutations/createEvent"
import LabeledSelectField from "app/core/components/form/LabeledSelectField"
import getTeam from "app/organizations/queries/getTeam"
import { Field } from "formik"
import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react"

type EventFormProps = {
  onSuccess?: () => void
  courseId: number
}

export const EventForm = ({ courseId, ...props }: EventFormProps) => {
  const [signupMutation] = useMutation(createEvent)

  const [instructors] = useQuery(getTeam, null)

  return (
    <div>
      <Form
        submitText="Create Event"
        schema={CreateEvent}
        initialValues={{ courseId, instructorIds: [], allDay: true }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledSelectField multiple name="instructorIds" label="Instructor">
          <option value="">Select an instructor</option>
          {instructors.map((instructor) => (
            <option value={instructor.id} key={instructor.id}>
              {`${instructor.user.name}${instructor.user.pending ? " (pending)" : ""}`}
            </option>
          ))}
        </LabeledSelectField>
        <Field
          name="allDay"
          render={({ field: { value, ...field } }) => (
            <Checkbox isChecked={value} {...field}>
              All Day Event
            </Checkbox>
          )}
        />
      </Form>
    </div>
  )
}

export default EventForm
