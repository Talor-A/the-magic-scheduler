import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import invariant from "tiny-invariant"

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
export const useLoggedInUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  invariant(user, "useLoggedInUser: No user found")
  return user
}
