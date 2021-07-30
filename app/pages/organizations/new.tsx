import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createOrganization, {
  CreateOrganization,
} from "app/organizations/mutations/createOrganization"
import { OrganizationForm, FORM_ERROR } from "app/organizations/components/OrganizationForm"

const NewOrganizationPage: BlitzPage = () => {
  const router = useRouter()
  const [createOrganizationMutation] = useMutation(createOrganization)

  return (
    <div>
      <h1>Create New Organization</h1>

      <OrganizationForm
        submitText="Create Organization"
        schema={CreateOrganization}
        initialValues={{
          name: "",
        }}
        onSubmit={async (values) => {
          try {
            const organization = await createOrganizationMutation(values)
            router.push(Routes.Dashboard())
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  )
}

NewOrganizationPage.authenticate = true
NewOrganizationPage.getLayout = (page) => <Layout title={"Create New Organization"}>{page}</Layout>

export default NewOrganizationPage
