import { useEffect, useState } from "react"
import context from "./CreateContexts"
import { fetchMe } from "../services/FetchRequests"

export default function ContextProvider({ children }) {
  const [user, setUser] = useState({})

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("bv_token")
      if (token) {
        const response = await fetchMe({ setFunction: setUser })

        if (!response) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
    fetchData()
  }, [])

  return (
    <context.Provider value={{ user, setUser }}>{children}</context.Provider>
  )
}
