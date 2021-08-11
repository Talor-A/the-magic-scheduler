import { RouteUrlObject, useRouter } from "blitz"

export const useIsActive = (route?: string | RouteUrlObject) => {
  const router = useRouter()

  if (!route) {
    return false
  }
  if (typeof route === "string") {
    return router.pathname === route
  } else return router.pathname === route.pathname
}
