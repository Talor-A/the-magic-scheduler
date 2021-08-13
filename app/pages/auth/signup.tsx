import { useRouter, BlitzPage, Routes } from "blitz"
import { SignupForm } from "app/auth/components/SignupForm"
import AuthLayout from "app/core/layouts/AuthLayout"
import { Stack, Link, Heading, Text } from "@chakra-ui/react"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Stack align={"center"} pb={10}>
        <Heading fontSize={"4xl"}>Welcome!</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          {"We're glad to have you 😄"}
        </Text>
      </Stack>

      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <AuthLayout title="Sign Up">{page}</AuthLayout>

export default SignupPage
