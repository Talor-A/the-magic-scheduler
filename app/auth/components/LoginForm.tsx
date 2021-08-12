import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/form/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/form/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Link as ChakraLink } from "@chakra-ui/react"

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <div>
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values)
            onSuccess?.()
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <Link passHref href={Routes.ForgotPasswordPage()}>
          <ChakraLink color={"blue.400"}>Forgot password?</ChakraLink>
        </Link>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or{" "}
        <Link passHref href={Routes.SignupPage()}>
          <ChakraLink color={"blue.400"}>Sign Up</ChakraLink>
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
