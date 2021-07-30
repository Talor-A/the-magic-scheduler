import { useRouter, BlitzPage } from "blitz"
import AuthLayout from "app/core/layouts/AuthLayout"
import { LoginForm } from "app/auth/components/LoginForm"
import { Stack, Link, Heading, Text } from "@chakra-ui/react"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Stack align={"center"} pb={10}>
        <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
        </Text>
      </Stack>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <AuthLayout title="Log In">{page}</AuthLayout>

export default LoginPage
