import styles from "../style_modules/components_modules/Header.module.css"
import { Link, NavLink } from "react-router-dom"
import BharatVastra from "../assets/images/BharatVastra.png"
import { useState } from "react"
import { useEffect } from "react"
import { Search } from "../services/Search"
import { fetchDistinctCommonCategories } from "../services/FetchRequests"

export default function Header({
  position,
  top,
  zIndex,
  setSearch,
  placeHolder = "Search",
  isSearchBarNeeded = true,
  page = "",
  userDetails: user,
}) {
  const [input, setInput] = useState("")
  const [clickedHamburger, setClickedHamburger] = useState(false)
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
      setSearch && setSearch(input)
    }
  }, [input])

  function handleHamburgerMenu() {
    const element = document.querySelector(`.${styles.secondUlContainer}`)
    const isNone = element.classList.contains(`${styles.none}`)
    const oldDisplay = isNone ? `${styles.none}` : `${styles.block}`
    const newDisplay = isNone ? `${styles.block}` : `${styles.none}`
    element.classList.remove(oldDisplay)
    element.classList.add(newDisplay)
    setClickedHamburger(clickedHamburger ? false : true)
  }

  const isCloth = input !== "" ? (searchProducts.length ? true : false) : false

  function handleChange(e) {
    setInput(e.target.value)
  }

  function handleClick() {
    setSearch && setSearch(input)
  }

  return (
    <header
      className="bg-body-tertiary "
      style={{ position, top, zIndex, height: "62px" }}
    >
      <nav className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-center">
          <NavLink className="navbar-brand" to="/">
            <img
              src={BharatVastra}
              alt="BharatVastra"
              style={{ width: "70px" }}
              className={`${styles.BharatVastra}`}
            />
            <span
              className={`${styles.navbarBrand} fw-bold fs-5 text-secondary`}
            >
              BharatVastra
            </span>
          </NavLink>
          {isSearchBarNeeded && (
            <div
              className={`input-group ${styles.searchInHeader} justify-content-center`}
            >
              <input
                type="text"
                className="border border-1 w-75 p-2"
                style={{ outline: "none" }}
                placeholder={placeHolder}
                aria-label="Search Product"
                aria-describedby="button-addon2"
                onChange={handleChange}
              ></input>
              {page && isCloth ? (
                <Link
                  to={`/products/${searchProducts[0].product}`}
                  className="btn btn-warning w-25"
                >
                  Search
                </Link>
              ) : (
                <button
                  className="btn btn-warning w-25"
                  type="button"
                  onClick={handleClick}
                >
                  Search
                </button>
              )}
            </div>
          )}
          <div className={`${styles.hamburger}`} style={{ cursor: "pointer" }}>
            <div
              className="d-flex align-items-center gap-1"
              onClick={handleHamburgerMenu}
            >
              {user && user ? (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    overflow: "hidden",
                    borderRadius: "100%",
                  }}
                >
                  {user && user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="profileImage"
                      className="w-100 img-fluid h-100"
                    />
                  ) : (
                    <div className="bg-info fs-5 d-flex align-items-center justify-content-center">
                      {user && user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "2px solid #757373c4",
                  }}
                >
                  <i className="bi bi-list fs-5"></i>
                </div>
              )}
              {clickedHamburger ? (
                <i className="bi bi-chevron-up"></i>
              ) : (
                <i className="bi bi-chevron-down"></i>
              )}
            </div>
          </div>
          <div className={`${styles.firstUlContainer}`}>
            <ul
              className="navbar-nav d-flex flex-row justify-content-between align-items-center"
              style={{ width: "300px" }}
            >
              <li className="nav-item">
                {user ? (
                  <NavLink
                    to="/user"
                    className="text-black"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{ height: "40px", fontSize: "14px" }}
                      className={`lh-sm px-1 ${styles.profileBtnInHeader}`}
                    >
                      <p className="my-0 fw-medium">
                        Hello, {user && user.name.split(" ")[0]}
                      </p>
                      <p className="my-0 text-primary fw-bold">
                        Account <i className="bi bi-chevron-down"></i>
                      </p>
                    </div>
                  </NavLink>
                ) : (
                  <NavLink
                    className="btn btn-secondary text-light"
                    aria-current="page"
                    to="/login"
                    style={{ width: "70px" }}
                  >
                    Login
                  </NavLink>
                )}
              </li>
              <li className="nav-item position-relative">
                <NavLink className="nav-link" to="/wishlist">
                  <i className="bi bi-heart fs-5"></i>
                  <div
                    className="bg-danger d-flex align-items-center justify-content-center text-white fw-medium position-absolute"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "100%",
                      fontSize: "10px",
                      bottom: "27px",
                      left: "12px",
                    }}
                  >
                    {user ? user.addToWishlistItems.length : 0}
                  </div>
                  {"   "}
                  <span className="ms-1">Wishlist</span>
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink className="nav-link" to="/cart">
                  <i className="bi bi-cart3 fs-5"></i>
                  <div
                    className="bg-danger d-flex align-items-center justify-content-center text-white fw-medium position-absolute"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "100%",
                      fontSize: "10px",
                      bottom: "27px",
                      left: "3px",
                    }}
                  >
                    {user ? user.addToCartItems.length : 0}
                  </div>
                  <span className="ms-1">Cart</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div
            className={`${styles.secondUlContainer} position-absolute none`}
            style={{ zIndex: 3, top: "60px", right: "10px" }}
          >
            <ul
              className="d-flex flex-column  justify-content-between bg-body-tertiary p-3"
              style={{
                height: "200px",
                listStyleType: "none",
              }}
            >
              <li
                className="nav-item btn btn-warning"
                style={{ width: "125px" }}
              >
                {user ? (
                  <NavLink
                    to="/user"
                    className="text-black"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{ height: "40px", fontSize: "14px" }}
                      className={`lh-sm px-1 ${styles.profileBtnInHeader}`}
                    >
                      <p className="my-0 fw-medium">
                        Hello, {user && user.name.split(" ")[0]}
                      </p>
                      <p className="my-0 text-primary fw-bold">
                        Account <i className="bi bi-chevron-down"></i>
                      </p>
                    </div>
                  </NavLink>
                ) : (
                  <NavLink
                    className="btn btn-warning text-black"
                    aria-current="page"
                    to="/login"
                    style={{ width: "70px" }}
                  >
                    Login
                  </NavLink>
                )}
              </li>
              <li
                className="nav-item btn btn-warning position-relative"
                style={{ width: "125px" }}
              >
                <NavLink className="nav-link" to="/wishlist">
                  <i className="bi bi-heart fs-5"></i>
                  <div
                    className="bg-danger d-flex align-items-center justify-content-center text-white fw-medium position-absolute"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "100%",
                      fontSize: "10px",
                      bottom: "20px",
                      left: "33px",
                    }}
                  >
                    {user ? user.addToWishlistItems.length : 0}
                  </div>
                  {"   "}
                  <span className="ms-1">Wishlist</span>
                </NavLink>
              </li>
              <li
                className="nav-item btn btn-warning position-relative"
                style={{ width: "125px" }}
              >
                <NavLink className="nav-link" to="/cart">
                  <i className="bi bi-cart3 fs-5"></i>
                  <div
                    className="bg-danger d-flex align-items-center justify-content-center text-white fw-medium position-absolute"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "100%",
                      fontSize: "10px",
                      bottom: "25px",
                      left: "38px",
                    }}
                  >
                    {user ? user.addToCartItems.length : 0}
                  </div>
                  <span className="ms-1">Cart</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
