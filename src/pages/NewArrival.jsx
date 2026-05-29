import styles from "../style_modules/pages_modules/NewArrival.module.css"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Search } from "../services/Search"
import {
  fetchClothById,
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchNewArrivalCloths,
  fetchUserById,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
} from "../services/FetchRequests.js"
import NewArrivalShimmer from "../shimmers/NewArrival.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import GetUserId from "../services/GetClothsData.js"
import { syncUserAndCreateOrder } from "../services/Function.js"
import Error from "../components/Error.jsx"

export default function NewArrival() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  const [clothsData, setClothsData] = useState([])

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        await fetchNewArrivalCloths(setClothsData, setIsError)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchData()
  }, [])

  /* isUpdate useState is used to if user add to cart a item or add to wishlist a item 
  then variables present on this page will reinitialize */
  const [isUpdate, setUpdate] = useState(false)

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

  // To fix clothsData for first render of this page
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

  const searchProducts = search ? Search(finalClothsData, search) : []

  const isCloth = searchProducts.length
    ? searchProducts.length
      ? true
      : false
    : false

  useEffect(() => {
    if (search !== "" && !isCloth) {
      toast("No such product available")
    }
  }, [search])

  const finalFilteredProducts = search
    ? finalClothsData.filter((product) => {
        const cloth = searchProducts.filter((item) => item.id === product.id)
        return cloth.length
      })
    : finalClothsData

  async function addToCart(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

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
        const item = await fetchClothById(e.target.value, undefined, setIsError)
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

  async function addToWishlist(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      const promises = []

      const isAddedToWishlist = user.addToWishlistItems.find(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToWishlist) {
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
        const item = await fetchClothById(e.target.value, undefined, setIsError)

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

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          await fetchCreateOrderByUserId(
            userId,
            setCreateOrderInDatabase,
            setIsError,
          )
          const user = await fetchUserById(userId, setUser, setIsError)
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
  }, [isUpdate])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading ? (
        <NewArrivalShimmer />
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            setSearch={setSearch}
            placeHolder="Search Product"
            userDetails={user}
          />
          <SearchInPage
            margin="ms-3"
            setSearch={setSearch}
            placeHolder="Search Product"
          />
          <main className="mx-5 my-3">
            <h2 className="my-3 text-secondary">New Arrival</h2>
            <div className="">
              <div className="row">
                {finalFilteredProducts.map((product) => (
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
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
