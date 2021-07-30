import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

import { Input } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { FormErrorMessage } from "@chakra-ui/react"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <FormControl {...outerProps}>
        <FormLabel>
          {label}
          <Input {...input} disabled={isSubmitting} {...props} ref={ref} />
        </FormLabel>
        <ErrorMessage name={name}>
          {(msg) => <FormErrorMessage>{msg}</FormErrorMessage>}
        </ErrorMessage>
      </FormControl>
    )
  }
)

export default LabeledTextField
