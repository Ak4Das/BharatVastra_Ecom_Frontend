import styles from "../style_modules/pages_modules/Login.module.css"
import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchMe, login } from "../services/FetchRequests"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import { loginSchema } from "../schema/Login.schema"
import GetUser from "../services/GetClothsData"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setIsError] = useState("")
  const navigate = useNavigate()

  const initialValues = {
    email: "",
    password: "",
  }

  const { user, setUser } = GetUser()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setLoading(true)

        const response = await login({
          body: values,
          setIsError,
          navigate,
        })

        if (response) {
          localStorage.setItem("bv_token", response.token)

          toast.success("Login Successful")

          setTimeout(async () => {
            await fetchMe({ setFunction: setUser, setIsError, navigate })
            navigate("/")
          }, 1500)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik

  useEffect(() => {
    if (error === "User not found.") {
      toast.error("User not found please signup to continue.")
      navigate("/signup")
    }
  }, [error])

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.brandTitle}>Log in</h2>
          <p className={styles.brandSubtitle}>
            Log in to your system profile workspace
          </p>
        </div>

        {error && <div className={styles.errorAlertBanner}>{error}</div>}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Registered Email Address</label>
            <input
              className={styles.formInput}
              type="email"
              required
              value={values.email}
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className={`text-danger my-0 ${styles.errorMessage}`}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Security Password</label>
            <input
              className={styles.formInput}
              type="password"
              required
              value={values.password}
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className={`text-danger my-0 ${styles.errorMessage}`}>
                {errors.password}
              </p>
            ) : null}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Validating account..." : "Sign In"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Don't have an account?{" "}
          <Link className={`text-primary ${styles.signupLink}`} to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
