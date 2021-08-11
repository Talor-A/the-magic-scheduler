import { useQuery } from "blitz"
import getCurrentOrg from "app/organizations/queries/getCurrentOrg"

export const useCurrentOrg = () => {
  const [org] = useQuery(getCurrentOrg, null)

  return org
}
