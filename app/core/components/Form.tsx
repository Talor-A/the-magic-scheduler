import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { Button, chakra, ChakraProps, Stack, useColorModeValue } from "@chakra-ui/react"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  const bg = useColorModeValue("white", "gray.700")
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validateZodSchema(schema)}
      onSubmit={async (values, { setErrors }) => {
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

        if (FORM_ERROR) {
          setFormError(FORM_ERROR)
        }

        if (Object.keys(otherErrors).length > 0) {
          setErrors(otherErrors)
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <chakra.form onSubmit={handleSubmit} rounded={"lg"} bg={bg} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            {/* Form fields supplied as children are rendered here */}
            {children}

            {formError && (
              <div role="alert" style={{ color: "red" }}>
                {formError}
              </div>
            )}

            {submitText && (
              <Button type="submit" disabled={isSubmitting}>
                {submitText}
              </Button>
            )}
          </Stack>
        </chakra.form>
      )}
    </Formik>
  )
}

export default Form
