import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useFormik } from "formik"
import { updateAddressOfUser } from "../services/FetchRequests"
import GetUser from "../services/GetClothsData"
import Error from "../components/Error"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { addressValidationSchema } from "../schema/Address.schema"

export default function AddAddressForm() {
  const [isError, setIsError] = useState("")
  const id = Number(useParams().id)
  const navigate = useNavigate()

  const { user, setUser } = GetUser()

  const address = Object.keys(user).length
    ? user.address.find((add) => add.id === id)
    : null

  const initialValues = {
    country: "India",
    fullName: address?.fullName || "",
    mobNo: address?.mobNo || "",
    pinCode: address?.pinCode || "",
    localInfo: address?.localInfo || "",
    area: address?.area || "",
    city: address?.city || "",
    state: address?.state || "",
  }

  function generateUniqueNumber() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return Number(`${timestamp}${random.toString().padStart(3, "0")}`)
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addressValidationSchema,
    onSubmit: async (values) => {
      try {
        const Address = {
          ...values,
          selected: address?.selected || false,
          id: address ? id : generateUniqueNumber(),
        }

        let updatedAddresses = [...user.address]
        if (address) {
          const finalAddresses = updatedAddresses.filter((add) => add.id !== id)
          finalAddresses.push(Address)
          updatedAddresses = finalAddresses
        } else {
          updatedAddresses.push(Address)
        }

        await updateAddressOfUser({
          addresses: updatedAddresses,
          setIsError,
          navigate,
        })

        if (setUser) {
          setUser({ ...user, address: updatedAddresses })
        }

        navigate("/userAddress/user")
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    },
  })

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
  } = formik

  if (isError) {
    return <Error />
  }

  if (!Object.keys(user).length) {
    return null
  }

  return (
    <>
      <Header
        position="static"
        top="auto"
        zIndex="auto"
        isSearchBarNeeded={false}
        userDetails={user}
      />
      <main className="container my-5">
        <h2>{address ? "Edit address" : "Add a new address"}</h2>
        <form onSubmit={handleSubmit} id="addAddressForm" className="mt-3">
          {/* Country Field */}
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country/Region
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value="India"
              className={`form-control`}
              style={{ cursor: "not-allowed" }}
              readOnly
            />
          </div>

          {/* Full Name Field */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full name (First and Last name)
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={values.fullName}
              className={`form-control ${
                touched.fullName && errors.fullName ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.fullName && errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>

          {/* Mobile Number Field */}
          <div className="mb-3">
            <label htmlFor="mobNo" className="form-label">
              Mobile number
            </label>
            <input
              id="mobNo"
              name="mobNo"
              type="text"
              value={values.mobNo}
              className={`form-control ${
                touched.mobNo && errors.mobNo ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.mobNo && errors.mobNo && (
              <div className="invalid-feedback">{errors.mobNo}</div>
            )}
          </div>

          {/* Pincode Field */}
          <div className="mb-3">
            <label htmlFor="pinCode" className="form-label">
              Pincode
            </label>
            <input
              id="pinCode"
              name="pinCode"
              type="text"
              value={values.pinCode}
              className={`form-control ${
                touched.pinCode && errors.pinCode ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.pinCode && errors.pinCode && (
              <div className="invalid-feedback">{errors.pinCode}</div>
            )}
          </div>

          {/* Flat / Local Info Field */}
          <div className="mb-3">
            <label htmlFor="localInfo" className="form-label">
              Flat, House no., Building, Company, Apartment
            </label>
            <input
              id="localInfo"
              name="localInfo"
              type="text"
              value={values.localInfo}
              className={`form-control ${
                touched.localInfo && errors.localInfo ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.localInfo && errors.localInfo && (
              <div className="invalid-feedback">{errors.localInfo}</div>
            )}
          </div>

          {/* Area Field */}
          <div className="mb-3">
            <label htmlFor="area" className="form-label">
              Area, Street, Sector, Village
            </label>
            <input
              id="area"
              name="area"
              type="text"
              value={values.area}
              className={`form-control ${
                touched.area && errors.area ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.area && errors.area && (
              <div className="invalid-feedback">{errors.area}</div>
            )}
          </div>

          {/* Town/City Field */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              Town/City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={values.city}
              className={`form-control ${
                touched.city && errors.city ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.city && errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>

          {/* State Field */}
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={values.state}
              className={`form-control ${
                touched.state && errors.state ? "is-invalid" : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.state && errors.state && (
              <div className="invalid-feedback">{errors.state}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-warning rounded-pill mt-3"
            type="submit"
            disabled={isSubmitting}
          >
            {address ? "Edit Address" : "Add Address"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
