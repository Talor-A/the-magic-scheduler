import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

import { Select, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react"

export interface LabeledSelectFieldProps extends ComponentPropsWithoutRef<typeof Select> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** multi-select */
  multiple?: boolean

  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ name, label, outerProps, multiple = false, ...props }, ref) => {
    const [input] = useField({
      name,
      multiple,
    })
    const { isSubmitting } = useFormikContext()

    return (
      <FormControl {...outerProps}>
        <FormLabel>
          {label}
          <Select {...input} disabled={isSubmitting} {...props} ref={ref} />
        </FormLabel>
        <ErrorMessage name={name}>
          {(msg) => <FormErrorMessage>{msg}</FormErrorMessage>}
        </ErrorMessage>
      </FormControl>
    )
  }
)

export default LabeledSelectField
