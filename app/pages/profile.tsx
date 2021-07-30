import { useLoggedInUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useMutation } from "blitz"
import changeMyName from "app/users/mutations/changeMyName"
import ProfileForm from "app/users/components/ProfileForm"
import { Suspense } from "react"

const Profile: BlitzPage = () => {
  return (
    <Suspense fallback="loading...">
      <ProfileForm />
    </Suspense>
  )
}

Profile.suppressFirstRenderFlicker = true
Profile.getLayout = (page) => <Layout title="Profile">{page}</Layout>
Profile.authenticate = {
  redirectTo: "/login",
}

export default Profile
