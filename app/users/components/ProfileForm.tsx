import { invalidateQuery, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import changeMyName from "app/users/mutations/changeMyName"
import { UpdateProfile } from "app/auth/validations"
import { useLoggedInUser } from "app/core/hooks/useCurrentUser"
import getCurrentUser from "../queries/getCurrentUser"

type ProfileFormProps = {
  onSuccess?: () => void
}

export const ProfileForm = (props: ProfileFormProps) => {
  const user = useLoggedInUser()
  const [changeName] = useMutation(changeMyName)

  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={UpdateProfile}
        initialValues={{ name: user.name ?? "" }}
        onSubmit={async (values) => {
          try {
            await changeName(values)
            await invalidateQuery(getCurrentUser)
            props.onSuccess?.()
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Your Name" />
      </Form>
    </div>
  )
}

export default ProfileForm
