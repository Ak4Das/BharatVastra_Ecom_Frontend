import ClothsContext from "../contexts/ClothsContext"
import { useContext } from "react"

export default function GetUserId() {
  const { userId } = useContext(ClothsContext)
  return userId
}
