import styles from "../style_modules/components_modules/SearchPage.module.css"
import { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Search } from "../services/Search.js"
import { fetchDistinctCommonCategories } from "../services/FetchRequests.js"

export default function searchInPage({
  margin,
  setSearch,
  placeHolder = "Search",
  isSearchBarNeeded = true,
  page = "",
  position = "position-static",
  top = "",
  zIndex = 0,
  search,
}) {
  const [input, setInput] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function fetchData() {
      const result = await fetchDistinctCommonCategories()
      setCategories(result)
    }
    fetchData()
  }, [])

  const searchProducts = input ? Search(categories, input) : []

  useEffect(() => {
    if (!input) {
      setSearch && setSearch(typeof search === "string" ? "" : [])
    }
  }, [input])

  const isCloth = input !== "" ? (searchProducts.length ? true : false) : false

  function handleChange(e) {
    setInput(e.target.value)
  }

  async function handleClick() {
    if (typeof search === "object") {
      const distinctCommonCategories = await fetchDistinctCommonCategories()
      const searchProducts = input
        ? Search(distinctCommonCategories, input)
        : []
      const commonCategoryList = searchProducts.map((item) => item.product)
      const uniqueCommonCategoryList = []
      commonCategoryList.forEach((category) => {
        if (!uniqueCommonCategoryList.includes(category)) {
          uniqueCommonCategoryList.push(category)
        }
      })
      setSearch && setSearch(uniqueCommonCategoryList)
    } else {
      setSearch && setSearch(input)
    }
  }
  return (
    <>
      {isSearchBarNeeded && (
        <div
          className={`input-group ${styles.searchInPage} bg-light py-2 ${position}`}
          style={{ top: `${top}`, zIndex }}
        >
          <input
            type="text"
            className={`border border-1 ${margin} p-2 ${styles.searchInputInPage}`}
            style={{ outline: "none" }}
            placeholder={placeHolder}
            aria-label={placeHolder}
            aria-describedby="button-addon2"
            onChange={handleChange}
          ></input>
          {page && isCloth ? (
            <Link
              to={`/products/${searchProducts[0].product}`}
              className={`btn btn-warning ${styles.searchBtnInPage1}`}
              style={{ zIndex: 0 }}
              id="button-addon2"
            >
              Search
            </Link>
          ) : (
            <button
              className={`btn btn-warning ${styles.searchBtnInPage1}`}
              style={{ zIndex: 0 }}
              type="button"
              id="button-addon2"
              onClick={handleClick}
            >
              Search
            </button>
          )}
          {page && isCloth ? (
            <Link
              to={`/products/${searchProducts[0].product}`}
              className={`btn btn-warning ${styles.searchBtnInPage2}`}
              style={{ zIndex: 0 }}
              id="button-addon2"
            >
              <i className="bi bi-search"></i>
            </Link>
          ) : (
            <button
              className={`btn btn-warning ${styles.searchBtnInPage2}`}
              style={{ zIndex: 0 }}
              type="button"
              id="button-addon2"
              onClick={handleClick}
            >
              <i className="bi bi-search"></i>
            </button>
          )}
        </div>
      )}
    </>
  )
}
