import styles from "../style_modules/pages_modules/ProductListing.module.css"
import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"

import Header from "../components/Header"
import Offcanvas from "../components/Offcanvas"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import ProductListingShimmer from "../shimmers/ProductListing.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import Error from "../components/Error.jsx"

import GetUserId from "../services/GetClothsData.js"
import {
  fetchCloths,
  fetchUserById,
  fetchCreateOrderByUserId,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  fetchCreateOrderByUserIdAndUpdate,
  fetchCategory,
} from "../services/FetchRequests.js"
import { syncUserAndCreateOrder } from "../services/Function.js"

export default function ProductListingPage() {
  const { mainCategory } = useParams()
  const userId = GetUserId()

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState("")
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [isUpdate, setUpdate] = useState(false)

  const [search, setSearch] = useState([])
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState(0)
  const [sortBy, setSortBy] = useState("")
  const [gender, setGender] = useState("")
  const [productCategory, setProductCategory] = useState([])
  const [age, setAge] = useState([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [category, setCategory] = useState([])
  const isCategory = category.length ? true : false

  const [showHamburgerPointer, setShowHamburgerPointer] = useState(false)

  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  const uniqueCreateOrderInDatabase =
    CreateOrderInDatabase && CreateOrderInDatabase.length
      ? CreateOrderInDatabase[0].products.reduce((acc, item) => {
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

  const loadFilteredProducts = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = {
        mainCategory,
        price,
        rating,
        sortBy,
        gender,
        commonCategory: productCategory.join(","),
        age: age.join(","),
        search: search.join(","),
        page,
        limit: 12,
      }

      const result = await fetchCloths(queryParams, undefined, setIsError)

      if (result) {
        setProducts(result.respondedData || [])
        setTotalPages(result.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.dir(error)
      setIsError(error.message || "Failed to sync products from server")
    } finally {
      setLoading(false)
    }
  }, [
    mainCategory,
    price,
    rating,
    sortBy,
    gender,
    productCategory,
    age,
    search,
    page,
  ])

  useEffect(() => {
    loadFilteredProducts()
  }, [loadFilteredProducts])

  useEffect(() => {
    async function syncUserState() {
      if (!userId) return
      try {
        await Promise.all([
          fetchCategory(mainCategory, setCategory, setIsError),
          fetchUserById(userId, setUser, setIsError),
          fetchCreateOrderByUserId(
            userId,
            setCreateOrderInDatabase,
            setIsError,
          ),
        ])
        if (isUpdate) {
          setUpdate(false)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") console.error(error)
      }
    }
    syncUserState()
  }, [userId, isUpdate])

  useEffect(() => {
    const body = document.body

    const pointerOnTimer = setTimeout(() => {
      setShowHamburgerPointer(true)
      body.style.overflowY = "hidden"
    }, 2000)

    const pointerOffTimer = setTimeout(() => {
      setShowHamburgerPointer(false)
      body.style.overflowY = "scroll"
    }, 5000)

    // Structural safe cleanup configuration
    return () => {
      clearTimeout(pointerOnTimer)
      clearTimeout(pointerOffTimer)
      body.style.overflowY = "scroll"
    }
  }, [])

  const handleAddToCart = async (e) => {
    // To stop Event Bubbling
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
        const item = products.find(
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
          createOrder.item &&
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

  const handleAddToWishlist = async (e, productId) => {
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
        const item = products.find(
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
          btn.innerHTML = '<i className="bi bi-check2"></i>'
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

  const finalProducts = products.map((cloth) => {
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

  if (isError) return <Error />

  return (
    <>
      <Header
        position="sticky"
        top={0}
        zIndex={7}
        setSearch={(val) => {
          setSearch(val)
          setPage(1)
        }}
        placeHolder="Search Product"
        userDetails={user}
        search={search}
      />

      <SearchInPage
        margin="ms-3"
        setSearch={(val) => {
          setSearch(val)
          setPage(1)
        }}
        placeHolder="Search Product"
        position="position-fixed"
        top="62px"
        zIndex={6}
        search={search}
      />

      <main>
        <Offcanvas
          setPrice={(value) => {
            setPrice(value)
            setPage(1)
          }}
          setRating={(value) => {
            setRating(value)
            setPage(1)
          }}
          setSortBy={(value) => {
            setSortBy(value)
            setPage(1)
          }}
          setGender={(value) => {
            setGender(value)
            setPage(1)
          }}
          productCategory={productCategory}
          setProductCategory={(value) => {
            setProductCategory(value)
            setPage(1)
          }}
          setUpdate={setUpdate}
          age={age}
          setAge={(value) => {
            setAge(value)
            setPage(1)
          }}
          isCategory={isCategory}
          setShowHamburgerPointer={setShowHamburgerPointer}
        />

        <div className="mx-5 my-3">
          {showHamburgerPointer && (
            <div className={`${styles.hamburgerPointer} position-fixed`}>
              <div
                className={`${styles.leftPointerDiv1} position-absolute`}
                style={{ width: "46px", height: "46px" }}
              ></div>
              <div
                className={`${styles.leftPointerDiv2} position-absolute`}
                style={{ width: "50px", height: "50px" }}
              ></div>
              <div
                className={`${styles.leftPointerDiv3} position-absolute`}
                style={{ width: "50px", height: "50px" }}
              ></div>
              <p className="my-0 ms-4">Use Filters</p>
            </div>
          )}

          <h4 className={`${styles.listingPageHeading} text-secondary`}>
            Showing All Products
          </h4>

          {loading ? (
            <ProductListingShimmer />
          ) : (
            <div className="row position-relative" style={{ zIndex: 1 }}>
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
                          className={`my-0 lh-sm ${styles.listProductName} lh-base`}
                        >
                          {!!Number(product.offer.replace("%", "")) && (
                            <span className="badge text-bg-warning me-1">
                              Diwali Offer
                            </span>
                          )}
                          {product.newArrival === true && (
                            <span className="badge text-bg-primary me-1">
                              New
                            </span>
                          )}
                          {product.freeDelivery && (
                            <span className="badge text-bg-success">
                              Free Deilvery
                            </span>
                          )}{" "}
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
                          <p id="discount" className="my-0">
                            <b>₹</b>
                            {Math.round(
                              product.price -
                                (product.price *
                                  (Number(product.offer.replace("%", ""))
                                    ? Number(product.offer.replace("%", ""))
                                    : Number(
                                        product.discount.replace("%", ""),
                                      ))) /
                                  100,
                            )}
                            (-
                            {Number(product.offer.replace("%", ""))
                              ? product.offer
                              : product.discount}
                            )
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
                                onClick={handleAddToCart}
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
                                onClick={handleAddToWishlist}
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
          )}

          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-muted small">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
