import { RouteUrlObject, useRouter } from "blitz"

export const useIsActive = (route?: string | RouteUrlObject, exact = false) => {
  const router = useRouter()

  if (!route) {
    return false
  }
  if (typeof route === "string") {
    if (!exact) return router.pathname.startsWith(route)
    return router.pathname === route
  } else {
    if (!exact) return router.pathname.startsWith(route.pathname)
    return router.pathname === route.pathname
  }
}
