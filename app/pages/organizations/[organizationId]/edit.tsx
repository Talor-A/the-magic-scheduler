import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrganization from "app/organizations/queries/getOrganization"
import updateOrganization from "app/organizations/mutations/updateOrganization"
import { OrganizationForm, FORM_ERROR } from "app/organizations/components/OrganizationForm"

export const EditOrganization = () => {
  const router = useRouter()
  const organizationId = useParam("organizationId", "number")
  const [organization, { setQueryData }] = useQuery(
    getOrganization,
    { id: organizationId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateOrganizationMutation] = useMutation(updateOrganization)

  return (
    <>
      {/* <Head>
        <title>Edit Organization {organization.id}</title>
      </Head>

      <div>
        <h1>Edit Organization {organization.id}</h1>
        <pre>{JSON.stringify(organization)}</pre>

        <OrganizationForm
          submitText="Update Organization"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateOrganization}
          initialValues={organization}
          onSubmit={async (values) => {
            try {
              const updated = await updateOrganizationMutation({
                id: organization.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowOrganizationPage({ organizationId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div> */}
    </>
  )
}

const EditOrganizationPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditOrganization />
      </Suspense>

      <p>
        <Link passHref href={Routes.Dashboard()}>
          <a>Dashboard</a>
        </Link>
      </p>
    </div>
  )
}

EditOrganizationPage.authenticate = true
EditOrganizationPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditOrganizationPage
