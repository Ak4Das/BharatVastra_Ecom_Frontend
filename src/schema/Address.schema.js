import * as Yup from "yup"

export const addressValidationSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  fullName: Yup.string()
    .trim()
    .matches(
      /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/,
      "Each word must start with a capital letter and contain only letters and only one space allowed btw words no space is allowed in the beginning and end of name",
    )
    .required("Full name is required"),
  mobNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
  pinCode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code")
    .required("Pincode is required"),
  localInfo: Yup.string()
    .trim()
    .min(3, "Flat/House/Building info is required")
    .required("Local address details are required"),
  area: Yup.string()
    .trim()
    .min(3, "Area/Street details are required")
    .required("Area details are required"),
  city: Yup.string()
    .trim()
    .min(2, "City name is required")
    .required("Town/City is required"),
  state: Yup.string()
    .trim()
    .min(2, "State name is required")
    .required("State is required"),
})
