import styles from "../style_modules/pages_modules/SaleProducts.module.css"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"

import Header from "../components/Header"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import SaleProductsShimmer from "../shimmers/SaleProducts.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import Error from "../components/Error.jsx"

import GetUserId from "../services/GetClothsData.js"
import {
  fetchOfferOnACategory,
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchUserById,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
} from "../services/FetchRequests.js"
import { syncUserAndCreateOrder } from "../services/Function.js"

export default function SaleProducts() {
  const { commonCategory } = useParams()
  const userId = GetUserId()

  const [clothsData, setClothsData] = useState([])
  const [user, setUser] = useState(null)
  const [createOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState("")

  const [search, setSearch] = useState("")
  const [gender, setGender] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isUpdate, setUpdate] = useState(false)

  useEffect(() => {
    if (!userId) return
    async function fetchUserMetadata() {
      try {
        await Promise.all([
          fetchCreateOrderByUserId(
            userId,
            setCreateOrderInDatabase,
            setIsError,
          ),
          fetchUserById(userId, setUser, setIsError),
        ])
        if (isUpdate) {
          setUpdate(false)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
      }
    }
    fetchUserMetadata()
  }, [userId, isUpdate])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        const response = await fetchOfferOnACategory(
          commonCategory.toLowerCase(),
          { page, gender, search },
          setClothsData,
          setIsError,
        )

        if (response?.pagination) {
          setTotalPages(response.pagination.totalPages)
          if (search && response.products?.length === 0) {
            toast.info("No products with this material available")
          }
        }
      } catch (error) {
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [commonCategory, page, gender, search])

  const uniqueCreateOrderInDatabase =
    createOrderInDatabase && createOrderInDatabase.length
      ? createOrderInDatabase[0].products.reduce((acc, item) => {
          if (!acc.length) {
            acc.push(item)
          } else {
            const searchInAcc = acc.find((obj) => obj.id === item.id)
              ? true
              : false
            if (!searchInAcc) {
              acc.push(item)
            }
          }
          return acc
        }, [])
      : []

  const createOrder = { item: uniqueCreateOrderInDatabase }

  const finalClothsData = clothsData.map((cloth) => {
    const isClothPresentInCart =
      user && user.addToCartItems.filter((item) => item.id === cloth.id)
    if (isClothPresentInCart && isClothPresentInCart.length) {
      cloth.addToCart = true
      cloth.quantity = isClothPresentInCart[0].quantity
        ? isClothPresentInCart[0].quantity
        : 1
      cloth.size = isClothPresentInCart[0].size
        ? isClothPresentInCart[0].size
        : ""
    } else {
      delete cloth.addToCart
    }
    const isClothPresentInWishlist =
      user && user.addToWishlistItems.filter((item) => item.id === cloth.id)
    if (isClothPresentInWishlist && isClothPresentInWishlist.length) {
      cloth.addToWishList = true
    } else {
      delete cloth.addToWishList
    }
    return cloth
  })

  // Refactored Add to Cart Logic using Optimistic UI state updates
  const addToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const promises = []

      const isAddedToCart = user.addToCartItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToCart.length) {
        // Update user in Database
        user.addToCartItems.push({
          id: Number(e.target.value),
          quantity: 1,
          size: "",
        })
        promises.push({
          name: "user",
          request: updateCartItemsInUser(
            user._id,
            user.addToCartItems,
            undefined,
            setIsError,
          ),
        })

        // Update clothsData in memory
        const item = clothsData.find(
          (Product) => Product.id === Number(e.target.value),
        )
        if (item) {
          item.addToCart = true
          item.quantity = 1
          item.size = ""
        }

        // Update createOrder in Database
        const Product =
          createOrder &&
          createOrder.item.length &&
          createOrder.item.filter(
            (product) => product.id === Number(e.target.value),
          )
        if (Product && Product.length) {
          Product[0].addToCart = true
          Product[0].quantity = 1
          Product[0].size = ""
          const CreateOrder = { products: createOrder.item, userId }
          promises.push({
            name: "createOrder",
            request: fetchCreateOrderByUserIdAndUpdate(
              userId,
              CreateOrder,
              undefined,
              setIsError,
            ),
          })
        }

        const result = await Promise.all(
          promises.map((promise) => promise.request),
        )
        const indexOfRejectedPromises = []
        let isAllPromisesFulfilled = true
        result.forEach((res, index) => {
          if (res === undefined) {
            isAllPromisesFulfilled = false
            indexOfRejectedPromises.push(index)
          }
        })
        const rejectedRequests = indexOfRejectedPromises.map(
          (index) => promises[index],
        )
        const isAnyPromiseRejected = isAllPromisesFulfilled ? false : true
        if (isAnyPromiseRejected) {
          userId &&
            (await syncUserAndCreateOrder({
              userId,
              productId: Number(e.target.value),
              setIsError,
              action: "cart",
              rejectedRequests,
            }))
        } else {
          // For interactivity
          const btn = e.target
          btn.innerHTML = '<i class="bi bi-check2"></i>'
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
          setTimeout(() => {
            btn.innerHTML = "Added To Cart"
            btn.style.backgroundColor = ""
            btn.style.color = ""
          }, 1000)

          // To update the variables present in this page
          setUpdate(true)

          toast("Product added to cart😊")
        }
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  // Wishlist Logic Optimization
  const addToWishlist = async (e) => {
    // To stop Event Bubbling
    e.preventDefault()
    e.stopPropagation()

    try {
      const promises = []

      const isAddedToWishlist = user.addToWishlistItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToWishlist.length) {
        // Update user in Database
        user.addToWishlistItems.push({ id: Number(e.target.value) })
        promises.push({
          name: "user",
          request: updateWishlistItemsInUser(
            user._id,
            user.addToWishlistItems,
            undefined,
            setIsError,
          ),
        })

        // Update clothsData in memory
        const item = clothsData.find(
          (Product) => Product.id === Number(e.target.value),
        )
        if (item) {
          item.addToWishList = true
        }

        // Update createOrder in Database
        const Product =
          createOrder &&
          createOrder.item.length &&
          createOrder.item.filter(
            (product) => product.id === Number(e.target.value),
          )
        if (Product && Product.length) {
          Product[0].addToWishList = true
          const CreateOrder = { products: createOrder.item, userId }
          promises.push({
            name: "createOrder",
            request: fetchCreateOrderByUserIdAndUpdate(
              userId,
              CreateOrder,
              undefined,
              setIsError,
            ),
          })
        }

        const result = await Promise.all(
          promises.map((promise) => promise.request),
        )
        const indexOfRejectedPromises = []
        let isAllPromisesFulfilled = true
        result.forEach((res, index) => {
          if (res === undefined) {
            isAllPromisesFulfilled = false
            indexOfRejectedPromises.push(index)
          }
        })
        const rejectedRequests = indexOfRejectedPromises.map(
          (index) => promises[index],
        )
        const isAnyPromiseRejected = isAllPromisesFulfilled ? false : true
        if (isAnyPromiseRejected) {
          userId &&
            (await syncUserAndCreateOrder({
              userId,
              productId: Number(e.target.value),
              setIsError,
              action: "wishlist",
              rejectedRequests,
            }))
        } else {
          // For interactivity
          const btn = e.target
          btn.innerHTML = '<i class="bi bi-check2"></i>'
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
          setTimeout(() => {
            btn.innerHTML = "Added To Wishlist"
            btn.style.backgroundColor = ""
            btn.style.color = ""
          }, 1000)

          // To update the variables present in this page
          setUpdate(true)

          toast("Product added to wishlist😊")
        }
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  if (isError) return <Error />

  return (
    <>
      <Header
        position="sticky"
        top={0}
        zIndex={6}
        setSearch={setSearch}
        search={search}
        placeHolder="Search by product Material"
        userDetails={user}
      />
      <SearchInPage
        margin="ms-3"
        setSearch={setSearch}
        search={search}
        placeHolder="Search by product Material"
      />

      <main>
        <div className="mx-5 my-3">
          <div
            className={`d-flex justify-content-between ${styles.saleProductFirstSection} mb-3`}
          >
            <h4 className="my-3 text-secondary">
              Diwali offer on {commonCategory}
            </h4>
            <div style={{ width: "160px" }}>
              <label
                htmlFor="gender"
                className="form-label me-2 fw-bold text-secondary"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={gender}
                className="py-1 px-2 rounded fw-medium text-secondary"
                onChange={(e) => {
                  setGender(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SaleProductsShimmer />
          ) : (
            <>
              <div className="row">
                {finalClothsData.map((product) => (
                  <div key={product.id} className="col-sm-6 col-xl-4 mb-3">
                    <Link
                      className="text-decoration-none"
                      to={`/productDetails/${product.id}`}
                    >
                      <div className={`card ${styles.productCard}`}>
                        <div className={`${styles.ProductImageContainer}`}>
                          <img
                            src={product.url}
                            className={`img-fluid ${styles.listProductImage}`}
                            style={{ height: "300px" }}
                            alt="productImage"
                          />
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between w-100">
                          <p
                            id="name"
                            className={`my-0 lh-sm ${styles.listProductName}`}
                          >
                            <span className="badge text-bg-warning me-1">
                              Diwali Offer
                            </span>
                            {product.name.length > 61
                              ? product.name.slice(0, 60).concat("...")
                              : product.name}
                          </p>
                          <div className="d-flex align-items-end">
                            <RatingBar rating={product.rating} />
                            <span
                              style={{ fontSize: "15px" }}
                              className={`ms-1 ${styles.rating_listingPage}`}
                            >
                              {product.rating}
                            </span>
                          </div>
                          <div>
                            <p id="offer" className="my-0">
                              <b>₹</b>
                              {(
                                product.price -
                                (product.price *
                                  Number(product.offer.replace("%", ""))) /
                                  100
                              ).toFixed(1)}{" "}
                              (-{product.offer})
                            </p>
                            <small
                              id="M.R.P."
                              className="text-decoration-line-through"
                            >
                              M.R.P. ₹{product.price}
                            </small>
                          </div>
                          <div>
                            <div>
                              {!user ? (
                                <button
                                  className={`btn btn-secondary w-100 mb-1 ${styles.addToCart}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toast("Please login to your account")
                                  }}
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              ) : (
                                <button
                                  value={product.id}
                                  className={`btn btn-secondary w-100 mb-1 ${styles.addToCart}`}
                                  onClick={addToCart}
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              )}
                            </div>
                            <div>
                              {!user ? (
                                <button
                                  className={`btn btn-outline-secondary w-100 ${styles.saveToWishlist}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toast("Please login to your account")
                                  }}
                                >
                                  {product.addToWishList
                                    ? "Added To Wishlist"
                                    : "Save To Wishlist"}
                                </button>
                              ) : (
                                <button
                                  value={product.id}
                                  className={`btn btn-outline-secondary w-100 ${styles.saveToWishlist}`}
                                  onClick={addToWishlist}
                                >
                                  {product.addToWishList
                                    ? "Added To Wishlist"
                                    : "Save To Wishlist"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center my-4 gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  <span className="align-self-center mx-2 fw-medium text-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
