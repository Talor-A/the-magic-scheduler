import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import invariant from "tiny-invariant"
import getLoggedInUser from "app/users/queries/getLoggedInUser"

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
export const useLoggedInUser = () => {
  const [user] = useQuery(getLoggedInUser, null)
  invariant(user, "useLoggedInUser: No user found")
  return user
}
