import * as yup from "yup"

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Please enter your email")
    .test(
      "is-lowercase",
      "Email must be in lowercase",
      (value) => value === value?.toLowerCase(),
    ),
  password: yup
    .string()
    .trim()
    .required("Please enter your password")
    .min(6, "Password must have at least 6 characters"),
})
