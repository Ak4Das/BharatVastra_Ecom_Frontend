import { useState } from "react"
import ClothsContext from "./ClothsContext"

export default function ClothsContextProvider({ children }) {
  const userId = localStorage.getItem("userId")

  return (
    <ClothsContext.Provider value={{ userId }}>
      {children}
    </ClothsContext.Provider>
  )
}
