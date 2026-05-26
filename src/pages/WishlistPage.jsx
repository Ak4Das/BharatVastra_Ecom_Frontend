import styles from "../style_modules/pages_modules/WishlistPage.module.css"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import SearchInPage from "../components/SearchInPage"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Search } from "../services/Search"
import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchUserById,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  fetchClothById,
} from "../services/FetchRequests.js"
import WishlistShimmer from "../shimmers/Wishlist.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import GetUserId from "../services/GetClothsData.js"
import { syncUserAndCreateOrder } from "../services/Function.js"
import Error from "../components/Error.jsx"

export default function WishlistPage() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")

  const [clothsData, setClothsData] = useState([])
  const [search, setSearch] = useState("")

  /* isUpdated useState is used to if user press moveToCart btn  or  removeFromWishlist btn 
  then variables present on this page will reinitialize */
  const [isUpdated, setUpdated] = useState(false)

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    async function fetchWishlistItems(setIsError) {
      try {
        if (user) {
          const itemsIds = user.addToWishlistItems.map((item) => item.id)
          const items = await Promise.all(
            itemsIds.map((id) => fetchClothById(id, undefined, setIsError)),
          )
          setClothsData(items)
        }
      } catch (error) {
        console.error(error)
        setIsError(error.message)
      }
    }
    fetchWishlistItems(setIsError)
  }, [user])

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

  async function moveToCart(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      const promises = []

      // Update clothsData in memory
      const cloth = await fetchClothById(
        Number(e.target.value),
        undefined,
        setIsError,
      )
      if (cloth) {
        cloth.addToCart = true
        cloth.quantity = 1
        cloth.size = ""
      }

      // Update createOrder in Database
      const createOrderItem =
        createOrder.item.length &&
        createOrder.item.find((item) => item.id === Number(e.target.value))
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
        const CreateOrder = { products: createOrder.item, userId }
        await fetchCreateOrderByUserIdAndUpdate(
          userId,
          CreateOrder,
          undefined,
          setIsError,
        )
      }

      // Update user in Database
      const item = user.addToCartItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!item.length) {
        user.addToCartItems.push({
          id: Number(e.target.value),
          quantity: 1,
          size: "",
        })
      } else {
        item[0].quantity = item[0].quantity ? item[0].quantity + 1 : 2
      }
      promises.push(
        updateCartItemsInUser(
          user._id,
          user.addToCartItems,
          undefined,
          setIsError,
        ),
      )

      const result = await Promise.all(promises)
      let isAllPromisesFulfilled = true
      result.forEach((res) => {
        if (res === undefined) {
          isAllPromisesFulfilled = false
        }
      })
      const isAnyPromiseRejected = isAllPromisesFulfilled ? false : true
      if (isAnyPromiseRejected) {
        userId && (await syncUserAndCreateOrder(userId, setIsError))
      } else {
        // For interactivity
        const product = user.addToCartItems.find(
          (item) => item.id === Number(e.target.value),
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

        toast("Product added to cart😊")
      }
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

  async function removeFromWishlist(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      const promises = []

      // Update clothsData in memory
      const item = await fetchClothById(
        Number(e.target.value),
        undefined,
        setIsError,
      )
      if (item) {
        delete item.addToWishList
      }

      // Update user in Database
      const remainingWishlistItem = user.addToWishlistItems.filter(
        (item) => item.id !== Number(e.target.value),
      )

      promises.push(
        updateWishlistItemsInUser(
          user._id,
          remainingWishlistItem,
          undefined,
          setIsError,
        ),
      )

      // Update createOrder in Database
      const Product =
        createOrder &&
        createOrder.item.length &&
        createOrder.item.filter(
          (product) => product.id === Number(e.target.value),
        )
      if (Product && Product.length) {
        delete Product[0].addToWishList
        const CreateOrder = { products: createOrder.item, userId }
        await fetchCreateOrderByUserIdAndUpdate(
          userId,
          CreateOrder,
          undefined,
          setIsError,
        )
      }

      const result = await Promise.all(promises)
      let isAllPromisesFulfilled = true
      result.forEach((res) => {
        if (res === undefined) {
          isAllPromisesFulfilled = false
        }
      })
      const isAnyPromiseRejected = isAllPromisesFulfilled ? false : true
      if (isAnyPromiseRejected) {
        userId && (await syncUserAndCreateOrder(userId, setIsError))
      } else {
        // To update the variables present in this page
        setUpdated(true)

        toast("Product remove from wishlist")
      }
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

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
    cloth.addToWishList = true
    return cloth
  })

  const searchProducts = search ? Search(finalClothsData, search) : []

  const wishlistProducts = finalClothsData

  const finalWishlistProducts = searchProducts.length
    ? wishlistProducts.filter((product) => {
        const filteredSearchProducts = searchProducts.filter(
          (item) => item.addToWishList,
        )
        const cloth = filteredSearchProducts.filter(
          (item) => item.id === product.id,
        )
        return cloth.length
      })
    : wishlistProducts

  async function fetchData(setLoading, setIsError) {
    try {
      if (userId) {
        await fetchCreateOrderByUserId(
          userId,
          setCreateOrderInDatabase,
          setIsError,
        )
        await fetchUserById(userId, setUser, setIsError)
      }
      if (isUpdated) {
        setUpdated(false)
      }
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(setLoading, setIsError)
  }, [isUpdated])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading ? (
        <WishlistShimmer />
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
                          >
                            {product.addToCart
                              ? "Added To Cart"
                              : "Move To Cart"}
                          </button>
                          <button
                            className={`btn btn-outline-secondary w-100 ${styles.saveToWishlist}`}
                            value={product.id}
                            onClick={removeFromWishlist}
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
          <Footer />
        </>
      )}
    </>
  )
}
