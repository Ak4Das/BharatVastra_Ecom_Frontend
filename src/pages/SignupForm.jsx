import styles from "../style_modules/pages_modules/Signup.module.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { SignupFormSchema } from "../schema/Signup.schema"
import { signup } from "../services/FetchRequests"
import Error from "../components/Error"

export default function SignupForm() {
  const [isError, setIsError] = useState("")
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: SignupFormSchema,
    onSubmit: async (values) => {
      try {
        const user = {
          name: values.name,
          email: values.email,
          password: values.password,
          profileImage: "",
          address: [],
          addToCartItems: [],
          addToWishlistItems: [],
        }

        const newUser = await signup({
          newUser: user,
          setIsError,
          navigate,
        })

        localStorage.setItem("bv_token", newUser.token)

        navigate("/userAddress")
        window.location.reload()
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    },
  })

  if (isError) {
    return <Error />
  }

  return (
    <main
      className={`d-flex align-items-center justify-content-center ${styles.card_container}`}
    >
      <div
        className={`card ${styles.signupForm}`}
        style={{
          width: "50%",
          maxWidth: "500px",
          paddingInline: "48px",
          paddingBlock: "24px",
        }}
      >
        <h2 className="text-center fw-bold">Sign up</h2>
        <h6 className="text-center">
          Create an account to access all features
        </h6>
        <form className="mt-4" onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Sarah Johnson"
              className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger small mt-1">{formik.errors.name}</div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. name@example.com"
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger small mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger small mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={formik.isSubmitting}
          >
            Submit
          </button>
        </form>
        <p className="my-3 text-center" style={{ fontSize: "14px" }}>
          Already sign up?{" "}
          <span
            className={`text-primary fw-medium ${styles.hover_underline}`}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </main>
  )
}
