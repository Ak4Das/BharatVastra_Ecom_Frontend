import styles from "../style_modules/pages_modules/LoginForm.module.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { saveNewUser } from "../services/FetchRequests"
import Error from "../components/Error"

export default function LoginForm() {
  const [isError, setIsError] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  async function handleSubmit() {
    try {
      const user = {
        name,
        email,
        password,
        profileImage: "",
        address: [],
        addToCartItems: [],
        addToWishlistItems: [],
      }
      const newUser = await saveNewUser(user, undefined, setIsError)
      localStorage.setItem("userId", newUser._id)
      window.location.reload()
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

  if (isError) {
    return <Error />
  }

  return (
    <main
      className={`card mx-auto my-5 ${styles.loginForm}`}
      style={{ width: "50%", paddingInline: "48px", paddingBlock: "24px" }}
    >
      <h2 className="text-success">Login Form</h2>
      <form className="mt-4">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="text"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <Link
          to="/userAddress"
          className="btn btn-warning"
          onClick={handleSubmit}
        >
          Submit
        </Link>
      </form>
    </main>
  )
}
