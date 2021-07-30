import { ReactNode } from "react"
import { Head } from "blitz"
import { useColorModeValue, Box } from "@chakra-ui/react"

export type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "the-magic-scheduler"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        {children}
      </Box>
    </>
  )
}

export default Layout
