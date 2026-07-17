import styles from "../style_modules/pages_modules/WishlistPage.module.css"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "../components/Header"
import Footer from "../components/Footer.jsx"
import SearchInPage from "../components/SearchInPage"
import Error from "../components/Error.jsx"
import WishlistShimmer from "../shimmers/Wishlist.shimmer.jsx"
import { Search } from "../services/Search"
import GetUser from "../services/GetClothsData"
import { syncUserAndCreateOrder } from "../services/Function.js"
import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  fetchClothById,
} from "../services/FetchRequests.js"

export default function WishlistPage() {
  const { user, setUser } = GetUser()
  const userId = user._id
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [clothsData, setClothsData] = useState([])
  const [search, setSearch] = useState("")
  const [isUpdated, setUpdated] = useState(false)
  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  const [disableCartBtnId, setDisableCartBtnId] = useState(null)
  const [disableWishlistBtnId, setDisableWishlistBtnId] = useState(null)

  useEffect(() => {
    setLoading(true)
  }, [])

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }
    try {
      await Promise.all([
        userId &&
          fetchCreateOrderByUserId({
            userId,
            setFunction: setCreateOrderInDatabase,
            setIsError,
            navigate,
          }),
      ])
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") console.error(error)
      setIsError(error.message)
    } finally {
      setLoading(false)
      setUpdated(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData, isUpdated])

  useEffect(() => {
    async function fetchWishlistItems() {
      try {
        if (Object.keys(user).length) {
          const itemsIds = user.addToWishlistItems.map((item) => item.id)
          const items = await Promise.all(
            itemsIds.map((id) =>
              fetchClothById({
                clothId: id,
                setIsError,
                navigate,
              }),
            ),
          )
          setClothsData(items)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchWishlistItems()
  }, [user])

  const uniqueCreateOrderInDatabase = useMemo(() => {
    return CreateOrderInDatabase && CreateOrderInDatabase.length
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
  }, [CreateOrderInDatabase])
  const createOrder = { item: uniqueCreateOrderInDatabase }

  const finalClothsData = useMemo(() => {
    return clothsData.map((cloth) => {
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
      cloth.addToWishList = true
      return cloth
    })
  }, [clothsData, user])

  const finalWishlistProducts = useMemo(() => {
    if (!search) return finalClothsData
    const searchProducts = Search(finalClothsData, search) || []
    return searchProducts.length
      ? finalClothsData.filter((product) => {
          const filteredSearchProducts = searchProducts.filter(
            (item) => item.addToWishList,
          )
          const cloth = filteredSearchProducts.filter(
            (item) => item.id === product.id,
          )
          return cloth.length
        })
      : finalClothsData
  }, [search, finalClothsData])

  async function moveToCart(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      setDisableCartBtnId(e.target.value)

      const productId = Number(e.target.value)

      const promises = []

      // Update createOrder in Database
      const updatedOrderItems = [...uniqueCreateOrderInDatabase]
      const createOrderItem =
        updatedOrderItems.length &&
        updatedOrderItems.find((item) => item.id === Number(productId))
      if (createOrderItem) {
        const isCreateOrderItemAddedToCart = user.addToCartItems.filter(
          (item) => item.id === createOrderItem.id,
        )
        if (isCreateOrderItemAddedToCart.length) {
          createOrderItem.quantity = isCreateOrderItemAddedToCart[0].quantity
            ? isCreateOrderItemAddedToCart[0].quantity + 1
            : 2
        } else {
          createOrderItem.addToCart = true
          createOrderItem.quantity = 1
          createOrderItem.size = ""
        }
        const payload = { products: updatedOrderItems, userId }
        promises.push({
          name: "createOrder",
          request: fetchCreateOrderByUserIdAndUpdate({
            userId: userId,
            createOrder: payload,
            setIsError,
            navigate,
          }),
        })
      }

      // Update user in Database
      const updatedCartItems = [...user.addToCartItems]
      const item = updatedCartItems.filter(
        (item) => item.id === Number(productId),
      )
      if (!item.length) {
        updatedCartItems.push({
          id: Number(productId),
          quantity: 1,
          size: "",
        })
      } else {
        item[0].quantity = item[0].quantity ? item[0].quantity + 1 : 2
      }
      promises.push({
        name: "user",
        request: updateCartItemsInUser({
          items: updatedCartItems,
          setIsError,
          navigate,
        }),
      })

      setUser({ ...user, addToCartItems: updatedCartItems })

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
            productId: Number(productId),
            setIsError,
            action: "cart",
            rejectedRequests,
          }))
      } else {
        // For interactivity
        const product = updatedCartItems.find(
          (item) => item.id === Number(productId),
        )
        const btn = e.target
        if (product.quantity) {
          btn.innerHTML = `quantity: ${product.quantity}`
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
        } else {
          btn.innerHTML = "Added To Cart"
          btn.style.backgroundColor = "#05a058"
          btn.style.color = "white"
        }
        setTimeout(() => {
          btn.innerHTML = "Added To Cart"
          btn.style.backgroundColor = ""
          btn.style.color = ""
        }, 1000)

        // To update the variables present in this page
        setUpdated(true)

        toast.success("Product added to cart😊")
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

  async function removeFromWishlist(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      setDisableWishlistBtnId(e.target.value)

      const productId = Number(e.target.value)

      const promises = []

      // Update user in Database
      const remainingWishlistItem = user.addToWishlistItems.filter(
        (item) => item.id !== Number(productId),
      )

      promises.push({
        name: "user",
        request: updateWishlistItemsInUser({
          items: remainingWishlistItem,
          setIsError,
          navigate,
        }),
      })

      setUser({ ...user, addToWishlistItems: remainingWishlistItem })

      // Update createOrder in Database
      const Product =
        createOrder &&
        createOrder.item.length &&
        createOrder.item.filter((product) => product.id === Number(productId))
      if (Product && Product.length) {
        delete Product[0].addToWishList
        const CreateOrder = { products: createOrder.item, userId }
        promises.push({
          name: "createOrder",
          request: fetchCreateOrderByUserIdAndUpdate({
            userId: userId,
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
            productId: Number(productId),
            setIsError,
            action: "wishlist",
            rejectedRequests,
          }))
      } else {
        // To update the variables present in this page
        setUpdated(true)

        toast.success("Product remove from wishlist")
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
      {loading ? (
        <WishlistShimmer />
      ) : (
        <main className="bg-body-secondary pb-3">
          <div className="mx-5">
            <h3 className="py-3 text-center">My Wishlist</h3>
            <div className="row row-gap-4">
              {finalWishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className={`col-sm-6 col-md-4 col-xl-3 col-xxl-2 ${styles.cardContainer}`}
                >
                  <Link
                    className="text-decoration-none"
                    to={`/productDetails/${product.id}`}
                  >
                    <div className="card border border-0">
                      <img
                        src={product.url}
                        alt="productImage"
                        className="img-fluid"
                        style={{ height: "300px" }}
                      />
                      <div className="card-body">
                        <p
                          className="text-center overflow-hidden"
                          style={{ height: "75px" }}
                        >
                          {product.newArrival === true && (
                            <span className="badge text-bg-success me-1">
                              New
                            </span>
                          )}
                          {!!Number(product.offer.replace("%", "")) && (
                            <span className="badge text-bg-warning me-1">
                              Diwali Offer
                            </span>
                          )}
                          {product.name.length > 61
                            ? product.name.slice(0, 60).concat("...")
                            : product.name}
                        </p>
                        <p className="text-center fw-bold">
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
                          )}{" "}
                          (
                          {Number(product.offer.replace("%", ""))
                            ? product.offer
                            : product.discount}{" "}
                          off)
                        </p>
                        <button
                          className={`btn btn-secondary w-100 my-2 ${styles.moveToCart}`}
                          value={product.id}
                          onClick={moveToCart}
                          disabled={product.id === Number(disableCartBtnId)}
                        >
                          {product.addToCart ? "Added To Cart" : "Move To Cart"}
                        </button>
                        <button
                          className={`btn btn-outline-secondary w-100 ${styles.saveToWishlist}`}
                          value={product.id}
                          onClick={removeFromWishlist}
                          disabled={product.id === Number(disableWishlistBtnId)}
                        >
                          Remove From Wishlist
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      <Footer />
    </>
  )
}
