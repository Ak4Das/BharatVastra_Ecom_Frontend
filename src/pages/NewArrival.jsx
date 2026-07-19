import React, { useEffect, useState, useCallback, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import styles from "../style_modules/pages_modules/NewArrival.module.css"
import Header from "../components/Header"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import NewArrivalShimmer from "../shimmers/NewArrival.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import Error from "../components/Error.jsx"

import GetUser from "../services/GetClothsData"
import { Search } from "../services/Search"
import {
  fetchNewArrivalCloths,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  fetchCreateOrderByUserIdAndUpdate,
  fetchClothById,
  fetchCreateOrderByUserId,
} from "../services/FetchRequests.js"
import { syncUserAndCreateOrder } from "../services/Function.js"

const itemsPerPage = 12

export default function NewArrival() {
  const { user, setUser } = GetUser()
  const userId = user._id
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)
  const [isUpdate, setUpdate] = useState(false)

  const [disableCartBtnId, setDisableCartBtnId] = useState(null)
  const [disableWishlistBtnId, setDisableWishlistBtnId] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          await fetchCreateOrderByUserId({
            userId,
            setFunction: setCreateOrderInDatabase,
            setIsError,
            navigate,
          })
        }
        if (isUpdate) {
          setUpdate(false)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isUpdate, userId])

  const loadProducts = useCallback(
    async (currentPage, search) => {
      try {
        setLoading(true)

        const query = {
          currentPage,
          itemsPerPage,
          search: search.join(","),
        }

        const response = await fetchNewArrivalCloths({
          query,
          setFunction: setProducts,
          setIsError,
          navigate,
        })

        if (response) {
          setTotalPages(response.pagination?.totalPages || 1)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error("Fetch Error: ", error)
        }
        setIsError(error.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    },
    [userId],
  )

  useEffect(() => {
    loadProducts(currentPage, search)
  }, [currentPage, search, loadProducts])

  const uniqueCreateOrderInDatabase = useMemo(() => {
    if (!CreateOrderInDatabase || !CreateOrderInDatabase.length) return []
    return CreateOrderInDatabase[0].products.reduce((acc, item) => {
      if (!acc.length) {
        acc.push(item)
      } else {
        const searchInAcc = acc.find((obj) => obj.id === item.id) ? true : false
        if (!searchInAcc) {
          acc.push(item)
        }
      }
      return acc
    }, [])
  }, [CreateOrderInDatabase])

  const createOrder = useMemo(
    () => ({ item: uniqueCreateOrderInDatabase }),
    [uniqueCreateOrderInDatabase],
  )

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // debugger
      const promises = []

      const isAddedToCart = user.addToCartItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToCart.length) {
        setDisableCartBtnId(e.target.value)
        // Update user in Database
        user.addToCartItems.push({
          id: Number(e.target.value),
          quantity: 1,
          size: "",
        })

        promises.push({
          name: "user",
          request: updateCartItemsInUser({
            items: user.addToCartItems,
            setIsError,
            navigate,
          }),
        })

        // Update clothsData in memory
        const item = await fetchClothById({
          clothId: e.target.value,
          setIsError,
          navigate,
        })
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
            request: fetchCreateOrderByUserIdAndUpdate({
              userId,
              createOrder: CreateOrder,
              setIsError,
              navigate,
            }),
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
          btn.innerHTML = "Added To Cart"
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
          setTimeout(() => {
            btn.innerHTML = "Added To Cart"
            btn.style.backgroundColor = ""
            btn.style.color = ""
          }, 1000)

          // To update the variables present in this page
          setUpdate(true)

          toast.success("Product added to cart😊")
        }
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setDisableCartBtnId(null)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const promises = []

      const isAddedToWishlist = user.addToWishlistItems.find(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToWishlist) {
        setDisableWishlistBtnId(e.target.value)
        user.addToWishlistItems.push({ id: Number(e.target.value) })
        promises.push({
          name: "user",
          request: updateWishlistItemsInUser({
            items: user.addToWishlistItems,
            setIsError,
            navigate,
          }),
        })

        // Update clothsData in memory
        const item = await fetchClothById({
          clothId: e.target.value,
          setIsError,
          navigate,
        })

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
            request: fetchCreateOrderByUserIdAndUpdate({
              userId,
              createOrder: CreateOrder,
              setIsError,
              navigate,
            }),
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
          btn.innerHTML = "Added To Wishlist"
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
          setTimeout(() => {
            btn.innerHTML = "Added To Wishlist"
            btn.style.backgroundColor = ""
            btn.style.color = ""
          }, 1000)

          // To update the variables present in this page
          setUpdate(true)

          toast.success("Product added to wishlist😊")
        }
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setDisableWishlistBtnId(null)
    }
  }

  const finalProducts = useMemo(() => {
    if (!user || !Object.keys(user).length) return []
    return products.map((cloth) => {
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
  }, [products, user])

  if (isError) {
    return <Error />
  }

  if (!Object.keys(user).length) {
    return
  }

  return (
    <>
      <Header
        position="static"
        top="auto"
        zIndex="auto"
        setSearch={setSearch}
        placeHolder="Search Product"
        userDetails={user}
        search={search}
      />
      <SearchInPage
        margin="ms-3"
        setSearch={setSearch}
        placeHolder="Search Product"
        search={search}
      />

      <main className="mx-5 my-3">
        <h2 className="my-3 text-secondary">New Arrivals</h2>

        {loading ? (
          <NewArrivalShimmer />
        ) : products.length === 0 ? (
          <div className="text-center my-5">
            <h4>No products found matching your description.</h4>
          </div>
        ) : (
          <>
            <div className="row">
              {finalProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-sm-6 col-xl-4 col-xxl-3 mb-3"
                >
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
                          <span className="badge text-bg-success me-1">
                            New
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
                          <p className={`${styles.discount} my-0`}>
                            <b>₹</b>
                            {(
                              product.price -
                              (product.price *
                                Number(product.discount.replace("%", ""))) /
                                100
                            ).toFixed(1)}
                            (-{product.discount})
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
                                  toast.info("Please login to your account")
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
                                onClick={handleAddToCart}
                                disabled={
                                  product.id === Number(disableCartBtnId)
                                }
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
                                  toast.info("Please login to your account")
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
                                onClick={handleAddToWishlist}
                                disabled={
                                  product.id === Number(disableWishlistBtnId)
                                }
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

            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-muted small">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
