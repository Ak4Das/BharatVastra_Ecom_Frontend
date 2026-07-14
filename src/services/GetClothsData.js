import context from "../contexts/CreateContexts"
import { useContext } from "react"

export default function GetUser() {
  const { user, setUser } = useContext(context)
  return { user, setUser }
}
