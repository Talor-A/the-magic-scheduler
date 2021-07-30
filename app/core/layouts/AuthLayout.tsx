import { Flex, Stack, useColorModeValue } from "@chakra-ui/react"
import Layout, { LayoutProps } from "./Layout"

export default function AuthLayout({ children, ...props }: LayoutProps) {
  return (
    <Layout {...props}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} pb={12} pt={6} px={6}>
          {children}
        </Stack>
      </Flex>
    </Layout>
  )
}
