import styles from "../style_modules/pages_modules/ProductListing.module.css"
import { useState } from "react"
import Header from "../components/Header"
import Offcanvas from "../components/Offcanvas"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { Search } from "../services/Search"
import {
  fetchCategory,
  fetchClothsByCommonCategory,
  fetchClothsByMainCategory,
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchUserById,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
} from "../services/FetchRequests.js"
import ProductListingShimmer from "../shimmers/ProductListing.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import GetUserId from "../services/GetClothsData.js"
import { syncUserAndCreateOrder } from "../services/Function.js"
import Error from "../components/Error.jsx"

export default function ProductListingPage() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  const { mainCategory } = useParams()
  const [category, setCategory] = useState([])

  const isCategory = category.length ? true : false

  const [clothsData, setClothsData] = useState([])

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const category = await fetchCategory(
          mainCategory,
          setCategory,
          setIsError,
        )
        if (category.length === 0) {
          const cloths = await fetchClothsByCommonCategory(
            mainCategory,
            undefined,
            setIsError,
          )
          if (cloths.length === 0) {
            toast("No Such Product Available😔.")
          } else {
            setClothsData(cloths)
          }
        } else {
          const cloths = await fetchClothsByMainCategory(
            mainCategory,
            undefined,
            setIsError,
          )
          if (cloths.length === 0) {
            toast("No Such Product Available😔.")
          } else {
            setClothsData(cloths)
          }
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchData()
  }, [])

  // price, rating, sortBy, Category these useStates is used for filter
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState(0)
  const [sortBy, setSortBy] = useState("")
  const [gender, setGender] = useState("")
  const [productCategory, setProductCategory] = useState([])
  const [age, setAge] = useState([])
  const [showHamburgerPointer, setShowHamburgerPointer] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowHamburgerPointer(true)
      document.querySelector("body").style.overflowY = "hidden"
    }, 2000)

    setTimeout(() => {
      setShowHamburgerPointer(false)
      document.querySelector("body").style.overflowY = "scroll"
    }, 5000)
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

  async function addToWishlist(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

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
    ? searchProducts.filter((cloth) => {
        return cloth.mainCategory.includes(mainCategory)
      }).length
      ? true
      : false
    : false

  useEffect(() => {
    if (clothsData.length && search !== "" && isCategory && !isCloth) {
      toast("No Product Found😔")
    }
  }, [search])

  const filterByCategory = isCategory
    ? finalClothsData
    : finalClothsData.filter((data) =>
        data.commonCategory.includes(mainCategory),
      )

  const filterByPrice = filterByCategory.filter((product) => {
    const actualPrice = Math.round(
      product.price -
        (product.price / 100) *
          (Number(product.offer.replace("%", ""))
            ? Number(product.offer.replace("%", ""))
            : Number(product.discount.replace("%", ""))),
    )
    if (actualPrice >= price) {
      return true
    }
  })

  const filterByRating = filterByPrice.filter(
    (product) => product.rating >= rating,
  )

  function discountedPrice(product) {
    const actualPrice = Math.round(
      product.price -
        (product.price / 100) *
          (Number(product.offer.replace("%", ""))
            ? Number(product.offer.replace("%", ""))
            : Number(product.discount.replace("%", ""))),
    )
    return actualPrice
  }

  function sortProducts() {
    if (sortBy !== "") {
      for (let i = 0; i < filterByRating.length; ) {
        for (let j = i + 1; j < filterByRating.length; j++) {
          if (sortBy === "lowToHigh") {
            if (
              Number(discountedPrice(filterByRating[i])) >
              Number(discountedPrice(filterByRating[j]))
            ) {
              const a = filterByRating[j]
              filterByRating[j] = filterByRating[i]
              filterByRating[i] = a
            }
          } else {
            if (
              Number(discountedPrice(filterByRating[j])) >
              Number(discountedPrice(filterByRating[i]))
            ) {
              const a = filterByRating[j]
              filterByRating[j] = filterByRating[i]
              filterByRating[i] = a
            }
          }
        }
        i++
      }
    }
    return filterByRating
  }

  const filterBySort = sortProducts()

  const filterByGender =
    gender === ""
      ? filterBySort
      : filterBySort.filter((product) => product.gender === gender)

  const filterBySearch =
    search === ""
      ? filterByGender
      : filterByGender.filter((product) => {
          const cloth = searchProducts.filter((item) => item.id === product.id)
          return cloth.length
        })

  const filterByUserAge =
    age.length === 0
      ? filterBySearch
      : filterBySearch.filter((product) => {
          return age.filter((age) => product.mainCategory.includes(age)).length
            ? true
            : false
        })

  const finalFilter =
    productCategory.length === 0
      ? filterByUserAge
      : filterByUserAge.filter((product) =>
          productCategory.includes(product.commonCategory),
        )

  useEffect(() => {
    if (clothsData.length && !finalFilter.length) {
      toast("No Product Found😔")
    }
  }, [age.length])

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          await fetchCreateOrderByUserId(
            userId,
            setCreateOrderInDatabase,
            setIsError,
          )
          await fetchUserById(userId, setUser, setIsError)
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
        <ProductListingShimmer />
      ) : (
        <>
          <Header
            position="sticky"
            top={0}
            zIndex={7}
            setSearch={setSearch}
            placeHolder="Search Product"
            userDetails={user}
          />
          <SearchInPage
            margin="ms-3"
            setSearch={setSearch}
            placeHolder="Search Product"
            position="position-fixed"
            top="62px"
            zIndex={6}
          />
          <main>
            <Offcanvas
              setPrice={setPrice}
              setRating={setRating}
              setSortBy={setSortBy}
              setGender={setGender}
              productCategory={productCategory}
              setProductCategory={setProductCategory}
              setUpdate={setUpdate}
              age={age}
              setAge={setAge}
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
              <div className="row position-relative" style={{ zIndex: 1 }}>
                {finalFilter.map((product) => (
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
